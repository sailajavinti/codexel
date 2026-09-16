import { useState, useRef } from "react";
import { FaImage, FaTrash, FaGripVertical, FaCopy } from "react-icons/fa";

const SNAP_WIDTHS = [
  { label: "25%", value: 25 },
  { label: "33.33%", value: 33.333 },
  { label: "50%", value: 50 },
  { label: "66.67%", value: 66.667 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
];

const SHADOW_MAP = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

const VIEWPORT_WIDTHS = {
  desktop: "max-w-5xl",
  tablet: "max-w-[768px]",
  mobile: "max-w-[375px]",
};

function Canvas({
  components = [],
  selectedComponent,
  setSelectedComponent,
  onDropComponent,
  onDeleteComponent,
  onReorderComponents,
  onUpdateComponent,
  onDuplicateComponent,
  onNavigatePage,
  viewportMode = "desktop",
  isPreviewMode = false,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null);
  const containerRef = useRef(null);

  const getComponentStyle = (component) => {
    const isButton = component.type === "button";

    return {
      backgroundColor: isButton ? undefined : component.backgroundColor || undefined,
      color: component.textColor || undefined,
      fontSize: component.fontSize ? `${component.fontSize}px` : undefined,
      fontWeight: component.fontWeight || undefined,
      textAlign: component.textAlign || undefined,
      padding: isButton
        ? undefined
        : component.padding !== undefined && component.padding !== ""
        ? `${component.padding}px`
        : undefined,
      margin:
        component.margin !== undefined && component.margin !== ""
          ? `${component.margin}px`
          : 0,
      borderRadius: isButton ? undefined : `${component.borderRadius ?? 0}px`,
      borderWidth: isButton
        ? undefined
        : component.borderWidth
        ? `${component.borderWidth}px`
        : undefined,
      borderStyle: isButton
        ? undefined
        : component.borderStyle || (component.borderWidth ? "solid" : undefined),
      borderColor: isButton ? undefined : component.borderColor || undefined,
      boxShadow: isButton
        ? undefined
        : component.boxShadow
        ? SHADOW_MAP[component.boxShadow]
        : undefined,
      minHeight: component.minHeight ? `${component.minHeight}px` : undefined,
      opacity:
        component.opacity !== undefined && component.opacity !== ""
          ? component.opacity / 100
          : undefined,
    };
  };

  const handleWidthResizeMouseDown = (e, compKey, currentWidth) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const containerWidth = containerRef.current?.getBoundingClientRect().width || 1000;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const rawCurrent = currentWidth === "auto" ? 30 : parseFloat(currentWidth || "100");
      const targetPercent = Math.max(20, Math.min(100, rawCurrent + deltaPercent));

      let closest = SNAP_WIDTHS[0];
      let minDiff = Math.abs(targetPercent - SNAP_WIDTHS[0].value);
      for (const snap of SNAP_WIDTHS) {
        const diff = Math.abs(targetPercent - snap.value);
        if (diff < minDiff) {
          minDiff = diff;
          closest = snap;
        }
      }

      if (onUpdateComponent) {
        onUpdateComponent(compKey, { width: closest.label });
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleHeightResizeMouseDown = (e, compKey, currentMinHeight) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    const initialH = parseInt(currentMinHeight, 10) || 120;

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const nextH = Math.max(50, Math.round(initialH + deltaY));
      if (onUpdateComponent) {
        onUpdateComponent(compKey, { minHeight: nextH });
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleOuterDragOver = (e) => {
    if (isPreviewMode) return;
    e.preventDefault();
    if (draggedIndex === null) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleOuterDrop = (e) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex !== null) return;

    const rawData =
      e.dataTransfer.getData("application/json") ||
      e.dataTransfer.getData("component");

    if (!rawData) return;

    try {
      const droppedComp = JSON.parse(rawData);
      if (onDropComponent) {
        onDropComponent(droppedComp);
      }
    } catch (err) {
      console.error("Invalid dropped component:", err);
    }
  };

  const handleGripDragStart = (e, index) => {
    if (isPreviewMode) return;
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", `${index}`);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDragOver = (e, index) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null) {
      e.dataTransfer.dropEffect = "copy";
      return;
    }

    e.dataTransfer.dropEffect = "move";

    const rect = e.currentTarget.getBoundingClientRect();
    const hoverMiddleX = rect.left + rect.width / 2;
    const isLeft = e.clientX < hoverMiddleX;

    setDropIndicator({
      index,
      position: isLeft ? "before" : "after",
    });
  };

  const handleItemDrop = (e, index) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null) {
      handleOuterDrop(e);
      setDropIndicator(null);
      return;
    }

    const fromIndex = draggedIndex;
    const indicator = dropIndicator;

    setDraggedIndex(null);
    setDropIndicator(null);

    if (fromIndex === null || fromIndex === undefined) return;

    let destinationIndex = index;
    if (indicator?.position === "after" && fromIndex > index) {
      destinationIndex += 1;
    } else if (indicator?.position === "before" && fromIndex < index) {
      destinationIndex -= 1;
    }

    if (fromIndex !== destinationIndex && onReorderComponents) {
      onReorderComponents(fromIndex, destinationIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropIndicator(null);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteComponent) {
      onDeleteComponent(id);
    }
  };

  const handleDuplicate = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDuplicateComponent) {
      onDuplicateComponent(id);
    }
  };

  const renderComponent = (component) => {
    const style = getComponentStyle(component);
    const customFontSize = component.fontSize ? Number(component.fontSize) : null;
    const customWeight = component.fontWeight || undefined;

    switch (component.type) {
      case "navbar": {
        const navLinks = component.navLinks || [
          { id: "link-1", label: component.home || "Home", targetPageId: component.homePageId || "" },
          { id: "link-2", label: component.about || "About", targetPageId: component.aboutPageId || "" },
          { id: "link-3", label: component.contact || "Contact", targetPageId: component.contactPageId || "" },
        ];

        const handleLinkClick = (e, targetPageId) => {
          e.preventDefault();
          if (targetPageId && onNavigatePage) {
            e.stopPropagation();
            onNavigatePage(targetPageId);
          }
        };

        return (
          <nav
            style={style}
            className={`flex h-full w-full items-center justify-between px-8 py-4 ${
              !component.backgroundColor ? "bg-white" : ""
            }`}
          >
            <div
              style={{
                color: component.brandColor || undefined,
                fontSize: customFontSize ? `${Math.round(customFontSize * 1.25)}px` : undefined,
                fontWeight: customWeight || "700",
              }}
              className="tracking-tight"
            >
              {component.brand || "Brand"}
            </div>
            <div
              style={{
                color: component.navLinkColor || undefined,
                fontSize: customFontSize ? `${customFontSize}px` : undefined,
                fontWeight: customWeight || "500",
              }}
              className="flex flex-wrap gap-6 opacity-90 select-none items-center"
            >
              {navLinks.map((link, idx) => (
                <span
                  key={link.id || idx}
                  onClick={(e) => handleLinkClick(e, link.targetPageId)}
                  className={`transition ${
                    link.targetPageId
                      ? "cursor-pointer hover:underline hover:text-blue-600 font-semibold"
                      : ""
                  }`}
                  title={link.targetPageId ? "Click to navigate to this page" : ""}
                >
                  {link.label || `Link ${idx + 1}`}
                </span>
              ))}
            </div>
          </nav>
        );
      }

      case "hero": {
        const align = component.textAlign || "left";
        const alignClasses =
          align === "center"
            ? "items-center text-center mx-auto"
            : align === "right"
            ? "items-end text-right ml-auto"
            : "items-start text-left";

        return (
          <section
            style={style}
            className={`flex flex-col justify-center h-full w-full p-10 ${
              !component.backgroundColor
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : ""
            }`}
          >
            <div className={`flex flex-col w-full ${alignClasses}`}>
              <h1
                style={{
                  fontSize: customFontSize ? `${Math.round(customFontSize * 2)}px` : undefined,
                  fontWeight: customWeight || "800",
                  lineHeight: 1.15,
                }}
                className="text-4xl md:text-5xl tracking-tight"
              >
                {component.heading || "Your Hero Heading"}
              </h1>
              <p
                style={{
                  fontSize: customFontSize ? `${customFontSize}px` : undefined,
                  fontWeight: customWeight || "normal",
                }}
                className="mt-4 max-w-2xl opacity-90 leading-relaxed"
              >
                {component.description || "Your hero description goes here."}
              </p>
              <div className="mt-6">
                <a
                  href={component.heroButtonLink || "#"}
                  onClick={(e) => {
                    if (!isPreviewMode) e.preventDefault();
                  }}
                  style={{
                    backgroundColor: component.heroButtonBg || "#ffffff",
                    color: component.heroButtonTextColor || "#2563eb",
                    fontSize: customFontSize ? `${customFontSize}px` : undefined,
                  }}
                  className="inline-block rounded-md px-6 py-3 font-semibold shadow-xs transition hover:opacity-90"
                >
                  {component.buttonText || "Get Started"}
                </a>
              </div>
            </div>
          </section>
        );
      }

      case "section":
        return (
          <section
            style={style}
            className={`h-full w-full p-8 ${!component.backgroundColor ? "bg-white" : ""}`}
          >
            {component.heading && (
              <h2
                style={{
                  fontSize: customFontSize ? `${Math.round(customFontSize * 1.5)}px` : undefined,
                  fontWeight: customWeight || "700",
                }}
                className="mb-3 text-2xl"
              >
                {component.heading}
              </h2>
            )}
            <p
              style={{
                fontSize: customFontSize ? `${customFontSize}px` : undefined,
                fontWeight: customWeight || "normal",
              }}
              className="opacity-90 leading-relaxed"
            >
              {component.content || "This is a section. Add your content here."}
            </p>
          </section>
        );

      case "features":
        return (
          <section
            style={style}
            className={`h-full w-full p-8 ${!component.backgroundColor ? "bg-white" : ""}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: component.featureTitle1 || "Feature 1", desc: component.featureDesc1 || "Feature description." },
                { title: component.featureTitle2 || "Feature 2", desc: component.featureDesc2 || "Feature description." },
                { title: component.featureTitle3 || "Feature 3", desc: component.featureDesc3 || "Feature description." },
              ].map((feat, i) => (
                <div key={i} className="bg-black/5 p-5 rounded-lg border border-black/10">
                  <h4
                    style={{
                      fontSize: customFontSize ? `${Math.round(customFontSize * 1.15)}px` : undefined,
                      fontWeight: customWeight || "700",
                    }}
                  >
                    {feat.title}
                  </h4>
                  <p
                    style={{
                      fontSize: customFontSize ? `${Math.round(customFontSize * 0.9)}px` : undefined,
                      fontWeight: customWeight || "normal",
                    }}
                    className="mt-2 opacity-80 leading-relaxed"
                  >
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case "pricing":
        return (
          <section
            style={style}
            className={`h-full w-full p-8 ${!component.backgroundColor ? "bg-white" : ""}`}
          >
            <div className="border border-gray-200 p-6 text-center shadow-xs rounded-lg max-w-xs mx-auto">
              <span
                style={{ fontSize: customFontSize ? `${Math.round(customFontSize * 0.75)}px` : undefined }}
                className="font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
              >
                {component.pricingPlan || "Pro"}
              </span>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span
                  style={{
                    fontSize: customFontSize ? `${Math.round(customFontSize * 2.25)}px` : undefined,
                    fontWeight: customWeight || "800",
                  }}
                  className="text-4xl"
                >
                  {component.pricingPrice || "$29"}
                </span>
                <span
                  style={{ fontSize: customFontSize ? `${Math.round(customFontSize * 0.85)}px` : undefined }}
                  className="opacity-70"
                >
                  {component.pricingPeriod || "/ mo"}
                </span>
              </div>
              <ul
                style={{
                  fontSize: customFontSize ? `${customFontSize}px` : undefined,
                  fontWeight: customWeight || "normal",
                }}
                className="mt-5 space-y-2 text-left border-t border-b border-gray-100 py-4 opacity-90"
              >
                {(component.pricingFeatures || "Feature 1\nFeature 2")
                  .split("\n")
                  .map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-blue-500 font-bold">✓</span> {f}
                    </li>
                  ))}
              </ul>
              <button
                type="button"
                style={{
                  backgroundColor: component.pricingButtonBg || "#2563eb",
                  color: component.pricingButtonTextColor || "#ffffff",
                  fontSize: customFontSize ? `${customFontSize}px` : undefined,
                }}
                className="mt-5 w-full rounded-md py-2.5 font-semibold shadow-xs transition hover:opacity-90"
              >
                {component.pricingButtonText || "Choose Plan"}
              </button>
            </div>
          </section>
        );

      case "footer":
        return (
          <footer
            style={style}
            className={`flex flex-col sm:flex-row items-center justify-between px-8 py-6 gap-4 h-full w-full ${
              !component.backgroundColor ? "bg-slate-900 text-slate-400" : ""
            }`}
          >
            <div style={{ fontSize: customFontSize ? `${customFontSize}px` : undefined, fontWeight: customWeight }}>
              {component.copyright || "© 2026 CodeXel Inc."}
            </div>
            <div
              style={{ fontSize: customFontSize ? `${customFontSize}px` : undefined, fontWeight: customWeight }}
              className="flex gap-6"
            >
              <span>{component.footerLink1 || "Privacy"}</span>
              <span>{component.footerLink2 || "Terms"}</span>
            </div>
          </footer>
        );

      case "heading":
        return (
          <div
            style={style}
            className={`p-6 h-full w-full ${!component.backgroundColor ? "bg-white" : ""}`}
          >
            <h2
              style={{
                fontSize: customFontSize ? `${Math.round(customFontSize * 1.5)}px` : undefined,
                fontWeight: customWeight || "700",
              }}
              className="text-2xl"
            >
              {component.title || "Custom Heading"}
            </h2>
            {component.subtitle && (
              <p
                style={{
                  fontSize: customFontSize ? `${customFontSize}px` : undefined,
                  fontWeight: customWeight || "normal",
                }}
                className="mt-2 opacity-80 leading-relaxed"
              >
                {component.subtitle}
              </p>
            )}
          </div>
        );

      case "divider":
        return (
          <div style={style} className="py-2 px-6 h-full w-full flex items-center">
            <hr
              className="w-full"
              style={{
                borderColor: component.dividerColor || "#e2e8f0",
                borderWidth: `${component.dividerThickness || 1}px`,
              }}
            />
          </div>
        );

      case "button": {
        const alignMap = {
          left: "justify-start",
          center: "justify-center",
          right: "justify-end",
          full: "w-full",
        };

        return (
          <div className={`p-2 flex ${alignMap[component.btnAlign || "left"]} w-full h-full`}>
            <a
              href={component.link || "#"}
              onClick={(e) => {
                if (!isPreviewMode) e.preventDefault();
              }}
              style={{
                backgroundColor: component.btnBgColor || "#2563eb",
                color: component.btnTextColor || "#ffffff",
                paddingLeft: `${component.btnPaddingX ?? 20}px`,
                paddingRight: `${component.btnPaddingX ?? 20}px`,
                paddingTop: `${component.btnPaddingY ?? 10}px`,
                paddingBottom: `${component.btnPaddingY ?? 10}px`,
                borderRadius: `${component.borderRadius ?? 6}px`,
                fontSize: customFontSize ? `${customFontSize}px` : undefined,
                fontWeight: customWeight || "600",
                boxShadow: component.boxShadow ? SHADOW_MAP[component.boxShadow] : undefined,
                borderWidth: component.borderWidth ? `${component.borderWidth}px` : undefined,
                borderStyle: component.borderStyle || (component.borderWidth ? "solid" : undefined),
                borderColor: component.borderColor || undefined,
              }}
              className={`inline-flex items-center justify-center transition hover:opacity-90 ${
                component.btnAlign === "full" ? "w-full text-center" : ""
              }`}
            >
              {component.text || "Click Me"}
            </a>
          </div>
        );
      }

      case "card":
        return (
          <div
            style={style}
            className={`p-6 h-full w-full ${!component.backgroundColor ? "bg-white border border-gray-100" : ""}`}
          >
            <h3
              style={{
                fontSize: customFontSize ? `${Math.round(customFontSize * 1.25)}px` : undefined,
                fontWeight: customWeight || "700",
              }}
              className="text-xl"
            >
              {component.cardTitle || component.title || "Card Title"}
            </h3>
            <p
              style={{
                fontSize: customFontSize ? `${customFontSize}px` : undefined,
                fontWeight: customWeight || "normal",
              }}
              className="mt-2 opacity-80 leading-relaxed"
            >
              {component.cardContent || component.content || "Card content."}
            </p>
          </div>
        );

      case "image":
        return (
          <div style={{ ...style, overflow: "hidden" }} className="h-full w-full">
            {component.src ? (
              <div
                style={{
                  width: component.imageWidth ? `${component.imageWidth}px` : "100%",
                  height: component.imageHeight ? `${component.imageHeight}px` : "auto",
                  margin:
                    component.imageAlign === "center"
                      ? "0 auto"
                      : component.imageAlign === "right"
                      ? "0 0 0 auto"
                      : undefined,
                }}
              >
                <img
                  src={component.src}
                  alt={component.alt || "Uploaded image"}
                  style={{
                    width: "100%",
                    height: component.imageHeight ? "100%" : "auto",
                    objectFit: component.objectFit || "cover",
                  }}
                  className="block"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                  <FaImage className="mx-auto text-3xl" />
                  <p className="mt-2 text-sm">Upload an image from Properties</p>
                </div>
              </div>
            )}
          </div>
        );

      case "form":
        return (
          <form
            style={style}
            onSubmit={(e) => e.preventDefault()}
            className={`space-y-4 p-8 h-full w-full ${!component.backgroundColor ? "bg-white" : ""}`}
          >
            {component.formTitle && (
              <h3
                style={{
                  fontSize: customFontSize ? `${Math.round(customFontSize * 1.25)}px` : undefined,
                  fontWeight: customWeight || "700",
                }}
                className="text-xl"
              >
                {component.formTitle}
              </h3>
            )}
            <div>
              <label
                style={{
                  fontSize: customFontSize ? `${customFontSize}px` : undefined,
                  fontWeight: customWeight || "500",
                }}
                className="mb-1 block"
              >
                Name
              </label>
              <input
                type="text"
                placeholder={component.namePlaceholder || "Enter your name"}
                style={{ fontSize: customFontSize ? `${customFontSize}px` : undefined }}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: customFontSize ? `${customFontSize}px` : undefined,
                  fontWeight: customWeight || "500",
                }}
                className="mb-1 block"
              >
                Email
              </label>
              <input
                type="email"
                placeholder={component.emailPlaceholder || "Enter your email"}
                style={{ fontSize: customFontSize ? `${customFontSize}px` : undefined }}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <button
              type="submit"
              style={{ fontSize: customFontSize ? `${customFontSize}px` : undefined }}
              className="rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        );

      default:
        return (
          <div style={style} className="border border-dashed border-gray-300 p-8 text-center h-full w-full">
            <p className="text-gray-500">{component.name || component.type}</p>
          </div>
        );
    }
  };

  return (
    <main
      className={`relative flex-1 overflow-y-auto p-6 transition-all duration-300 ${
        isPreviewMode ? "bg-slate-200/70" : "bg-slate-100"
      }`}
      onDragOver={handleOuterDragOver}
      onDrop={handleOuterDrop}
      onClick={() => {
        if (!isPreviewMode && setSelectedComponent) {
          setSelectedComponent(null);
        }
      }}
    >
      <div
        ref={containerRef}
        className={`mx-auto min-h-full transition-all duration-300 shadow-sm border border-gray-200 bg-white ${
          VIEWPORT_WIDTHS[viewportMode] || "max-w-5xl"
        } ${isPreviewMode ? "shadow-2xl rounded-lg overflow-hidden my-4" : ""}`}
        onDragOver={handleOuterDragOver}
        onDrop={handleOuterDrop}
      >
        {components.length === 0 ? (
          <div className="flex min-h-[500px] items-center justify-center p-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-500">
                Start building your website
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Drag components here or click a component from the panel
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap content-start">
            {components.map((component, index) => {
              const compKey = component.id || component._id;
              const isSelected = Boolean(
                !isPreviewMode &&
                  selectedComponent &&
                  (selectedComponent === compKey ||
                    String(selectedComponent) === String(component.id) ||
                    String(selectedComponent) === String(component._id))
              );

              const isBeingDragged = !isPreviewMode && draggedIndex === index;
              const isDropTarget =
                !isPreviewMode && dropIndicator?.index === index && draggedIndex !== index;
              const isAutoWidth = component.width === "auto";
              const hasShadow = component.boxShadow && component.boxShadow !== "none";

              return (
                <div
                  key={compKey}
                  style={{
                    width: isAutoWidth ? "auto" : component.width || "100%",
                    flexGrow: isAutoWidth ? 0 : undefined,
                    flexShrink: 0,
                    zIndex: isSelected ? 30 : hasShadow ? 10 : 1,
                  }}
                  className={`group relative transition-all ${
                    isBeingDragged ? "opacity-30 scale-[0.98]" : "opacity-100"
                  } ${
                    isDropTarget && dropIndicator?.position === "before"
                      ? "border-l-4 border-l-blue-600"
                      : ""
                  } ${
                    isDropTarget && dropIndicator?.position === "after"
                      ? "border-r-4 border-r-blue-600"
                      : ""
                  }`}
                  onClick={(e) => {
                    if (isPreviewMode) return;
                    e.stopPropagation();
                    if (setSelectedComponent) setSelectedComponent(compKey);
                  }}
                  onDragOver={(e) => handleItemDragOver(e, index)}
                  onDrop={(e) => handleItemDrop(e, index)}
                >
                  {/* Selection Outline Overlay */}
                  {isSelected && !isPreviewMode && (
                    <div className="pointer-events-none absolute inset-0 z-20 border-2 border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" />
                  )}

                  {/* Drag Reorder Handle */}
                  {!isPreviewMode && (
                    <div
                      draggable
                      onDragStart={(e) => handleGripDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                      className="absolute left-2 top-2 z-30 flex h-6 w-6 cursor-grab active:cursor-grabbing items-center justify-center rounded bg-white/90 text-gray-500 shadow-md border border-gray-200 opacity-0 transition group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-600 backdrop-blur-xs"
                      title="Drag to reposition component"
                    >
                      <FaGripVertical className="text-[10px]" />
                    </div>
                  )}

                  {/* Actions Badge */}
                  {isSelected && !isPreviewMode && (
                    <div className="absolute right-2 top-2 z-30 flex items-center gap-1.5 bg-white/95 px-1.5 py-1 rounded shadow-md border border-gray-200 backdrop-blur-xs text-xs">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        {component.width || "100%"}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(e, compKey)}
                        className="flex h-5 w-5 items-center justify-center rounded text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                        title="Duplicate Component (Ctrl+D)"
                      >
                        <FaCopy className="pointer-events-none text-[10px]" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, compKey)}
                        className="flex h-5 w-5 items-center justify-center rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                        title="Delete Component (Del)"
                      >
                        <FaTrash className="pointer-events-none text-[10px]" />
                      </button>
                    </div>
                  )}

                  {/* Component View */}
                  <div className="w-full h-full">{renderComponent(component)}</div>

                  {/* Right Resize Handle */}
                  {isSelected && !isPreviewMode && (
                    <div
                      onMouseDown={(e) =>
                        handleWidthResizeMouseDown(e, compKey, component.width)
                      }
                      className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-blue-500/30 flex items-center justify-center z-30"
                      title="Drag to resize width"
                    >
                      <div className="h-8 w-1 bg-blue-500 rounded-full shadow-xs" />
                    </div>
                  )}

                  {/* Bottom Resize Handle */}
                  {isSelected && !isPreviewMode && (
                    <div
                      onMouseDown={(e) =>
                        handleHeightResizeMouseDown(e, compKey, component.minHeight)
                      }
                      className="absolute left-0 right-0 bottom-0 h-2.5 cursor-ns-resize hover:bg-blue-500/30 flex items-center justify-center z-30"
                      title="Drag to resize height"
                    >
                      <div className="w-8 h-1 bg-blue-500 rounded-full shadow-xs" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Canvas;