import { createDefaultComponent } from "../components/constants.js";

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
  return (
    element.getAttribute("class") ||
    element.getAttribute("className") ||
    element.getAttribute("classname") ||
    ""
  );
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
/*
 * Convert common Tailwind colors to hex values.
 */
const tailwindColorToHex = (color) => {
  const colors = {
    "black": "#000000",
    "white": "#ffffff",
    "transparent": "transparent",

    // Slate
    "slate-50": "#f8fafc",
    "slate-100": "#f1f5f9",
    "slate-200": "#e2e8f0",
    "slate-300": "#cbd5e1",
    "slate-400": "#94a3b8",
    "slate-500": "#64748b",
    "slate-600": "#475569",
    "slate-700": "#334155",
    "slate-800": "#1e293b",
    "slate-900": "#0f172a",
    "slate-950": "#020617",

    // Gray
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
    "gray-950": "#030712",

    // Zinc
    "zinc-50": "#fafafa",
    "zinc-100": "#f4f4f5",
    "zinc-200": "#e4e4e7",
    "zinc-300": "#d4d4d8",
    "zinc-400": "#a1a1aa",
    "zinc-500": "#71717a",
    "zinc-600": "#52525b",
    "zinc-700": "#3f3f46",
    "zinc-800": "#27272a",
    "zinc-900": "#18181b",
    "zinc-950": "#09090b",

    // Red
    "red-50": "#fef2f2",
    "red-100": "#fee2e2",
    "red-200": "#fecaca",
    "red-300": "#fca5a5",
    "red-400": "#f87171",
    "red-500": "#ef4444",
    "red-600": "#dc2626",
    "red-700": "#b91c1c",
    "red-800": "#991b1b",
    "red-900": "#7f1d1d",

    // Blue
    "blue-50": "#eff6ff",
    "blue-100": "#dbeafe",
    "blue-200": "#bfdbfe",
    "blue-300": "#93c5fd",
    "blue-400": "#60a5fa",
    "blue-500": "#3b82f6",
    "blue-600": "#2563eb",
    "blue-700": "#1d4ed8",
    "blue-800": "#1e40af",
    "blue-900": "#1e3a8a",

    // Green
    "green-50": "#f0fdf4",
    "green-100": "#dcfce7",
    "green-200": "#bbf7d0",
    "green-300": "#86efac",
    "green-400": "#4ade80",
    "green-500": "#22c55e",
    "green-600": "#16a34a",
    "green-700": "#15803d",
    "green-800": "#166534",
    "green-900": "#14532d",

    // Yellow / Amber
    "yellow-500": "#eab308",
    "yellow-600": "#ca8a04",
    "amber-400": "#fbbf24",
    "amber-500": "#f59e0b",

    // Purple / Indigo / Violet
    "purple-500": "#a855f7",
    "purple-600": "#9333ea",
    "indigo-500": "#6366f1",
    "indigo-600": "#4f46e5",
    "violet-500": "#8b5cf6",
    "violet-600": "#7c3aed",

    // Pink / Rose / Orange
    "pink-500": "#ec4899",
    "pink-600": "#db2777",
    "rose-500": "#f43f5e",
    "rose-600": "#e11d48",
    "orange-500": "#f97316",
    "orange-600": "#ea580c",
  };

  return colors[color] || null;
};

/*
 * Convert hex color string to rgba format with specified alpha.
 */
const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== "string") return hex;
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
};

/*
 * Extract a Tailwind color from classes, supporting:
 * - Arbitrary hex values: bg-[#567843], text-[#2563eb], border-[#345686]
 * - Opacity modifiers: bg-white/10, border-white/40, bg-black/5
 * - Named palette colors: text-blue-600, bg-slate-950, etc.
 */
const extractColor = (classes, prefix) => {
  if (!classes || typeof classes !== "string") return null;

  // 1. Check for arbitrary hex or rgb: e.g. bg-[#567843], text-[#2563eb], border-[#345686]
  const arbitraryRegex = new RegExp(`(?:^|\\s)${prefix}-\\[(#[0-9a-fA-F]{3,8}|rgba?\\([^)]+\\)|[a-zA-Z]+)\\](?=\\s|$)`);
  const arbitraryMatch = classes.match(arbitraryRegex);
  if (arbitraryMatch) {
    return arbitraryMatch[1];
  }

  // 2. Check for opacity modifier: e.g. bg-white/10, border-white/40, bg-black/5
  const opacityRegex = new RegExp(`(?:^|\\s)${prefix}-([a-z]+(?:-[0-9]+)?)\\/([0-9]+)(?=\\s|$)`);
  const opacityMatch = classes.match(opacityRegex);
  if (opacityMatch) {
    const baseColorName = opacityMatch[1];
    const alphaPercent = parseInt(opacityMatch[2], 10);
    const alpha = alphaPercent / 100;

    if (baseColorName === "white") {
      return `rgba(255, 255, 255, ${alpha})`;
    }
    if (baseColorName === "black") {
      return `rgba(0, 0, 0, ${alpha})`;
    }
    const hex = tailwindColorToHex(baseColorName);
    if (hex) {
      return hexToRgba(hex, alpha);
    }
  }

  // 3. Check for standard Tailwind color: e.g. text-blue-600, bg-gray-100
  const standardRegex = new RegExp(`(?:^|\\s)${prefix}-([a-z]+(?:-[0-9]+)?)(?=\\s|$)`);
  const match = classes.match(standardRegex);
  if (match) {
    return tailwindColorToHex(match[1]);
  }

  return null;
};

/*
 * Parse inline style attribute from an element into a clean style object.
 */
