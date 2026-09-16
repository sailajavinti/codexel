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

function formatComponentName(name) {
  const cleaned = (name || "Page").replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "Page";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
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
  const hasShadow = comp.boxShadow && comp.boxShadow !== "none";
  const zClass = hasShadow ? "relative z-10" : "relative";
  const customFontSize = comp.fontSize ? Number(comp.fontSize) : null;
  const customWeight = comp.fontWeight || null;

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
      const styleAttr = buildStyles();
      const brandStyle = `style={{ color: '${comp.brandColor || "#0f172a"}'${
        customFontSize ? `, fontSize: '${Math.round(customFontSize * 1.25)}px'` : ""
      }${customWeight ? `, fontWeight: '${customWeight}'` : "" } }}`;

      const linkStyle = `style={{ color: '${comp.navLinkColor || "#475569"}'${
        customFontSize ? `, fontSize: '${customFontSize}px'` : ""
      }${customWeight ? `, fontWeight: '${customWeight}'` : "" } }}`;

      const navLinks = comp.navLinks || [
        { id: "link-1", label: comp.home || "Home", targetPageId: comp.homePageId || "" },
        { id: "link-2", label: comp.about || "About", targetPageId: comp.aboutPageId || "" },
        { id: "link-3", label: comp.contact || "Contact", targetPageId: comp.contactPageId || "" },
      ];

      const resolveHref = (pageId) => {
        if (!pageId) return "#";
        const found = pages.find((p) => p.id === pageId);
        return found ? `/${formatComponentName(found.name).toLowerCase()}` : "#";
      };

      const linksJSX = navLinks
        .map(
          (l, i) =>
            `          <a href="${resolveHref(l.targetPageId)}" className="hover:opacity-80">${l.label || `Link ${i + 1}`}</a>`
        )
        .join("\n");

      return `      {/* Navbar */}
      <nav className="${widthClass} ${zClass} flex items-center justify-between px-8 py-4 ${
        !comp.backgroundColor ? "bg-white border-b border-gray-100" : ""
      }" ${styleAttr}>
        <span className="font-bold tracking-tight" ${brandStyle}>
          ${comp.brand || "Brand"}
        </span>
        <div className="flex flex-wrap gap-6 opacity-90 items-center" ${linkStyle}>
${linksJSX}
        </div>
      </nav>`;
    }

    case "hero": {
      const hasCustomBg = Boolean(comp.backgroundColor);
      const bgClass = hasCustomBg ? "" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white";
      const defaultTextColor = hasCustomBg && !comp.textColor ? { color: "'#0f172a'" } : {};
      const styleAttr = buildStyles(defaultTextColor);

      const align = comp.textAlign || "left";
      const alignClasses =
        align === "center"
          ? "items-center text-center mx-auto"
          : align === "right"
          ? "items-end text-right ml-auto"
          : "items-start text-left";

      const headingStyle = customFontSize || customWeight
        ? `style={{ ${customFontSize ? `fontSize: '${Math.round(customFontSize * 2)}px', ` : ""}${
            customWeight ? `fontWeight: '${customWeight}'` : ""
          } }}`
        : "";

      const descStyle = customFontSize || customWeight
        ? `style={{ ${customFontSize ? `fontSize: '${customFontSize}px', ` : ""}${
            customWeight ? `fontWeight: '${customWeight}'` : ""
          } }}`
        : "";

      return `      {/* Hero Section */}
      <section className="${widthClass} ${zClass} p-12 ${bgClass}" ${styleAttr}>
        <div className="flex flex-col w-full ${alignClasses}">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" ${headingStyle}>
            ${comp.heading || "Build Modern Web Experiences"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg opacity-90 leading-relaxed" ${descStyle}>
            ${comp.description || "Design and export responsive interfaces visually in minutes."}
          </p>
          <div className="mt-6">
            <a
              href="${comp.heroButtonLink || "#"}"
              style={{ backgroundColor: '${comp.heroButtonBg || "#ffffff"}', color: '${comp.heroButtonTextColor || "#2563eb"}'${
                customFontSize ? `, fontSize: '${customFontSize}px'` : ""
              } }}
              className="inline-block px-6 py-3 rounded-md font-semibold shadow-xs hover:opacity-95 transition"
            >
              ${comp.buttonText || "Get Started"}
            </a>
          </div>
        </div>
      </section>`;
    }

    case "section": {
      const styleAttr = buildStyles();
      const headingStyle = customFontSize || customWeight
        ? `style={{ ${customFontSize ? `fontSize: '${Math.round(customFontSize * 1.5)}px', ` : ""}${
            customWeight ? `fontWeight: '${customWeight}'` : ""
          } }}`
        : "";

      return `      {/* Content Section */}
      <section className="${widthClass} ${zClass} p-10 ${!comp.backgroundColor ? "bg-white" : ""}" ${styleAttr}>
        ${comp.heading ? `<h2 className="text-2xl font-bold mb-3" ${headingStyle}>${comp.heading}</h2>` : ""}
        <p className="opacity-90 leading-relaxed">
          ${comp.content || "This is a customizable content section."}
        </p>
      </section>`;
    }

    case "heading": {
      const styleAttr = buildStyles();
      const headingStyle = customFontSize || customWeight
        ? `style={{ ${customFontSize ? `fontSize: '${Math.round(customFontSize * 1.5)}px', ` : ""}${
            customWeight ? `fontWeight: '${customWeight}'` : ""
          } }}`
        : "";

      return `      {/* Heading / Text */}
      <div className="${widthClass} ${zClass} p-6 ${!comp.backgroundColor ? "bg-white" : ""}" ${styleAttr}>
        <h2 className="text-2xl font-bold" ${headingStyle}>${comp.title || "Custom Heading"}</h2>
        ${comp.subtitle ? `<p className="mt-2 opacity-80 leading-relaxed">${comp.subtitle}</p>` : ""}
      </div>`;
    }

    case "card": {
      const styleAttr = buildStyles();
      const cardTitleStyle = customFontSize || customWeight
        ? `style={{ ${customFontSize ? `fontSize: '${Math.round(customFontSize * 1.25)}px', ` : ""}${
            customWeight ? `fontWeight: '${customWeight}'` : ""
          } }}`
        : "";

      return `      {/* Card */}
      <div className="${widthClass} ${zClass} p-6 ${!comp.backgroundColor ? "bg-white border border-gray-100" : ""}" ${styleAttr}>
        <h3 className="text-xl font-bold" ${cardTitleStyle}>${comp.cardTitle || comp.title || "Card Title"}</h3>
        <p className="mt-2 opacity-80 leading-relaxed">${comp.cardContent || comp.content || "Card content."}</p>
      </div>`;
    }

    case "features": {
      const styleAttr = buildStyles();
      const titleStyle = customFontSize || customWeight
        ? `style={{ ${customFontSize ? `fontSize: '${Math.round(customFontSize * 1.15)}px', ` : ""}${
            customWeight ? `fontWeight: '${customWeight}'` : ""
          } }}`
        : "";

      return `      {/* Features Grid */}
      <section className="${widthClass} ${zClass} p-10 ${!comp.backgroundColor ? "bg-white" : ""}" ${styleAttr}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-black/5 border border-black/10 rounded-lg">
            <h4 className="font-bold" ${titleStyle}>${comp.featureTitle1 || "Feature 1"}</h4>
            <p className="mt-2 text-sm opacity-80 leading-relaxed">${comp.featureDesc1 || "Feature description text."}</p>
          </div>
          <div className="p-6 bg-black/5 border border-black/10 rounded-lg">
            <h4 className="font-bold" ${titleStyle}>${comp.featureTitle2 || "Feature 2"}</h4>
            <p className="mt-2 text-sm opacity-80 leading-relaxed">${comp.featureDesc2 || "Feature description text."}</p>
          </div>
          <div className="p-6 bg-black/5 border border-black/10 rounded-lg">
            <h4 className="font-bold" ${titleStyle}>${comp.featureTitle3 || "Feature 3"}</h4>
            <p className="mt-2 text-sm opacity-80 leading-relaxed">${comp.featureDesc3 || "Feature description text."}</p>
          </div>
        </div>
      </section>`;
    }

    case "pricing": {
      const styleAttr = buildStyles();
      const priceStyle = customFontSize || customWeight
        ? `style={{ ${customFontSize ? `fontSize: '${Math.round(customFontSize * 2.25)}px', ` : ""}${
            customWeight ? `fontWeight: '${customWeight}'` : ""
          } }}`
        : "";

      return `      {/* Pricing Card */}
      <section className="${widthClass} ${zClass} p-8 ${!comp.backgroundColor ? "bg-white" : ""}" ${styleAttr}>
        <div className="max-w-xs mx-auto border border-gray-200 p-6 rounded-lg text-center shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            ${comp.pricingPlan || "Pro"}
          </span>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold" ${priceStyle}>${comp.pricingPrice || "$29"}</span>
            <span className="text-sm opacity-70">${comp.pricingPeriod || "/ mo"}</span>
          </div>
          <ul className="mt-5 space-y-2 text-xs opacity-90 text-left border-t border-b border-gray-100 py-4">
            ${(comp.pricingFeatures || "Feature 1\nFeature 2")
              .split("\n")
              .map((f) => `<li className="flex items-center gap-2"><span className="text-blue-500 font-bold">✓</span> ${f}</li>`)
              .join("\n            ")}
          </ul>
          <button
            style={{ backgroundColor: '${comp.pricingButtonBg || "#2563eb"}', color: '${comp.pricingButtonTextColor || "#ffffff"}'${
              customFontSize ? `, fontSize: '${customFontSize}px'` : ""
            } }}
            className="mt-5 w-full py-2.5 rounded-md font-semibold shadow-xs hover:opacity-90 transition"
          >
            ${comp.pricingButtonText || "Choose Plan"}
          </button>
        </div>
      </section>`;
    }

    case "button": {
      const alignMap = {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
        full: "w-full",
      };
      const buttonShadow = hasShadow ? `boxShadow: '${SHADOW_MAP[comp.boxShadow]}',` : "";

      return `      {/* Button */}
      <div className="${widthClass} ${zClass} flex ${alignMap[comp.btnAlign || "left"]} p-3">
        <a
          href="${comp.link || "#"}"
          style={{
            backgroundColor: '${comp.btnBgColor || "#2563eb"}',
            color: '${comp.btnTextColor || "#ffffff"}',
            padding: '${comp.btnPaddingY ?? 10}px ${comp.btnPaddingX ?? 20}px',
            borderRadius: '${comp.borderRadius ?? 6}px',
            fontSize: '${comp.fontSize || 16}px',
            fontWeight: '${comp.fontWeight || "600"}',
            ${buttonShadow}
          }}
          className="inline-flex items-center justify-center font-semibold hover:opacity-90 transition ${comp.btnAlign === "full" ? "w-full" : ""}"
        >
          ${comp.text || "Click Me"}
        </a>
      </div>`;
    }

    case "image":
      return `      {/* Image */}
      <div className="${widthClass} ${zClass} overflow-hidden bg-gray-100">
        <img
          src="${comp.src || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"}"
          alt="${comp.alt || "Uploaded visual"}"
          className="w-full h-auto object-cover block"
        />
      </div>`;

    case "footer": {
      const hasCustomBg = Boolean(comp.backgroundColor);
      const bgClass = hasCustomBg ? "" : "bg-slate-900 text-slate-400";
      const styleAttr = buildStyles();

      return `      {/* Footer */}
      <footer className="${widthClass} ${zClass} flex flex-col sm:flex-row items-center justify-between px-8 py-6 text-sm gap-4 ${bgClass}" ${styleAttr}>
        <span>${comp.copyright || "© 2026 CodeXel Inc."}</span>
        <div className="flex gap-6">
          <a href="#" className="hover:opacity-80">${comp.footerLink1 || "Privacy"}</a>
          <a href="#" className="hover:opacity-80">${comp.footerLink2 || "Terms"}</a>
        </div>
      </footer>`;
    }

    case "form": {
      const styleAttr = buildStyles();
      return `      {/* Contact Form */}
      <form className="${widthClass} ${zClass} p-8 space-y-4 ${!comp.backgroundColor ? "bg-white" : ""}" ${styleAttr}>
        ${comp.formTitle ? `<h3 className="text-xl font-bold">${comp.formTitle}</h3>` : ""}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="${comp.namePlaceholder || "Enter your name"}"
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 bg-white text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="${comp.emailPlaceholder || "Enter your email"}"
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 bg-white text-gray-900"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
          Submit
        </button>
      </form>`;
    }

    case "divider":
      return `      {/* Divider */}
      <div className="${widthClass} ${zClass} py-4 px-6 flex items-center">
        <hr className="w-full" style={{ borderColor: '${comp.dividerColor || "#e2e8f0"}', borderWidth: '${comp.dividerThickness || 1}px' }} />
      </div>`;

    default: {
      const styleAttr = buildStyles();
      return `      {/* Generic Block */}
      <div className="${widthClass} ${zClass} p-6 border border-gray-100 ${!comp.backgroundColor ? "bg-white" : ""}" ${styleAttr}>
        <p className="opacity-80">${comp.name || comp.type}</p>
      </div>`;
    }
  }
}

