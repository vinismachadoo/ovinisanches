'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

const getSvgContentFromPublic = async (src: string): Promise<string> => {
  const res = await fetch(src);
  if (!res.ok) {
    throw new Error(`Failed to load SVG from ${src}: ${res.status}`);
  }
  return res.text();
};

export const parseGradients = (svgElement: SVGSVGElement) => {
  const gradients: Record<string, string> = {};
  const linearGradients = svgElement.querySelectorAll('linearGradient');

  linearGradients.forEach((gradient) => {
    const id = gradient.getAttribute('id');
    if (id) {
      // Store the complete gradient element as a string
      gradients[`#${id}`] = gradient.outerHTML;
    }
  });

  return gradients;
};

export const parseSvgStylesFromRootAndDefs = (svgElement: SVGSVGElement) => {
  // This function will parse style rules from `<defs><style>` and from any direct `<style>` tag child of SVG (outside defs too).
  const styles: Record<string, Record<string, string>> = {};

  // All <style> elements under <svg> or under <defs>
  const styleElements = [
    ...Array.from(svgElement.querySelectorAll(':scope > style')),
    ...Array.from(svgElement.querySelectorAll('defs > style')),
  ];

  styleElements.forEach((styleElement) => {
    const styleContent = styleElement.textContent || '';
    // Find selectors { property: value; ... }
    // This regex matches selectors wrapped with {} containing rules
    const styleRules = styleContent.match(/[^\}]+\{[^\}]+\}/g) || [];
    styleRules.forEach((rule) => {
      const [selectorRaw, stylesStr] = rule.split('{');
      if (!stylesStr) return;
      const selectorList = selectorRaw.trim().split(',');
      const styleObj: Record<string, string> = {};
      stylesStr.replace(/\s*([^:]+)\s*:\s*([^;]+);/g, (_, prop, value) => {
        styleObj[prop.trim()] = value.trim();
        return '';
      });
      selectorList.forEach((sel) => {
        const key = sel.trim();
        // Merge if selector already exists (later style wins)
        styles[key] = { ...(styles[key] || {}), ...styleObj };
      });
    });
  });

  return styles;
};

export const parseGroupsFromDefs = (svgElement: SVGSVGElement) => {
  const groups: Record<string, Record<string, string>> = {};
  const defsGroups = svgElement.querySelectorAll('defs > g');

  defsGroups.forEach((group) => {
    const id = group.getAttribute('id');
    if (id) {
      const properties: Record<string, string> = {};
      const fill = group.getAttribute('fill');
      if (fill) properties.fill = fill;

      groups[`#${id}`] = properties;

      const referencingElements = svgElement.querySelectorAll(`use[*|href="#${id}"]`);
      referencingElements.forEach((element) => {
        const elementId = element.getAttribute('id');
        if (elementId) {
          groups[`#${elementId}`] = { ...properties };
        }
      });
    }
  });

  return groups;
};

export const resolveReferences = (element: Element, groups: Record<string, Record<string, string>>) => {
  const href = element.getAttribute('xlink:href') || element.getAttribute('href');
  if (href && href.startsWith('#')) {
    const referencedStyles = groups[href];
    if (referencedStyles) {
      return { ...referencedStyles };
    }
  }
  return {};
};

