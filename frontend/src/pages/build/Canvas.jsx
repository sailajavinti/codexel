import {
  FaImage,
  FaTrash,
} from "react-icons/fa";

function Canvas({
  components = [],
  selectedComponent,
  setSelectedComponent,
  onDropComponent,
  onDeleteComponent,
  onMoveComponent,
}) {
  const getComponentStyle = (
    component
  ) => {
    return {
      backgroundColor:
        component.backgroundColor ||
        undefined,

      color:
        component.textColor ||
        undefined,

      fontSize: component.fontSize
        ? `${component.fontSize}px`
        : undefined,

      padding: component.padding
        ? `${component.padding}px`
        : undefined,

      margin: component.margin
        ? `${component.margin}px`
        : undefined,

      borderRadius:
        component.borderRadius
          ? `${component.borderRadius}px`
          : undefined,

      textAlign:
        component.textAlign ||
        undefined,

      fontWeight:
        component.fontWeight ||
        undefined,
    };
  };

  const handleDelete = (
    e,
    id
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDeleteComponent) {
      onDeleteComponent(id);
    }
  };

  const renderComponent = (
    component
  ) => {
    const style =
      getComponentStyle(
        component
      );

    switch (component.type) {
      /* =========================
         NAVBAR
      ========================== */
      case "navbar":
        return (
          <nav
            style={style}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
          >
            <div className="text-xl font-bold">
              {component.brand ||
                "Brand"}
            </div>

            <div className="flex gap-6 text-sm">
              <span>
                {component.home ||
                  "Home"}
              </span>

              <span>
                {component.about ||
                  "About"}
              </span>

              <span>
                {component.contact ||
                  "Contact"}
              </span>
            </div>
          </nav>
        );

      /* =========================
         HERO
      ========================== */
      case "hero":
        return (
          <section
            style={style}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white"
          >
            <h1 className="text-4xl font-bold">
              {component.heading ||
                "Your Hero Heading"}
            </h1>

            <p className="mt-4 max-w-2xl text-blue-100">
              {component.description ||
                "Your hero description goes here."}
            </p>

            <button
              type="button"
              className="mt-6 rounded-lg bg-white px-5 py-3 font-semibold text-blue-600"
            >
              {component.buttonText ||
                "Get Started"}
            </button>
          </section>
        );

      /* =========================
         SECTION
      ========================== */
      case "section":
        return (
          <section
            style={style}
            className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            <p className="text-gray-700">
              {component.content ||
                "This is a section. Add your content here."}
            </p>
          </section>
        );

      /* =========================
         IMAGE
      ========================== */
      case "image":
        return (
          <div
            style={{
              ...style,
              overflow: "hidden",
            }}
            className="rounded-xl border border-gray-200 bg-gray-100"
          >
            {component.src ? (
              <div
                style={{
                  width:
                    component.imageWidth
                      ? `${component.imageWidth}px`
                      : "100%",

                  height:
                    component.imageHeight
                      ? `${component.imageHeight}px`
                      : "auto",

                  margin:
                    component.imageAlign ===
                    "center"
                      ? "0 auto"
                      : component.imageAlign ===
                        "right"
                      ? "0 0 0 auto"
                      : undefined,
                }}
              >
                <img
                  src={component.src}
                  alt={
                    component.alt ||
                    "Uploaded image"
                  }
                  style={{
                    width: "100%",

                    height:
                      component.imageHeight
                        ? "100%"
                        : "auto",

                    objectFit:
                      component.objectFit ||
                      "cover",
                  }}
                  className="block"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center">
                <div className="text-center text-gray-400">
                  <FaImage className="mx-auto text-3xl" />

                  <p className="mt-2 text-sm">
                    Upload an image from
                    Properties
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      /* =========================
         CARD
      ========================== */
      case "card":
        return (
          <div
            style={style}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-900">
              {component.title ||
                "Card Title"}
            </h3>

            <p className="mt-3 text-gray-600">
              {component.content ||
                "Card content goes here."}
            </p>
          </div>
        );

      /* =========================
         BUTTON
      ========================== */
      case "button":
        return (
          <div style={style}>
            <a
              href={
                component.link || "#"
              }
              onClick={(e) =>
                e.preventDefault()
              }
              className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {component.text ||
                "Click Me"}
            </a>
          </div>
        );

      /* =========================
         FORM
      ========================== */
      case "form":
        return (
          <form
            style={style}
            onSubmit={(e) =>
              e.preventDefault()
            }
            className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                placeholder={
                  component.namePlaceholder ||
                  "Enter your name"
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder={
                  component.emailPlaceholder ||
                  "Enter your email"
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        );

      /* =========================
         DEFAULT
      ========================== */
      default:
        return (
          <div
            style={style}
            className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center"
          >
            <p className="text-gray-500">
              {component.name ||
                component.type}
            </p>
          </div>
        );
    }
  };

  return (
    <main className="relative flex-1 overflow-y-auto bg-slate-100 p-6">
      <div className="mx-auto min-h-full max-w-5xl">
        {components.length ===
        0 ? (
          <div
            onDragOver={(e) =>
              e.preventDefault()
            }
            onDrop={(e) => {
              e.preventDefault();

              const componentData =
                e.dataTransfer.getData(
                  "component"
                );

              if (componentData) {
                try {
                  const component =
                    JSON.parse(
                      componentData
                    );

                  if (
                    onDropComponent
                  ) {
                    onDropComponent(
                      component
                    );
                  }
                } catch (error) {
                  console.error(
                    "Invalid component data:",
                    error
                  );
                }
              }
            }}
            className="flex min-h-[500px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white"
          >
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-500">
                Start building your website
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Drag components here
                or click a component
                from the panel
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {components.map(
              (component, index) => {
                const compKey =
                  component.id ||
                  component._id;

                const isSelected =
                  selectedComponent ===
                  compKey;

                const isFirst =
                  index === 0;

                const isLast =
                  index ===
                  components.length -
                    1;

                return (
                  <div
                    key={compKey}
                    className={`group relative rounded-xl transition-all ${
                      isSelected
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (
                        setSelectedComponent
                      ) {
                        setSelectedComponent(
                          compKey
                        );
                      }
                    }}
                    onDragOver={(e) =>
                      e.preventDefault()
                    }
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const componentData =
                        e.dataTransfer.getData(
                          "component"
                        );

                      if (
                        componentData
                      ) {
                        try {
                          const newComponent =
                            JSON.parse(
                              componentData
                            );

                          if (
                            onDropComponent
                          ) {
                            onDropComponent(
                              newComponent
                            );
                          }
                        } catch (error) {
                          console.error(
                            "Invalid component data:",
                            error
                          );
                        }
                      }
                    }}
                  >
                    {/* =========================
                        COMPONENT CONTROLS
                    ========================== */}
                    {isSelected && (
                      <div className="absolute -right-3 -top-3 z-30 flex gap-1">
                        {/* MOVE UP */}
                        <button
                          type="button"
                          disabled={
                            isFirst
                          }
                          onClick={(
                            e
                          ) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (
                              !isFirst &&
                              onMoveComponent
                            ) {
                              onMoveComponent(
                                compKey,
                                "up"
                              );
                            }
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white text-lg shadow-md transition ${
                            isFirst
                              ? "cursor-not-allowed border-gray-200 text-gray-300"
                              : "border-gray-200 text-blue-600 hover:bg-blue-50"
                          }`}
                          title="Move Up"
                        >
                          ↑
                        </button>

                        {/* MOVE DOWN */}
                        <button
                          type="button"
                          disabled={
                            isLast
                          }
                          onClick={(
                            e
                          ) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (
                              !isLast &&
                              onMoveComponent
                            ) {
                              onMoveComponent(
                                compKey,
                                "down"
                              );
                            }
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white text-lg shadow-md transition ${
                            isLast
                              ? "cursor-not-allowed border-gray-200 text-gray-300"
                              : "border-gray-200 text-blue-600 hover:bg-blue-50"
                          }`}
                          title="Move Down"
                        >
                          ↓
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={(e) =>
                            handleDelete(
                              e,
                              compKey
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-red-500 shadow-md transition hover:bg-red-50 hover:text-red-700"
                          title="Delete Component"
                        >
                          <FaTrash className="pointer-events-none text-xs" />
                        </button>
                      </div>
                    )}

                    {/* COMPONENT */}
                    {renderComponent(
                      component
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Canvas;