function generatePageCode(pageName, components, pages = []) {
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
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    if (activePage?.id) {
      setSelectedPageId(activePage.id);
    } else if (pages.length > 0) {
      setSelectedPageId(pages[0].id);
    }
  }, [activePage, pages, isOpen]);

  if (!isOpen) return null;

  const validPages = pages.length > 0 ? pages : [activePage];
  const currentPageToView = validPages.find((p) => p.id === selectedPageId) || validPages[0];
  const currentCode = generatePageCode(currentPageToView.name, currentPageToView.canvasData || [], validPages);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (validPages.length <= 1) {
      const fileName = `${formatComponentName(currentPageToView.name)}.jsx`;
      const blob = new Blob([currentCode], { type: "text/javascript" });
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
      const folder = zip.folder("src/pages");

      validPages.forEach((p) => {
        const componentName = formatComponentName(p.name);
        const code = generatePageCode(p.name, p.canvasData || [], validPages);
        folder.file(`${componentName}.jsx`, code);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CodeXel-Project-Pages.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate zip:", err);
      alert("Failed to bundle files into a zip. Please try again.");
    } finally {
      setIsZipping(false);
    }
  };

  const isMultiPage = validPages.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-6 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <FaCode className="text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export Code</h3>
              <p className="text-[11px] text-slate-400">
                React + Tailwind CSS Output ({validPages.length} {validPages.length === 1 ? "page" : "pages"})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <FaTimes />
          </button>
        </div>

        {/* Multi-Page Tabs Bar */}
        {isMultiPage && (
          <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-950/70 px-6 py-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">
              Select Page to View / Copy:
            </span>
            {validPages.map((page) => {
              const isSelected = page.id === selectedPageId;
              const formattedName = formatComponentName(page.name);

              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setSelectedPageId(page.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <FaFileCode className="text-[10px]" />
                  <span>{formattedName}.jsx</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Details Bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
          <span>File: src/pages/{formatComponentName(currentPageToView.name)}.jsx</span>
          <span>{currentPageToView.canvasData?.length || 0} Components</span>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-slate-900 p-6 font-mono text-xs text-slate-200 selection:bg-blue-600">
          <pre className="leading-relaxed">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-800 px-6 bg-slate-950">
          <span className="text-xs text-slate-500">
            {isMultiPage
              ? `Multi-page project: Downloads a .zip folder containing all ${validPages.length} page files.`
              : "Single-page project: Downloads as an individual .jsx component file."}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isZipping}
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition disabled:opacity-50"
            >
              {isMultiPage ? <FaFolder className="text-[11px] text-amber-400" /> : <FaDownload className="text-[11px]" />}
              {isZipping
                ? "Creating Zip..."
                : isMultiPage
                ? `Download All as .ZIP (${validPages.length} files)`
                : `Download ${formatComponentName(currentPageToView.name)}.jsx`}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition"
            >
              {copied ? <FaCheck className="text-xs text-emerald-300" /> : <FaCopy className="text-xs" />}
              {copied
                ? `Copied ${formatComponentName(currentPageToView.name)}.jsx!`
                : `Copy ${formatComponentName(currentPageToView.name)}.jsx`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodePreview;