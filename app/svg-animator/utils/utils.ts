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

export const parseStylesFromDefs = (svgElement: SVGSVGElement) => {
  const styleElement = svgElement.querySelector('defs > style');
  const styles: Record<string, Record<string, string>> = {};

  if (styleElement) {
    const styleContent = styleElement.textContent || '';
    const styleRules = styleContent.match(/[^\}]+\{[^\}]+\}/g) || [];

    styleRules.forEach((rule) => {
      const [selector, stylesStr] = rule.split('{');
      const styleObj: Record<string, string> = {};
      stylesStr.replace(/\s*([^:]+)\s*:\s*([^;]+);/g, (_, prop, value) => {
        styleObj[prop.trim()] = value.trim();
        return '';
      });
      selector.split(',').forEach((sel) => {
        styles[sel.trim()] = styleObj;
      });
    });
  }

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