export const parseInlineStyles = (element) => {
  if (!element || typeof element.getAttribute !== "function") return {};
  const rawStyle = element.getAttribute("style");
  if (!rawStyle || typeof rawStyle !== "string") return {};

  const styles = {};
  const declarations = rawStyle.split(";");

  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = decl.slice(0, colonIdx).trim().toLowerCase();
    const val = decl.slice(colonIdx + 1).trim();
    if (!prop || !val) continue;

    // Helper to extract numeric pixel value
    const numVal = parseInt(val, 10);

    switch (prop) {
      case "background-color":
      case "background":
        styles.backgroundColor = val;
        break;
      case "color":
        styles.color = val;
        styles.textColor = val;
        break;
      case "font-size":
        styles.fontSize = isNaN(numVal) ? val : numVal;
        break;
      case "font-weight":
        styles.fontWeight = isNaN(numVal) ? val : numVal;
        break;
      case "text-align":
        styles.textAlign = val;
        break;
      case "padding":
        styles.padding = isNaN(numVal) ? val : numVal;
        break;
      case "padding-left":
        styles.paddingLeft = isNaN(numVal) ? val : numVal;
        break;
      case "padding-right":
        styles.paddingRight = isNaN(numVal) ? val : numVal;
        break;
      case "padding-top":
        styles.paddingTop = isNaN(numVal) ? val : numVal;
        break;
      case "padding-bottom":
        styles.paddingBottom = isNaN(numVal) ? val : numVal;
        break;
      case "margin":
        styles.margin = isNaN(numVal) ? val : numVal;
        break;
      case "border": {
        styles.border = val;
        const bwMatch = val.match(/(\d+)px/);
        if (bwMatch) styles.borderWidth = parseInt(bwMatch[1], 10);
        if (val.includes("solid")) styles.borderStyle = "solid";
        else if (val.includes("dashed")) styles.borderStyle = "dashed";
        else if (val.includes("dotted")) styles.borderStyle = "dotted";
        const hexOrRgb = val.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/);
        if (hexOrRgb) {
          styles.borderColor = hexOrRgb[1];
        } else {
          const words = val.split(/\s+/).filter(
            (w) => !/^\d+px$/.test(w) && !["solid", "dashed", "dotted", "none", "thin", "medium", "thick"].includes(w.toLowerCase())
          );
          if (words.length > 0) {
            styles.borderColor = words[0];
          }
        }
        break;
      }
      case "gap":
      case "grid-gap":
        styles.gap = val;
        break;
      case "border-radius":
        styles.borderRadius = isNaN(numVal) ? val : numVal;
        break;
      case "border-width":
        styles.borderWidth = isNaN(numVal) ? val : numVal;
        break;
      case "border-style":
        styles.borderStyle = val;
        break;
      case "border-color":
        styles.borderColor = val;
        break;
      case "min-height":
        styles.minHeight = isNaN(numVal) ? val : numVal;
        break;
      case "opacity":
        styles.opacity = parseFloat(val);
        break;
      case "box-shadow":
        styles.boxShadow = val;
        break;
      default: {
        // Convert kebab-case to camelCase
        const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styles[camelProp] = val;
        break;
      }
    }
  }

  return styles;
};

/*
 * Apply inline styles to component schema properties following CSS precedence.
 * Inline styles strictly override class-based Tailwind styles.
 */
export const applyInlineStylesToComponent = (component, element) => {
  const styles = parseInlineStyles(element);
  if (!styles || Object.keys(styles).length === 0) return;

  component.inlineStyles = {
    ...(component.inlineStyles || {}),
    ...styles,
  };

  if (styles.backgroundColor) {
    component.backgroundColor = styles.backgroundColor;
    if (component.type === "button") {
      component.btnBgColor = styles.backgroundColor;
    }
  }

  if (styles.color || styles.textColor) {
    const textColor = styles.color || styles.textColor;
    component.textColor = textColor;
    if (component.type === "button") {
      component.btnTextColor = textColor;
    }
  }

  if (styles.fontSize !== undefined) {
    component.fontSize = styles.fontSize;
  }

  if (styles.fontWeight !== undefined) {
    component.fontWeight = styles.fontWeight;
  }

  if (styles.textAlign !== undefined) {
    component.textAlign = styles.textAlign;
  }

  if (styles.padding !== undefined) {
    component.padding = styles.padding;
  }

  if (styles.paddingLeft !== undefined || styles.paddingRight !== undefined) {
    const pX = Math.max(
      typeof styles.paddingLeft === "number" ? styles.paddingLeft : 0,
      typeof styles.paddingRight === "number" ? styles.paddingRight : 0
    );
    if (pX > 0) {
      if (component.type === "button") component.btnPaddingX = pX;
    }
  }

  if (styles.paddingTop !== undefined || styles.paddingBottom !== undefined) {
    const pY = Math.max(
      typeof styles.paddingTop === "number" ? styles.paddingTop : 0,
      typeof styles.paddingBottom === "number" ? styles.paddingBottom : 0
    );
    if (pY > 0) {
      if (component.type === "button") component.btnPaddingY = pY;
    }
  }

  if (styles.margin !== undefined) {
    component.margin = styles.margin;
  }

  if (styles.borderRadius !== undefined) {
    component.borderRadius = styles.borderRadius;
  }

  if (styles.borderWidth !== undefined) {
    component.borderWidth = styles.borderWidth;
    if (!component.borderStyle) component.borderStyle = "solid";
  }

  if (styles.borderStyle !== undefined) {
    component.borderStyle = styles.borderStyle;
  }

  if (styles.borderColor !== undefined) {
    component.borderColor = styles.borderColor;
  }

  if (styles.minHeight !== undefined) {
    component.minHeight = styles.minHeight;
  }

  if (styles.opacity !== undefined) {
    component.opacity = styles.opacity;
  }
};

/*
 * Apply common Tailwind styling to a CodeXel component.
 */
/*
 * Apply common Tailwind styling to a CodeXel component.
 */
