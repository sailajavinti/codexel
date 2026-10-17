import { createDefaultComponent } from "../components/constants";

/*
 * Generates a unique ID for imported components.
 */
const generateId = (type) => {
  return `imported-${type}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;
};

/*
 * Extract useful text from an element.
 */
const getTextContent = (element) => {
  return element.textContent?.trim().replace(/\s+/g, " ") || "";
};

/*
 * Extract Tailwind classes.
 */
const getClasses = (element) => {
  return element.getAttribute("class") || "";
};

/*
 * Convert common Tailwind spacing values to pixels.
 *
 * Tailwind:
 * 0  -> 0px
 * 1  -> 4px
 * 2  -> 8px
 * 4  -> 16px
 * 6  -> 24px
 * 8  -> 32px
 * 12 -> 48px
 */
const spacingToPixels = (value) => {
  const spacingMap = {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
  };

  return spacingMap[value] ?? null;
};

/*
 * Convert common Tailwind colors to hex values.
 */
const tailwindColorToHex = (color) => {
  const colors = {
    "black": "#000000",
    "white": "#ffffff",

    "gray-50": "#f9fafb",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-400": "#9ca3af",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
    "gray-700": "#374151",
    "gray-800": "#1f2937",
    "gray-900": "#111827",

    "red-500": "#ef4444",
    "red-600": "#dc2626",
    "red-700": "#b91c1c",

    "blue-500": "#3b82f6",
    "blue-600": "#2563eb",
    "blue-700": "#1d4ed8",

    "green-500": "#22c55e",
    "green-600": "#16a34a",
    "green-700": "#15803d",

    "yellow-500": "#eab308",
    "yellow-600": "#ca8a04",

    "purple-500": "#a855f7",
    "purple-600": "#9333ea",

    "pink-500": "#ec4899",
    "pink-600": "#db2777",

    "orange-500": "#f97316",
    "orange-600": "#ea580c",

    "indigo-500": "#6366f1",
    "indigo-600": "#4f46e5",
  };

  return colors[color] || null;
};

/*
 * Extract a Tailwind color from classes.
 *
 * Example:
 * text-blue-600
 * bg-gray-100
 */
const extractColor = (classes, prefix) => {
  const regex = new RegExp(
    `(?:^|\\s)${prefix}-([a-z]+(?:-[0-9]+)?)(?=\\s|$)`
  );

  const match = classes.match(regex);

  if (!match) {
    return null;
  }

  return tailwindColorToHex(match[1]);
};

/*
 * Apply common Tailwind styling to a CodeXel component.
 */
const applyTailwindStyles = (component, element) => {
  const classes = getClasses(element);

  /*
   * Background color
   */
  const backgroundColor = extractColor(classes, "bg");

  if (backgroundColor) {
    component.backgroundColor = backgroundColor;
  }

  /*
   * Text color
   */
  const textColor = extractColor(classes, "text");

  if (textColor) {
    component.textColor = textColor;
  }

  /*
   * Padding
   *
   * px-6
   * py-3
   * p-4
   */
  const paddingMatch = classes.match(/(?:^|\s)p-(\d+(?:\.\d+)?)(?=\s|$)/);
  const paddingXMatch = classes.match(/(?:^|\s)px-(\d+(?:\.\d+)?)(?=\s|$)/);
  const paddingYMatch = classes.match(/(?:^|\s)py-(\d+(?:\.\d+)?)(?=\s|$)/);

  if (paddingMatch) {
    const padding = spacingToPixels(paddingMatch[1]);

    if (padding !== null) {
      component.padding = padding;
    }
  }

  /*
   * If only horizontal/vertical padding exists,
   * use the larger value as the component padding.
   */
  if (!paddingMatch && (paddingXMatch || paddingYMatch)) {
    const paddingX = paddingXMatch
      ? spacingToPixels(paddingXMatch[1])
      : 0;

    const paddingY = paddingYMatch
      ? spacingToPixels(paddingYMatch[1])
      : 0;

    component.padding = Math.max(
      paddingX ?? 0,
      paddingY ?? 0
    );
  }

  /*
   * Margin
   */
  const marginMatch = classes.match(/(?:^|\s)m-(\d+(?:\.\d+)?)(?=\s|$)/);

  if (marginMatch) {
    const margin = spacingToPixels(marginMatch[1]);

    if (margin !== null) {
      component.margin = margin;
    }
  }

  /*
   * Text alignment
   */
  if (/(?:^|\s)text-center(?:\s|$)/.test(classes)) {
    component.textAlign = "center";
  } else if (/(?:^|\s)text-left(?:\s|$)/.test(classes)) {
    component.textAlign = "left";
  } else if (/(?:^|\s)text-right(?:\s|$)/.test(classes)) {
    component.textAlign = "right";
  }

  /*
   * Font size
   */
  const fontSizeMap = {
    "text-xs": 12,
    "text-sm": 14,
    "text-base": 16,
    "text-lg": 18,
    "text-xl": 20,
    "text-2xl": 24,
    "text-3xl": 30,
    "text-4xl": 36,
    "text-5xl": 48,
    "text-6xl": 60,
  };

  for (const [className, size] of Object.entries(fontSizeMap)) {
    if (new RegExp(`(?:^|\\s)${className}(?:\\s|$)`).test(classes)) {
      component.fontSize = size;
      break;
    }
  }

  /*
   * Font weight
   */
  const fontWeightMap = {
    "font-thin": 100,
    "font-extralight": 200,
    "font-light": 300,
    "font-normal": 400,
    "font-medium": 500,
    "font-semibold": 600,
    "font-bold": 700,
    "font-extrabold": 800,
    "font-black": 900,
  };

  for (const [className, weight] of Object.entries(fontWeightMap)) {
    if (new RegExp(`(?:^|\\s)${className}(?:\\s|$)`).test(classes)) {
      component.fontWeight = weight;
      break;
    }
  }

  /*
   * Border radius
   */
  const borderRadiusMap = {
    "rounded-none": 0,
    "rounded-sm": 2,
    "rounded": 4,
    "rounded-md": 6,
    "rounded-lg": 8,
    "rounded-xl": 12,
    "rounded-2xl": 16,
    "rounded-3xl": 24,
    "rounded-full": 9999,
  };

  for (const [className, radius] of Object.entries(borderRadiusMap)) {
    if (new RegExp(`(?:^|\\s)${className}(?:\\s|$)`).test(classes)) {
      component.borderRadius = radius;
      break;
    }
  }
};

/*
 * Apply button-specific Tailwind styles.
 */
const applyButtonStyles = (component, element) => {
  const classes = getClasses(element);

  /*
   * Button background color
   */
  const backgroundColor = extractColor(classes, "bg");

  if (backgroundColor) {
    component.btnBgColor = backgroundColor;
  }

  /*
   * Button text color
   */
  const textColor = extractColor(classes, "text");

  if (textColor) {
    component.btnTextColor = textColor;
  }

  /*
   * Button alignment
   */
  if (classes.includes("text-center")) {
    component.btnAlign = "center";
  } else if (classes.includes("text-right")) {
    component.btnAlign = "right";
  } else {
    component.btnAlign = "left";
  }

  /*
   * Button horizontal padding
   */
  const paddingXMatch = classes.match(
    /(?:^|\s)px-(\d+(?:\.\d+)?)(?=\s|$)/
  );

  if (paddingXMatch) {
    const paddingX = spacingToPixels(paddingXMatch[1]);

    if (paddingX !== null) {
      component.btnPaddingX = paddingX;
    }
  }

  /*
   * Button vertical padding
   */
  const paddingYMatch = classes.match(
    /(?:^|\s)py-(\d+(?:\.\d+)?)(?=\s|$)/
  );

  if (paddingYMatch) {
    const paddingY = spacingToPixels(paddingYMatch[1]);

    if (paddingY !== null) {
      component.btnPaddingY = paddingY;
    }
  }
};

/*
 * Parse a single HTML element into a CodeXel component.
 */
const parseElement = (element) => {
  const tag = element.tagName.toLowerCase();

  /*
   * Ignore script/style elements.
   */
  if (tag === "script" || tag === "style") {
    return null;
  }

  /*
   * BUTTON
   */
  if (tag === "button") {
    const component = createDefaultComponent("button");

    component.id = generateId("button");
    component.text = getTextContent(element);

    applyTailwindStyles(component, element);
    applyButtonStyles(component, element);

    return component;
  }

  /*
   * ANCHOR
   *
   * Treat standalone <a> elements as buttons.
   */
  if (tag === "a") {
    const component = createDefaultComponent("button");

    component.id = generateId("button");
    component.text = getTextContent(element);
    component.link = element.getAttribute("href") || "";

    applyTailwindStyles(component, element);
    applyButtonStyles(component, element);

    return component;
  }

  /*
   * IMAGE
   */
  if (tag === "img") {
    const component = createDefaultComponent("image");

    component.id = generateId("image");

    component.src =
      element.getAttribute("src") || component.src;

    component.alt =
      element.getAttribute("alt") || "";

    applyTailwindStyles(component, element);

    return component;
  }

  /*
   * HEADING
   */
  if (/^h[1-6]$/.test(tag)) {
    const component = createDefaultComponent("heading");

    component.id = generateId("heading");
    component.title = getTextContent(element);
    component.subtitle = "";

    applyTailwindStyles(component, element);

    return component;
  }

  /*
   * PARAGRAPH
   */
  if (tag === "p") {
    const component = createDefaultComponent("paragraph");

    component.id = generateId("paragraph");
    component.content = getTextContent(element);

    applyTailwindStyles(component, element);

    return component;
  }

  /*
   * NAVIGATION
   */
  if (tag === "nav") {
    const component = createDefaultComponent("navbar");

    component.id = generateId("navbar");

    const links = Array.from(
      element.querySelectorAll("a")
    ).map((link, index) => ({
      id: `imported-link-${Date.now()}-${index}`,
      label: getTextContent(link),
      targetPageId: "",
    }));

    if (links.length > 0) {
      component.navLinks = links;
    }

    applyTailwindStyles(component, element);

    return component;
  }

  /*
   * FOOTER
   */
  if (tag === "footer") {
    const component = createDefaultComponent("footer");

    component.id = generateId("footer");

    applyTailwindStyles(component, element);

    return component;
  }

  /*
   * FORM
   */
  if (tag === "form") {
    const component = createDefaultComponent("form");

    component.id = generateId("form");

    const fields = Array.from(
      element.querySelectorAll("input, textarea")
    ).map((field, index) => ({
      id: `imported-field-${Date.now()}-${index}`,
      label:
        field.getAttribute("placeholder") ||
        field.getAttribute("name") ||
        `Field ${index + 1}`,
      type:
        field.tagName.toLowerCase() === "textarea"
          ? "textarea"
          : field.getAttribute("type") || "text",
      placeholder:
        field.getAttribute("placeholder") || "",
      required: field.hasAttribute("required"),
    }));

    if (fields.length > 0) {
      component.formFields = fields;
    }

    applyTailwindStyles(component, element);

    return component;
  }

  /*
   * SECTION
   */
  if (
    tag === "section" ||
    tag === "main" ||
    tag === "article"
  ) {
    const component = createDefaultComponent("section");

    component.id = generateId("section");
    component.heading = "";
    component.content = "";

    applyTailwindStyles(component, element);

    return component;
  }

  /*
   * GENERIC CONTAINERS
   */
  if (
    tag === "div" ||
    tag === "header" ||
    tag === "aside"
  ) {
    const component = createDefaultComponent("section");

    component.id = generateId("section");
    component.heading = "";
    component.content = "";

    applyTailwindStyles(component, element);

    return component;
  }

  /*
   * Unsupported elements are ignored.
   */
  return null;
};

/*
 * Elements that should keep their internal structure.
 */
const isSelfContainedComponent = (element) => {
  const tag = element.tagName.toLowerCase();

  return (
    tag === "nav" ||
    tag === "footer" ||
    tag === "form"
  );
};

/*
 * Recursively parse an element and its children.
 */
/*
 * Recursively parse an element and its children.
 */
const parseElementTree = (element) => {
  const tag = element.tagName.toLowerCase();

  // Ignore executable or styling elements.
  if (tag === "script" || tag === "style") {
    return [];
  }

  // Keep these as single, self-contained CodeXel components.
  if (isSelfContainedComponent(element)) {
    const component = parseElement(element);
    return component ? [component] : [];
  }

  // Preserve meaningful section-level hierarchy.
  if (["section", "main", "article"].includes(tag)) {
    const component = parseElement(element);

    if (!component) {
      return Array.from(element.children).flatMap(parseElementTree);
    }

    component.children = Array.from(element.children).flatMap(
      parseElementTree
    );

    // Avoid creating empty sections for unsupported/empty wrappers.
    if (component.children.length === 0 && !component.heading && !component.content) {
      return [];
    }

    return [component];
  }

  // Generic wrappers are flattened into their nearest supported parent.
  if (["div", "header", "aside"].includes(tag)) {
    return Array.from(element.children).flatMap(parseElementTree);
  }

  // Parse supported elements such as headings, paragraphs and buttons.
  const component = parseElement(element);

  return component ? [component] : [];
};

/*
 * Main HTML parser.
 */
export const parseHTMLToComponents = (html) => {
  if (!html || !html.trim()) {
    return [];
  }

  const parser = new DOMParser();

  const document = parser.parseFromString(
    html,
    "text/html"
  );

  const root = document.body;

  const components = [];

  /*
   * Parse every top-level element recursively.
   */
  Array.from(root.children).forEach((element) => {
    const parsedComponents = parseElementTree(element);

    components.push(...parsedComponents);
  });

  return components;
};