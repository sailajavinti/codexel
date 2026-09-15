import { useState, useRef } from "react";
import { FaImage, FaTrash, FaGripVertical } from "react-icons/fa";

const SNAP_WIDTHS = [
  { label: "25%", value: 25 },
  { label: "33.33%", value: 33.333 },
  { label: "50%", value: 50 },
  { label: "66.67%", value: 66.667 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
];

function Canvas({
  components = [],
  selectedComponent,
  setSelectedComponent,
  onDropComponent,
  onDeleteComponent,
  onReorderComponents,
  onUpdateComponent,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null);
  const containerRef = useRef(null);

  const getComponentStyle = (component) => {
    const shadowMap = {
      none: "none",
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    };

    const isButton = component.type === "button";

    return {
      backgroundColor: isButton ? undefined : component.backgroundColor || undefined,
      color: component.textColor || undefined,
      fontSize: component.fontSize ? `${component.fontSize}px` : undefined,
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
      textAlign: component.textAlign || undefined,
      fontWeight: component.fontWeight || undefined,
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
        ? shadowMap[component.boxShadow]
        : undefined,
      minHeight: component.minHeight ? `${component.minHeight}px` : undefined,
      opacity:
        component.opacity !== undefined && component.opacity !== ""
          ? component.opacity / 100
          : undefined,
    };
  };

  // --- Horizontal & Vertical Drag Resizing ---
  const handleWidthResizeMouseDown = (e, compKey, currentWidth) => {
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

  // --- Outer Container Drop ---
  const handleOuterDragOver = (e) => {
    e.preventDefault();
    if (draggedIndex === null) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleOuterDrop = (e) => {
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

  // --- Reordering Drag Handlers ---
  const handleGripDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", `${index}`);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDragOver = (e, index) => {
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

  const renderComponent = (component) => {
    const style = getComponentStyle(component);

    switch (component.type) {
      case "navbar":
        return (
          <nav
            style={style}
            className="flex h-full w-full items-center justify-between px-8 py-4"
          >
            <div
              style={{ color: component.brandColor || undefined }}
              className="text-xl font-bold"
            >
              {component.brand || "Brand"}
            </div>
            <div
              style={{ color: component.navLinkColor || undefined }}
              className="flex gap-6 text-sm font-medium opacity-90"
            >
              <span>{component.home || "Home"}</span>
              <span>{component.about || "About"}</span>
              <span>{component.contact || "Contact"}</span>
            </div>
          </nav>
        );

      case "hero":
        return (
          <section
            style={style}
            className={`flex flex-col justify-center h-full w-full p-10 ${
              !component.backgroundColor
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : ""
            }`}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {component.heading || "Your Hero Heading"}
            </h1>
            <p className="mt-3 max-w-2xl opacity-90 leading-relaxed">
              {component.description || "Your hero description goes here."}
            </p>
            <div className="mt-5">
              <a
                href={component.heroButtonLink || "#"}
                onClick={(e) => e.preventDefault()}
                style={{
                  backgroundColor: component.heroButtonBg || "#ffffff",
                  color: component.heroButtonTextColor || "#2563eb",
                }}
                className="inline-block rounded-md px-5 py-2.5 font-semibold shadow-xs transition hover:opacity-90"
              >
                {component.buttonText || "Get Started"}
              </a>
            </div>
          </section>
        );

      case "section":
        return (
          <section style={style} className="h-full w-full p-8">
            {component.heading && (
              <h2 className="mb-2 text-2xl font-bold">{component.heading}</h2>
            )}
            <p className="opacity-90 leading-relaxed">
              {component.content || "This is a section. Add your content here."}
            </p>
          </section>
        );

      case "features":
        return (
          <section style={style} className="h-full w-full p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/5 p-5 rounded-sm border border-black/10">
                <h4 className="font-bold">{component.featureTitle1 || "Feature 1"}</h4>
                <p className="mt-1 text-sm opacity-80">{component.featureDesc1 || "Feature description."}</p>
              </div>
              <div className="bg-black/5 p-5 rounded-sm border border-black/10">
                <h4 className="font-bold">{component.featureTitle2 || "Feature 2"}</h4>
                <p className="mt-1 text-sm opacity-80">{component.featureDesc2 || "Feature description."}</p>
              </div>
              <div className="bg-black/5 p-5 rounded-sm border border-black/10">
                <h4 className="font-bold">{component.featureTitle3 || "Feature 3"}</h4>
                <p className="mt-1 text-sm opacity-80">{component.featureDesc3 || "Feature description."}</p>
              </div>
            </div>
          </section>
        );

      case "pricing":
        return (
          <section style={style} className="h-full w-full p-8">
            <div className="border border-gray-200 p-6 text-center shadow-xs rounded-sm max-w-xs mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {component.pricingPlan || "Pro"}
              </span>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="text-3xl font-extrabold">{component.pricingPrice || "$29"}</span>
                <span className="opacity-70 text-sm">{component.pricingPeriod || "/ mo"}</span>
              </div>
              <ul className="mt-4 space-y-2 text-xs opacity-90 text-left border-t border-b border-gray-100 py-3">
                {(component.pricingFeatures || "Feature 1\nFeature 2")
                  .split("\n")
                  .map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-blue-500">✓</span> {f}
                    </li>
                  ))}
              </ul>
              <button
                type="button"
                style={{
                  backgroundColor: component.pricingButtonBg || "#2563eb",
                  color: component.pricingButtonTextColor || "#ffffff",
                }}
                className="mt-4 w-full rounded-md px-3 py-2 text-xs font-semibold shadow-xs transition hover:opacity-90"
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
            className={`flex flex-col sm:flex-row items-center justify-between px-8 py-6 text-sm gap-4 h-full w-full ${
              !component.backgroundColor ? "bg-slate-900 text-slate-400" : ""
            }`}
          >
            <div>{component.copyright || "© 2026 CodeXel Inc."}</div>
            <div className="flex gap-6">
              <span>{component.footerLink1 || "Privacy"}</span>
              <span>{component.footerLink2 || "Terms"}</span>
            </div>
          </footer>
        );

      case "heading":
        return (
          <div style={style} className="p-6 h-full w-full">
            <h2 className="text-2xl font-bold">{component.title || "Custom Heading"}</h2>
            {component.subtitle && (
              <p className="mt-2 opacity-80 leading-relaxed">{component.subtitle}</p>
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

        const shadowMap = {
          none: "none",
          sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        };

        return (
          <div className={`p-2 flex ${alignMap[component.btnAlign || "left"]} w-full h-full`}>
            <a
              href={component.link || "#"}
              onClick={(e) => e.preventDefault()}
              style={{
                backgroundColor: component.btnBgColor || "#2563eb",
                color: component.btnTextColor || "#ffffff",
                paddingLeft: `${component.btnPaddingX ?? 20}px`,
                paddingRight: `${component.btnPaddingX ?? 20}px`,
                paddingTop: `${component.btnPaddingY ?? 10}px`,
                paddingBottom: `${component.btnPaddingY ?? 10}px`,
                borderRadius: `${component.borderRadius ?? 6}px`,
                fontSize: component.fontSize ? `${component.fontSize}px` : undefined,
                fontWeight: component.fontWeight || "600",
                boxShadow: component.boxShadow ? shadowMap[component.boxShadow] : undefined,
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
          <div style={style} className="p-6 h-full w-full">
            <h3 className="text-xl font-bold">{component.cardTitle || component.title || "Card Title"}</h3>
            <p className="mt-2 opacity-80 leading-relaxed">{component.cardContent || component.content || "Card content."}</p>
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
            className="space-y-4 p-8 h-full w-full"
          >
            {component.formTitle && <h3 className="text-xl font-bold">{component.formTitle}</h3>}
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                type="text"
                placeholder={component.namePlaceholder || "Enter your name"}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder={component.emailPlaceholder || "Enter your email"}
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
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
      className="relative flex-1 overflow-y-auto bg-slate-100 p-6"
      onDragOver={handleOuterDragOver}
      onDrop={handleOuterDrop}
    >
      <div
        ref={containerRef}
        className="mx-auto min-h-full max-w-5xl shadow-sm border border-gray-200 bg-white"
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
              const isSelected = selectedComponent === compKey;
              const isBeingDragged = draggedIndex === index;
              const isDropTarget = dropIndicator?.index === index && draggedIndex !== index;
              const isAutoWidth = component.width === "auto";
              const hasShadow = component.boxShadow && component.boxShadow !== "none";

              return (
                <div
                  key={compKey}
                  style={{
                    width: isAutoWidth ? "auto" : component.width || "100%",
                    flexGrow: isAutoWidth ? 0 : undefined,
                    flexShrink: 0,
                    // Elevates elements with shadows or when selected so shadows render over following sections
                    zIndex: isSelected ? 30 : hasShadow ? 10 : 1,
                  }}
                  className={`group relative transition-all ${
                    isSelected ? "ring-2 ring-blue-500 ring-inset" : ""
                  } ${isBeingDragged ? "opacity-30 scale-[0.98]" : "opacity-100"} ${
                    isDropTarget && dropIndicator?.position === "before"
                      ? "border-l-4 border-l-blue-600"
                      : ""
                  } ${
                    isDropTarget && dropIndicator?.position === "after"
                      ? "border-r-4 border-r-blue-600"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (setSelectedComponent) setSelectedComponent(compKey);
                  }}
                  onDragOver={(e) => handleItemDragOver(e, index)}
                  onDrop={(e) => handleItemDrop(e, index)}
                >
                  {/* Grip Handle for Moving */}
                  <div
                    draggable
                    onDragStart={(e) => handleGripDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    className="absolute left-2 top-2 z-30 flex h-6 w-6 cursor-grab active:cursor-grabbing items-center justify-center rounded bg-white/90 text-gray-500 shadow-md border border-gray-200 opacity-0 transition group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-600 backdrop-blur-xs"
                    title="Drag to reposition component"
                  >
                    <FaGripVertical className="text-[10px]" />
                  </div>

                  {/* Delete Button & Width Badge */}
                  {isSelected && (
                    <div className="absolute right-2 top-2 z-30 flex items-center gap-1.5 bg-white/90 px-1.5 py-1 rounded shadow-md border border-gray-200 backdrop-blur-xs text-xs">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        {component.width || "100%"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, compKey)}
                        className="flex h-5 w-5 items-center justify-center rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                        title="Delete Component"
                      >
                        <FaTrash className="pointer-events-none text-[10px]" />
                      </button>
                    </div>
                  )}

                  {/* Inner Component Markup */}
                  <div className="w-full h-full">{renderComponent(component)}</div>

                  {/* Right Boundary Resize Handle */}
                  {isSelected && (
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

                  {/* Bottom Boundary Resize Handle */}
                  {isSelected && (
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