const applyTailwindStyles = (component, element) => {
  const classes = getClasses(element);
  if (classes) {
    component.customClasses = classes;
  }

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
   * Borders
   */
  if (/(?:^|\s)border(?:-[0-9]+)?(?:\s|$)/.test(classes)) {
    const bwMatch = classes.match(/(?:^|\s)border-(\d+)(?=\s|$)/);
    component.borderWidth = bwMatch ? parseInt(bwMatch[1], 10) : 1;
    component.borderStyle = "solid";
  }
  const borderColor = extractColor(classes, "border");
  if (borderColor) {
    component.borderColor = borderColor;
  }

  /*
   * Padding
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

  if (!paddingMatch && (paddingXMatch || paddingYMatch)) {
    const paddingX = paddingXMatch ? spacingToPixels(paddingXMatch[1]) : 0;
    const paddingY = paddingYMatch ? spacingToPixels(paddingYMatch[1]) : 0;
    component.padding = Math.max(paddingX ?? 0, paddingY ?? 0);
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
   * Font size & Responsive Font Size
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

  // Check for responsive desktop overrides first (e.g. md:text-5xl)
  for (const [className, size] of Object.entries(fontSizeMap)) {
    if (new RegExp(`(?:^|\\s)md:${className}(?:\\s|$)`).test(classes)) {
      component.fontSize = size;
      if (!component.responsiveStyles) component.responsiveStyles = { tablet: {}, mobile: {} };
      component.responsiveStyles.tablet.fontSize = size;
      break;
    }
  }

  // Base mobile font size
  for (const [className, size] of Object.entries(fontSizeMap)) {
    if (new RegExp(`(?:^|\\s)${className}(?:\\s|$)`).test(classes)) {
      if (!component.fontSize) {
        component.fontSize = size;
      }
      if (!component.responsiveStyles) component.responsiveStyles = { tablet: {}, mobile: {} };
      component.responsiveStyles.mobile.fontSize = size;
      break;
    }
  }

  /*
   * Responsive Widths (e.g. md:w-1/2, w-full)
   */
  const widthMap = {
    "w-full": "100%",
    "w-1/2": "50%",
    "w-1/3": "33.33%",
    "w-2/3": "66.67%",
    "w-1/4": "25%",
    "w-3/4": "75%",
    "w-auto": "auto",
  };

  for (const [wClass, wVal] of Object.entries(widthMap)) {
    if (new RegExp(`(?:^|\\s)md:${wClass}(?:\\s|$)`).test(classes)) {
      component.width = wVal;
      if (!component.responsiveStyles) component.responsiveStyles = { tablet: {}, mobile: {} };
      component.responsiveStyles.tablet.width = wVal;
      break;
    }
  }

  for (const [wClass, wVal] of Object.entries(widthMap)) {
    if (new RegExp(`(?:^|\\s)${wClass}(?:\\s|$)`).test(classes)) {
      if (!component.width) {
        component.width = wVal;
      }
      if (!component.responsiveStyles) component.responsiveStyles = { tablet: {}, mobile: {} };
      component.responsiveStyles.mobile.width = wVal;
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

  // Strictly apply inline styles on top of Tailwind classes (CSS precedence)
  applyInlineStylesToComponent(component, element);
};

/*
 * Apply button-specific Tailwind and inline styles.
 */
const applyButtonStyles = (component, element) => {
  const classes = getClasses(element);
  component.customClasses = classes;

  const backgroundColor = extractColor(classes, "bg");
  if (backgroundColor) {
    component.btnBgColor = backgroundColor;
    component.backgroundColor = backgroundColor;
  }

  const textColor = extractColor(classes, "text");
  if (textColor) {
    component.btnTextColor = textColor;
    component.textColor = textColor;
  }

  if (classes.includes("text-center")) {
    component.btnAlign = "center";
  } else if (classes.includes("text-right")) {
    component.btnAlign = "right";
  } else if (classes.includes("text-left")) {
    component.btnAlign = "left";
  }

  const paddingXMatch = classes.match(/(?:^|\s)px-(\d+(?:\.\d+)?)(?=\s|$)/);
  if (paddingXMatch) {
    const paddingX = spacingToPixels(paddingXMatch[1]);
    if (paddingX !== null) {
      component.btnPaddingX = paddingX;
    }
  }

  const paddingYMatch = classes.match(/(?:^|\s)py-(\d+(?:\.\d+)?)(?=\s|$)/);
  if (paddingYMatch) {
    const paddingY = spacingToPixels(paddingYMatch[1]);
    if (paddingY !== null) {
      component.btnPaddingY = paddingY;
    }
  }

  if (/(?:^|\s)border(?:-[0-9]+)?(?:\s|$)/.test(classes)) {
    const bwMatch = classes.match(/(?:^|\s)border-(\d+)(?=\s|$)/);
    component.borderWidth = bwMatch ? parseInt(bwMatch[1], 10) : 1;
    component.borderStyle = "solid";
  }

  const borderColor = extractColor(classes, "border");
  if (borderColor) {
    component.borderColor = borderColor;
  }

  // Strictly apply inline styles on top of button styles
  applyInlineStylesToComponent(component, element);
};

/*
 * Check if element is a divider (<hr> or <div><hr/></div>).
 */
const isDividerElement = (element) => {
  if (!element || !element.tagName) return false;
  const tag = element.tagName.toLowerCase();
  if (tag === "hr") return true;
  if (tag === "div") {
    const children = Array.from(element.children);
    if (children.length === 1 && children[0].tagName.toLowerCase() === "hr" && !getTextContent(element)) {
      return true;
    }
  }
  return false;
};

/*
 * Parse a divider element.
 */
const parseDividerElement = (element) => {
  const tag = element.tagName.toLowerCase();
  const hrEl = tag === "hr" ? element : element.querySelector("hr");
  const component = createDefaultComponent("divider");
  component.id = generateId("divider");

  const hrClasses = hrEl ? getClasses(hrEl) : "";
  const elClasses = getClasses(element);
  const combinedClasses = `${elClasses} ${hrClasses}`.trim();

  const hrStyles = hrEl ? parseInlineStyles(hrEl) : {};
  const elStyles = parseInlineStyles(element);
  const combinedStyles = { ...elStyles, ...hrStyles };

  component.dividerColor =
    combinedStyles.borderColor ||
    extractColor(combinedClasses, "border") ||
    "#e2e8f0";

  if (combinedStyles.borderWidth) {
    component.dividerThickness = String(parseInt(combinedStyles.borderWidth, 10) || 1);
  } else {
    const bwMatch = combinedClasses.match(/(?:^|\s)border-(\d+)(?=\s|$)/);
    if (bwMatch) {
      component.dividerThickness = bwMatch[1];
    }
  }

  component.customClasses = combinedClasses;
  component.inlineStyles = combinedStyles;
  applyTailwindStyles(component, element);
  applyInlineStylesToComponent(component, element);
  return component;
};

/*
 * Check if element is a hero section.
 */
const isHeroElement = (element) => {
  if (!element || !element.tagName) return false;
  const tag = element.tagName.toLowerCase();
  if (!["section", "header", "div"].includes(tag)) return false;

  const classes = getClasses(element).toLowerCase();
  if (classes.includes("hero")) return true;

  // An element that contains a nav or footer or another section is a page wrapper, not a hero
  if (element.querySelector("nav, footer") || (tag === "div" && element.querySelector("section"))) {
    return false;
  }

  // Check for hero content pattern: an h1, a paragraph, and 1 or more buttons/anchors
  const hasH1 = Boolean(element.querySelector("h1, .text-4xl, .text-5xl, .text-6xl"));
  const hasP = Boolean(element.querySelector("p"));
  const buttons = element.querySelectorAll("a, button");
  const hasButtons = buttons.length >= 1;

  if (hasH1 && hasP && hasButtons && !element.querySelector("form") && !element.querySelector("table")) {
    return true;
  }
  return false;
};

/*
 * Parse a hero section.
 */
const parseHeroElement = (element) => {
  const component = createDefaultComponent("hero");
  component.id = generateId("hero");

  const h1El = element.querySelector("h1, h2, .text-4xl, .text-5xl");
  if (h1El) {
    component.heading = getTextContent(h1El);
    const h1Classes = getClasses(h1El);
    const h1Styles = parseInlineStyles(h1El);
    if (h1Styles.color) component.heroHeadingColor = h1Styles.color;
    else if (extractColor(h1Classes, "text")) component.heroHeadingColor = extractColor(h1Classes, "text");

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

    for (const [cls, size] of Object.entries(fontSizeMap)) {
      if (new RegExp(`(?:^|\\s)md:${cls}(?:\\s|$)`).test(h1Classes)) {
        component.fontSize = size;
        if (!component.responsiveStyles) component.responsiveStyles = { tablet: {}, mobile: {} };
        component.responsiveStyles.tablet.fontSize = size;
        break;
      }
    }

    for (const [cls, size] of Object.entries(fontSizeMap)) {
      if (new RegExp(`(?:^|\\s)${cls}(?:\\s|$)`).test(h1Classes)) {
        if (!component.fontSize) component.fontSize = size;
        if (!component.responsiveStyles) component.responsiveStyles = { tablet: {}, mobile: {} };
        component.responsiveStyles.mobile.fontSize = size;
        break;
      }
    }
  }

  const pEl = element.querySelector("p");
  if (pEl) {
    component.description = getTextContent(pEl);
    const pClasses = getClasses(pEl);
    const pStyles = parseInlineStyles(pEl);
    if (pStyles.color) component.heroDescColor = pStyles.color;
    else if (extractColor(pClasses, "text")) component.heroDescColor = extractColor(pClasses, "text");
  }

  const buttons = Array.from(element.querySelectorAll("button, a")).filter(
    (btn) => getTextContent(btn).length > 0 && !btn.closest("nav")
  );

  if (buttons.length > 0) {
    const btn1 = buttons[0];
    component.showHeroButton = true;
    component.buttonText = getTextContent(btn1) || "Get Started";
    component.heroButtonLink = btn1.getAttribute("href") || "#";

    const btn1Styles = parseInlineStyles(btn1);
    const btn1Classes = getClasses(btn1);
    component.heroButtonBg =
      btn1Styles.backgroundColor ||
      extractColor(btn1Classes, "bg") ||
      (btn1Classes.includes("bg-black") ? "#000000" : undefined) ||
      "#ffffff";
    component.heroButtonTextColor =
      btn1Styles.color ||
      extractColor(btn1Classes, "text") ||
      "#2563eb";
    component.heroButtonClasses = btn1Classes;
    component.heroButtonInlineStyles = btn1Styles;
  } else {
    component.showHeroButton = false;
  }

  if (buttons.length > 1) {
    const btn2 = buttons[1];
    component.showSecondaryButton = true;
    component.secondaryButtonText = getTextContent(btn2) || "Learn More";
    component.secondaryButtonLink = btn2.getAttribute("href") || "#";

    const btn2Styles = parseInlineStyles(btn2);
    const btn2Classes = getClasses(btn2);
    component.secondaryButtonBg =
      btn2Styles.backgroundColor ||
      extractColor(btn2Classes, "bg") ||
      (btn2Classes.includes("bg-white/10") ? "rgba(255, 255, 255, 0.1)" : undefined);
    component.secondaryButtonTextColor =
      btn2Styles.color ||
      extractColor(btn2Classes, "text") ||
      (btn2Classes.includes("text-white") ? "#ffffff" : undefined);
    component.secondaryButtonBorderColor =
      btn2Styles.borderColor ||
      extractColor(btn2Classes, "border") ||
      (btn2Classes.includes("border-white/40") ? "rgba(255, 255, 255, 0.4)" : undefined);
    component.secondaryButtonClasses = btn2Classes;
    component.secondaryButtonInlineStyles = btn2Styles;
  } else {
    component.showSecondaryButton = false;
  }

  applyTailwindStyles(component, element);
  applyInlineStylesToComponent(component, element);

  // Ensure element inline background is preserved
  const elStyles = parseInlineStyles(element);
  if (elStyles.backgroundColor) {
    component.backgroundColor = elStyles.backgroundColor;
  }

  return component;
};

/*
 * Check if element is a pricing section/card.
 */
const isPricingElement = (element) => {
  if (!element || !element.tagName) return false;
  const classes = getClasses(element).toLowerCase();
  const text = getTextContent(element);

  if (classes.includes("pricing")) return true;

  const hasPrice = /\$\s*\d+/.test(text);
  const hasPeriod = /(?:\/|\b)(?:month|mo|year|yr|week)\b/i.test(text);
  const hasPlan = /(?:plan|tier|starter|pro|enterprise|pricing)/i.test(text);

  return hasPrice && (hasPeriod || hasPlan);
};

/*
 * Parse a pricing section/card.
 */
const parsePricingElement = (element) => {
  const component = createDefaultComponent("pricing");
  component.id = generateId("pricing");

  const badgeEl = element.querySelector('[class*="badge"], [class*="uppercase"], [class*="rounded-full"], span:first-child');
  if (badgeEl && getTextContent(badgeEl).length < 25 && !/\$/.test(getTextContent(badgeEl))) {
    component.pricingBadge = getTextContent(badgeEl);
  }

  const planEl = element.querySelector("h2, h3, h4, .text-xl, .text-2xl, strong");
  if (planEl) {
    component.pricingPlan = getTextContent(planEl);
  }

  const text = getTextContent(element);
  const priceMatch = text.match(/(\$\s*\d+(?:\.\d+)?)/);
  if (priceMatch) {
    component.pricingPrice = priceMatch[1].replace(/\s+/, "");
  }

  const periodMatch = text.match(/(\/\s*(?:month|mo|year|yr|week)[a-z]*)/i);
  if (periodMatch) {
    component.pricingPeriod = periodMatch[1];
  }

  const allChildNodes = element.querySelectorAll("li, div");
  const listItems = Array.from(allChildNodes).filter((item) => {
    const txt = getTextContent(item);
    if (!txt || txt.length < 2) return false;
    if (item.querySelector("button, a, h1, h2, h3, h4")) return false;
    const hasCheckOrCross = txt.includes("✓") || txt.includes("✕") || txt.includes("✔") || txt.includes("•");
    const childHasCheck = Array.from(item.children).some((c) => {
      const cTxt = getTextContent(c);
      return cTxt.includes("✓") || cTxt.includes("✕") || cTxt.includes("✔");
    });
    return hasCheckOrCross && !childHasCheck;
  });

  const fallbackItems = Array.from(element.querySelectorAll("li")).filter(
    (item) => getTextContent(item).length > 2 && !item.querySelector("button, a, h1, h2, h3, h4")
  );

  const itemsToUse = listItems.length > 0 ? listItems : fallbackItems;

  if (itemsToUse.length > 0) {
    component.pricingFeaturesList = itemsToUse.slice(0, 8).map((item, idx) => {
      const itemText = getTextContent(item).replace(/^[✓✕\-*•]\s*/, "");
      const isCross = item.textContent.includes("✕") || (item.className && item.className.includes("line-through"));
      return {
        id: `imported-pf-${Date.now()}-${idx}`,
        text: itemText || `Feature ${idx + 1}`,
        included: !isCross,
      };
    });
  }

  const ctaBtn = element.querySelector("button, a");
  if (ctaBtn) {
    component.pricingButtonText = getTextContent(ctaBtn) || "Choose Plan";
    const btnClasses = getClasses(ctaBtn);
    const btnStyles = parseInlineStyles(ctaBtn);
    component.pricingButtonBg = btnStyles.backgroundColor || extractColor(btnClasses, "bg") || "#2563eb";
    component.pricingButtonTextColor = btnStyles.color || extractColor(btnClasses, "text") || "#ffffff";
  }

  applyTailwindStyles(component, element);
  applyInlineStylesToComponent(component, element);
  return component;
};

/*
 * Parse a navigation element.
 */
const parseNavbarElement = (element) => {
  const component = createDefaultComponent("navbar");
  component.id = generateId("navbar");

  const brandEl = element.querySelector('.font-bold, .font-extrabold, h1, h2, h3, [class*="brand"], span:first-child, div:first-child');
  if (brandEl) {
    component.brand = getTextContent(brandEl) || "Brand";
    const brandStyles = parseInlineStyles(brandEl);
    const brandClasses = getClasses(brandEl);
    component.brandColor = brandStyles.color || extractColor(brandClasses, "text") || "#0f172a";
  }

  const links = Array.from(element.querySelectorAll("a")).filter((a) => a !== brandEl);
  const navLinks = [];
  let ctaLink = null;

  links.forEach((link, index) => {
    const lClasses = getClasses(link);
    const isCta = lClasses.includes("rounded") || lClasses.includes("bg-") || lClasses.includes("px-");
    if (isCta && !ctaLink) {
      ctaLink = link;
    } else {
      navLinks.push({
        id: `imported-link-${Date.now()}-${index}`,
        label: getTextContent(link) || `Link ${index + 1}`,
        targetPageId: "",
        link: link.getAttribute("href") || "#",
      });
    }
  });

  // Also check for button CTA in navbar
  if (!ctaLink) {
    const btn = element.querySelector("button");
    if (btn && btn !== brandEl) {
      ctaLink = btn;
    }
  }

  if (navLinks.length > 0) {
    component.navLinks = navLinks;
  }

  if (ctaLink) {
    component.showNavCta = true;
    component.navCtaText = getTextContent(ctaLink) || "Get Started";
    const ctaClasses = getClasses(ctaLink);
    const ctaStyles = parseInlineStyles(ctaLink);
    component.navCtaBg = ctaStyles.backgroundColor || extractColor(ctaClasses, "bg") || "#2563eb";
    component.navCtaColor = ctaStyles.color || extractColor(ctaClasses, "text") || "#ffffff";
  }

  applyTailwindStyles(component, element);
  applyInlineStylesToComponent(component, element);
  return component;
};

/*
 * Parse a footer element.
 */
const parseFooterElement = (element) => {
  const component = createDefaultComponent("footer");
  component.id = generateId("footer");

  const brandEl = element.querySelector('.font-bold, h1, h2, h3, [class*="brand"], div:first-child');
  if (brandEl) {
    component.brand = getTextContent(brandEl);
  }

  const aboutEl = element.querySelector('p');
  if (aboutEl) {
    component.footerAbout = getTextContent(aboutEl);
  }

  const allText = getTextContent(element);
  const copyrightMatch =
    allText.match(/(©[^\n<]+(?:rights reserved|\d{4}[^\n<]*|\.|$))/i) ||
    allText.match(/(©[^\n<]+)/i) ||
    allText.match(/(?:copyright|\(c\))[^\n<]+/i);

  if (copyrightMatch) {
    component.copyright = copyrightMatch[1] ? copyrightMatch[1].trim() : copyrightMatch[0].trim();
  }

  applyTailwindStyles(component, element);
  applyInlineStylesToComponent(component, element);
  return component;
};

/*
 * Parse a single HTML element into a CodeXel component.
 */
const parseElement = (element) => {
  const tag = element.tagName.toLowerCase();

  /*
   * Ignore script/style elements.
   */
  if (tag === "script" || tag === "style" || tag === "meta" || tag === "link" || tag === "title") {
    return null;
  }

  /*
   * DIVIDER
   */
  if (tag === "hr") {
    return parseDividerElement(element);
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
    component.src = element.getAttribute("src") || component.src;
    component.alt = element.getAttribute("alt") || "";

    applyTailwindStyles(component, element);
    applyInlineStylesToComponent(component, element);

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
    applyInlineStylesToComponent(component, element);

    return component;
  }

  /*
   * PARAGRAPH
   */
  if (tag === "p") {
    const component = createDefaultComponent("paragraph");
    component.id = generateId("paragraph");
    component.content = getTextContent(element);

    const keyAttr = element.getAttribute("data-key") || element.getAttribute("key");
    if (keyAttr) component.key = keyAttr;

    applyTailwindStyles(component, element);
    applyInlineStylesToComponent(component, element);

    return component;
  }

  /*
   * SPAN & INLINE TEXT ELEMENTS
   */
  if (tag === "span" || tag === "i" || tag === "em" || tag === "strong" || tag === "b" || tag === "small") {
    const component = createDefaultComponent("paragraph");
    component.id = generateId("paragraph");
    component.content = getTextContent(element) || element.getAttribute("aria-label") || element.getAttribute("title") || "";

    const keyAttr = element.getAttribute("data-key") || element.getAttribute("key");
    if (keyAttr) component.key = keyAttr;

    applyTailwindStyles(component, element);
    applyInlineStylesToComponent(component, element);

    return component;
  }

  /*
   * ICON / SVG ELEMENTS
   */
  if (tag === "svg" || tag.startsWith("fa") || tag.endsWith("icon")) {
    const component = createDefaultComponent("paragraph");
    component.id = generateId("paragraph");
    component.content = getTextContent(element) || "✦";

    const keyAttr = element.getAttribute("data-key") || element.getAttribute("key");
    if (keyAttr) component.key = keyAttr;

    applyTailwindStyles(component, element);
    applyInlineStylesToComponent(component, element);

    return component;
  }

  /*
   * NAVIGATION
   */
  if (tag === "nav") {
    return parseNavbarElement(element);
  }

  /*
   * FOOTER
   */
  if (tag === "footer") {
    return parseFooterElement(element);
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
    applyInlineStylesToComponent(component, element);

    return component;
  }

  /*
   * SECTION & GENERIC CONTAINERS
   */
  if (["section", "main", "article", "div", "header", "aside"].includes(tag)) {
    const component = createDefaultComponent("section");
    component.id = generateId("section");
    component.heading = "";
    component.content = "";

    applyTailwindStyles(component, element);
    applyInlineStylesToComponent(component, element);

    return component;
  }

  return null;
};

/*
 * Recursively parse an element and its children.
 */
const parseElementTree = (element) => {
  if (!element || !element.tagName) return [];
  const tag = element.tagName.toLowerCase();

  // Ignore executable or styling elements.
  if (tag === "script" || tag === "style" || tag === "meta" || tag === "link" || tag === "title") {
    return [];
  }

  // 1. Divider
  if (isDividerElement(element)) {
    return [parseDividerElement(element)];
  }

  // 2. Self-contained components
  if (tag === "nav") {
    return [parseNavbarElement(element)];
  }
  if (tag === "footer") {
    return [parseFooterElement(element)];
  }
  if (tag === "form") {
    const comp = parseElement(element);
    return comp ? [comp] : [];
  }

  // 3. Hero component
  if (isHeroElement(element)) {
    return [parseHeroElement(element)];
  }

  // 4. Pricing component
  if (isPricingElement(element)) {
    return [parsePricingElement(element)];
  }

  // 5. Container elements: section, main, article, div, header, aside
  if (["section", "main", "article", "header", "aside", "div"].includes(tag)) {
    const childComponents = Array.from(element.children).flatMap(parseElementTree);

    // If container contains top-level layout blocks (navbar, hero, footer), unwrap it (e.g. React root wrapper)
    const containsTopLevelBlocks = childComponents.some(
      (c) => c.type === "navbar" || c.type === "footer" || c.type === "hero"
    );
    if (containsTopLevelBlocks) {
      return childComponents;
    }

    // If an element is a div with no children, but has text (e.g. <div>Hello</div>)
    if (childComponents.length === 0 && getTextContent(element)) {
      const paragraphComp = createDefaultComponent("paragraph");
      paragraphComp.id = generateId("paragraph");
      paragraphComp.content = getTextContent(element);
      applyTailwindStyles(paragraphComp, element);
      applyInlineStylesToComponent(paragraphComp, element);
      return [paragraphComp];
    }

    // Direct heading or description check for section content
    const directH = Array.from(element.children).find((c) => /^h[1-6]$/.test(c.tagName.toLowerCase()));
    const directP = Array.from(element.children).find((c) => c.tagName.toLowerCase() === "p");

    // If section only contains a direct heading and/or paragraph, store them on the section directly
    if (childComponents.length <= 2 && (directH || directP) && childComponents.every((c) => c.type === "heading" || c.type === "paragraph")) {
      const component = createDefaultComponent("section");
      component.id = generateId("section");
      if (directH) component.heading = getTextContent(directH);
      if (directP) component.content = getTextContent(directP);
      component.children = [];
      const keyAttr = element.getAttribute("data-key") || element.getAttribute("key");
      if (keyAttr) component.key = keyAttr;
      applyTailwindStyles(component, element);
      applyInlineStylesToComponent(component, element);
      return [component];
    }

    const hasStyles = Boolean(
      element.getAttribute("style") ||
      (getClasses(element) && !getClasses(element).match(/^w-full$/))
    );

    // Only unstyled, single-child div wrappers can pass through their child
    if (tag === "div" && !hasStyles && childComponents.length === 1) {
      return childComponents;
    }

    // Preserve container with its hierarchy and styles
    const component = createDefaultComponent("section");
    component.id = generateId("section");
    component.children = childComponents;

    const keyAttr = element.getAttribute("data-key") || element.getAttribute("key");
    if (keyAttr) {
      component.key = keyAttr;
    }

    applyTailwindStyles(component, element);
    applyInlineStylesToComponent(component, element);

    // Avoid empty wrappers
    if (component.children.length === 0 && !component.heading && !component.content && !hasStyles) {
      return [];
    }

    return [component];
  }

  // 6. Terminal elements
  const component = parseElement(element);
  return component ? [component] : [];
};

/*
 * Extracts balanced parenthesis/brackets/braces taking strings and comments into account.
 */
const extractBalanced = (text, openIdx, openChar = "(", closeChar = ")") => {
  let depth = 0;
  let inStr = null;
  let i = openIdx;

  while (i < text.length) {
    const c = text[i];
    const next = text[i + 1];

    if (inStr) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === inStr) {
        inStr = null;
      }
    } else {
      if (c === "/" && next === "/") {
        const lineEnd = text.indexOf("\n", i);
        if (lineEnd === -1) break;
        i = lineEnd;
        continue;
      }
      if (c === "/" && next === "*") {
        const commentEnd = text.indexOf("*/", i);
        if (commentEnd === -1) break;
        i = commentEnd + 1;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") {
        inStr = c;
      } else if (c === openChar) {
        depth++;
      } else if (c === closeChar) {
        depth--;
        if (depth === 0) {
          return text.slice(openIdx + 1, i);
        }
      }
    }
    i++;
  }
  return text.slice(openIdx + 1);
};