export const AnimatedSvg = ({ src, className, ...props }: React.ComponentPropsWithoutRef<'div'> & { src: string }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [svgContent, setSvgContent] = React.useState<string | null>(null);

  React.useEffect(() => {
    getSvgContentFromPublic(src)
      .then(setSvgContent)
      .catch((error) => {
        console.error('Error loading default SVG from public:', error);
      });
  }, [src]);

  const drawDuration = 2;
  const delay = 0;
  const strokeColor = '#09090B';
  const fillAfterEachPath = false;

  React.useEffect(() => {
    if (ref.current) {
      const svgElement = ref.current.querySelector('svg');
      if (svgElement) {
        const originalWidth = svgElement.getAttribute('width') || svgElement.getAttribute('viewBox')?.split(' ')[2];
        const originalHeight = svgElement.getAttribute('height') || svgElement.getAttribute('viewBox')?.split(' ')[3];

        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');

        // Parse gradients before styles
        // const gradients = parseGradients(svgElement);

        const styles = parseSvgStylesFromRootAndDefs(svgElement);
        const groups = parseGroupsFromDefs(svgElement);

        // Ensure gradients are present in the SVG as defs and correctly uppercased
        // const defs =
        //   svgElement.querySelector('defs') ||
        //   svgElement.insertBefore(
        //     document.createElementNS('http://www.w3.org/2000/svg', 'defs'),
        //     svgElement.firstChild,
        //   );

        // Object.values(gradients).forEach((gradientHTML) => {
        //   const parser = new DOMParser();
        //   const svgDocument = parser.parseFromString(
        //     `<svg xmlns="http://www.w3.org/2000/svg">${gradientHTML}</svg>`,
        //     'image/svg+xml',
        //   );
        //   const gradientElement = svgDocument.querySelector('linearGradient');
        //   if (gradientElement) {
        //     defs.appendChild(gradientElement);
        //   }
        // });

        // Get SVG fill and stroke as fallback
        const svgFill = svgElement.getAttribute('fill');
        const svgStroke = svgElement.getAttribute('stroke');

        const paths = svgElement.querySelectorAll('path, line, circle, rect, ellipse, polygon, polyline');

        let maxStrokeDuration = 0;

        paths.forEach((path, index) => {
          if (path instanceof SVGGeometryElement) {
            const length = path.getTotalLength();
            const totalStrokeDuration = drawDuration + index * delay;

            maxStrokeDuration = Math.max(maxStrokeDuration, totalStrokeDuration);

            // Get styles from class names
            const classNames = path.getAttribute('class')?.split(' ') || [];
            const classStyles = classNames.reduce(
              (acc: Record<string, string>, className) => ({
                ...acc,
                ...styles[`.${className}`],
              }),
              {},
            );

            // Get styles from style
            const pathStyles = path.getAttribute('style')?.split(';') || [];
            const pathStyleStyles = pathStyles.reduce(
              (acc: Record<string, string>, style) => ({
                ...acc,
                [style.split(':')[0]]: style.split(':')[1],
              }),
              {},
            );

            // Get styles from group references
            const groupStyles = resolveReferences(path, groups);

            // Get styles from parent group if path is inside a group
            let parentGroup = path.closest('g');
            const parentGroupStyles: Record<string, string> = {};
            while (parentGroup) {
              const groupId = parentGroup.getAttribute('id');
              if (groupId && groups[`#${groupId}`]) {
                Object.assign(parentGroupStyles, groups[`#${groupId}`]);
              }
              const groupFill = parentGroup.getAttribute('fill');
              if (groupFill) {
                parentGroupStyles.fill = groupFill;
              }
              parentGroup = parentGroup.parentElement?.closest('g') || null;
            }

            // Combine all styles with correct precedence
            const originalFill =
              classStyles.fill ||
              path.getAttribute('fill') ||
              pathStyleStyles.fill ||
              groupStyles.fill ||
              parentGroupStyles.fill ||
              svgFill;

            const originalStroke =
              classStyles.stroke ||
              path.getAttribute('stroke') ||
              groupStyles.stroke ||
              parentGroupStyles.stroke ||
              svgStroke;

            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = length.toString();
            path.style.stroke = originalStroke || strokeColor;
            path.style.fill = originalFill || '#000';
            path.style.strokeWidth = (1 / (1000 / Math.max(Number(originalWidth), Number(originalHeight)))).toString();
            path.style.fillOpacity = '0';

            path.style.animation = `
              animate-draw-path ${drawDuration}s ease-in-out ${index * delay}s forwards
              `;

            // // Modify animation for gradient-filled paths
            // if (originalFill?.startsWith('url')) {
            //   path.style.animation = `
            //     animate-draw-path ${totalStrokeDuration}s ease-in-out forwards,
            //     animate-fill-opacity ${totalStrokeDuration / 2}s ease-in-out ${totalStrokeDuration / 2}s forwards
            //   `;
            // } else {
            //   path.style.animation = `
            //     animate-draw-path ${totalStrokeDuration}s ease-in-out forwards,
            //     animate-fill-opacity ${totalStrokeDuration / 2}s ease-in-out ${totalStrokeDuration / 2}s forwards,
            //     animate-remove-stroke ${totalStrokeDuration / 4}s ease-in-out ${totalStrokeDuration * 0.75}s forwards
            //   `;
            // }

            // Add fill after each path draw
            if (fillAfterEachPath) {
              path.style.animation += `,
                animate-fill-opacity 1s ease-in-out ${totalStrokeDuration}s forwards
                `;

              if (!originalStroke) {
                path.style.animation += `,
                animate-remove-stroke 1s ease-in-out ${totalStrokeDuration}s forwards
                `;
              }
            }
          }
        });

        // Add fill and remove stroke animations for all paths after max stroke duration
        if (!fillAfterEachPath) {
          paths.forEach((path) => {
            if (path instanceof SVGGeometryElement) {
              // Get styles from class names
              const classNames = path.getAttribute('class')?.split(' ') || [];
              const classStyles = classNames.reduce(
                (acc: Record<string, string>, className) => ({
                  ...acc,
                  ...styles[`.${className}`],
                }),
                {},
              );
              // Get styles from group references
              const groupStyles = resolveReferences(path, groups);

              // Get styles from parent group if path is inside a group
              let parentGroup = path.closest('g');
              const parentGroupStyles: Record<string, string> = {};
              while (parentGroup) {
                const groupId = parentGroup.getAttribute('id');
                if (groupId && groups[`#${groupId}`]) {
                  Object.assign(parentGroupStyles, groups[`#${groupId}`]);
                }
                const groupFill = parentGroup.getAttribute('fill');
                if (groupFill) {
                  parentGroupStyles.fill = groupFill;
                }
                parentGroup = parentGroup.parentElement?.closest('g') || null;
              }

              const originalStroke =
                classStyles.stroke ||
                path.getAttribute('stroke') ||
                groupStyles.stroke ||
                parentGroupStyles.stroke ||
                svgStroke;

              path.style.animation += `,
                animate-fill-opacity 1s ease-in-out ${maxStrokeDuration}s forwards
                `;

              if (!originalStroke) {
                path.style.animation += `,
                  animate-remove-stroke 1s ease-in-out ${maxStrokeDuration}s forwards
                  `;
              }
            }
          });
        }
      }
    }
  }, [svgContent, drawDuration, delay, fillAfterEachPath, strokeColor]);

  return (
    <div className={cn('flex size-full items-center justify-center p-8', className)} {...props}>
      <style jsx>{`
        @keyframes animate-draw-path {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes animate-fill-opacity {
          from {
            fill-opacity: 0;
          }
          to {
            fill-opacity: 1;
          }
        }
        @keyframes animate-remove-stroke {
          to {
            stroke-width: 0;
          }
        }
      `}</style>
      <div
        ref={ref}
        dangerouslySetInnerHTML={{ __html: svgContent || '' }}
        className="size-full [&_svg]:size-full [&_svg]:max-h-full [&_svg]:max-w-full"
      />
    </div>
  );
};
