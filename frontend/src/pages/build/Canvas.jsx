import { useState, useRef } from "react";
import { FaTrash, FaGripVertical, FaCopy } from "react-icons/fa";
import { renderComponentOnCanvas, HOVER_EFFECT_MAP } from "./components/renderers";

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
      margin: component.margin !== undefined && component.margin !== "" ? `${component.margin}px` : 0,
      borderRadius: isButton ? undefined : `${component.borderRadius ?? 0}px`,
      borderWidth: isButton ? undefined : component.borderWidth ? `${component.borderWidth}px` : undefined,
      borderStyle: isButton ? undefined : component.borderStyle || (component.borderWidth ? "solid" : undefined),
      borderColor: isButton ? undefined : component.borderColor || undefined,
      boxShadow: isButton ? undefined : component.boxShadow ? SHADOW_MAP[component.boxShadow] : undefined,
      minHeight: component.minHeight ? `${component.minHeight}px` : undefined,
      opacity: component.opacity !== undefined && component.opacity !== "" ? component.opacity / 100 : undefined,
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

  return (
    <main
      className={`relative flex-1 overflow-y-auto p-6 transition-all duration-300 ${
        isPreviewMode ? "bg-slate-200/70" : "bg-slate-100"
      }`}
      onDragOver={(e) => {
        if (!isPreviewMode) e.preventDefault();
      }}
      onDrop={(e) => {
        if (isPreviewMode) return;
        e.preventDefault();
        const raw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("component");
        if (raw && onDropComponent) {
          try {
            onDropComponent(JSON.parse(raw));
          } catch (err) {
            console.error(err);
          }
        }
      }}
      onClick={() => {
        if (!isPreviewMode && setSelectedComponent) setSelectedComponent(null);
      }}
    >
      <div
        ref={containerRef}
        className={`mx-auto min-h-full transition-all duration-300 shadow-sm border border-gray-200 bg-white ${
          VIEWPORT_WIDTHS[viewportMode] || "max-w-5xl"
        } ${isPreviewMode ? "shadow-2xl rounded-lg overflow-hidden my-4" : ""}`}
      >
        {components.length === 0 ? (
          <div className="flex min-h-[500px] items-center justify-center p-8 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-500">Start building your website</p>
              <p className="mt-2 text-sm text-gray-400">Drag components here or click from the panel</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap content-start">
            {components.map((comp, index) => {
              const compKey = comp.id || comp._id;
              const isSelected =
                !isPreviewMode &&
                selectedComponent &&
                (selectedComponent === compKey ||
                  String(selectedComponent) === String(comp.id) ||
                  String(selectedComponent) === String(comp._id));

              const isBeingDragged = !isPreviewMode && draggedIndex === index;
              const isDropTarget = !isPreviewMode && dropIndicator?.index === index && draggedIndex !== index;
              const isAutoWidth = comp.width === "auto";

              return (
                <div
                  key={compKey}
                  data-comp-id={compKey}
                  style={{
                    width: isAutoWidth ? "auto" : comp.width || "100%",
                    flexGrow: isAutoWidth ? 0 : undefined,
                    flexShrink: 0,
                    zIndex: isSelected ? 30 : 1,
                  }}
                  className={`group relative transition-all ${
                    isBeingDragged ? "opacity-30 scale-[0.98]" : "opacity-100"
                  } ${
                    isDropTarget && dropIndicator?.position === "before" ? "border-l-4 border-l-blue-600" : ""
                  } ${
                    isDropTarget && dropIndicator?.position === "after" ? "border-r-4 border-r-blue-600" : ""
                  }`}
                  onClick={(e) => {
                    if (isPreviewMode) return;
                    e.stopPropagation();
                    if (setSelectedComponent) setSelectedComponent(compKey);
                  }}
                  onDragOver={(e) => {
                    if (isPreviewMode) return;
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setDropIndicator({
                      index,
                      position: e.clientX < rect.left + rect.width / 2 ? "before" : "after",
                    });
                  }}
                  onDrop={(e) => {
                    if (isPreviewMode) return;
                    e.preventDefault();
                    e.stopPropagation();
                    if (draggedIndex !== null && onReorderComponents && draggedIndex !== index) {
                      onReorderComponents(draggedIndex, index);
                    }
                    setDraggedIndex(null);
                    setDropIndicator(null);
                  }}
                >
                  {isSelected && (
                    <div className="pointer-events-none absolute inset-0 z-20 border-2 border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]" />
                  )}

                  {!isPreviewMode && (
                    <div
                      draggable
                      onDragStart={(e) => {
                        setDraggedIndex(index);
                        e.dataTransfer.setData("text/plain", `${index}`);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDropIndicator(null);
                      }}
                      className="absolute left-2 top-2 z-30 flex h-6 w-6 cursor-grab active:cursor-grabbing items-center justify-center rounded bg-white/90 text-gray-500 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-600 transition"
                      title="Drag to reposition"
                    >
                      <FaGripVertical className="text-[10px]" />
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute right-2 top-2 z-30 flex items-center gap-1.5 bg-white/95 px-1.5 py-1 rounded shadow-md border border-gray-200 text-xs">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{comp.width || "100%"}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDuplicateComponent) onDuplicateComponent(compKey);
                        }}
                        className="p-1 hover:text-blue-600 transition"
                        title="Duplicate"
                      >
                        <FaCopy className="text-[10px]" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDeleteComponent) onDeleteComponent(compKey);
                        }}
                        className="p-1 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>
                  )}

                  <div className="w-full h-full">
                    {renderComponentOnCanvas({
                      component: comp,
                      style: getComponentStyle(comp),
                      customFontSize: comp.fontSize ? Number(comp.fontSize) : null,
                      customWeight: comp.fontWeight,
                      hoverClass: HOVER_EFFECT_MAP[comp.hoverEffect || "none"] || "",
                      isPreviewMode,
                      onNavigatePage,
                    })}
                  </div>

                  {isSelected && (
                    <>
                      <div
                        onMouseDown={(e) => handleWidthResizeMouseDown(e, compKey, comp.width)}
                        className="absolute right-0 top-0 bottom-0 w-2.5 cursor-ew-resize hover:bg-blue-500/30 flex items-center justify-center z-30"
                      >
                        <div className="h-8 w-1 bg-blue-500 rounded-full" />
                      </div>
                      <div
                        onMouseDown={(e) => handleHeightResizeMouseDown(e, compKey, comp.minHeight)}
                        className="absolute left-0 right-0 bottom-0 h-2.5 cursor-ns-resize hover:bg-blue-500/30 flex items-center justify-center z-30"
                      >
                        <div className="w-8 h-1 bg-blue-500 rounded-full" />
                      </div>
                    </>
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