/*
 * Extract JSX return body from React functional components.
 */
const extractJsxFromSource = (source) => {
  // 1. Look for return ( ... )
  const returnParenIdx = source.search(/\breturn\s*\(/);
  if (returnParenIdx !== -1) {
    const openParen = source.indexOf("(", returnParenIdx);
    return extractBalanced(source, openParen, "(", ")").trim();
  }

  // 2. Look for return <...
  const returnDirectMatch = source.match(/\breturn\s+(<[\s\S]*);?/);
  if (returnDirectMatch && returnDirectMatch[1]) {
    let jsx = returnDirectMatch[1].trim();
    if (jsx.endsWith(";")) jsx = jsx.slice(0, -1).trim();
    return jsx;
  }

  // 3. Look for arrow function returning: () => ( ... )
  const arrowParenIdx = source.search(/=>\s*\(/);
  if (arrowParenIdx !== -1) {
    const openParen = source.indexOf("(", arrowParenIdx);
    return extractBalanced(source, openParen, "(", ")").trim();
  }

  return source;
};

/*
 * Safe parser for static JavaScript array literals without eval.
 */
const parseStaticArrays = (source) => {
  const arrays = {};
  const declRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\[/g;
  let match;

  while ((match = declRegex.exec(source)) !== null) {
    const varName = match[1];
    const openBracketIdx = match.index + match[0].length - 1;
    const arrayBody = extractBalanced(source, openBracketIdx, "[", "]");
    arrays[varName] = parseArrayItems(arrayBody);
  }

  return arrays;
};

const parseArrayItems = (body) => {
  const items = [];
  let i = 0;

  while (i < body.length) {
    while (i < body.length && (/\s/.test(body[i]) || body[i] === ",")) i++;
    if (i >= body.length) break;

    if (body[i] === "{") {
      const objBody = extractBalanced(body, i, "{", "}");
      items.push(parseObjectBody(objBody));
      let depth = 0;
      let inStr = null;
      let j = i;
      while (j < body.length) {
        const c = body[j];
        if (inStr) {
          if (c === "\\") { j += 2; continue; }
          if (c === inStr) inStr = null;
        } else {
          if (c === '"' || c === "'" || c === "`") inStr = c;
          else if (c === "{") depth++;
          else if (c === "}") {
            depth--;
            if (depth === 0) { j++; break; }
          }
        }
        j++;
      }
      i = j;
    } else if (body[i] === '"' || body[i] === "'" || body[i] === "`") {
      const q = body[i];
      let j = i + 1;
      let str = "";
      while (j < body.length) {
        if (body[j] === "\\") { str += body[j + 1] || ""; j += 2; continue; }
        if (body[j] === q) { j++; break; }
        str += body[j];
        j++;
      }
      items.push(str);
      i = j;
    } else {
      i++;
    }
  }

  return items;
};

const parseObjectBody = (body) => {
  const obj = {};
  let i = 0;

  while (i < body.length) {
    const slice = body.slice(i);
    const keyMatch = slice.match(/([a-zA-Z_$][a-zA-Z0-9_$]*|['"][^'"]+['"])\s*:/);
    if (!keyMatch) break;

    const rawKey = keyMatch[1];
    const key = rawKey.replace(/^['"]|['"]$/g, "");
    let valStart = i + keyMatch.index + keyMatch[0].length;

    while (valStart < body.length && /\s/.test(body[valStart])) valStart++;
    if (valStart >= body.length) break;

    const startChar = body[valStart];
    let valEnd = valStart;

    if (startChar === '"' || startChar === "'" || startChar === "`") {
      let j = valStart + 1;
      let str = "";
      while (j < body.length) {
        if (body[j] === "\\") { str += body[j + 1] || ""; j += 2; continue; }
        if (body[j] === startChar) { valEnd = j + 1; break; }
        str += body[j];
        j++;
      }
      obj[key] = str;
      i = valEnd;
    } else if (startChar === "<") {
      let j = valStart;
      let tagDepth = 0;
      let inQ = null;
      while (j < body.length) {
        const c = body[j];
        if (inQ) {
          if (c === inQ) inQ = null;
        } else if (c === '"' || c === "'") {
          inQ = c;
        } else if (c === "<") {
          tagDepth++;
        } else if (c === ">") {
          tagDepth--;
          if (tagDepth === 0) { valEnd = j + 1; break; }
        }
        j++;
      }
      obj[key] = body.slice(valStart, valEnd);
      i = valEnd;
    } else {
      let j = valStart;
      while (j < body.length && body[j] !== "," && body[j] !== "\n" && body[j] !== "}") j++;
      let rawVal = body.slice(valStart, j).trim();
      if (/^-?\d+(?:\.\d+)?$/.test(rawVal)) obj[key] = Number(rawVal);
      else if (rawVal === "true") obj[key] = true;
      else if (rawVal === "false") obj[key] = false;
      else obj[key] = rawVal;
      i = j + 1;
    }
  }

  return obj;
};

/*
 * Extract static string definitions (e.g. const title = "...")
 */
const parseStaticStrings = (source) => {
  const strings = {};
  const declRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(['"`])([\s\S]*?)\2\s*;/g;
  let match;
  while ((match = declRegex.exec(source)) !== null) {
    strings[match[1]] = match[3];
  }
  return strings;
};

const UNITLESS_CSS = new Set([
  "z-index", "opacity", "font-weight", "line-height",
  "flex", "flex-grow", "flex-shrink", "order", "zoom"
]);

/*
 * Convert React camelCase style object body into standard CSS declaration string.
 */
const styleObjectBodyToCss = (styleBody) => {
  const declarations = [];
  let i = 0;

  while (i < styleBody.length) {
    const slice = styleBody.slice(i);
    const keyMatch = slice.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/);
    if (!keyMatch) break;

    const rawKey = keyMatch[1];
    const colonPos = i + keyMatch.index + keyMatch[0].length;
    const cssProp = rawKey.replace(/([A-Z])/g, (_, c) => `-${c.toLowerCase()}`);

    let valStart = colonPos;
    while (valStart < styleBody.length && /\s/.test(styleBody[valStart])) valStart++;

    let j = valStart;
    let inQ = null;
    let parenDepth = 0;

    while (j < styleBody.length) {
      const ch = styleBody[j];
      if (inQ) {
        if (ch === "\\") { j += 2; continue; }
        if (ch === inQ) inQ = null;
      } else {
        if (ch === '"' || ch === "'" || ch === "`") inQ = ch;
        else if (ch === "(") parenDepth++;
        else if (ch === ")") parenDepth--;
        else if (ch === "," && parenDepth === 0) break;
      }
      j++;
    }

    let rawVal = styleBody.slice(valStart, j).trim();
    i = j + 1;

    if ((rawVal.startsWith('"') && rawVal.endsWith('"')) ||
        (rawVal.startsWith("'") && rawVal.endsWith("'")) ||
        (rawVal.startsWith("`") && rawVal.endsWith("`"))) {
      rawVal = rawVal.slice(1, -1);
    } else if (/^-?\d+(?:\.\d+)?$/.test(rawVal)) {
      if (!UNITLESS_CSS.has(cssProp)) {
        rawVal = `${rawVal}px`;
      }
    }

    if (rawVal) {
      declarations.push(`${cssProp}: ${rawVal};`);
    }
  }

  return declarations.join(" ");
};

/*
 * Convert style={{ ... }} in JSX to HTML style="..."
 */
const convertJsxStylesToHtml = (jsx) => {
  let text = jsx;
  const styleRegex = /\bstyle\s*=\s*\{\{/g;
  let match;

  while ((match = styleRegex.exec(text)) !== null) {
    const startIdx = match.index;
    const firstBraceIdx = text.indexOf("{", startIdx);
    const secondBraceIdx = text.indexOf("{", firstBraceIdx + 1);

    let depth = 0;
    let inStr = null;
    let closeIdx = -1;
    let j = secondBraceIdx;

    while (j < text.length) {
      const c = text[j];
      if (inStr) {
        if (c === "\\") { j += 2; continue; }
        if (c === inStr) inStr = null;
      } else {
        if (c === '"' || c === "'" || c === "`") {
          inStr = c;
        } else if (c === "{") {
          depth++;
        } else if (c === "}") {
          depth--;
          if (depth === 0) {
            closeIdx = j;
            break;
          }
        }
      }
      j++;
    }

    if (closeIdx === -1) break;

    let outerCloseIdx = text.indexOf("}", closeIdx + 1);
    if (outerCloseIdx === -1) outerCloseIdx = closeIdx;

    const styleBody = text.slice(secondBraceIdx + 1, closeIdx);
    const cssString = styleObjectBodyToCss(styleBody);
    const replacement = `style="${cssString.replace(/"/g, '&quot;')}"`;

    text = text.slice(0, startIdx) + replacement + text.slice(outerCloseIdx + 1);
    styleRegex.lastIndex = startIdx + replacement.length;
  }

  return text;
};

/*
 * Safely remove event handlers from imported code while warning.
 * Avoids executing arbitrary imported code and prevents => from corrupting DOM tags.
 */
const stripEventHandlers = (jsx) => {
  let text = jsx;
  const handlerRegex = /\bon([A-Z][a-zA-Z0-9_$]*)\s*=\s*\{/g;
  let match;

  while ((match = handlerRegex.exec(text)) !== null) {
    const eventName = `on${match[1]}`;
    const startIdx = match.index;
    const openBraceIdx = startIdx + match[0].length - 1;

    let depth = 0;
    let inStr = null;
    let j = openBraceIdx;

    while (j < text.length) {
      const c = text[j];
      if (inStr) {
        if (c === "\\") { j += 2; continue; }
        if (c === inStr) inStr = null;
      } else {
        if (c === '"' || c === "'" || c === "`") inStr = c;
        else if (c === "{") depth++;
        else if (c === "}") {
          depth--;
          if (depth === 0) break;
        }
      }
      j++;
    }

    console.warn(`Unsupported event handler '${eventName}' was omitted during import.`);
    text = text.slice(0, startIdx) + text.slice(j + 1);
    handlerRegex.lastIndex = startIdx;
  }

  text = text.replace(/\bon([A-Z][a-zA-Z0-9_$]*)\s*=\s*(?:'[^']*'|"[^"]*")/g, (m, ev) => {
    console.warn(`Unsupported event handler 'on${ev}' was omitted during import.`);
    return "";
  });

  return text;
};

/*
 * Expand static array .map() expressions in JSX safely without arbitrary code execution.
 */
const expandMapExpressions = (jsx, staticArrays) => {
  let text = jsx;
  const mapRegex = /\{([a-zA-Z_$][a-zA-Z0-9_$]*)\.map\s*\(/g;
  let match;

  while ((match = mapRegex.exec(text)) !== null) {
    const arrayName = match[1];
    const mapStart = match.index;
    const openParenIdx = mapStart + match[0].length - 1;

    const mapBody = extractBalanced(text, openParenIdx, "(", ")");
    const fullExprEnd = text.indexOf("}", openParenIdx + mapBody.length + 1);
    if (fullExprEnd === -1) continue;

    const arrayData = staticArrays[arrayName];
    if (!Array.isArray(arrayData)) {
      console.warn(`Dynamic array expression '{${arrayName}.map(...)}' cannot be statically evaluated. Preserving placeholder.`);
      text = text.slice(0, mapStart) + `<!-- Dynamic expression ${arrayName}.map(...) could not be statically evaluated -->` + text.slice(fullExprEnd + 1);
      mapRegex.lastIndex = mapStart;
      continue;
    }

    const arrowIdx = mapBody.indexOf("=>");
    if (arrowIdx === -1) {
      console.warn(`Unsupported non-arrow function inside .map() for ${arrayName}`);
      continue;
    }

    const paramsPart = mapBody.slice(0, arrowIdx).trim();
    const cleanParams = paramsPart.replace(/[()]/g, "").split(",").map((s) => s.trim());
    const itemVar = cleanParams[0] || "item";
    const indexVar = cleanParams[1] || null;

    let templateJSX = mapBody.slice(arrowIdx + 2).trim();
    if (templateJSX.startsWith("(")) {
      templateJSX = extractBalanced(templateJSX, 0, "(", ")").trim();
    } else if (templateJSX.startsWith("{")) {
      const retIdx = templateJSX.search(/\breturn\s*\(/);
      if (retIdx !== -1) {
        const retParen = templateJSX.indexOf("(", retIdx);
        templateJSX = extractBalanced(templateJSX, retParen, "(", ")").trim();
      }
    }

    const expandedCards = arrayData.map((item, idx) => {
      let card = templateJSX;

      // Determine key value: if key="{...}" or key="..."
      let keyValue = String(idx);
      const keyMatch = card.match(/(?:^|\s)key\s*=\s*(?:\{([^}]+)\}|"([^"]+)"|'([^']+)')/);
      if (keyMatch) {
        const rawKeyExpr = (keyMatch[1] || keyMatch[2] || keyMatch[3]).trim();
        if (indexVar && rawKeyExpr === indexVar) {
          keyValue = String(idx);
        } else if (typeof item === "object" && item !== null) {
          const propMatch = rawKeyExpr.match(new RegExp(`^${itemVar}\\.([a-zA-Z0-9_$]+)$`));
          if (propMatch && item[propMatch[1]] !== undefined) {
            keyValue = String(item[propMatch[1]]);
          } else if (rawKeyExpr.startsWith('"') || rawKeyExpr.startsWith("'")) {
            keyValue = rawKeyExpr.slice(1, -1);
          } else if (/^\d+$/.test(rawKeyExpr)) {
            keyValue = rawKeyExpr;
          }
        }
      }

      card = card.replace(/(?:^|\s)key\s*=\s*(?:\{[^}]*\}|"[^"]*"|'[^']*')/g, ` data-key="${keyValue}"`);

      if (indexVar) {
        const indexRegex = new RegExp(`\\{${indexVar}\\}`, "g");
        card = card.replace(indexRegex, String(idx));
      }

      if (typeof item === "object" && item !== null) {
        for (const [key, val] of Object.entries(item)) {
          const propRegex = new RegExp(`\\{${itemVar}\\.${key}\\}`, "g");
          card = card.replace(propRegex, String(val));
        }
      } else if (typeof item === "string" || typeof item === "number") {
        const directRegex = new RegExp(`\\{${itemVar}\\}`, "g");
        card = card.replace(directRegex, String(item));
      }

      const leftoverRegex = new RegExp(`\\{${itemVar}\\.[a-zA-Z0-9_$]+\\}`, "g");
      card = card.replace(leftoverRegex, "");
      return card;
    });

    const replacement = expandedCards.join("\n");
    text = text.slice(0, mapStart) + replacement + text.slice(fullExprEnd + 1);
    mapRegex.lastIndex = mapStart + replacement.length;
  }

  return text;
};

/*
 * Normalize HTML or React JSX/TSX into DOM-parseable markup.
 */
const normalizeSourceToMarkup = (source) => {
  if (!source || !source.trim()) return "";
  let raw = source.trim();

  // Extract static declarations before return extraction
  const staticArrays = parseStaticArrays(raw);
  const staticStrings = parseStaticStrings(raw);

  // Extract the JSX return content using balanced parenthesis scanner
  let text = extractJsxFromSource(raw);

  // Remove JSX comments: {/* ... */}
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // Expand JSX Fragments <> and </>
  text = text.replace(/<>\s*/g, "<div>");
  text = text.replace(/<\/>\s*/g, "</div>");
  text = text.replace(/<React\.Fragment(?:\s+[^>]*)?>/g, "<div>");
  text = text.replace(/<\/React\.Fragment>/g, "</div>");

  // Expand self-closing non-void tags in JSX: <div ... /> -> <div ...></div>
  text = text.replace(/<(div|span|p|section|nav|footer|header|main|article|aside|h[1-6]|button|a)([^>]*?)\s*\/>/gi, "<$1$2></$1>");

  // Safely strip event handlers (e.g. onClick={() => alert(...)}) without breaking markup
  text = stripEventHandlers(text);

  // Expand static .map() expressions into concrete JSX elements
  text = expandMapExpressions(text, staticArrays);

  // Replace static string variables: {title} -> "..."
  for (const [name, val] of Object.entries(staticStrings)) {
    const varRegex = new RegExp(`\\{${name}\\}`, "g");
    text = text.replace(varRegex, val);
  }

  // Convert React style objects style={{ ... }} into HTML style="..."
  text = convertJsxStylesToHtml(text);

  // Convert className="..." to class="..."
  text = text.replace(/\bclassName\s*=\s*/g, "class=");

  // Convert className={'...'} or className={"..."} to class="..."
  text = text.replace(/\bclass=\{['"`](.*?)['"`]\}/g, 'class="$1"');

  // Convert htmlFor="..." to for="..."
  text = text.replace(/\bhtmlFor\s*=\s*/g, "for=");

  // Clean empty JSX expressions or simple string literals in braces: {'Hello'} -> Hello
  text = text.replace(/\{['"`](.*?)['"`]\}/g, "$1");

  // Remove boolean true/false attributes in JSX: attr={true} -> attr, attr={false} -> ""
  text = text.replace(/\b([a-zA-Z-]+)=\{true\}/g, "$1");
  text = text.replace(/\b([a-zA-Z-]+)=\{false\}/g, "");

  return text;
};

/*
 * Main HTML / React JSX/TSX parser.
 */
export const parseHTMLToComponents = (html) => {
  if (!html || !html.trim()) {
    return [];
  }

  const normalized = normalizeSourceToMarkup(html);
  const parser = new DOMParser();

  const document = parser.parseFromString(
    normalized,
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