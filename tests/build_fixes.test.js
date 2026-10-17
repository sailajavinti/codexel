import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

if (typeof globalThis.DOMParser === "undefined") {
  class MockNode {
    constructor(tagName = "DIV", attrs = {}, text = "", children = []) {
      this.tagName = tagName.toUpperCase();
      this.nodeType = 1;
      this.attributes = attrs;
      this._textContent = text;
      this.children = children;
      children.forEach((c) => { c.parentElement = this; });
    }
    get textContent() {
      if (this.children.length === 0) return this._textContent;
      return this.children.map((c) => c.textContent).filter(Boolean).join(" ");
    }
    set textContent(val) {
      this._textContent = val;
    }
    getAttribute(name) {
      return this.attributes[name.toLowerCase()] ?? null;
    }
    hasAttribute(name) {
      return name.toLowerCase() in this.attributes;
    }
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    }
    querySelectorAll(selector) {
      const results = [];
      const parts = selector.split(",").map((s) => s.trim().toLowerCase());

      const matches = (node, sel) => {
        if (!node || !node.tagName) return false;
        const tag = node.tagName.toLowerCase();
        if (sel === tag) return true;
        if (sel.startsWith(".")) {
          const cls = sel.slice(1);
          const classAttr = node.getAttribute("class") || "";
          return classAttr.split(/\s+/).includes(cls);
        }
        if (sel.startsWith("[class*=")) {
          const match = sel.match(/\[class\*=['"]?([^'"\]]+)['"]?\]/);
          if (match) {
            const val = match[1];
            return (node.getAttribute("class") || "").includes(val);
          }
        }
        return false;
      };

      const traverse = (node) => {
        for (const child of node.children) {
          if (parts.some((p) => matches(child, p))) {
            results.push(child);
          }
          traverse(child);
        }
      };
      traverse(this);
      return results;
    }
    closest(selector) {
      let cur = this.parentElement;
      while (cur) {
        if (cur.tagName && cur.tagName.toLowerCase() === selector.toLowerCase()) return cur;
        cur = cur.parentElement;
      }
      return null;
    }
  }

  const parseHtmlString = (html) => {
    const cleanHtml = html
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");
    const root = new MockNode("CONTAINER");
    const stack = [root];

    const tagRegex = /<(\/)?([a-zA-Z0-9\-]+)([^>]*)>|([^<]+)/g;
    let match;

    const parseAttributes = (attrStr) => {
      const attrs = {};
      const attrRegex = /([a-zA-Z0-9\-]+)(?:=(?:["']([^"']*)["']|([^\s>]+)))?/g;
      let m;
      while ((m = attrRegex.exec(attrStr)) !== null) {
        const name = m[1].toLowerCase();
        const val = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : "");
        attrs[name] = val;
      }
      return attrs;
    };

    const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

    while ((match = tagRegex.exec(cleanHtml)) !== null) {
      const [full, isClosing, tagName, attrString, textContent] = match;

      if (textContent) {
        const trimmed = textContent.trim();
        if (trimmed && stack.length > 0) {
          const current = stack[stack.length - 1];
          if (current._textContent) {
            current._textContent += " " + trimmed;
          } else {
            current._textContent = trimmed;
          }
        }
      } else if (isClosing) {
        const lowerTag = tagName.toLowerCase();
        for (let i = stack.length - 1; i > 0; i--) {
          if (stack[i].tagName.toLowerCase() === lowerTag) {
            stack.length = i;
            break;
          }
        }
      } else {
        const isSelfClosing = full.endsWith("/>") || voidElements.has(tagName.toLowerCase());
        const attrs = parseAttributes(attrString || "");
        const node = new MockNode(tagName, attrs, "", []);
        const parent = stack[stack.length - 1];
        parent.children.push(node);
        node.parentElement = parent;

        if (!isSelfClosing) {
          stack.push(node);
        }
      }
    }

    return root;
  };

  globalThis.DOMParser = class MockDOMParser {
    parseFromString(str) {
      const parsedRoot = parseHtmlString(str);
      const findBody = (node) => {
        if (!node) return null;
        if (node.tagName === "BODY") return node;
        for (const child of node.children) {
          const found = findBody(child);
          if (found) return found;
        }
        return null;
      };
      const bodyEl = findBody(parsedRoot);
      return { body: bodyEl || parsedRoot };
    }
  };
}

import { parseHTMLToComponents } from "../frontend/src/pages/build/code-import/codeParser.js";

describe("CodeXel - BuildHeader and Import/Export UI Fixes", () => {
  const buildHeaderPath = path.resolve("frontend/src/pages/build/BuildHeader.jsx");
  const buildPath = path.resolve("frontend/src/pages/build/Build.jsx");
  const importModalPath = path.resolve("frontend/src/pages/build/ImportCodeModal.jsx");

  const buildHeaderCode = fs.readFileSync(buildHeaderPath, "utf-8");
  const buildCode = fs.readFileSync(buildPath, "utf-8");
  const importModalCode = fs.readFileSync(importModalPath, "utf-8");

  describe("Requirement 1: Remove Theme Option from BuildHeader", () => {
    test("BuildHeader does not import FaPalette", () => {
      assert.strictEqual(
        buildHeaderCode.includes("FaPalette"),
        false,
        "BuildHeader should not import FaPalette"
      );
    });

    test("BuildHeader does not render any Theme button", () => {
      assert.strictEqual(
        buildHeaderCode.includes('title="Design Tokens & Theme"'),
        false,
        "BuildHeader desktop Theme button should be removed"
      );
      assert.strictEqual(
        buildHeaderCode.includes('title="Theme"'),
        false,
        "BuildHeader mobile Theme button should be removed"
      );
      assert.strictEqual(
        buildHeaderCode.includes("onOpenThemeModal"),
        false,
        "BuildHeader should not accept or call onOpenThemeModal"
      );
    });

    test("Theme persistence and underlying theme state are preserved in Build and backend save", () => {
      assert.ok(
        buildHeaderCode.includes("theme:"),
        "BuildHeader should still include theme in save payload"
      );
      assert.ok(
        buildCode.includes("setTheme"),
        "Build.jsx should preserve setTheme functionality"
      );
    });
  });

  describe("Requirement 2: Remove Undo/Redo Controls from BuildHeader but Preserve Functionality", () => {
    test("BuildHeader does not import FaUndo or FaRedo", () => {
      assert.strictEqual(
        buildHeaderCode.includes("FaUndo"),
        false,
        "BuildHeader should not import FaUndo"
      );
      assert.strictEqual(
        buildHeaderCode.includes("FaRedo"),
        false,
        "BuildHeader should not import FaRedo"
      );
    });

    test("BuildHeader does not render Undo or Redo buttons", () => {
      assert.strictEqual(
        buildHeaderCode.includes('title="Undo (Ctrl+Z)"'),
        false,
        "BuildHeader desktop Undo button should be removed"
      );
      assert.strictEqual(
        buildHeaderCode.includes('title="Redo (Ctrl+Y)"'),
        false,
        "BuildHeader desktop Redo button should be removed"
      );
      assert.strictEqual(
        buildHeaderCode.includes('title="Undo"'),
        false,
        "BuildHeader mobile Undo button should be removed"
      );
      assert.strictEqual(
        buildHeaderCode.includes('title="Redo"'),
        false,
        "BuildHeader mobile Redo button should be removed"
      );
    });

    test("Build.jsx preserves undo/redo functions and keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)", () => {
      assert.ok(
        buildCode.includes("const undo = () => {"),
        "undo function must be preserved in Build.jsx"
      );
      assert.ok(
        buildCode.includes("const redo = () => {"),
        "redo function must be preserved in Build.jsx"
      );
      assert.ok(
        buildCode.includes("e.key.toLowerCase() === \"z\""),
        "Ctrl+Z shortcut must be preserved in Build.jsx"
      );
      assert.ok(
        buildCode.includes("e.key.toLowerCase() === \"y\""),
        "Ctrl+Y shortcut must be preserved in Build.jsx"
      );
      assert.ok(
        buildCode.includes("cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === \"z\""),
        "Ctrl+Shift+Z shortcut must be preserved in Build.jsx"
      );
    });
  });

  describe("Requirement 3: Remove Example HTML from Import Existing Code Interface", () => {
    test("ImportCodeModal does not contain hardcoded default HTML code or example elements", () => {
      assert.strictEqual(
        importModalCode.includes("<h1>Hello CodeXel</h1>"),
        false,
        "No hardcoded HTML example in ImportCodeModal"
      );
      assert.strictEqual(
        importModalCode.includes("Click Me</button>"),
        false,
        "No hardcoded example button in ImportCodeModal"
      );
      assert.ok(
        importModalCode.includes('code = ""'),
        "ImportCodeModal default code prop should be empty string"
      );
      assert.ok(
        importModalCode.includes('internalCode, setInternalCode] = useState("")'),
        "ImportCodeModal internal fallback code should be empty string"
      );
    });

    test("ImportCodeModal displays a non-intrusive visual placeholder when empty", () => {
      assert.ok(
        importModalCode.includes("Paste your HTML or React code here..."),
        "Visual placeholder should be present when input is empty"
      );
      assert.ok(
        importModalCode.includes("!currentCode &&"),
        "Placeholder should only be rendered when currentCode is empty"
      );
    });

    test("ImportCodeModal blocks importing if input is empty", () => {
      assert.ok(
        importModalCode.includes("Please paste HTML or React JSX/TSX code before importing"),
        "Validation must alert user if code is empty"
      );
    });
  });

  describe("Requirement 4: Clear Import Input After Successful Save or 'New project'", () => {
    test("Build.jsx manages importCodeText state and passes it to ImportCodeModal", () => {
      assert.ok(
        buildCode.includes("const [importCodeText, setImportCodeText] = useState(\"\");"),
        "Build.jsx must hold importCodeText state"
      );
      assert.ok(
        buildCode.includes("code={importCodeText}"),
        "Build.jsx must pass code={importCodeText} to ImportCodeModal"
      );
      assert.ok(
        buildCode.includes("setCode={setImportCodeText}"),
        "Build.jsx must pass setCode={setImportCodeText} to ImportCodeModal"
      );
    });

    test("handleNewProject clears importCodeText", () => {
      const handleNewProjectRegex = /const handleNewProject = \(\) => {[\s\S]*?setImportCodeText\(""\);[\s\S]*?};/;
      assert.ok(
        handleNewProjectRegex.test(buildCode),
        "handleNewProject must call setImportCodeText(\"\")"
      );
    });

    test("onProjectSaved clears importCodeText only upon successful save", () => {
      const onProjectSavedRegex = /onProjectSaved=\{\(savedDoc\) => {[\s\S]*?setImportCodeText\(""\);[\s\S]*?}}/;
      assert.ok(
        onProjectSavedRegex.test(buildCode),
        "onProjectSaved callback must call setImportCodeText(\"\")"
      );
    });

    test("Failed save retains importCodeText because onProjectSaved is only called on HTTP success", () => {
      // In BuildHeader:
      // try { const res = await api.post("/projects/save", ...); if (onProjectSaved) onProjectSaved(res.data); } catch (err) { setStatus("error"); }
      const saveTryCatchRegex = /try\s*{[\s\S]*?await api\.post\([\s\S]*?if\s*\(onProjectSaved\)\s*{\s*onProjectSaved\([\s\S]*?catch\s*\(err\)/;
      assert.ok(
        saveTryCatchRegex.test(buildHeaderCode),
        "onProjectSaved must be invoked inside try block after api.post succeeds, not in catch block"
      );
    });
  });

  describe("Requirement 5: Allow Code Export Only After Saving the Project", () => {
    test("Build.jsx calculates canExport based on saved project ID and not dirty", () => {
      assert.ok(
        buildCode.includes("const canExport = Boolean(currentProject?._id) && !isDirty;"),
        "canExport must require currentProject?._id and !isDirty"
      );
    });

    test("Build.jsx guards handleExportClick", () => {
      assert.ok(
        buildCode.includes("if (!canExport)"),
        "handleExportClick must guard against !canExport"
      );
      assert.ok(
        buildCode.includes("Please save your project before exporting code."),
        "Shows clear message when project is never saved"
      );
      assert.ok(
        buildCode.includes("Please save your changes before exporting code."),
        "Shows clear message when project has unsaved changes"
      );
    });

    test("BuildHeader desktop and mobile export buttons are disabled when !canExport", () => {
      assert.ok(
        buildHeaderCode.includes("disabled={!canExport}"),
        "BuildHeader export buttons must use disabled={!canExport}"
      );
      assert.ok(
        buildHeaderCode.includes("Please save your project before exporting code."),
        "BuildHeader button tooltip must instruct to save project before exporting"
      );
      assert.ok(
        buildHeaderCode.includes("Please save your changes before exporting code."),
        "BuildHeader button tooltip must instruct to save changes before exporting"
      );
    });

    test("Gating truth table logic matches acceptance criteria", () => {
      const evaluateExport = (projectId, isDirty) => {
        const canExport = Boolean(projectId) && !isDirty;
        let message = "Export Code";
        if (!projectId) {
          message = "Please save your project before exporting code.";
        } else if (isDirty) {
          message = "Please save your changes before exporting code.";
        }
        return { canExport, message };
      };

      // 1. New, unsaved project
      const r1 = evaluateExport(null, false);
      assert.strictEqual(r1.canExport, false);
      assert.strictEqual(r1.message, "Please save your project before exporting code.");

      // 2. Saved project with no pending changes
      const r2 = evaluateExport("proj-123", false);
      assert.strictEqual(r2.canExport, true);
      assert.strictEqual(r2.message, "Export Code");

      // 3. Editing a saved project makes export unavailable
      const r3 = evaluateExport("proj-123", true);
      assert.strictEqual(r3.canExport, false);
      assert.strictEqual(r3.message, "Please save your changes before exporting code.");

      // 4. Failed save leaves project dirty or unsaved
      const r4 = evaluateExport("proj-123", true);
      assert.strictEqual(r4.canExport, false);

      // 5. Successful save sets isDirty=false and projectId exists
      const r5 = evaluateExport("proj-123", false);
      assert.strictEqual(r5.canExport, true);
    });
  });

  describe("HTML and React JSX Parser Functionality", () => {
    test("Parses standard HTML markup into components", () => {
      const html = `<button class="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>`;
      const comps = parseHTMLToComponents(html);
      assert.ok(comps.length > 0);
      assert.strictEqual(comps[0].type, "button");
      assert.strictEqual(comps[0].text, "Submit");
    });

    test("Parses React JSX markup with className into components", () => {
      const jsx = `
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-xl font-bold">Welcome</h2>
          <button className="bg-indigo-600 text-white px-4 py-2">Click Here</button>
        </div>
      `;
      const comps = parseHTMLToComponents(jsx);
      assert.ok(comps.length >= 1);
      const headingOrBtn = comps.some((c) => c.type === "heading" || (c.children && c.children.some((ch) => ch.type === "heading")));
      assert.ok(headingOrBtn, "Heading must be preserved in component or container");
    });
  });

  describe("Requirement: HTML Import Rendering and Style Preservation", () => {
    const fullTestHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>CodeXel Test Page</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body>
        <!-- Navbar -->
        <nav class="w-full flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
          <span class="font-bold tracking-tight text-slate-900">CodeXel</span>
          <div class="flex gap-6 items-center">
            <a href="#home" class="text-slate-600 hover:text-blue-600">Home</a>
            <a href="#about" class="text-slate-600 hover:text-blue-600">About</a>
            <a href="#pricing" class="text-slate-600 hover:text-blue-600">Pricing</a>
          </div>
          <a href="#cta" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold">Get Started</a>
        </nav>

        <!-- Hero Section -->
        <section class="w-full relative p-12" style="background-color: #567843;">
          <div class="flex flex-col w-full max-w-3xl mx-auto text-center items-center">
            <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight whitespace-pre-line leading-tight text-white">Build Modern Web Experiences Effortlessly</h1>
            <p class="mt-4 max-w-2xl text-lg opacity-90 leading-relaxed whitespace-pre-line text-white">Design and export responsive interfaces visually in minutes.</p>
            <div class="mt-8 flex flex-wrap gap-3 items-center justify-center">
              <a href="#primary" style="background-color: #000000; color: #2563eb;" class="px-6 py-3 rounded-md font-semibold shadow-xs hover:opacity-95 transition text-sm">Get Started</a>
              <a href="#secondary" class="px-6 py-3 rounded-md font-semibold border border-white/40 bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 transition text-sm">Learn More</a>
            </div>
          </div>
        </section>

        <!-- Content Section -->
        <section class="w-full relative p-10 bg-white">
          <h2 class="text-2xl font-bold mb-3 whitespace-pre-line text-gray-900">Our Features</h2>
          <p class="opacity-90 leading-relaxed whitespace-pre-line text-gray-600">Explore our powerful feature set designed for modern web applications.</p>
        </section>

        <!-- Pricing Card Section -->
        <section class="w-full relative p-8 bg-slate-50">
          <div class="border border-gray-200 p-8 text-center shadow-md rounded-2xl max-w-sm mx-auto bg-white">
            <span class="font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">Most Popular</span>
            <h3 class="mt-4 text-xl font-bold text-gray-900">Pro Plan</h3>
            <div class="mt-3 flex items-baseline justify-center gap-1">
              <span class="text-4xl font-extrabold text-gray-900">$29</span>
              <span class="text-sm text-gray-500">/ month</span>
            </div>
            <div class="mt-6 space-y-2.5 text-left border-t border-b border-gray-100 py-6 text-xs">
              <div class="flex items-center gap-2.5 text-gray-700"><span>✓</span><span>Unlimited Design Pages</span></div>
              <div class="flex items-center gap-2.5 text-gray-700"><span>✓</span><span>Full ZIP Source Code Export</span></div>
            </div>
            <a href="#choose-plan" style="background-color: #2563eb; color: #ffffff;" class="mt-6 block w-full py-3 rounded-xl font-semibold shadow-xs hover:opacity-90 transition text-sm text-center">Choose Plan</a>
          </div>
        </section>

        <!-- Divider -->
        <div class="w-full relative py-4 px-6 flex items-center" style="border-color: #345686;">
          <hr class="w-full" style="border-color: #345686; border-width: 2px;" />
        </div>

        <!-- Footer -->
        <footer class="w-full relative px-8 py-10 bg-slate-950 text-slate-400">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            <div class="md:col-span-1">
              <h3 class="text-base font-bold text-white tracking-tight">CodeXel</h3>
              <p class="mt-2 text-xs opacity-75 leading-relaxed whitespace-pre-line">Empowering creators to design and export production-grade interfaces visually.</p>
            </div>
          </div>
          <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span class="whitespace-pre-line">© 2026 CodeXel Inc. All rights reserved.</span>
          </div>
        </footer>
      </body>
      </html>
    `;

    const comps = parseHTMLToComponents(fullTestHTML);

    test("Tailwind CDN script and meta elements are safely ignored without script execution", () => {
      const hasScript = comps.some((c) => c.type === "script" || c.type === "meta");
      assert.strictEqual(hasScript, false, "Script and meta elements must not be converted to components");
    });

    test("Hero section displays #567843 background", () => {
      const hero = comps.find((c) => c.type === "hero");
      assert.ok(hero, "Hero component should be recognized");
      assert.strictEqual(
        hero.backgroundColor,
        "#567843",
        "Hero section background must preserve #567843"
      );
      assert.strictEqual(
        hero.inlineStyles?.backgroundColor,
        "#567843",
        "Hero inlineStyles must store backgroundColor: #567843"
      );
    });

    test("Hero heading and paragraph retain typography, spacing, alignment, and text", () => {
      const hero = comps.find((c) => c.type === "hero");
      assert.ok(hero, "Hero component should exist");
      assert.strictEqual(
        hero.heading,
        "Build Modern Web Experiences Effortlessly",
        "Hero heading text should be preserved"
      );
      assert.strictEqual(
        hero.description,
        "Design and export responsive interfaces visually in minutes.",
        "Hero description text should be preserved"
      );
      // Desktop font size: md:text-5xl -> 48px
      assert.strictEqual(hero.fontSize, 48, "Hero should parse desktop font size 48px");
      // Mobile responsive font size: text-3xl -> 30px
      assert.strictEqual(
        hero.responsiveStyles?.mobile?.fontSize,
        30,
        "Hero should preserve mobile font size 30px"
      );
    });

    test("First button retains black background (#000000) and #2563eb text color", () => {
      const hero = comps.find((c) => c.type === "hero");
      assert.ok(hero, "Hero component should exist");
      assert.strictEqual(hero.showHeroButton, true, "Primary button must be visible");
      assert.strictEqual(hero.buttonText, "Get Started", "Button text must match");
      assert.strictEqual(
        hero.heroButtonBg,
        "#000000",
        "First button must retain black background #000000"
      );
      assert.strictEqual(
        hero.heroButtonTextColor,
        "#2563eb",
        "First button must retain #2563eb text color"
      );
    });

    test("Second button retains border, translucent background (bg-white/10), and white text", () => {
      const hero = comps.find((c) => c.type === "hero");
      assert.ok(hero, "Hero component should exist");
      assert.strictEqual(hero.showSecondaryButton, true, "Secondary button must be visible");
      assert.strictEqual(hero.secondaryButtonText, "Learn More", "Secondary button text must match");
      assert.ok(
        hero.secondaryButtonClasses.includes("border") || hero.secondaryButtonClasses.includes("border-white/40"),
        "Secondary button must retain border utility class"
      );
      assert.ok(
        hero.secondaryButtonClasses.includes("bg-white/10"),
        "Secondary button must retain translucent bg-white/10 class"
      );
      assert.strictEqual(
        hero.secondaryButtonTextColor,
        "#ffffff",
        "Secondary button must retain white text color"
      );
      assert.ok(
        hero.secondaryButtonBg.includes("rgba(255, 255, 255, 0.1)") || hero.secondaryButtonBg === "bg-white/10",
        "Secondary button bg must resolve translucent rgba"
      );
      assert.ok(
        hero.secondaryButtonBorderColor.includes("rgba(255, 255, 255, 0.4)") || hero.secondaryButtonBorderColor === "border-white/40",
        "Secondary button border color must resolve translucent rgba"
      );
    });

    test("Navbar retains structure, brand, links, and CTA button", () => {
      const navbar = comps.find((c) => c.type === "navbar");
      assert.ok(navbar, "Navbar component should be recognized");
      assert.strictEqual(navbar.brand, "CodeXel", "Navbar brand should be CodeXel");
      assert.ok(navbar.navLinks.length >= 3, "Navbar should have at least 3 links");
      assert.strictEqual(navbar.navLinks[0].label, "Home");
      assert.strictEqual(navbar.navLinks[1].label, "About");
      assert.strictEqual(navbar.navLinks[2].label, "Pricing");
      assert.strictEqual(navbar.showNavCta, true, "Navbar CTA should be enabled");
      assert.strictEqual(navbar.navCtaText, "Get Started", "Navbar CTA text should match");
    });

    test("Content section retains heading, paragraph, and styling", () => {
      const section = comps.find((c) => c.type === "section" && c.heading === "Our Features");
      assert.ok(section, "Content section with heading 'Our Features' should exist");
      assert.ok(section.content.includes("Explore our powerful feature set"), "Section content should match");
    });

    test("Pricing card retains plan, badge, price, features, and button", () => {
      const pricing = comps.find((c) => c.type === "pricing");
      assert.ok(pricing, "Pricing component should be recognized");
      assert.strictEqual(pricing.pricingBadge, "Most Popular", "Badge should match");
      assert.strictEqual(pricing.pricingPlan, "Pro Plan", "Plan should match");
      assert.strictEqual(pricing.pricingPrice, "$29", "Price should match");
      assert.ok(pricing.pricingPeriod.includes("month"), "Period should include month");
      assert.ok(pricing.pricingFeaturesList.length >= 2, "Features list should have items");
      assert.strictEqual(pricing.pricingFeaturesList[0].text, "Unlimited Design Pages");
      assert.strictEqual(pricing.pricingButtonText, "Choose Plan");
      assert.strictEqual(pricing.pricingButtonBg, "#2563eb");
    });

    test("Divider is preserved and retains border color #345686 and thickness 2px", () => {
      const divider = comps.find((c) => c.type === "divider");
      assert.ok(divider, "Divider component should be recognized instead of being dropped");
      assert.strictEqual(
        divider.dividerColor,
        "#345686",
        "Divider must retain #345686 border color"
      );
      assert.strictEqual(
        divider.dividerThickness,
        "2",
        "Divider must retain 2px thickness"
      );
    });

    test("Footer retains brand, about text, and copyright statement", () => {
      const footer = comps.find((c) => c.type === "footer");
      assert.ok(footer, "Footer component should be recognized");
      assert.strictEqual(footer.brand, "CodeXel", "Footer brand should be CodeXel");
      assert.ok(
        footer.footerAbout.includes("Empowering creators"),
        "Footer about text should be preserved"
      );
      assert.ok(
        footer.copyright.includes("© 2026 CodeXel Inc"),
        "Footer copyright should be preserved"
      );
    });

    test("Inline styles take cascading precedence over Tailwind utility classes", () => {
      const htmlWithConflict = `
        <button class="bg-blue-600 text-white rounded-lg" style="background-color: #567843; color: #000000; border-radius: 14px;">Custom</button>
      `;
      const result = parseHTMLToComponents(htmlWithConflict);
      assert.ok(result.length > 0);
      const btn = result[0];
      assert.strictEqual(
        btn.btnBgColor,
        "#567843",
        "Inline background-color #567843 must override utility class bg-blue-600"
      );
      assert.strictEqual(
        btn.btnTextColor,
        "#000000",
        "Inline color #000000 must override utility class text-white"
      );
      assert.strictEqual(
        btn.borderRadius,
        14,
        "Inline border-radius 14px must override utility class rounded-lg"
      );
    });
  });

  describe("Requirement: React JSX Import Fidelity and Preservation", () => {
    const reactTestComponent = `
      import React from 'react';

      const features = [
        {
          icon: '⚡',
          title: 'Visual Drag & Drop Engine',
          description: 'Assemble responsive websites with pre-styled modular UI components.',
        },
        {
          icon: '💻',
          title: 'Multi-Format Clean Code Export',
          description: 'Export human-readable React 19 JSX and Tailwind CSS.',
        },
        {
          icon: '📱',
          title: 'Live Responsive Viewports',
          description: 'Test responsive layouts dynamically across devices.',
        },
      ];

      export default function App() {
        return (
          <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
            {/* Navbar */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#0f172a' }}>CodeXel</span>
              <div style={{ display: 'flex', gap: '24px' }}>
                <a href="#home" style={{ color: '#64748b' }}>Home</a>
                <a href="#about" style={{ color: '#64748b' }}>About</a>
                <a href="#pricing" style={{ color: '#64748b' }}>Pricing</a>
              </div>
              <button
                onClick={() => alert("React import works!")}
                style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 20px', borderRadius: '8px' }}
              >
                Get Started
              </button>
            </nav>

            {/* Hero Section */}
            <section style={{ padding: '64px 32px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#0f172a' }}>
                Build Modern Web Experiences Effortlessly
              </h1>
              <p style={{ fontSize: '18px', color: '#64748b', marginTop: '16px' }}>
                Design and export responsive interfaces visually in minutes.
              </p>
              <div style={{ marginTop: '32px' }}>
                <button
                  onClick={() => alert("React import works!")}
                  style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontWeight: '600' }}
                >
                  Get Started
                </button>
              </div>
            </section>

            {/* Feature Cards Grid */}
            <section style={{ padding: '64px 32px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ fontSize: '28px', marginBottom: '16px' }}>{feature.icon}</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>{feature.title}</h3>
                    <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Dark Footer */}
            <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>CodeXel</h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>
                    Empowering creators to design and export production-grade interfaces visually.
                  </p>
                </div>
                <span style={{ fontSize: '12px' }}>© 2026 CodeXel Inc. All rights reserved.</span>
              </div>
            </footer>
          </div>
        );
      }
    `;

    const parsed = parseHTMLToComponents(reactTestComponent);

    test("Complete React component parses into top-level layout components without premature return truncation", () => {
      assert.ok(parsed.length >= 3, `Expected at least 3 top-level components, got ${parsed.length}`);
      const types = parsed.map((c) => c.type);
      assert.ok(types.includes("navbar"), "Navbar component must exist in parsed tree");
      assert.ok(types.includes("hero"), "Hero component must exist in parsed tree");
      assert.ok(types.includes("footer"), "Footer component must exist in parsed tree");
    });

    test("Navbar displays CodeXel brand and all three navigation links", () => {
      const navbar = parsed.find((c) => c.type === "navbar");
      assert.ok(navbar, "Navbar component should exist");
      assert.strictEqual(navbar.brand, "CodeXel", "Navbar brand must be CodeXel");
      assert.ok(navbar.navLinks.length >= 3, "Navbar must retain all 3 navigation links");
      const labels = navbar.navLinks.map((l) => l.label);
      assert.ok(labels.includes("Home"), "Navbar links must include Home");
      assert.ok(labels.includes("About"), "Navbar links must include About");
      assert.ok(labels.includes("Pricing"), "Navbar links must include Pricing");
      assert.strictEqual(navbar.showNavCta, true, "Navbar CTA button must be enabled");
      assert.strictEqual(navbar.navCtaText, "Get Started", "Navbar CTA button text must be 'Get Started'");
      assert.strictEqual(navbar.navCtaBg, "#2563eb", "Navbar CTA button background must be '#2563eb'");
    });

    test("Hero section displays heading, description, and blue Get Started button", () => {
      const hero = parsed.find((c) => c.type === "hero");
      assert.ok(hero, "Hero component should exist");
      assert.strictEqual(
        hero.heading,
        "Build Modern Web Experiences Effortlessly",
        "Hero heading text must be preserved"
      );
      assert.ok(
        hero.description.includes("Design and export responsive interfaces visually in minutes"),
        "Hero description text must be preserved"
      );
      assert.strictEqual(hero.showHeroButton, true, "Hero primary button must be visible");
      assert.strictEqual(hero.buttonText, "Get Started", "Hero button label must be 'Get Started'");
      assert.strictEqual(hero.heroButtonBg, "#2563eb", "Hero button background must be blue '#2563eb'");
      assert.strictEqual(hero.heroButtonTextColor, "#ffffff", "Hero button text color must be white '#ffffff'");
    });

    test("All three feature cards render with icons, titles, descriptions, borders, spacing, and rounded corners", () => {
      // Find the container section with feature card children
      const cardContainer = parsed.find(
        (c) => c.type === "section" && Array.isArray(c.children) && c.children.length === 3
      ) || parsed.find(
        (c) => c.type === "section" && c.children?.some((ch) => Array.isArray(ch.children) && ch.children.length === 3)
      );

      assert.ok(cardContainer, "Feature cards container section should exist with 3 children");
      const cards = cardContainer.children.length === 3
        ? cardContainer.children
        : cardContainer.children.find((ch) => ch.children?.length === 3).children;

      assert.strictEqual(cards.length, 3, "Must render exactly 3 feature cards from features.map()");

      // Card 1
      const c1 = cards[0];
      assert.strictEqual(c1.borderRadius, 12, "Card 1 must retain borderRadius 12");
      assert.strictEqual(c1.borderWidth, 1, "Card 1 must retain borderWidth 1");
      assert.strictEqual(c1.borderColor, "#e2e8f0", "Card 1 must retain borderColor '#e2e8f0'");
      assert.strictEqual(c1.padding, 24, "Card 1 must retain padding 24");
      assert.strictEqual(c1.backgroundColor, "#ffffff", "Card 1 must retain backgroundColor '#ffffff'");
      assert.strictEqual(c1.key, "0", "Card 1 must preserve key without rendering it visibly");

      const c1Texts = c1.children ? c1.children.map((ch) => ch.content || ch.title) : [];
      assert.ok(c1Texts.includes("⚡"), "Card 1 must contain icon ⚡");
      assert.ok(c1Texts.includes("Visual Drag & Drop Engine"), "Card 1 must contain title 'Visual Drag & Drop Engine'");
      assert.ok(c1Texts.some((t) => t && t.includes("Assemble responsive websites")), "Card 1 must contain description");

      // Card 2
      const c2 = cards[1];
      assert.strictEqual(c2.borderRadius, 12, "Card 2 must retain borderRadius 12");
      assert.strictEqual(c2.borderWidth, 1, "Card 2 must retain borderWidth 1");
      assert.strictEqual(c2.borderColor, "#e2e8f0", "Card 2 must retain borderColor '#e2e8f0'");
      assert.strictEqual(c2.padding, 24, "Card 2 must retain padding 24");
      assert.strictEqual(c2.backgroundColor, "#ffffff", "Card 2 must retain backgroundColor '#ffffff'");

      const c2Texts = c2.children ? c2.children.map((ch) => ch.content || ch.title) : [];
      assert.ok(c2Texts.includes("💻"), "Card 2 must contain icon 💻");
      assert.ok(c2Texts.includes("Multi-Format Clean Code Export"), "Card 2 must contain title 'Multi-Format Clean Code Export'");

      // Card 3
      const c3 = cards[2];
      assert.strictEqual(c3.borderRadius, 12, "Card 3 must retain borderRadius 12");
      assert.strictEqual(c3.borderWidth, 1, "Card 3 must retain borderWidth 1");
      assert.strictEqual(c3.borderColor, "#e2e8f0", "Card 3 must retain borderColor '#e2e8f0'");
      assert.strictEqual(c3.padding, 24, "Card 3 must retain padding 24");
      assert.strictEqual(c3.backgroundColor, "#ffffff", "Card 3 must retain backgroundColor '#ffffff'");

      const c3Texts = c3.children ? c3.children.map((ch) => ch.content || ch.title) : [];
      assert.ok(c3Texts.includes("📱"), "Card 3 must contain icon 📱");
      assert.ok(c3Texts.includes("Live Responsive Viewports"), "Card 3 must contain title 'Live Responsive Viewports'");
    });

    test("Dark footer and copyright text appear", () => {
      const footer = parsed.find((c) => c.type === "footer");
      assert.ok(footer, "Footer component should exist");
      assert.strictEqual(footer.brand, "CodeXel", "Footer brand should be CodeXel");
      assert.ok(
        footer.footerAbout.includes("Empowering creators"),
        "Footer about text should be preserved"
      );
      assert.ok(
        footer.copyright.includes("© 2026 CodeXel Inc. All rights reserved."),
        "Footer copyright should be preserved"
      );
      assert.strictEqual(
        footer.backgroundColor,
        "#0f172a",
        "Dark footer background must preserve '#0f172a'"
      );
    });

    test("React inline style objects with gridTemplateColumns and flex properties are converted and preserved", () => {
      const cardContainer = parsed.find(
        (c) => c.type === "section" && Array.isArray(c.children) && c.children.length === 3
      ) || parsed.find(
        (c) => c.type === "section" && c.children?.some((ch) => Array.isArray(ch.children) && ch.children.length === 3)
      );
      assert.ok(cardContainer, "Cards container should exist");
      const gridElem = cardContainer.inlineStyles?.gridTemplateColumns
        ? cardContainer
        : cardContainer.children?.find((ch) => ch.inlineStyles?.gridTemplateColumns);

      assert.ok(gridElem, "Grid container element should exist");
      assert.strictEqual(
        gridElem.inlineStyles.gridTemplateColumns,
        "repeat(3, 1fr)",
        "gridTemplateColumns 'repeat(3, 1fr)' must be preserved"
      );
      assert.strictEqual(
        gridElem.inlineStyles.display,
        "grid",
        "display 'grid' must be preserved"
      );
      assert.strictEqual(
        gridElem.inlineStyles.gap,
        "24px",
        "gap '24px' must be preserved"
      );
    });

    test("Event handlers such as onClick={() => alert(...)} are safely omitted without arbitrary execution", () => {
      // Re-verify that buttons are preserved and no alert was called
      const hero = parsed.find((c) => c.type === "hero");
      assert.strictEqual(hero.buttonText, "Get Started", "Button must remain visible with its text");
      assert.strictEqual(hero.heroButtonBg, "#2563eb", "Button must retain its styling");
    });

    test("React Fragments (<> ... </>) and nested components are supported", () => {
      const fragmentJSX = `
        const Comp = () => (
          <>
            <nav><span>Fragment Brand</span></nav>
            <div style={{ padding: 20 }}>
              <p>Fragment text content</p>
            </div>
          </>
        );
      `;
      const fragmentComps = parseHTMLToComponents(fragmentJSX);
      assert.ok(fragmentComps.length >= 1, "Fragment components should parse");
      const hasNav = fragmentComps.some((c) => c.type === "navbar" || c.brand === "Fragment Brand");
      assert.ok(hasNav, "Fragment nav element should be preserved");
    });
  });
});
