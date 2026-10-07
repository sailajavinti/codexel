import { useState } from "react";
import { FaTimes, FaCopy, FaCheck, FaCode, FaDownload, FaFileCode, FaFolder } from "react-icons/fa";
import JSZip from "jszip";

const SHADOW_MAP = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

const HOVER_CLASS_MAP = {
  none: "",
  lift: "transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg",
  scale: "transition-transform duration-200 hover:scale-[1.02]",
  glow: "transition-all duration-200 hover:ring-2 hover:ring-blue-500/50 hover:shadow-lg",
  dim: "transition-opacity duration-200 hover:opacity-85",
};

const STACK_LABELS = {
  react: "React + Tailwind JSX",
  tsx: "React + TypeScript TSX",
  html: "Vanilla HTML + Tailwind CDN",
  "css-modules": "React + CSS Modules",
};

function formatComponentName(name) {
  const cleaned = (name || "Page").replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "Page";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function formatRoutePath(name) {
  return (
    (name || "page")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page"
  );
}

function isHomePage(page, pages = []) {
  if (!page) return false;
  if (page.id === "page-home") return true;
  const name = (page.name || "").trim().toLowerCase();
  if (name === "home" || name === "index") return true;
  const hasNamedHome = pages.some(
    (p) => p && (p.id === "page-home" || (p.name || "").trim().toLowerCase() === "home")
  );
  if (!hasNamedHome && pages.length > 0) {
    const firstPage = pages[0];
    return (firstPage.id && firstPage.id === page.id) || (firstPage._id && firstPage._id === page._id);
  }
  return false;
}

function getJustifyClass(align) {
  if (align === "center") return "justify-center";
  if (align === "right") return "justify-end";
  return "justify-start";
}

function resolveLink(targetPageId, fallbackLink, pages = [], stack = "react") {
  if (targetPageId) {
    const found = pages.find((p) => (p.id && p.id === targetPageId) || (p._id && p._id === targetPageId));
    if (found) {
      if (stack === "html") {
        return isHomePage(found, pages) ? "index.html" : `${formatRoutePath(found.name)}.html`;
      }
      return isHomePage(found, pages) ? "/" : `/${formatRoutePath(found.name)}`;
    }
  }
  if (fallbackLink && typeof fallbackLink === "string" && fallbackLink.trim() && fallbackLink.trim() !== "#") {
    return fallbackLink.trim();
  }
  return "#";
}

function getPageTabName(page, pages = [], stack = "react") {
  if (stack === "html") {
    return isHomePage(page, pages) ? "index.html" : `${formatRoutePath(page.name)}.html`;
  }
  if (stack === "tsx") {
    return `${formatComponentName(page.name)}.tsx`;
  }
  return `${formatComponentName(page.name)}.jsx`;
}

function getGlobalLayoutComponents(pages = []) {
  const allComps = (pages || []).flatMap((p) => p?.canvasData || []);
  const navbar = allComps.find((c) => c?.type === "navbar");
  const footer = allComps.find((c) => c?.type === "footer");
  return { navbar, footer };
}

function generateComponentJSX(comp, pages = [], stack = "react") {
  const widthClassMap = {
    "25%": "w-full md:w-1/4",
    "33.33%": "w-full md:w-1/3",
    "50%": "w-full md:w-1/2",
    "66.67%": "w-full md:w-2/3",
    "75%": "w-full md:w-3/4",
    "100%": "w-full",
    auto: "w-auto",
  };

  const widthClass = widthClassMap[comp.width] || "w-full";
  const hoverClass = HOVER_CLASS_MAP[comp.hoverEffect || "none"] || "";
  const hasShadow = comp.boxShadow && comp.boxShadow !== "none";
  const zClass = hasShadow ? "relative z-10" : "relative";

  const buildStyles = (extraStyles = {}) => {
    const combined = {
      ...(comp.backgroundColor && { backgroundColor: `'${comp.backgroundColor}'` }),
      ...(comp.textColor && { color: `'${comp.textColor}'` }),
      ...(comp.fontSize && { fontSize: `'${comp.fontSize}px'` }),
      ...(comp.fontWeight && { fontWeight: `'${comp.fontWeight}'` }),
      ...(comp.textAlign && { textAlign: `'${comp.textAlign}'` }),
      ...(comp.padding !== undefined && comp.padding !== "" && { padding: `'${comp.padding}px'` }),
      ...(comp.margin !== undefined && comp.margin !== "" && { margin: `'${comp.margin}px'` }),
      ...(comp.borderRadius !== undefined && comp.borderRadius !== "" && { borderRadius: `'${comp.borderRadius}px'` }),
      ...(comp.borderWidth && { borderWidth: `'${comp.borderWidth}px'` }),
      ...(comp.borderStyle && comp.borderWidth && { borderStyle: `'${comp.borderStyle}'` }),
      ...(comp.borderColor && comp.borderWidth && { borderColor: `'${comp.borderColor}'` }),
      ...(hasShadow && { boxShadow: `'${SHADOW_MAP[comp.boxShadow]}'` }),
      ...(comp.minHeight && { minHeight: `'${comp.minHeight}px'` }),
      ...(comp.opacity !== undefined && comp.opacity !== "" && comp.opacity !== 100 && { opacity: comp.opacity / 100 }),
      ...extraStyles,
    };

    const entries = Object.entries(combined).map(([k, v]) => `${k}: ${v}`);
    return entries.length > 0 ? `style={{ ${entries.join(", ")} }}` : "";
  };

  switch (comp.type) {
    case "navbar": {
      const navLinks = comp.navLinks || [];
      return `      {/* Navbar */}
      <nav className="${widthClass} ${zClass} flex items-center justify-between px-8 py-4 ${
        !comp.backgroundColor ? "bg-white border-b border-gray-100" : ""
      } ${hoverClass}" ${buildStyles()}>
        <span className="font-bold tracking-tight whitespace-pre-line" style={{ color: '${comp.brandColor || "#0f172a"}' }}>
          ${comp.brand || "Brand"}
        </span>
        <div className="flex flex-wrap gap-6 items-center opacity-90" style={{ color: '${comp.navLinkColor || "#475569"}' }}>
${navLinks.map((l) => `          <a href="${resolveLink(l.targetPageId, l.link, pages, stack)}" className="hover:opacity-80">${l.label}</a>`).join("\n")}
        </div>
        ${
          comp.showNavCta
            ? `<a href="${resolveLink(comp.navCtaPageId, comp.navCtaLink, pages, stack)}" style={{ backgroundColor: '${comp.navCtaBg || "#2563eb"}', color: '${comp.navCtaColor || "#ffffff"}' }} className="px-4 py-2 rounded-lg text-xs font-semibold shadow-xs hover:opacity-90 transition">${comp.navCtaText || "Get Started"}</a>`
            : ""
        }
      </nav>`;
    }

    case "hero": {
      const bgClass = comp.backgroundColor ? "" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white";

      return `      {/* Hero Section */}
      <section className="${widthClass} ${zClass} p-12 ${bgClass} ${hoverClass}" ${buildStyles()}>
        <div className="flex flex-col w-full max-w-3xl mx-auto text-center items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight whitespace-pre-line leading-tight" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(comp.heading || "Hero Heading")} }} />
          <p className="mt-4 max-w-2xl text-lg opacity-90 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(comp.description || "Hero description text.")} }} />
          <div className="mt-8 flex flex-wrap gap-3 items-center justify-center">
            ${
              comp.showHeroButton !== false
                ? `<a href="${resolveLink(comp.heroButtonPageId, comp.heroButtonLink, pages, stack)}" style={{ backgroundColor: '${comp.heroButtonBg || "#ffffff"}', color: '${comp.heroButtonTextColor || "#2563eb"}' }} className="px-6 py-3 rounded-md font-semibold shadow-xs hover:opacity-95 transition text-sm">${comp.buttonText || "Get Started"}</a>`
                : ""
            }
            ${
              comp.showSecondaryButton !== false
                ? `<a href="${resolveLink(comp.secondaryButtonPageId, comp.secondaryButtonLink, pages, stack)}" className="px-6 py-3 rounded-md font-semibold border border-white/40 bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 transition text-sm">${comp.secondaryButtonText || "Learn More"}</a>`
                : ""
            }
          </div>
        </div>
      </section>`;
    }

    case "paragraph":
      return `      {/* Paragraph */}
      <div className="${widthClass} ${zClass} p-6 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}" ${buildStyles()}>
        <p className="whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(comp.content || "")} }} />
      </div>`;

    case "heading":
      return `      {/* Heading */}
      <div className="${widthClass} ${zClass} p-6 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}" ${buildStyles()}>
        <h2 className="text-2xl font-bold whitespace-pre-line" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(comp.title || "Custom Heading")} }} />
        ${comp.subtitle ? `<p className="mt-2 opacity-80 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(comp.subtitle)} }} />` : ""}
      </div>`;

    case "section":
      return `      {/* Section */}
      <section className="${widthClass} ${zClass} p-10 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}" ${buildStyles()}>
        ${comp.heading ? `<h2 className="text-2xl font-bold mb-3 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(comp.heading)} }} />` : ""}
        <p className="opacity-90 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(comp.content || "")} }} />
      </section>`;

    case "image":
      return `      {/* Image Block */}
      <div className="${widthClass} ${zClass} overflow-hidden ${hoverClass}" ${buildStyles()}>
        <img
          src="${comp.src || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000"}"
          alt="${comp.alt || "Visual"}"
          style={{
            width: '${comp.imageWidth ? `${comp.imageWidth}%` : "100%"}',
            height: '${comp.imageHeight ? `${comp.imageHeight}px` : "auto"}',
            objectFit: '${comp.objectFit || "cover"}'
          }}
          className="block mx-auto"
        />
      </div>`;

    case "features": {
      const features = comp.featuresList || [];
      const boxHover = HOVER_CLASS_MAP[comp.boxHoverEffect || "none"] || "";
      return `      {/* Features Grid */}
      <section className="${widthClass} ${zClass} p-10 ${!comp.backgroundColor ? "bg-white" : ""}" ${buildStyles()}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
${features.map((f) => `          <div className="p-6 bg-black/5 border border-black/10 rounded-xl ${boxHover}">
            <h4 className="font-bold whitespace-pre-line">${f.title}</h4>
            <p className="mt-2 text-xs opacity-80 leading-relaxed whitespace-pre-line">${f.desc}</p>
          </div>`).join("\n")}
        </div>
      </section>`;
    }

    case "pricing": {
      const features = comp.pricingFeaturesList || [];
      return `      {/* Pricing Card */}
      <section className="${widthClass} ${zClass} p-8 ${!comp.backgroundColor ? "bg-slate-50" : ""}" ${buildStyles()}>
        <div className="border border-gray-200 p-8 text-center shadow-md rounded-2xl max-w-sm mx-auto bg-white ${hoverClass}">
          ${comp.pricingBadge ? `<span className="font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">${comp.pricingBadge}</span>` : ""}
          <h3 className="mt-4 text-xl font-bold text-gray-900">${comp.pricingPlan}</h3>
          <div className="mt-3 flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-gray-900">${comp.pricingPrice}</span>
            <span className="text-sm text-gray-500">${comp.pricingPeriod}</span>
          </div>
          <div className="mt-6 space-y-2.5 text-left border-t border-b border-gray-100 py-6 text-xs">
${features.map((f) => `            <div className="flex items-center gap-2.5 ${f.included ? "text-gray-700" : "text-gray-400 line-through"}">
              <span>${f.included ? "✓" : "✕"}</span>
              <span>${f.text}</span>
            </div>`).join("\n")}
          </div>
          <a href="${resolveLink(comp.pricingButtonPageId, comp.pricingButtonLink, pages, stack)}" style={{ backgroundColor: '${comp.pricingButtonBg || "#2563eb"}', color: '${comp.pricingButtonTextColor || "#ffffff"}' }} className="mt-6 block w-full py-3 rounded-xl font-semibold shadow-xs hover:opacity-90 transition text-sm">
            ${comp.pricingButtonText || "Choose Plan"}
          </a>
        </div>
      </section>`;
    }

    case "testimonials": {
      const list = comp.testimonialsList || [];
      return `      {/* Testimonials */}
      <section className="${widthClass} ${zClass} p-8 ${!comp.backgroundColor ? "bg-slate-50" : ""}" ${buildStyles()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
${list.map((t) => `          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs ${hoverClass}">
            <div className="flex gap-1 text-amber-400 text-xs mb-3">
              ${"★".repeat(Math.max(1, Math.min(5, t.rating || 5)))}
            </div>
            <p className="text-xs text-gray-700 italic leading-relaxed whitespace-pre-line">
              "${t.quote || ""}"
            </p>
            <div className="mt-4 flex items-center gap-3">
              ${t.avatar ? `<img src="${t.avatar}" alt="${t.author || "Author"}" className="h-10 w-10 rounded-full object-cover border border-gray-200" />` : ""}
              <div>
                <h4 className="text-xs font-bold text-gray-900">${t.author || ""}</h4>
                <p className="text-[11px] text-gray-500">${t.role || ""}</p>
              </div>
            </div>
          </div>`).join("\n")}
        </div>
      </section>`;
    }

    case "faq": {
      const list = comp.faqList || [];
      return `      {/* FAQ Accordion */}
      <section className="${widthClass} ${zClass} p-8 ${!comp.backgroundColor ? "bg-white" : ""}" ${buildStyles()}>
        <div className="max-w-3xl mx-auto space-y-4">
          ${comp.faqTitle ? `<div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">${comp.faqTitle}</h2>
            ${comp.faqSubtitle ? `<p className="mt-1 text-xs text-gray-500 whitespace-pre-line">${comp.faqSubtitle}</p>` : ""}
          </div>` : ""}
          <div className="space-y-3">
${list.map((item) => `            <details className="group border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-800 transition hover:bg-gray-50 list-none">
                <span className="whitespace-pre-line text-sm">${item.question || ""}</span>
                <span className="text-xs text-gray-400 transition-transform duration-200 group-open:rotate-180 ml-2">▼</span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-gray-600 border-t border-gray-100 whitespace-pre-line">
                ${item.answer || ""}
              </div>
            </details>`).join("\n")}
          </div>
        </div>
      </section>`;
    }

    case "authForm": {
      const fields = comp.authFields || [];
      return `      {/* Authentication Form */}
      <div className="${widthClass} ${zClass} flex w-full justify-center items-center py-8">
        <div className="p-8 w-full max-w-md ${!comp.backgroundColor ? "bg-white border border-gray-100 shadow-xl rounded-2xl" : ""} ${hoverClass}" ${buildStyles()}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">${comp.authTitle || "Welcome Back"}</h3>
            ${comp.authSubtitle ? `<p className="mt-1 text-xs text-gray-500 whitespace-pre-line">${comp.authSubtitle}</p>` : ""}
          </div>
          ${
            comp.showSocialLogin
              ? `          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              GitHub
            </button>
          </div>`
              : ""
          }
          <form className="space-y-3.5">
${fields.map((f) => `            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">${f.label} ${f.required ? "*" : ""}</label>
              <input type="${f.type || "text"}" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
            </div>`).join("\n")}
            ${
              comp.showRememberMe || comp.showForgotPassword
                ? `            <div className="flex items-center justify-between text-xs pt-1">
              ${comp.showRememberMe ? `<label className="flex items-center gap-1.5 text-gray-600 cursor-pointer"><input type="checkbox" className="rounded accent-blue-600" /> Remember me</label>` : `<span />`}
              ${comp.showForgotPassword ? `<a href="#" className="text-blue-600 hover:underline">Forgot password?</a>` : ""}
            </div>`
                : ""
            }
            <button type="submit" className="w-full py-2.5 rounded-lg bg-blue-600 font-semibold text-xs text-white shadow-xs hover:bg-blue-700 transition mt-2">
              ${comp.submitButtonText || "Continue"}
            </button>
          </form>
        </div>
      </div>`;
    }

    case "form": {
      const fields = comp.formFields || [];
      return `      {/* Dynamic Form */}
      <form className="${widthClass} ${zClass} p-8 space-y-4 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}" ${buildStyles()}>
        ${comp.formTitle ? `<h3 className="text-xl font-bold whitespace-pre-line">${comp.formTitle}</h3>` : ""}
${fields.map((f) => f.type === "textarea"
    ? `        <div>
          <label className="block text-xs font-medium mb-1">${f.label} ${f.required ? "*" : ""}</label>
          <textarea rows={3} placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
        </div>`
    : `        <div>
          <label className="block text-xs font-medium mb-1">${f.label} ${f.required ? "*" : ""}</label>
          <input type="${f.type || "text"}" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
        </div>`).join("\n")}
        <button type="submit" className="px-5 py-2.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">
          ${comp.submitButtonText || "Send Message"}
        </button>
      </form>`;
    }

    case "footer": {
      const columns = comp.footerColumns || [];
      return `      {/* Footer */}
      <footer className="${widthClass} ${zClass} px-8 py-10 ${!comp.backgroundColor ? "bg-slate-950 text-slate-400" : ""} ${hoverClass}" ${buildStyles()}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          <div className="md:col-span-1">
            <h3 className="text-base font-bold text-white tracking-tight">${comp.brand || "Brand"}</h3>
            <p className="mt-2 text-xs opacity-75 leading-relaxed whitespace-pre-line">${comp.footerAbout || ""}</p>
          </div>
${columns.map((col) => `          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">${col.title}</h4>
            <ul className="mt-3 space-y-2 text-xs">
${(col.items || []).map((it) => `              <li><a href="${resolveLink(it.targetPageId, it.link, pages, stack)}" className="hover:text-blue-400 transition">${it.label}</a></li>`).join("\n")}
            </ul>
          </div>`).join("\n")}
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="whitespace-pre-line">${comp.copyright || ""}</span>
        </div>
      </footer>`;
    }

    case "button":
      return `      {/* Button */}
      <div className="${widthClass} ${zClass} flex ${getJustifyClass(comp.btnAlign)} p-2">
        <a
          href="${resolveLink(comp.targetPageId, comp.link, pages, stack)}"
          style={{
            backgroundColor: '${comp.btnBgColor || "#2563eb"}',
            color: '${comp.btnTextColor || "#ffffff"}',
            padding: '${comp.btnPaddingY ?? 10}px ${comp.btnPaddingX ?? 20}px',
            borderRadius: '${comp.borderRadius ?? 6}px',
          }}
          className="font-semibold shadow-xs hover:opacity-90 transition ${hoverClass}"
        >
          ${comp.text || "Click Me"}
        </a>
      </div>`;

    case "divider":
      return `      {/* Divider */}
      <div className="${widthClass} ${zClass} py-4 px-6 flex items-center">
        <hr className="w-full" style={{ borderColor: '${comp.dividerColor || "#e2e8f0"}', borderWidth: '${comp.dividerThickness || 1}px' }} />
      </div>`;

    default:
      return `      <div className="${widthClass} p-6 bg-white border border-gray-100">${comp.type}</div>`;
  }
}

// ---------------------------------------------------------------------------
// VANILLA HTML + TAILWIND CDN GENERATOR (Fixed Styling & Inline Attributes)
// ---------------------------------------------------------------------------
function generateComponentHTML(comp, pages = []) {
  const widthClassMap = {
    "25%": "w-full md:w-1/4",
    "33.33%": "w-full md:w-1/3",
    "50%": "w-full md:w-1/2",
    "66.67%": "w-full md:w-2/3",
    "75%": "w-full md:w-3/4",
    "100%": "w-full",
    auto: "w-auto",
  };

  const widthClass = widthClassMap[comp.width] || "w-full";
  const hoverClass = HOVER_CLASS_MAP[comp.hoverEffect || "none"] || "";

  const buildHtmlStyles = (extraStyles = {}) => {
    const combined = {
      ...(comp.backgroundColor && { "background-color": comp.backgroundColor }),
      ...(comp.textColor && { color: comp.textColor }),
      ...(comp.fontSize && { "font-size": `${comp.fontSize}px` }),
      ...(comp.fontWeight && { "font-weight": comp.fontWeight }),
      ...(comp.textAlign && { "text-align": comp.textAlign }),
      ...(comp.padding !== undefined && comp.padding !== "" && { padding: `${comp.padding}px` }),
      ...(comp.margin !== undefined && comp.margin !== "" && { margin: `${comp.margin}px` }),
      ...(comp.borderRadius !== undefined && comp.borderRadius !== "" && { "border-radius": `${comp.borderRadius}px` }),
      ...(comp.borderWidth && { "border-width": `${comp.borderWidth}px` }),
      ...(comp.borderStyle && comp.borderWidth && { "border-style": comp.borderStyle }),
      ...(comp.borderColor && comp.borderWidth && { "border-color": comp.borderColor }),
      ...(comp.boxShadow && comp.boxShadow !== "none" && { "box-shadow": SHADOW_MAP[comp.boxShadow] }),
      ...(comp.minHeight && { "min-height": `${comp.minHeight}px` }),
      ...(comp.opacity !== undefined && comp.opacity !== "" && comp.opacity !== 100 && { opacity: comp.opacity / 100 }),
      ...extraStyles,
    };

    const entries = Object.entries(combined).map(([k, v]) => `${k}: ${v};`);
    return entries.length > 0 ? `style="${entries.join(" ")}"` : "";
  };

  switch (comp.type) {
    case "navbar": {
      const navLinks = comp.navLinks || [];
      return `    <!-- Navbar -->
    <nav class="${widthClass} relative flex items-center justify-between px-8 py-4 ${!comp.backgroundColor ? "bg-white border-b border-gray-100" : ""} ${hoverClass}" ${buildHtmlStyles()}>
      <span class="font-bold tracking-tight whitespace-pre-line" style="color: ${comp.brandColor || "#0f172a"}">${comp.brand || "Brand"}</span>
      <div class="flex flex-wrap gap-6 items-center opacity-90" style="color: ${comp.navLinkColor || "#475569"}">
${navLinks.map((l) => `        <a href="${resolveLink(l.targetPageId, l.link, pages, "html")}" class="hover:opacity-80">${l.label}</a>`).join("\n")}
      </div>
      ${comp.showNavCta ? `<a href="${resolveLink(comp.navCtaPageId, comp.navCtaLink, pages, "html")}" style="background-color: ${comp.navCtaBg || "#2563eb"}; color: ${comp.navCtaColor || "#ffffff"}" class="px-4 py-2 rounded-lg text-xs font-semibold shadow-xs hover:opacity-90 transition">${comp.navCtaText || "Get Started"}</a>` : ""}
    </nav>`;
    }

    case "hero": {
      const bgClass = comp.backgroundColor ? "" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white";
      return `    <!-- Hero Section -->
    <section class="${widthClass} relative p-12 ${bgClass} ${hoverClass}" ${buildHtmlStyles()}>
      <div class="flex flex-col w-full max-w-3xl mx-auto text-center items-center">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight whitespace-pre-line leading-tight">${comp.heading || "Hero Heading"}</h1>
        <p class="mt-4 max-w-2xl text-lg opacity-90 leading-relaxed whitespace-pre-line">${comp.description || "Hero description text."}</p>
        <div class="mt-8 flex flex-wrap gap-3 items-center justify-center">
          ${comp.showHeroButton !== false ? `<a href="${resolveLink(comp.heroButtonPageId, comp.heroButtonLink, pages, "html")}" style="background-color: ${comp.heroButtonBg || "#ffffff"}; color: ${comp.heroButtonTextColor || "#2563eb"}" class="px-6 py-3 rounded-md font-semibold shadow-xs hover:opacity-95 transition text-sm">${comp.buttonText || "Get Started"}</a>` : ""}
          ${comp.showSecondaryButton !== false ? `<a href="${resolveLink(comp.secondaryButtonPageId, comp.secondaryButtonLink, pages, "html")}" class="px-6 py-3 rounded-md font-semibold border border-white/40 bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 transition text-sm">${comp.secondaryButtonText || "Learn More"}</a>` : ""}
        </div>
      </div>
    </section>`;
    }

    case "paragraph":
      return `    <!-- Paragraph -->
    <div class="${widthClass} relative p-6 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}" ${buildHtmlStyles()}>
      <p class="whitespace-pre-line leading-relaxed">${comp.content || ""}</p>
    </div>`;

    case "heading":
      return `    <!-- Heading -->
    <div class="${widthClass} relative p-6 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}" ${buildHtmlStyles()}>
      <h2 class="text-2xl font-bold whitespace-pre-line">${comp.title || "Custom Heading"}</h2>
      ${comp.subtitle ? `<p class="mt-2 opacity-80 whitespace-pre-line">${comp.subtitle}</p>` : ""}
    </div>`;

    case "section":
      return `    <!-- Section -->
      <section class="${widthClass} relative p-10 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}" ${buildHtmlStyles()}>
      ${comp.heading ? `<h2 class="text-2xl font-bold mb-3 whitespace-pre-line">${comp.heading}</h2>` : ""}
      <p class="opacity-90 leading-relaxed whitespace-pre-line">${comp.content || ""}</p>
    </section>`;

    case "image":
      return `    <!-- Image Block -->
    <div class="${widthClass} relative overflow-hidden ${hoverClass}" ${buildHtmlStyles()}>
      <img src="${comp.src || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000"}" alt="${comp.alt || "Visual"}" style="width: ${comp.imageWidth || 100}%; height: ${comp.imageHeight ? `${comp.imageHeight}px` : "auto"}; object-fit: ${comp.objectFit || "cover"}" class="block mx-auto" />
    </div>`;

    case "features": {
      const features = comp.featuresList || [];
      const boxHover = HOVER_CLASS_MAP[comp.boxHoverEffect || "none"] || "";
      return `    <!-- Features Grid -->
    <section class="${widthClass} relative p-10 ${!comp.backgroundColor ? "bg-white" : ""}" ${buildHtmlStyles()}>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
${features.map((f) => `       <div class="p-6 bg-black/5 border border-black/10 rounded-xl ${boxHover}">
          <h4 class="font-bold whitespace-pre-line">${f.title}</h4>
          <p class="mt-2 text-xs opacity-80 leading-relaxed whitespace-pre-line">${f.desc}</p>
        </div>`).join("\n")}
      </div>
    </section>`;
    }

    case "pricing": {
      const features = comp.pricingFeaturesList || [];
      return `    <!-- Pricing Card -->
    <section class="${widthClass} relative p-8 ${!comp.backgroundColor ? "bg-slate-50" : ""}" ${buildHtmlStyles()}>
      <div class="border border-gray-200 p-8 text-center shadow-md rounded-2xl max-w-sm mx-auto bg-white ${hoverClass}">
        ${comp.pricingBadge ? `<span class="font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">${comp.pricingBadge}</span>` : ""}
        <h3 class="mt-4 text-xl font-bold text-gray-900">${comp.pricingPlan}</h3>
        <div class="mt-3 flex items-baseline justify-center gap-1">
          <span class="text-4xl font-extrabold text-gray-900">${comp.pricingPrice}</span>
          <span class="text-sm text-gray-500">${comp.pricingPeriod}</span>
        </div>
        <div class="mt-6 space-y-2.5 text-left border-t border-b border-gray-100 py-6 text-xs">
${features.map((f) => `          <div class="flex items-center gap-2.5 ${f.included ? "text-gray-700" : "text-gray-400 line-through"}">
            <span>${f.included ? "✓" : "✕"}</span>
            <span>${f.text}</span>
          </div>`).join("\n")}
        </div>
        <a href="${resolveLink(comp.pricingButtonPageId, comp.pricingButtonLink, pages, "html")}" style="background-color: ${comp.pricingButtonBg || "#2563eb"}; color: ${comp.pricingButtonTextColor || "#ffffff"}" class="mt-6 block w-full py-3 rounded-xl font-semibold shadow-xs hover:opacity-90 transition text-sm text-center">
          ${comp.pricingButtonText || "Choose Plan"}
        </a>
      </div>
    </section>`;
    }

    case "testimonials": {
      const list = comp.testimonialsList || [];
      return `    <!-- Testimonials -->
    <section class="${widthClass} relative p-8 ${!comp.backgroundColor ? "bg-slate-50" : ""}" ${buildHtmlStyles()}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
${list.map((t) => `        <div class="p-6 rounded-2xl border border-gray-200 bg-white shadow-xs ${hoverClass}">
          <div class="flex gap-1 text-amber-400 text-xs mb-3">
            ${"★".repeat(Math.max(1, Math.min(5, t.rating || 5)))}
          </div>
          <p class="text-xs text-gray-700 italic leading-relaxed whitespace-pre-line">
            "${t.quote || ""}"
          </p>
          <div class="mt-4 flex items-center gap-3">
            ${t.avatar ? `<img src="${t.avatar}" alt="${t.author || "Author"}" class="h-10 w-10 rounded-full object-cover border border-gray-200" />` : ""}
            <div>
              <h4 class="text-xs font-bold text-gray-900">${t.author || ""}</h4>
              <p class="text-[11px] text-gray-500">${t.role || ""}</p>
            </div>
          </div>
        </div>`).join("\n")}
      </div>
    </section>`;
    }

    case "faq": {
      const list = comp.faqList || [];
      return `    <!-- FAQ Accordion -->
    <section class="${widthClass} relative p-8 ${!comp.backgroundColor ? "bg-white" : ""}" ${buildHtmlStyles()}>
      <div class="max-w-3xl mx-auto space-y-4">
        ${comp.faqTitle ? `<div className="text-center mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">${comp.faqTitle}</h2>
          ${comp.faqSubtitle ? `<p className="mt-1 text-xs text-gray-500 whitespace-pre-line">${comp.faqSubtitle}</p>` : ""}
        </div>` : ""}
        <div class="space-y-3">
${list.map((item) => `          <details class="group border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <summary class="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-800 transition hover:bg-gray-50 list-none">
              <span class="whitespace-pre-line text-sm">${item.question || ""}</span>
              <span class="text-xs text-gray-400 transition-transform duration-200 group-open:rotate-180 ml-2">▼</span>
            </summary>
            <div class="px-4 pb-4 pt-1 text-xs leading-relaxed text-gray-600 border-t border-gray-100 whitespace-pre-line">
              ${item.answer || ""}
            </div>
          </details>`).join("\n")}
        </div>
      </div>
    </section>`;
    }

    case "authForm": {
      const fields = comp.authFields || [];
      return `    <!-- Authentication Form -->
    <div class="${widthClass} relative flex w-full justify-center items-center py-8" ${buildHtmlStyles()}>
      <div class="p-8 w-full max-w-md ${!comp.backgroundColor ? "bg-white border border-gray-100 shadow-xl rounded-2xl" : ""} ${hoverClass}">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold tracking-tight text-gray-900">${comp.authTitle || "Welcome Back"}</h3>
          ${comp.authSubtitle ? `<p className="mt-1 text-xs text-gray-500 whitespace-pre-line">${comp.authSubtitle}</p>` : ""}
        </div>
        ${
          comp.showSocialLogin
            ? `        <div class="grid grid-cols-2 gap-2.5 mb-5">
          <button type="button" class="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
            Google
          </button>
          <button type="button" class="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
            GitHub
          </button>
        </div>`
            : ""
        }
        <form onsubmit="event.preventDefault();" class="space-y-3.5">
${fields.map((f) => `          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">${f.label} ${f.required ? "*" : ""}</label>
            <input type="${f.type || "text"}" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
          </div>`).join("\n")}
          ${
            comp.showRememberMe || comp.showForgotPassword
              ? `          <div class="flex items-center justify-between text-xs pt-1">
            ${comp.showRememberMe ? `<label className="flex items-center gap-1.5 text-gray-600 cursor-pointer"><input type="checkbox" className="rounded accent-blue-600" /> Remember me</label>` : `<span />`}
            ${comp.showForgotPassword ? `<a href="#" className="text-blue-600 hover:underline">Forgot password?</a>` : ""}
          </div>`
              : ""
          }
          <button type="submit" class="w-full py-2.5 rounded-lg bg-blue-600 font-semibold text-xs text-white shadow-xs hover:bg-blue-700 transition mt-2">
            ${comp.submitButtonText || "Continue"}
          </button>
        </form>
      </div>
    </div>`;
    }

    case "form": {
      const fields = comp.formFields || [];
      return `    <!-- Dynamic Form -->
    <form onsubmit="event.preventDefault();" class="${widthClass} relative p-8 space-y-4 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}" ${buildHtmlStyles()}>
      ${comp.formTitle ? `<h3 class="text-xl font-bold whitespace-pre-line">${comp.formTitle}</h3>` : ""}
${fields.map((f) => f.type === "textarea"
    ? `      <div>
        <label class="block text-xs font-medium mb-1">${f.label} ${f.required ? "*" : ""}</label>
        <textarea rows={3} placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"></textarea>
      </div>`
    : `      <div>
        <label class="block text-xs font-medium mb-1">${f.label} ${f.required ? "*" : ""}</label>
        <input type="${f.type || "text"}" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
      </div>`).join("\n")}
      <button type="submit" class="px-5 py-2.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">
        ${comp.submitButtonText || "Send Message"}
      </button>
    </form>`;
    }

    case "footer": {
      const columns = comp.footerColumns || [];
      return `    <!-- Footer -->
    <footer class="${widthClass} relative px-8 py-10 ${!comp.backgroundColor ? "bg-slate-950 text-slate-400" : ""} ${hoverClass}" ${buildHtmlStyles()}>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
        <div class="md:col-span-1">
          <h3 class="text-base font-bold text-white tracking-tight">${comp.brand || "Brand"}</h3>
          <p class="mt-2 text-xs opacity-75 leading-relaxed whitespace-pre-line">${comp.footerAbout || ""}</p>
        </div>
${columns.map((col) => `        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200">${col.title}</h4>
          <ul class="mt-3 space-y-2 text-xs">
${(col.items || []).map((it) => `            <li><a href="${resolveLink(it.targetPageId, it.link, pages, "html")}" class="hover:text-blue-400 transition">${it.label}</a></li>`).join("\n")}
          </ul>
        </div>`).join("\n")}
      </div>
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <span class="whitespace-pre-line">${comp.copyright || ""}</span>
      </div>
    </footer>`;
    }

    case "button":
      return `    <!-- Button -->
    <div class="${widthClass} relative flex ${getJustifyClass(comp.btnAlign)} p-2" ${buildHtmlStyles()}>
      <a href="${resolveLink(comp.targetPageId, comp.link, pages, "html")}" style="background-color: ${comp.btnBgColor || "#2563eb"}; color: ${comp.btnTextColor || "#ffffff"}; padding: ${comp.btnPaddingY ?? 10}px ${comp.btnPaddingX ?? 20}px; border-radius: ${comp.borderRadius ?? 6}px;" class="font-semibold shadow-xs hover:opacity-90 transition ${hoverClass}">
        ${comp.text || "Click Me"}
      </a>
    </div>`;

    case "divider":
      return `    <!-- Divider -->
    <div class="${widthClass} relative py-4 px-6 flex items-center" ${buildHtmlStyles()}>
      <hr class="w-full" style="border-color: ${comp.dividerColor || "#e2e8f0"}; border-width: ${comp.dividerThickness || 1}px;" />
    </div>`;

    default:
      return `    <div class="${widthClass} p-6 bg-white border border-gray-100" ${buildHtmlStyles()}>${comp.type}</div>`;
  }
}

function generatePageCSSModule(pageName, components = []) {
  const componentName = formatComponentName(pageName);
  let css = `/* Styles for ${componentName}.module.css */\n`;
  css += `.pageWrapper {\n  min-height: 100vh;\n  background-color: #f8fafc;\n  display: flex;\n  flex-wrap: wrap;\n  align-content: flex-start;\n}\n\n`;

  components.forEach((comp, idx) => {
    const compClass = `comp_${comp.type}_${idx + 1}`;
    css += `.${compClass} {\n`;
    css += `  width: ${comp.width === "100%" || !comp.width ? "100%" : comp.width};\n`;
    if (comp.backgroundColor) css += `  background-color: ${comp.backgroundColor};\n`;
    if (comp.textColor) css += `  color: ${comp.textColor};\n`;
    if (comp.fontSize) css += `  font-size: ${comp.fontSize}px;\n`;
    if (comp.fontWeight) css += `  font-weight: ${comp.fontWeight};\n`;
    if (comp.textAlign) css += `  text-align: ${comp.textAlign};\n`;
    if (comp.padding !== undefined && comp.padding !== "") css += `  padding: ${comp.padding}px;\n`;
    if (comp.margin !== undefined && comp.margin !== "") css += `  margin: ${comp.margin}px;\n`;
    if (comp.borderRadius !== undefined && comp.borderRadius !== "") css += `  border-radius: ${comp.borderRadius}px;\n`;
    if (comp.borderWidth) css += `  border-width: ${comp.borderWidth}px;\n`;
    if (comp.borderStyle && comp.borderWidth) css += `  border-style: ${comp.borderStyle};\n`;
    if (comp.borderColor && comp.borderWidth) css += `  border-color: ${comp.borderColor};\n`;
    if (comp.boxShadow && comp.boxShadow !== "none" && SHADOW_MAP[comp.boxShadow]) {
      css += `  box-shadow: ${SHADOW_MAP[comp.boxShadow]};\n`;
    }
    if (comp.minHeight) css += `  min-height: ${comp.minHeight}px;\n`;
    if (comp.opacity !== undefined && comp.opacity !== "" && comp.opacity !== 100) {
      css += `  opacity: ${comp.opacity / 100};\n`;
    }
    css += `}\n\n`;
  });

  return css;
}

// ---------------------------------------------------------------------------
// STANDALONE SHARED COMPONENT GENERATORS (Navbar, Footer)
// ---------------------------------------------------------------------------
function generateStandaloneNavbar(comp, pages = [], stack = "react") {
  if (!comp) return "";

  if (stack === "html") {
    return `<!-- Reusable Navbar Component -->\n${generateComponentHTML(comp, pages)}`;
  }

  const navJSX = generateComponentJSX(comp, pages, stack).trim();

  if (stack === "tsx") {
    return `import React from 'react';

export default function Navbar(): React.ReactElement {
  return (
${navJSX}
  );
}
`;
  }

  if (stack === "css-modules") {
    const companionCss = generatePageCSSModule("Navbar", [comp]);
    return `import React from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
${navJSX}
  );
}

/* ==========================================================================
   Companion CSS Module File: Navbar.module.css
   ==========================================================================
${companionCss}
*/
`;
  }

  // Default: React JSX
  return `import React from 'react';

export default function Navbar() {
  return (
${navJSX}
  );
}
`;
}

function generateStandaloneFooter(comp, pages = [], stack = "react") {
  if (!comp) return "";

  if (stack === "html") {
    return `<!-- Reusable Footer Component -->\n${generateComponentHTML(comp, pages)}`;
  }

  const footerJSX = generateComponentJSX(comp, pages, stack).trim();

  if (stack === "tsx") {
    return `import React from 'react';

export default function Footer(): React.ReactElement {
  return (
${footerJSX}
  );
}
`;
  }

  if (stack === "css-modules") {
    const companionCss = generatePageCSSModule("Footer", [comp]);
    return `import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
${footerJSX}
  );
}

/* ==========================================================================
   Companion CSS Module File: Footer.module.css
   ==========================================================================
${companionCss}
*/
`;
  }

  // Default: React JSX
  return `import React from 'react';

export default function Footer() {
  return (
${footerJSX}
  );
}
`;
}

// ---------------------------------------------------------------------------
// PAGE COMPONENT GENERATOR (Clean Page Files with Shared Component Imports)
// ---------------------------------------------------------------------------
function generatePageCode(pageName, components = [], pages = [], stack = "react") {
  if (stack === "html") {
    const bodyContent = components.map((c) => generateComponentHTML(c, pages)).join("\n\n");
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageName || "Page"}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="min-h-screen bg-slate-50 flex flex-wrap content-start">
${bodyContent}
</body>
</html>`;
  }

  const componentName = formatComponentName(pageName);
  const { navbar, footer } = getGlobalLayoutComponents(pages);
  const hasNavbar = Boolean(navbar || components.some((c) => c?.type === "navbar"));
  const hasFooter = Boolean(footer || components.some((c) => c?.type === "footer"));

  // Build clean imports without inlining Navbar or Footer
  const importLines = ["import React from 'react';"];
  if (stack === "css-modules") {
    importLines.push(`import styles from './${componentName}.module.css';`);
  }
  if (hasNavbar) {
    importLines.push("import Navbar from '../components/Navbar';");
  }
  if (hasFooter) {
    importLines.push("import Footer from '../components/Footer';");
  }

  // Only render unique body content sections (Navbar and Footer are excluded from inline generation)
  const bodyComponents = components.filter((c) => c && c.type !== "navbar" && c.type !== "footer");
  const bodyElementsCode = bodyComponents.map((c) => generateComponentJSX(c, pages, stack)).join("\n\n");

  const layoutElements = [];
  if (hasNavbar) {
    layoutElements.push("      <Navbar />");
  }
  if (bodyElementsCode.trim()) {
    layoutElements.push(bodyElementsCode);
  }
  if (hasFooter) {
    layoutElements.push("      <Footer />");
  }

  const elementsCode = layoutElements.join("\n\n");

  if (stack === "tsx") {
    return `${importLines.join("\n")}

export default function ${componentName}(): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-wrap content-start">
${elementsCode}
    </div>
  );
}`;
  }

  if (stack === "css-modules") {
    const companionCss = generatePageCSSModule(pageName, bodyComponents);
    return `${importLines.join("\n")}

export default function ${componentName}() {
  return (
    <div className={styles.pageWrapper || "min-h-screen bg-slate-50 flex flex-wrap content-start"}>
${elementsCode}
    </div>
  );
}

/* ==========================================================================
   Companion CSS Module File: ${componentName}.module.css
   ==========================================================================
${companionCss}
*/`;
  }

  // Default: React JSX
  return `${importLines.join("\n")}

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-wrap content-start">
${elementsCode}
    </div>
  );
}`;
}

function generateReactRouterApp(validPages, isTsx = false) {
  const imports = validPages
    .map((p) => `import ${formatComponentName(p.name)} from './pages/${formatComponentName(p.name)}';`)
    .join("\n");

  const routes = validPages
    .map((p) => {
      const routePath = isHomePage(p, validPages) ? "/" : `/${formatRoutePath(p.name)}`;
      return `        <Route path="${routePath}" element={<${formatComponentName(p.name)} />} />`;
    })
    .join("\n");

  const returnType = isTsx ? ": React.ReactElement" : "";

  return `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
${imports}

export default function App()${returnType} {
  return (
    <BrowserRouter>
      <Routes>
${routes}
      </Routes>
    </BrowserRouter>
  );
}
`;
}

function generateMainFile(isTsx = false) {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')${isTsx ? "!" : ""}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
}

function generateIndexHtml(title = "CodeXel Project", entryFile = "src/main.jsx") {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/${entryFile}"></script>
  </body>
</html>`;
}

function generatePackageJson(stack = "react") {
  const isTsx = stack === "tsx";
  return JSON.stringify(
    {
      name: "codexel-project",
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: isTsx ? "tsc && vite build" : "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "react-router-dom": "^7.0.0",
      },
      devDependencies: {
        "@tailwindcss/vite": "^4.0.0",
        "@vitejs/plugin-react": "^4.3.0",
        tailwindcss: "^4.0.0",
        vite: "^6.0.0",
        ...(isTsx && {
          typescript: "^5.6.0",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
        }),
      },
    },
    null,
    2
  );
}

function generateViteConfig() {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;
}

function generateTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        useDefineForClassFields: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ["src"],
    },
    null,
    2
  );
}

function generateReadme(stack = "react", validPages = [], hasSharedComponents = false) {
  const stackName = STACK_LABELS[stack] || stack;
  if (stack === "html") {
    return `# CodeXel Website Export (Vanilla HTML)

This package contains a responsive, multi-page static website generated by CodeXel.

## Pages
${validPages.map((p) => `- \`${isHomePage(p, validPages) ? "index.html" : `${formatRoutePath(p.name)}.html`}\` (${p.name || "Page"})`).join("\n")}

