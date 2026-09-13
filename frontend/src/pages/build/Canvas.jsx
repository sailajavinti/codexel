import { useState } from "react";
import { FaImage, FaTrash, FaGripVertical } from "react-icons/fa";

function Canvas({
  components = [],
  selectedComponent,
  setSelectedComponent,
  onDropComponent,
  onDeleteComponent,
  onReorderComponents,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null); // { index, position: 'before' | 'after' }

  const getComponentStyle = (component) => {
    const shadowMap = {
      none: "none",
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    };

    return {
      backgroundColor: component.backgroundColor || undefined,
      color: component.textColor || undefined,
      fontSize: component.fontSize ? `${component.fontSize}px` : undefined,
      padding:
        component.padding !== undefined && component.padding !== ""
          ? `${component.padding}px`
          : undefined,
      margin:
        component.margin !== undefined && component.margin !== ""
          ? `${component.margin}px`
          : 0,
      borderRadius: `${component.borderRadius ?? 0}px`,
      textAlign: component.textAlign || undefined,
      fontWeight: component.fontWeight || undefined,
      borderWidth: component.borderWidth ? `${component.borderWidth}px` : undefined,
      borderStyle: component.borderStyle || (component.borderWidth ? "solid" : undefined),
      borderColor: component.borderColor || undefined,
      boxShadow: component.boxShadow ? shadowMap[component.boxShadow] : undefined,
      opacity:
        component.opacity !== undefined && component.opacity !== ""
          ? component.opacity / 100
          : undefined,
    };
  };

  // --- Outer Container Drop (From Sidebar Only) ---
  const handleOuterDragOver = (e) => {
    e.preventDefault();
    if (draggedIndex === null) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleOuterDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If reordering existing items, let item handlers process it
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
    const hoverMiddleY = rect.top + rect.height / 2;
    const isAbove = e.clientY < hoverMiddleY;

    setDropIndicator({
      index,
      position: isAbove ? "before" : "after",
    });
  };

  const handleItemDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    // If dropped from sidebar on top of a component
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
            className="flex items-center justify-between px-8 py-4"
          >
            <div className="text-xl font-bold">{component.brand || "Brand"}</div>
            <div className="flex gap-6 text-sm font-medium opacity-85">
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
            className={`p-12 ${
              !component.backgroundColor
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : ""
            }`}
          >
            <h1 className="text-4xl font-extrabold tracking-tight">
              {component.heading || "Your Hero Heading"}
            </h1>
            <p className="mt-4 max-w-2xl opacity-90 leading-relaxed">
              {component.description || "Your hero description goes here."}
            </p>
            <button
              type="button"
              className="mt-6 rounded-md bg-white px-6 py-3 font-semibold text-blue-600 shadow-sm"
            >
              {component.buttonText || "Get Started"}
            </button>
          </section>
        );

      case "section":
        return (
          <section style={style} className="p-10">
            {component.heading && (
              <h2 className="mb-3 text-2xl font-bold">{component.heading}</h2>
            )}
            <p className="opacity-90 leading-relaxed">
              {component.content || "This is a section. Add your content here."}
            </p>
          </section>
        );

      case "features":
        return (
          <section style={style} className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/5 p-6 rounded-sm border border-black/10">
                <h4 className="font-bold">
                  {component.featureTitle1 || "Feature 1"}
                </h4>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">
                  {component.featureDesc1 || "Feature description text."}
                </p>
              </div>
              <div className="bg-black/5 p-6 rounded-sm border border-black/10">
                <h4 className="font-bold">
                  {component.featureTitle2 || "Feature 2"}
                </h4>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">
                  {component.featureDesc2 || "Feature description text."}
                </p>
              </div>
              <div className="bg-black/5 p-6 rounded-sm border border-black/10">
                <h4 className="font-bold">
                  {component.featureTitle3 || "Feature 3"}
                </h4>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">
                  {component.featureDesc3 || "Feature description text."}
                </p>
              </div>
            </div>
          </section>
        );

      case "pricing":
        return (
          <section style={style} className="p-10">
            <div className="max-w-sm mx-auto border border-gray-200 p-8 text-center shadow-xs rounded-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {component.pricingPlan || "Pro"}
              </span>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold">
                  {component.pricingPrice || "$29"}
                </span>
                <span className="opacity-70 text-sm">
                  {component.pricingPeriod || "/ mo"}
                </span>
              </div>
              <ul className="mt-6 space-y-3 text-sm opacity-90 text-left border-t border-b border-gray-100 py-5">
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
                className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
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
            className={`flex flex-col sm:flex-row items-center justify-between px-8 py-8 text-sm gap-4 ${
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
          <div style={style} className="p-6">
            <h2 className="text-2xl font-bold">
              {component.title || "Custom Heading"}
            </h2>
            {component.subtitle && (
              <p className="mt-2 opacity-80 leading-relaxed">{component.subtitle}</p>
            )}
          </div>
        );

      case "divider":
        return (
          <div style={style} className="py-4 px-6">
            <hr
              style={{
                borderColor: component.dividerColor || "#e2e8f0",
                borderWidth: `${component.dividerThickness || 1}px`,
              }}
            />
          </div>
        );

      case "button":
        return (
          <div style={style} className="p-6">
            <a
              href={component.link || "#"}
              onClick={(e) => e.preventDefault()}
              className="inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {component.text || "Click Me"}
            </a>
          </div>
        );

      case "card":
        return (
          <div style={style} className="p-6">
            <h3 className="text-xl font-bold">
              {component.cardTitle || component.title || "Card Title"}
            </h3>
            <p className="mt-3 opacity-80 leading-relaxed">
              {component.cardContent || component.content || "Card content."}
            </p>
          </div>
        );

      case "image":
        return (
          <div style={{ ...style, overflow: "hidden" }}>
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
            className="space-y-4 p-8"
          >
            {component.formTitle && (
              <h3 className="text-xl font-bold">{component.formTitle}</h3>
            )}
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
          <div
            style={style}
            className="border border-dashed border-gray-300 p-8 text-center"
          >
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
          <div className="flex flex-col">
            {components.map((component, index) => {
              const compKey = component.id || component._id;
              const isSelected = selectedComponent === compKey;
              const isBeingDragged = draggedIndex === index;
              const isDropTarget = dropIndicator?.index === index && draggedIndex !== index;

              return (
                <div
                  key={compKey}
                  onDragOver={(e) => handleItemDragOver(e, index)}
                  onDrop={(e) => handleItemDrop(e, index)}
                  className={`group relative leading-none transition-all ${
                    isSelected ? "ring-2 ring-blue-500 ring-inset z-20" : ""
                  } ${isBeingDragged ? "opacity-35 scale-[0.99]" : "opacity-100"} ${
                    isDropTarget && dropIndicator?.position === "before"
                      ? "border-t-4 border-t-blue-600"
                      : ""
                  } ${
                    isDropTarget && dropIndicator?.position === "after"
                      ? "border-b-4 border-b-blue-600"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (setSelectedComponent) setSelectedComponent(compKey);
                  }}
                >
                  {/* Drag Reorder Handle */}
                  <div
                    draggable
                    onDragStart={(e) => handleGripDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    className="absolute left-3 top-3 z-30 flex h-7 w-7 cursor-grab active:cursor-grabbing items-center justify-center rounded bg-white/90 text-gray-500 shadow-md border border-gray-200 opacity-0 transition group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-600 backdrop-blur-xs"
                    title="Drag to reorder component"
                  >
                    <FaGripVertical className="text-xs" />
                  </div>

                  {/* Delete Button */}
                  {isSelected && (
                    <div className="absolute right-3 top-3 z-30 flex gap-1 bg-white/90 p-1 rounded-md shadow-md border border-gray-200 backdrop-blur-xs leading-normal">
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, compKey)}
                        className="flex h-7 w-7 items-center justify-center rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                        title="Delete Component"
                      >
                        <FaTrash className="pointer-events-none text-xs" />
                      </button>
                    </div>
                  )}

                  <div className="leading-normal">{renderComponent(component)}</div>
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