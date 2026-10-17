import { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaStar,
  FaChevronDown,
  FaImage,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";
import { HOVER_EFFECT_MAP } from "./constants";


export function FaqAccordionItem({ item, customFontSize }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-gray-800 transition hover:bg-gray-50"
      >
        <span
          style={{ fontSize: customFontSize ? `${customFontSize}px` : undefined }}
          className="whitespace-pre-line"
        >
          {item.question}
        </span>
        <FaChevronDown
          className={`text-xs text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180 text-blue-600" : ""
            }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-gray-600 border-t border-gray-100 whitespace-pre-line">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export function renderComponentOnCanvas({
  component,
  style,
  customFontSize,
  customWeight,
  hoverClass,
  isPreviewMode,
  onNavigatePage,
  selectedComponent,
  setSelectedComponent,
}) {
  const handleNav = (e, pageId) => {
    e.preventDefault();
    if (pageId && onNavigatePage) {
      e.stopPropagation();
      onNavigatePage(pageId);
    }
  };

  switch (component.type) {
    case "navbar": {
      const navLinks = component.navLinks || [];
      const hasBg = Boolean(component.backgroundColor || component.inlineStyles?.backgroundColor);
      return (
        <nav
          style={{ ...style, ...component.inlineStyles }}
          className={`flex flex-wrap h-full w-full items-center justify-between px-6 md:px-8 py-4 gap-4 ${!hasBg ? "bg-white border-b border-gray-100" : ""
            } ${hoverClass} ${component.customClasses || ""}`}
        >
          <div
            style={{
              color: component.brandColor || undefined,
              fontSize: customFontSize ? `${Math.round(customFontSize * 1.25)}px` : undefined,
              fontWeight: customWeight || "700",
            }}
            className="tracking-tight whitespace-pre-line shrink-0"
          >
            {component.brand || "Brand"}
          </div>

          <div
            style={{ color: component.navLinkColor || undefined }}
            className="flex flex-wrap gap-4 md:gap-6 items-center opacity-90 select-none text-sm font-medium"
          >
            {navLinks.map((link, idx) => (
              <span
                key={link.id || idx}
                onClick={(e) => handleNav(e, link.targetPageId)}
                className={`transition ${link.targetPageId
                  ? "cursor-pointer hover:underline hover:text-blue-600 font-semibold"
                  : ""
                  }`}
                title={link.targetPageId ? "Click to open page" : ""}
              >
                {link.label || `Link ${idx + 1}`}
              </span>
            ))}

            {component.showNavCta && (
              <button
                type="button"
                onClick={(e) => handleNav(e, component.navCtaPageId)}
                style={{
                  backgroundColor: component.navCtaBg || "#2563eb",
                  color: component.navCtaColor || "#ffffff",
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold shadow-xs hover:opacity-90 transition shrink-0"
              >
                {component.navCtaText || "Get Started"}
              </button>
            )}
          </div>
        </nav>
      );
    }

    case "hero": {
      const showPrimary = component.showHeroButton !== false;
      const showSecondary = component.showSecondaryButton !== false;
      const heroBg = component.backgroundColor || component.inlineStyles?.backgroundColor;
      const isCustomBg = Boolean(heroBg);

      return (
        <section
          style={{ ...style, ...component.inlineStyles, ...(heroBg ? { backgroundColor: heroBg } : {}) }}
          className={`flex flex-col justify-center h-full w-full p-6 md:p-12 ${!isCustomBg
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : ""
            } ${hoverClass} ${component.customClasses || ""}`}
        >
          <div className="flex flex-col w-full max-w-3xl mx-auto text-center items-center">
            <h1
              style={{
                fontSize: customFontSize ? `${Math.round(customFontSize * 2)}px` : undefined,
                fontWeight: customWeight || "800",
                color: component.heroHeadingColor || undefined,
              }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight whitespace-pre-line leading-tight"
            >
              {component.heading}
            </h1>
            <p
              style={{
                fontSize: customFontSize ? `${customFontSize}px` : undefined,
                color: component.heroDescColor || undefined,
              }}
              className="mt-4 max-w-2xl opacity-90 leading-relaxed whitespace-pre-line text-sm md:text-base text-lg"
            >
              {component.description}
            </p>

            {(showPrimary || showSecondary) && (
              <div className="mt-8 flex flex-wrap gap-3 items-center justify-center w-full">
                {showPrimary && (
                  <button
                    type="button"
                    onClick={(e) => handleNav(e, component.heroButtonPageId)}
                    style={{
                      backgroundColor: component.heroButtonBg || "#ffffff",
                      color: component.heroButtonTextColor || "#2563eb",
                      ...component.heroButtonInlineStyles,
                    }}
                    className={`rounded-lg px-6 py-3 text-sm font-semibold shadow-xs hover:opacity-90 transition ${component.heroButtonClasses || ""}`}
                  >
                    {component.buttonText || "Get Started"}
                  </button>
                )}
                {showSecondary && (
                  <button
                    type="button"
                    onClick={(e) => handleNav(e, component.secondaryButtonPageId)}
                    style={{
                      backgroundColor: component.secondaryButtonBg || undefined,
                      color: component.secondaryButtonTextColor || undefined,
                      borderColor: component.secondaryButtonBorderColor || undefined,
                      ...component.secondaryButtonInlineStyles,
                    }}
                    className={`rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition ${component.secondaryButtonClasses || ""}`}
                  >
                    {component.secondaryButtonText || "Learn More"}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      );
    }

    case "section": {
      const isFlex = component.customClasses?.includes("flex") || style?.display === "flex" || component.inlineStyles?.display === "flex";
      const hasBg = Boolean(component.backgroundColor || component.inlineStyles?.backgroundColor || component.customClasses?.match(/(?:^|\s)bg-/));

      return (
        <section
          style={{ ...style, ...component.inlineStyles }}
          className={`h-full w-full ${!hasBg ? "bg-white" : ""} ${component.customClasses !== undefined ? component.customClasses : "p-6 md:p-8"} ${hoverClass}`}
        >
          {component.heading && (
            <h2
              style={{
                fontSize: customFontSize
                  ? `${Math.round(customFontSize * 1.5)}px`
                  : undefined,
                fontWeight: customWeight || "700",
                color: component.textColor || undefined,
              }}
              className="mb-3 text-xl md:text-2xl whitespace-pre-line"
            >
              {component.heading}
            </h2>
          )}

          {component.content && (
            <p
              style={{
                fontSize: customFontSize
                  ? `${customFontSize}px`
                  : undefined,
                fontWeight: customWeight || "normal",
                color: component.textColor || undefined,
              }}
              className="mb-3 whitespace-pre-line opacity-90 leading-relaxed text-sm md:text-base"
            >
              {component.content}
            </p>
          )}

          {Array.isArray(component.children) &&
            component.children.map((child) => {
              const childStyle = {
                backgroundColor: child.type === "button"
                  ? undefined
                  : child.backgroundColor || undefined,
                color: child.textColor || undefined,
                fontSize: child.fontSize
                  ? `${child.fontSize}px`
                  : undefined,
                fontWeight: child.fontWeight || undefined,
                textAlign: child.textAlign || undefined,
                padding:
                  child.type !== "button" &&
                    child.padding !== undefined &&
                    child.padding !== ""
                    ? `${child.padding}px`
                    : undefined,
                margin:
                  child.margin !== undefined && child.margin !== ""
                    ? `${child.margin}px`
                    : 0,
                borderRadius:
                  child.type === "button"
                    ? undefined
                    : `${child.borderRadius ?? 0}px`,
                borderWidth:
                  child.type !== "button" && child.borderWidth
                    ? `${child.borderWidth}px`
                    : undefined,
                borderStyle:
                  child.type !== "button"
                    ? child.borderStyle ||
                    (child.borderWidth ? "solid" : undefined)
                    : undefined,
                borderColor: child.borderColor || undefined,
                minHeight: child.minHeight
                  ? `${child.minHeight}px`
                  : undefined,
                opacity:
                  child.opacity !== undefined && child.opacity !== ""
                    ? child.opacity / 100
                    : undefined,
                ...(child.inlineStyles || {}),
              };

              const isChildAuto = child.width === "auto" || child.type === "button";

              return (
                <div
                  key={child.id}
                  onClick={(event) => {
                    if (isPreviewMode) return;

                    event.stopPropagation();
                    setSelectedComponent?.(child.id || child._id);
                  }}
                  className={`relative ${isChildAuto || isFlex ? "w-auto shrink-0" : "w-full"} ${!isPreviewMode &&
                    String(selectedComponent) === String(child.id || child._id)
                    ? "outline outline-2 outline-blue-500 outline-offset-1"
                    : ""
                    }`}
                >
                  {renderComponentOnCanvas({
                    component: child,
                    style: childStyle,
                    customFontSize: child.fontSize
                      ? Number(child.fontSize)
                      : null,
                    customWeight: child.fontWeight,
                    hoverClass:
                      HOVER_EFFECT_MAP[child.hoverEffect || "none"] || "",
                    isPreviewMode,
                    onNavigatePage,
                    selectedComponent,
                    setSelectedComponent,
                  })}
                </div>
              );
            })}
        </section>
      );
    }

    case "features": {
      const features = component.featuresList || [];
      const boxHover = HOVER_EFFECT_MAP[component.boxHoverEffect || "none"] || "";

      return (
        <section style={style} className={`h-full w-full p-6 md:p-8 ${!component.backgroundColor ? "bg-white" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feat, idx) => (
              <div
                key={feat.id || idx}
                className={`bg-black/5 p-5 rounded-xl border border-black/10 ${boxHover}`}
              >
                <h4 className="font-bold whitespace-pre-line text-sm md:text-base">{feat.title}</h4>
                <p className="mt-2 text-xs opacity-80 leading-relaxed whitespace-pre-line">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "pricing": {
      const features = component.pricingFeaturesList || [];

      return (
        <section
          style={style}
          className={`h-full w-full p-6 md:p-8 ${!component.backgroundColor ? "bg-slate-50" : ""}`}
        >
          <div
            className={`border border-gray-200 p-6 md:p-8 text-center shadow-md rounded-2xl max-w-sm mx-auto bg-white ${hoverClass}`}
          >
            {component.pricingBadge && (
              <span className="font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">
                {component.pricingBadge}
              </span>
            )}
            <h3 className="mt-4 text-xl font-bold text-gray-900">{component.pricingPlan}</h3>
            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-gray-900">{component.pricingPrice}</span>
              <span className="text-sm text-gray-500">{component.pricingPeriod}</span>
            </div>

            <div className="mt-6 space-y-2.5 text-left border-t border-b border-gray-100 py-6 text-xs">
              {features.map((feat, idx) => (
                <div
                  key={feat.id || idx}
                  className={`flex items-center gap-2.5 ${feat.included ? "text-gray-700" : "text-gray-400 line-through"}`}
                >
                  {feat.included ? (
                    <FaCheck className="text-blue-500 shrink-0" />
                  ) : (
                    <FaTimes className="text-gray-300 shrink-0" />
                  )}
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={(e) => handleNav(e, component.pricingButtonPageId)}
              style={{
                backgroundColor: component.pricingButtonBg || "#2563eb",
                color: component.pricingButtonTextColor || "#ffffff",
              }}
              className="mt-6 w-full py-3 rounded-xl font-semibold shadow-xs hover:opacity-90 transition text-sm"
            >
              {component.pricingButtonText || "Choose Plan"}
            </button>
          </div>
        </section>
      );
    }

    case "testimonials": {
      const list = component.testimonialsList || [];
      return (
        <section
          style={style}
          className={`h-full w-full p-6 md:p-8 ${!component.backgroundColor ? "bg-slate-50" : ""}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.map((t, idx) => (
              <div
                key={t.id || idx}
                className={`p-6 rounded-2xl border border-gray-200 bg-white shadow-xs ${hoverClass}`}
              >
                <div className="flex gap-1 text-amber-400 text-xs mb-3">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed whitespace-pre-line">
                  "{t.quote}"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="h-10 w-10 rounded-full object-cover border border-gray-200"
                    />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.author}</h4>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "faq": {
      const list = component.faqList || [];
      return (
        <section style={style} className="h-full w-full p-6 md:p-8 bg-white">
          <div className="max-w-3xl mx-auto space-y-4">
            {component.faqTitle && (
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{component.faqTitle}</h2>
                {component.faqSubtitle && (
                  <p className="mt-1 text-xs text-gray-500">{component.faqSubtitle}</p>
                )}
              </div>
            )}
            {list.map((item, idx) => (
              <FaqAccordionItem
                key={item.id || idx}
                item={item}
                customFontSize={customFontSize}
              />
            ))}
          </div>
        </section>
      );
    }

    case "authForm": {
      const fields = component.authFields || [];
      return (
        <div className="flex w-full justify-center items-center py-8 px-4">
          <div
            style={style}
            className={`p-6 md:p-8 w-full max-w-md ${!component.backgroundColor ? "bg-white border border-gray-100 shadow-xl rounded-2xl" : ""
              } ${hoverClass}`}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">{component.authTitle}</h3>
              {component.authSubtitle && (
                <p className="mt-1 text-xs text-gray-500 whitespace-pre-line">{component.authSubtitle}</p>
              )}
            </div>

            {component.showSocialLogin && (
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <FaGoogle className="text-red-500" /> Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <FaGithub /> GitHub
                </button>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5">
              {fields.map((f, idx) => (
                <div key={f.id || idx}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              ))}

              {(component.showRememberMe || component.showForgotPassword) && (
                <div className="flex items-center justify-between text-xs pt-1">
                  {component.showRememberMe ? (
                    <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                      <input type="checkbox" className="rounded accent-blue-600" /> Remember me
                    </label>
                  ) : <span />}
                  {component.showForgotPassword && (
                    <a href="#" className="text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 font-semibold text-xs text-white shadow-xs hover:bg-blue-700 transition mt-2"
              >
                {component.submitButtonText || "Continue"}
              </button>
            </form>
          </div>
        </div>
      );
    }

    case "form": {
      const formFields = component.formFields || [];
      return (
        <form
          style={style}
          onSubmit={(e) => e.preventDefault()}
          className={`space-y-4 p-6 md:p-8 h-full w-full ${!component.backgroundColor ? "bg-white" : ""} ${hoverClass}`}
        >
          {component.formTitle && (
            <h3 className="text-lg md:text-xl font-bold whitespace-pre-line">{component.formTitle}</h3>
          )}
          {formFields.map((field, idx) => (
            <div key={field.id || idx}>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 text-gray-900 bg-white"
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-500 text-gray-900 bg-white"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
          >
            {component.submitButtonText || "Send Message"}
          </button>
        </form>
      );
    }

    case "footer": {
      const columns = component.footerColumns || [];
      return (
        <footer
          style={style}
          className={`px-6 md:px-8 py-10 h-full w-full ${!component.backgroundColor ? "bg-slate-950 text-slate-400" : ""
            } ${hoverClass}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            <div className="md:col-span-1">
              <h3 className="text-base font-bold text-white tracking-tight">{component.brand}</h3>
              <p className="mt-2 text-xs opacity-75 leading-relaxed whitespace-pre-line">
                {component.footerAbout}
              </p>
            </div>
            {columns.map((col, cIdx) => (
              <div key={col.id || cIdx}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{col.title}</h4>
                <ul className="mt-3 space-y-2 text-xs">
                  {(col.items || []).map((item, i) => (
                    <li key={i}>
                      <span
                        onClick={(e) => handleNav(e, item.targetPageId)}
                        className={`hover:text-blue-400 transition ${item.targetPageId ? "cursor-pointer font-semibold" : ""}`}
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="whitespace-pre-line">{component.copyright}</span>
          </div>
        </footer>
      );
    }

    case "paragraph": {
      const hasBg = Boolean(component.backgroundColor || component.inlineStyles?.backgroundColor);
      return (
        <div
          style={{ ...style, ...component.inlineStyles }}
          className={`${hasBg ? "" : "bg-transparent"} ${component.customClasses !== undefined ? component.customClasses : "p-6"} h-full w-full ${hoverClass}`}
        >
          <p
            style={{
              color: component.textColor || undefined,
              fontSize: customFontSize ? `${customFontSize}px` : undefined,
              fontWeight: customWeight || undefined,
              textAlign: component.textAlign || undefined,
            }}
            className="whitespace-pre-line leading-relaxed text-sm md:text-base"
          >
            {component.content}
          </p>
        </div>
      );
    }

    case "heading": {
      const hasBg = Boolean(component.backgroundColor || component.inlineStyles?.backgroundColor);
      return (
        <div
          style={{ ...style, ...component.inlineStyles }}
          className={`${hasBg ? "" : "bg-transparent"} ${component.customClasses !== undefined ? component.customClasses : "p-6"} h-full w-full ${hoverClass}`}
        >
          <h2
            style={{
              color: component.textColor || undefined,
              fontSize: customFontSize ? `${customFontSize}px` : undefined,
              fontWeight: customWeight || undefined,
              textAlign: component.textAlign || undefined,
            }}
            className="text-xl md:text-2xl font-bold whitespace-pre-line"
          >
            {component.title}
          </h2>
          {component.subtitle && <p className="mt-2 opacity-80 whitespace-pre-line text-xs md:text-sm">{component.subtitle}</p>}
        </div>
      );
    }

    case "button": {
      const btnBg = component.btnBgColor || component.backgroundColor;
      const btnColor = component.btnTextColor || component.textColor;
      const buttonCustomClasses = component.customClasses || "";
      return (
        <div className={`p-2 flex justify-${component.btnAlign || "left"} ${component.width === "auto" ? "w-auto" : "w-full"} h-full`}>
          <button
            type="button"
            onClick={(e) => handleNav(e, component.targetPageId)}
            style={{
              backgroundColor: btnBg || undefined,
              color: btnColor || undefined,
              paddingLeft: component.btnPaddingX !== undefined ? `${component.btnPaddingX}px` : undefined,
              paddingRight: component.btnPaddingX !== undefined ? `${component.btnPaddingX}px` : undefined,
              paddingTop: component.btnPaddingY !== undefined ? `${component.btnPaddingY}px` : undefined,
              paddingBottom: component.btnPaddingY !== undefined ? `${component.btnPaddingY}px` : undefined,
              borderRadius: component.borderRadius !== undefined ? `${component.borderRadius}px` : undefined,
              borderWidth: component.borderWidth ? `${component.borderWidth}px` : undefined,
              borderColor: component.borderColor || undefined,
              borderStyle: component.borderStyle || (component.borderWidth ? "solid" : undefined),
              ...component.inlineStyles,
            }}
            className={`font-semibold shadow-xs hover:opacity-90 transition text-sm ${hoverClass} ${buttonCustomClasses}`}
          >
            {component.text || "Click Me"}
          </button>
        </div>
      );
    }

    case "image":
      return (
        <div style={{ ...style, ...component.inlineStyles, overflow: "hidden" }} className={`h-full w-full ${hoverClass} ${component.customClasses || ""}`}>
          {component.src ? (
            <img
              src={component.src}
              alt={component.alt || "Visual"}
              style={{
                width: component.imageWidth ? `${component.imageWidth}%` : "100%",
                height: component.imageHeight ? `${component.imageHeight}px` : "auto",
                objectFit: component.objectFit || "cover",
              }}
              className="block mx-auto"
            />
          ) : (
            <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
              <FaImage className="text-3xl" />
            </div>
          )}
        </div>
      );

    case "divider":
      return (
        <div style={{ ...style, ...component.inlineStyles }} className={`py-2 px-6 h-full w-full flex items-center ${component.customClasses || ""}`}>
          <hr
            className="w-full"
            style={{
              borderColor: component.dividerColor || component.borderColor || "#e2e8f0",
              borderWidth: `${component.dividerThickness || component.borderWidth || 1}px`,
              borderStyle: component.borderStyle || "solid",
            }}
          />
        </div>
      );

    default:
      return (
        <div style={style} className="border border-dashed border-gray-300 p-8 text-center h-full w-full">
          <p className="text-gray-500">{component.name || component.type}</p>
        </div>
      );
  }
}