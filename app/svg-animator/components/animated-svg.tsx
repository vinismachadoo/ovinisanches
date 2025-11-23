'use client';

import { useSvgSearchParams } from '@/app/svg-animator/hooks/use-svg-search-params';
import {
  parseGradients,
  parseGroupsFromDefs,
  parseStylesFromDefs,
  resolveReferences,
} from '@/app/svg-animator/utils/utils';
import React from 'react';

interface AnimatedSvgProps extends React.ComponentPropsWithoutRef<'div'> {
  svgContent: string;
}

export const AnimatedSvg = ({ svgContent, ...props }: AnimatedSvgProps) => {
  const svgRef = React.useRef<HTMLDivElement>(null);
  // const { resolvedTheme } = useTheme();

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const { drawDuration, delay, fillAfterEachPath, strokeColor } = useSvgSearchParams();

  React.useEffect(() => {
    if (isMounted && svgRef.current) {
      const svgElement = svgRef.current.querySelector('svg');
      if (svgElement) {
        const originalWidth = svgElement.getAttribute('width') || svgElement.getAttribute('viewBox')?.split(' ')[2];
        const originalHeight = svgElement.getAttribute('height') || svgElement.getAttribute('viewBox')?.split(' ')[3];

        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');

        // Parse gradients before styles
        const gradients = parseGradients(svgElement);
        const styles = parseStylesFromDefs(svgElement);
        const groups = parseGroupsFromDefs(svgElement);

        // Ensure gradients are present in the SVG as defs and correctly uppercased
        const defs =
          svgElement.querySelector('defs') ||
          svgElement.insertBefore(
            document.createElementNS('http://www.w3.org/2000/svg', 'defs'),
            svgElement.firstChild
          );

        Object.values(gradients).forEach((gradientHTML) => {
          const parser = new DOMParser();
          const svgDocument = parser.parseFromString(
            `<svg xmlns="http://www.w3.org/2000/svg">${gradientHTML}</svg>`,
            'image/svg+xml'
          );
          const gradientElement = svgDocument.querySelector('linearGradient');
          if (gradientElement) {
            defs.appendChild(gradientElement);
          }
        });

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
              (acc: Record<string, string>, className) => ({ ...acc, ...styles[`.${className}`] }),
              {}
            );

            // Get styles from style
            const pathStyles = path.getAttribute('style')?.split(';') || [];
            const pathStyleStyles = pathStyles.reduce(
              (acc: Record<string, string>, style) => ({ ...acc, [style.split(':')[0]]: style.split(':')[1] }),
              {}
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
            path.style.fill = originalFill || 'none';
            path.style.strokeWidth = (1 / (1000 / Math.max(Number(originalWidth), Number(originalHeight)))).toString();
            path.style.fillOpacity = '0';

            path.style.animation = `
              drawPath ${drawDuration}s ease-in-out ${index * delay}s forwards
              `;

            // // Modify animation for gradient-filled paths
            // if (originalFill?.startsWith('url')) {
            //   path.style.animation = `
            //     drawPath ${totalStrokeDuration}s ease-in-out forwards,
            //     fillOpacity ${totalStrokeDuration / 2}s ease-in-out ${totalStrokeDuration / 2}s forwards
            //   `;
            // } else {
            //   path.style.animation = `
            //     drawPath ${totalStrokeDuration}s ease-in-out forwards,
            //     fillOpacity ${totalStrokeDuration / 2}s ease-in-out ${totalStrokeDuration / 2}s forwards,
            //     removeStroke ${totalStrokeDuration / 4}s ease-in-out ${totalStrokeDuration * 0.75}s forwards
            //   `;
            // }

            // Add fill after each path draw
            if (fillAfterEachPath) {
              path.style.animation += `,
                fillOpacity 1s ease-in-out ${totalStrokeDuration}s forwards
                `;

              if (!originalStroke) {
                path.style.animation += `,
                removeStroke 1s ease-in-out ${totalStrokeDuration}s forwards
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
                (acc: Record<string, string>, className) => ({ ...acc, ...styles[`.${className}`] }),
                {}
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
                fillOpacity 1s ease-in-out ${maxStrokeDuration}s forwards
                `;

              if (!originalStroke) {
                path.style.animation += `,
                  removeStroke 1s ease-in-out ${maxStrokeDuration}s forwards
                  `;
              }
            }
          });
        }
      }
    }
  }, [svgContent, drawDuration, delay, isMounted, fillAfterEachPath, strokeColor]);

  return (
    <React.Fragment>
      <div
        {...props}
        ref={svgRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className="flex w-full h-full p-0.5 items-center justify-center min-h-0 [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:max-w-full"
      />
      <style jsx global>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fillOpacity {
          from {
            fill-opacity: 0;
          }
          to {
            fill-opacity: 1;
          }
        }
        @keyframes removeStroke {
          to {
            stroke-width: 0;
          }
        }
      `}</style>
    </React.Fragment>
  );
};
