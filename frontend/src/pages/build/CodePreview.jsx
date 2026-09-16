import { useState, useEffect } from "react";
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

function formatComponentName(name) {
  const cleaned = (name || "Page").replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "Page";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function formatFileName(name) {
  return (name || "page").toLowerCase().replace(/[^a-z0-9]/g, "-");
}

function generateComponentJSX(comp, pages = []) {
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

  const resolveReactHref = (pageId) => {
    if (!pageId) return "#";
    const found = pages.find((p) => p.id === pageId);
    return found ? `/${formatFileName(found.name)}` : "#";
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
${navLinks.map((l) => `          <a href="${resolveReactHref(l.targetPageId)}" className="hover:opacity-80">${l.label}</a>`).join("\n")}
        </div>
        ${
          comp.showNavCta
            ? `<a href="${resolveReactHref(comp.navCtaPageId)}" style={{ backgroundColor: '${comp.navCtaBg || "#2563eb"}', color: '${comp.navCtaColor || "#ffffff"}' }} className="px-4 py-2 rounded-lg text-xs font-semibold shadow-xs hover:opacity-90 transition">${comp.navCtaText || "Get Started"}</a>`
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
                ? `<a href="${resolveReactHref(comp.heroButtonPageId)}" style={{ backgroundColor: '${comp.heroButtonBg || "#ffffff"}', color: '${comp.heroButtonTextColor || "#2563eb"}' }} className="px-6 py-3 rounded-md font-semibold shadow-xs hover:opacity-95 transition text-sm">${comp.buttonText || "Get Started"}</a>`
                : ""
            }
            ${
              comp.showSecondaryButton !== false
                ? `<a href="${resolveReactHref(comp.secondaryButtonPageId)}" className="px-6 py-3 rounded-md font-semibold border border-white/40 bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 transition text-sm">${comp.secondaryButtonText || "Learn More"}</a>`
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
          <a href="${resolveReactHref(comp.pricingButtonPageId)}" style={{ backgroundColor: '${comp.pricingButtonBg || "#2563eb"}', color: '${comp.pricingButtonTextColor || "#ffffff"}' }} className="mt-6 block w-full py-3 rounded-xl font-semibold shadow-xs hover:opacity-90 transition text-sm">
            ${comp.pricingButtonText || "Choose Plan"}
          </a>
        </div>
      </section>`;
    }

    case "authForm": {
      const fields = comp.authFields || [];
      return `      {/* Authentication Form */}
      <div className="${widthClass} ${zClass} flex w-full justify-center items-center py-8">
        <div className="p-8 w-full max-w-md ${!comp.backgroundColor ? "bg-white border border-gray-100 shadow-xl rounded-2xl" : ""} ${hoverClass}" ${buildStyles()}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">${comp.authTitle}</h3>
            ${comp.authSubtitle ? `<p className="mt-1 text-xs text-gray-500 whitespace-pre-line">${comp.authSubtitle}</p>` : ""}
          </div>
          <form className="space-y-3.5">
${fields.map((f) => `            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">${f.label} ${f.required ? "*" : ""}</label>
              <input type="${f.type}" placeholder="${f.placeholder}" ${f.required ? "required" : ""} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
            </div>`).join("\n")}
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
          <label className="block text-xs font-medium mb-1">${f.label}</label>
          <textarea rows={3} placeholder="${f.placeholder}" className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
        </div>`
    : `        <div>
          <label className="block text-xs font-medium mb-1">${f.label}</label>
          <input type="${f.type}" placeholder="${f.placeholder}" className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
        </div>`).join("\n")}
        <button type="submit" className="px-5 py-2.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">
          ${comp.submitButtonText || "Send"}
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
${(col.items || []).map((it) => `              <li><a href="${resolveReactHref(it.targetPageId)}" className="hover:text-blue-400 transition">${it.label}</a></li>`).join("\n")}
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
      <div className="${widthClass} ${zClass} flex justify-${comp.btnAlign || "left"} p-2">
        <a
          href="${resolveReactHref(comp.targetPageId) || comp.link || "#"}"
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
// VANILLA HTML + TAILWIND CDN GENERATOR
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

  const resolveHtmlHref = (pageId) => {
    if (!pageId) return "#";
    const found = pages.find((p) => p.id === pageId);
    return found ? `${formatFileName(found.name)}.html` : "#";
  };

  switch (comp.type) {
    case "navbar": {
      const navLinks = comp.navLinks || [];
      return `    <!-- Navbar -->
    <nav class="${widthClass} relative flex items-center justify-between px-8 py-4 ${!comp.backgroundColor ? "bg-white border-b border-gray-100" : ""} ${hoverClass}">
      <span class="font-bold tracking-tight whitespace-pre-line" style="color: ${comp.brandColor || "#0f172a"}">${comp.brand || "Brand"}</span>
      <div class="flex flex-wrap gap-6 items-center opacity-90" style="color: ${comp.navLinkColor || "#475569"}">
${navLinks.map((l) => `        <a href="${resolveHtmlHref(l.targetPageId)}" class="hover:opacity-80">${l.label}</a>`).join("\n")}
      </div>
      ${comp.showNavCta ? `<a href="${resolveHtmlHref(comp.navCtaPageId)}" style="background-color: ${comp.navCtaBg || "#2563eb"}; color: ${comp.navCtaColor || "#ffffff"}" class="px-4 py-2 rounded-lg text-xs font-semibold shadow-xs hover:opacity-90 transition">${comp.navCtaText || "Get Started"}</a>` : ""}
    </nav>`;
    }

    case "hero": {
      const bgClass = comp.backgroundColor ? "" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white";
      return `    <!-- Hero Section -->
    <section class="${widthClass} relative p-12 ${bgClass} ${hoverClass}">
      <div class="flex flex-col w-full max-w-3xl mx-auto text-center items-center">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight whitespace-pre-line leading-tight">${comp.heading || "Hero Heading"}</h1>
        <p class="mt-4 max-w-2xl text-lg opacity-90 leading-relaxed whitespace-pre-line">${comp.description || "Hero description text."}</p>
        <div class="mt-8 flex flex-wrap gap-3 items-center justify-center">
          ${comp.showHeroButton !== false ? `<a href="${resolveHtmlHref(comp.heroButtonPageId)}" style="background-color: ${comp.heroButtonBg || "#ffffff"}; color: ${comp.heroButtonTextColor || "#2563eb"}" class="px-6 py-3 rounded-md font-semibold shadow-xs hover:opacity-95 transition text-sm">${comp.buttonText || "Get Started"}</a>` : ""}
          ${comp.showSecondaryButton !== false ? `<a href="${resolveHtmlHref(comp.secondaryButtonPageId)}" class="px-6 py-3 rounded-md font-semibold border border-white/40 bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 transition text-sm">${comp.secondaryButtonText || "Learn More"}</a>` : ""}
        </div>
      </div>
    </section>`;
    }

    case "paragraph":
      return `    <!-- Paragraph -->
    <div class="${widthClass} relative p-6 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}">
      <p class="whitespace-pre-line leading-relaxed">${comp.content || ""}</p>
    </div>`;

    case "heading":
      return `    <!-- Heading -->
    <div class="${widthClass} relative p-6 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}">
      <h2 class="text-2xl font-bold whitespace-pre-line">${comp.title || "Custom Heading"}</h2>
      ${comp.subtitle ? `<p class="mt-2 opacity-80 whitespace-pre-line">${comp.subtitle}</p>` : ""}
    </div>`;

    case "section":
      return `    <!-- Section -->
    <section class="${widthClass} relative p-10 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}">
      ${comp.heading ? `<h2 class="text-2xl font-bold mb-3 whitespace-pre-line">${comp.heading}</h2>` : ""}
      <p class="opacity-90 leading-relaxed whitespace-pre-line">${comp.content || ""}</p>
    </section>`;

    case "image":
      return `    <!-- Image Block -->
    <div class="${widthClass} relative overflow-hidden ${hoverClass}">
      <img src="${comp.src || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000"}" alt="${comp.alt || "Visual"}" style="width: ${comp.imageWidth || 100}%; height: ${comp.imageHeight ? `${comp.imageHeight}px` : "auto"}; object-fit: ${comp.objectFit || "cover"}" class="block mx-auto" />
    </div>`;

    case "features": {
      const features = comp.featuresList || [];
      const boxHover = HOVER_CLASS_MAP[comp.boxHoverEffect || "none"] || "";
      return `    <!-- Features Grid -->
    <section class="${widthClass} relative p-10 ${!comp.backgroundColor ? "bg-white" : ""}">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
${features.map((f) => `        <div class="p-6 bg-black/5 border border-black/10 rounded-xl ${boxHover}">
          <h4 class="font-bold whitespace-pre-line">${f.title}</h4>
          <p class="mt-2 text-xs opacity-80 leading-relaxed whitespace-pre-line">${f.desc}</p>
        </div>`).join("\n")}
      </div>
    </section>`;
    }

    case "pricing": {
      const features = comp.pricingFeaturesList || [];
      return `    <!-- Pricing Card -->
    <section class="${widthClass} relative p-8 ${!comp.backgroundColor ? "bg-slate-50" : ""}">
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
        <a href="${resolveHtmlHref(comp.pricingButtonPageId)}" style="background-color: ${comp.pricingButtonBg || "#2563eb"}; color: ${comp.pricingButtonTextColor || "#ffffff"}" class="mt-6 block w-full py-3 rounded-xl font-semibold shadow-xs hover:opacity-90 transition text-sm text-center">
          ${comp.pricingButtonText || "Choose Plan"}
        </a>
      </div>
    </section>`;
    }

    case "authForm": {
      const fields = comp.authFields || [];
      return `    <!-- Authentication Form -->
    <div class="${widthClass} relative flex w-full justify-center items-center py-8">
      <div class="p-8 w-full max-w-md ${!comp.backgroundColor ? "bg-white border border-gray-100 shadow-xl rounded-2xl" : ""} ${hoverClass}">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-bold tracking-tight text-gray-900">${comp.authTitle}</h3>
          ${comp.authSubtitle ? `<p class="mt-1 text-xs text-gray-500 whitespace-pre-line">${comp.authSubtitle}</p>` : ""}
        </div>
        <form onsubmit="event.preventDefault();" class="space-y-3.5">
${fields.map((f) => `          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">${f.label} ${f.required ? "*" : ""}</label>
            <input type="${f.type}" placeholder="${f.placeholder}" ${f.required ? "required" : ""} class="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
          </div>`).join("\n")}
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
    <form onsubmit="event.preventDefault();" class="${widthClass} relative p-8 space-y-4 ${!comp.backgroundColor ? "bg-white" : ""} ${hoverClass}">
      ${comp.formTitle ? `<h3 class="text-xl font-bold whitespace-pre-line">${comp.formTitle}</h3>` : ""}
${fields.map((f) => f.type === "textarea"
    ? `      <div>
        <label class="block text-xs font-medium mb-1">${f.label}</label>
        <textarea rows="3" placeholder="${f.placeholder}" class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"></textarea>
      </div>`
    : `      <div>
        <label class="block text-xs font-medium mb-1">${f.label}</label>
        <input type="${f.type}" placeholder="${f.placeholder}" class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" />
      </div>`).join("\n")}
      <button type="submit" class="px-5 py-2.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">
        ${comp.submitButtonText || "Send"}
      </button>
    </form>`;
    }

    case "footer": {
      const columns = comp.footerColumns || [];
      return `    <!-- Footer -->
    <footer class="${widthClass} relative px-8 py-10 ${!comp.backgroundColor ? "bg-slate-950 text-slate-400" : ""} ${hoverClass}">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
        <div class="md:col-span-1">
          <h3 class="text-base font-bold text-white tracking-tight">${comp.brand || "Brand"}</h3>
          <p class="mt-2 text-xs opacity-75 leading-relaxed whitespace-pre-line">${comp.footerAbout || ""}</p>
        </div>
${columns.map((col) => `        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200">${col.title}</h4>
          <ul class="mt-3 space-y-2 text-xs">
${(col.items || []).map((it) => `            <li><a href="${resolveHtmlHref(it.targetPageId)}" class="hover:text-blue-400 transition">${it.label}</a></li>`).join("\n")}
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
    <div class="${widthClass} relative flex justify-${comp.btnAlign || "left"} p-2">
      <a href="${resolveHtmlHref(comp.targetPageId) || comp.link || "#"}" style="background-color: ${comp.btnBgColor || "#2563eb"}; color: ${comp.btnTextColor || "#ffffff"}; padding: ${comp.btnPaddingY ?? 10}px ${comp.btnPaddingX ?? 20}px; border-radius: ${comp.borderRadius ?? 6}px;" class="font-semibold shadow-xs hover:opacity-90 transition ${hoverClass}">
        ${comp.text || "Click Me"}
      </a>
    </div>`;

    case "divider":
      return `    <!-- Divider -->
    <div class="${widthClass} relative py-4 px-6 flex items-center">
      <hr class="w-full" style="border-color: ${comp.dividerColor || "#e2e8f0"}; border-width: ${comp.dividerThickness || 1}px;" />
    </div>`;

    default:
      return `    <div class="${widthClass} p-6 bg-white border border-gray-100">${comp.type}</div>`;
  }
}

function generatePageCode(pageName, components, pages = [], stack = "react") {
  if (stack === "html") {
    const bodyContent = components.map((c) => generateComponentHTML(c, pages)).join("\n\n");
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageName}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="min-h-screen bg-slate-50 flex flex-wrap content-start">
${bodyContent}
</body>
</html>`;
  }

  const componentName = formatComponentName(pageName);
  const elementsCode = components.map((c) => generateComponentJSX(c, pages)).join("\n\n");
  return `import React from 'react';

export default function ${componentName}() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-wrap content-start">
${elementsCode}
    </div>
  );
}`;
}

function CodePreview({ isOpen, onClose, activePage, pages = [] }) {
  const [selectedPageId, setSelectedPageId] = useState(activePage?.id || pages[0]?.id || null);
  const [selectedStack, setSelectedStack] = useState("react");
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    if (activePage?.id) setSelectedPageId(activePage.id);
    else if (pages.length > 0) setSelectedPageId(pages[0].id);
  }, [activePage, pages, isOpen]);

  if (!isOpen) return null;

  const validPages = pages.length > 0 ? pages : [activePage];
  const currentPageToView = validPages.find((p) => p.id === selectedPageId) || validPages[0];
  const currentCode = generatePageCode(currentPageToView.name, currentPageToView.canvasData || [], validPages, selectedStack);

  const handleDownload = async () => {
    const fileExtension = selectedStack === "html" ? "html" : "jsx";
    const formatter = selectedStack === "html" ? formatFileName : formatComponentName;

    if (validPages.length <= 1) {
      const fileName = `${formatter(currentPageToView.name)}.${fileExtension}`;
      const blob = new Blob([currentCode], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    try {
      setIsZipping(true);
      const zip = new JSZip();
      // For HTML export, output pages at the root level of the zip. For React, bundle under src/pages/
      const folder = selectedStack === "html" ? zip : zip.folder("src/pages");

      validPages.forEach((p) => {
        const name = formatter(p.name);
        const code = generatePageCode(p.name, p.canvasData || [], validPages, selectedStack);
        folder.file(`${name}.${fileExtension}`, code);
      });

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

  const isMultiPage = validPages.length > 1;

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
                {selectedStack === "react" ? "React + Tailwind JSX" : "Vanilla HTML + Tailwind CDN"} ({validPages.length} {validPages.length === 1 ? "page" : "pages"})
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
              onClick={() => setSelectedStack("html")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                selectedStack === "html" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              HTML (.html)
            </button>
          </div>

          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition p-1">
            <FaTimes />
          </button>
        </div>

        {isMultiPage && (
          <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-950/70 px-6 py-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">Select Page:</span>
            {validPages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setSelectedPageId(page.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  page.id === selectedPageId
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <FaFileCode className="text-[10px]" />
                <span>{selectedStack === "html" ? `${formatFileName(page.name)}.html` : `${formatComponentName(page.name)}.jsx`}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-auto bg-slate-900 p-6 font-mono text-xs text-slate-200 selection:bg-blue-600">
          <pre className="leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>

        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-800 px-6 bg-slate-950">
          <span className="text-xs text-slate-500">
            {isMultiPage ? `Bundles all ${validPages.length} pages into a .zip archive.` : "Downloads as an individual file."}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isZipping}
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              {isMultiPage ? <FaFolder className="text-amber-400" /> : <FaDownload />}
              {isZipping ? "Zipping..." : isMultiPage ? "Download All as .ZIP" : "Download File"}
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