${hasSharedComponents ? `## Shared Component Partials
- \`components/navbar.html\`
- \`components/footer.html\`
` : ""}
## Quick Start
1. Double-click \`index.html\` to open the homepage directly in any browser.
2. Or deploy the folder to GitHub Pages, Netlify, Vercel, or any static host.
`;
  }

  return `# CodeXel Project (${stackName})

This project was visually generated with CodeXel and bundled into a complete Vite + React application.

## Project Structure
- \`src/pages/\`: Individual routed page components (clean body sections)
${hasSharedComponents ? `- \`src/components/\`: Reusable global layout components (Navbar, Footer)\n` : ""}- \`src/App.${stack === "tsx" ? "tsx" : "jsx"}\`: React Router routing configuration
- \`src/main.${stack === "tsx" ? "tsx" : "jsx"}\`: Application entry point

## Pages & Routes
${validPages.map((p) => {
  const route = isHomePage(p, validPages) ? "/" : `/${formatRoutePath(p.name)}`;
  return `- \`${route}\` -> \`${formatComponentName(p.name)}\``;
}).join("\n")}

## Quick Start
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`
`;
}

function CodePreview({ isOpen, onClose, activePage, pages = [] }) {
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedStack, setSelectedStack] = useState("react");
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const validPages =
    Array.isArray(pages) && pages.length > 0
      ? pages.filter(Boolean)
      : activePage
      ? [activePage]
      : [{ id: "page-home", name: "Home", canvasData: [] }];

  // Global layout components extracted across the project
  const { navbar: globalNavbar, footer: globalFooter } = getGlobalLayoutComponents(validPages);
  const hasGlobalComps = Boolean(globalNavbar || globalFooter);

  const resolvedPageId =
    selectedFileId && validPages.some((p) => p.id === selectedFileId || p._id === selectedFileId)
      ? selectedFileId
      : activePage?.id || activePage?._id || validPages[0]?.id || validPages[0]?._id;

  const currentPageToView =
    validPages.find((p) => p.id === resolvedPageId || p._id === resolvedPageId) ||
    validPages[0] ||
    { id: "page-home", name: "Home", canvasData: [] };

  // Determine current code to display based on selected tab (page vs shared component)
  let currentCode = "";
  if (selectedFileId === "component-navbar" && globalNavbar) {
    currentCode = generateStandaloneNavbar(globalNavbar, validPages, selectedStack);
  } else if (selectedFileId === "component-footer" && globalFooter) {
    currentCode = generateStandaloneFooter(globalFooter, validPages, selectedStack);
  } else {
    currentCode = generatePageCode(
      currentPageToView.name,
      currentPageToView.canvasData || [],
      validPages,
      selectedStack
    );
  }

  const handleDownload = async () => {
    const isComponentSelected = selectedFileId === "component-navbar" || selectedFileId === "component-footer";

    // Individual file download
    if (validPages.length <= 1 && !hasGlobalComps && !isComponentSelected) {
      const fileName =
        selectedStack === "html"
          ? (isHomePage(currentPageToView, validPages) ? "index.html" : `${formatRoutePath(currentPageToView.name)}.html`)
          : selectedStack === "tsx"
          ? `${formatComponentName(currentPageToView.name)}.tsx`
          : `${formatComponentName(currentPageToView.name)}.jsx`;

      const mimeType = selectedStack === "html" ? "text/html;charset=utf-8" : "text/plain;charset=utf-8";
      const blob = new Blob([currentCode], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    // Complete ZIP bundle (multi-page and/or projects with shared layout components)
    try {
      setIsZipping(true);
      const zip = new JSZip();

      if (selectedStack === "html") {
        // Vanilla HTML bundle
        validPages.forEach((p) => {
          const fileName = isHomePage(p, validPages) ? "index.html" : `${formatRoutePath(p.name)}.html`;
          const code = generatePageCode(p.name, p.canvasData || [], validPages, "html");
          zip.file(fileName, code);
        });

        if (globalNavbar) {
          zip.file("components/navbar.html", generateStandaloneNavbar(globalNavbar, validPages, "html"));
        }
        if (globalFooter) {
          zip.file("components/footer.html", generateStandaloneFooter(globalFooter, validPages, "html"));
        }

        zip.file("README.md", generateReadme("html", validPages, hasGlobalComps));
      } else if (selectedStack === "tsx") {
        // TypeScript TSX bundle: Navbar and Footer placed into dedicated src/components/ folder
        if (globalNavbar) {
          zip.file("src/components/Navbar.tsx", generateStandaloneNavbar(globalNavbar, validPages, "tsx"));
        }
        if (globalFooter) {
          zip.file("src/components/Footer.tsx", generateStandaloneFooter(globalFooter, validPages, "tsx"));
        }

        const srcPages = zip.folder("src/pages");
        validPages.forEach((p) => {
          const fileName = `${formatComponentName(p.name)}.tsx`;
          const code = generatePageCode(p.name, p.canvasData || [], validPages, "tsx");
          srcPages.file(fileName, code);
        });

        zip.file("src/App.tsx", generateReactRouterApp(validPages, true));
        zip.file("src/main.tsx", generateMainFile(true));
        zip.file("src/index.css", '@import "tailwindcss";\n');
        zip.file("index.html", generateIndexHtml("CodeXel TSX Project", "src/main.tsx"));
        zip.file("package.json", generatePackageJson("tsx"));
        zip.file("tsconfig.json", generateTsConfig());
        zip.file("vite.config.ts", generateViteConfig());
        zip.file("README.md", generateReadme("tsx", validPages, hasGlobalComps));
      } else if (selectedStack === "css-modules") {
        // CSS Modules bundle: Navbar and Footer placed into dedicated src/components/ folder
        if (globalNavbar) {
          const navJsx = generateStandaloneNavbar(globalNavbar, validPages, "css-modules");
          const cleanNavJsx = navJsx.split("/* ==========================================================================")[0].trim() + "\n";
          zip.file("src/components/Navbar.jsx", cleanNavJsx);
          zip.file("src/components/Navbar.module.css", generatePageCSSModule("Navbar", [globalNavbar]));
        }
        if (globalFooter) {
          const footJsx = generateStandaloneFooter(globalFooter, validPages, "css-modules");
          const cleanFootJsx = footJsx.split("/* ==========================================================================")[0].trim() + "\n";
          zip.file("src/components/Footer.jsx", cleanFootJsx);
          zip.file("src/components/Footer.module.css", generatePageCSSModule("Footer", [globalFooter]));
        }

        const srcPages = zip.folder("src/pages");
        validPages.forEach((p) => {
          const compName = formatComponentName(p.name);
          const jsxCode = generatePageCode(p.name, p.canvasData || [], validPages, "css-modules");
          const cleanJsx = jsxCode.split("/* ==========================================================================")[0].trim() + "\n";
          const bodyComps = (p.canvasData || []).filter((c) => c && c.type !== "navbar" && c.type !== "footer");
          const cssCode = generatePageCSSModule(p.name, bodyComps);
          srcPages.file(`${compName}.jsx`, cleanJsx);
          srcPages.file(`${compName}.module.css`, cssCode);
        });

        zip.file("src/App.jsx", generateReactRouterApp(validPages, false));
        zip.file("src/main.jsx", generateMainFile(false));
        zip.file("src/index.css", '@import "tailwindcss";\n');
        zip.file("index.html", generateIndexHtml("CodeXel CSS Modules Project", "src/main.jsx"));
        zip.file("package.json", generatePackageJson("react"));
        zip.file("vite.config.js", generateViteConfig());
        zip.file("README.md", generateReadme("css-modules", validPages, hasGlobalComps));
      } else {
        // React JSX bundle: Navbar and Footer placed into dedicated src/components/ folder
        if (globalNavbar) {
          zip.file("src/components/Navbar.jsx", generateStandaloneNavbar(globalNavbar, validPages, "react"));
        }
        if (globalFooter) {
          zip.file("src/components/Footer.jsx", generateStandaloneFooter(globalFooter, validPages, "react"));
        }

        const srcPages = zip.folder("src/pages");
        validPages.forEach((p) => {
          const fileName = `${formatComponentName(p.name)}.jsx`;
          const code = generatePageCode(p.name, p.canvasData || [], validPages, "react");
          srcPages.file(fileName, code);
        });

        zip.file("src/App.jsx", generateReactRouterApp(validPages, false));
        zip.file("src/main.jsx", generateMainFile(false));
        zip.file("src/index.css", '@import "tailwindcss";\n');
        zip.file("index.html", generateIndexHtml("CodeXel React Project", "src/main.jsx"));
        zip.file("package.json", generatePackageJson("react"));
        zip.file("vite.config.js", generateViteConfig());
        zip.file("README.md", generateReadme("react", validPages, hasGlobalComps));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CodeXel-Project-${selectedStack.toUpperCase()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to bundle files into a zip:", err);
      alert("Failed to bundle files into a zip. Please try again.");
    } finally {
      setIsZipping(false);
    }
  };

  const isMultiFile = validPages.length > 1 || hasGlobalComps;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex h-[88vh] w-full max-w-4xl flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-6 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <FaCode className="text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export Code</h3>
              <p className="text-[11px] text-slate-400">
                {STACK_LABELS[selectedStack] || "React + Tailwind JSX"} ({validPages.length} {validPages.length === 1 ? "page" : "pages"}{hasGlobalComps ? " • Modular Components" : ""})
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedStack("react")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                selectedStack === "react" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              React (.jsx)
            </button>
            <button
              type="button"
              onClick={() => setSelectedStack("tsx")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                selectedStack === "tsx" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              TSX (.tsx)
            </button>
            <button
              type="button"
              onClick={() => setSelectedStack("html")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                selectedStack === "html" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              HTML (.html)
            </button>
            <button
              type="button"
              onClick={() => setSelectedStack("css-modules")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                selectedStack === "css-modules" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              CSS Modules
            </button>
          </div>

          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition p-1">
            <FaTimes />
          </button>
        </div>

        {isMultiFile && (
          <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-950/70 px-6 py-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">Pages:</span>
            {validPages.map((page, index) => {
              const pageKey = page.id || page._id || `page-${index}`;
              const isSelected =
                selectedFileId === pageKey ||
                (!selectedFileId && (currentPageToView.id === page.id || (!page.id && index === 0)));
              return (
                <button
                  key={pageKey}
                  type="button"
                  onClick={() => setSelectedFileId(pageKey)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <FaFileCode className="text-[10px]" />
                  <span>{getPageTabName(page, validPages, selectedStack)}</span>
                </button>
              );
            })}

            {hasGlobalComps && (
              <>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-3 mr-2">
                  Components:
                </span>
                {globalNavbar && (
                  <button
                    type="button"
                    onClick={() => setSelectedFileId("component-navbar")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      selectedFileId === "component-navbar"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <FaFileCode className="text-[10px]" />
                    <span>
                      {selectedStack === "html" ? "navbar.html" : selectedStack === "tsx" ? "Navbar.tsx" : "Navbar.jsx"}
                    </span>
                  </button>
                )}
                {globalFooter && (
                  <button
                    type="button"
                    onClick={() => setSelectedFileId("component-footer")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      selectedFileId === "component-footer"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <FaFileCode className="text-[10px]" />
                    <span>
                      {selectedStack === "html" ? "footer.html" : selectedStack === "tsx" ? "Footer.tsx" : "Footer.jsx"}
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex-1 overflow-auto bg-slate-900 p-6 font-mono text-xs text-slate-200 selection:bg-blue-600">
          <pre className="leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>

        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-800 px-6 bg-slate-950">
          <span className="text-xs text-slate-500">
            {isMultiFile
              ? `Bundles all ${validPages.length} pages and modular components into a .zip archive.`
              : "Downloads as an individual file."}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isZipping}
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition disabled:opacity-50"
            >
              {isMultiFile ? <FaFolder className="text-amber-400" /> : <FaDownload />}
              {isZipping ? "Zipping..." : isMultiFile ? "Download All as .ZIP" : "Download File"}
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(currentCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
            >
              {copied ? <FaCheck className="text-emerald-300" /> : <FaCopy />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodePreview;