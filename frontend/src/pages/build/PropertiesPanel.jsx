import { useState } from "react";

function PropertiesPanel({
  components = [],
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
}) {
  const selected = components.find(
    (component) =>
      (component.id || component._id) === selectedComponent
  );

  const updateProperty = (property, value) => {
    if (!selected || !onUpdateComponent) return;

    onUpdateComponent(selected.id || selected._id, {
      [property]: value,
    });
  };

  if (!selected) {
    return (
      <aside className="w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-800">
          Properties
        </h2>

        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            Select a component on the canvas to edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white">
      {/* HEADER */}
      <div className="border-b border-gray-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Selected Component
        </p>

        <h2 className="mt-1 text-xl font-bold capitalize text-slate-800">
          {selected.type}
        </h2>
      </div>

      <div className="space-y-6 p-5">

        {/* ================= CONTENT ================= */}

        <section>
          <h3 className="mb-4 text-sm font-bold text-slate-800">
            Content
          </h3>

          {/* NAVBAR */}
          {selected.type === "navbar" && (
            <div className="space-y-4">
              <Field
                label="Brand Name"
                value={selected.brand || ""}
                onChange={(value) =>
                  updateProperty("brand", value)
                }
                placeholder="Your Brand"
              />

              <Field
                label="Home"
                value={selected.home || ""}
                onChange={(value) =>
                  updateProperty("home", value)
                }
                placeholder="Home"
              />

              <Field
                label="About"
                value={selected.about || ""}
                onChange={(value) =>
                  updateProperty("about", value)
                }
                placeholder="About"
              />

              <Field
                label="Contact"
                value={selected.contact || ""}
                onChange={(value) =>
                  updateProperty("contact", value)
                }
                placeholder="Contact"
              />
            </div>
          )}

          {/* HERO */}
          {selected.type === "hero" && (
            <div className="space-y-4">
              <Field
                label="Heading"
                value={selected.heading || ""}
                onChange={(value) =>
                  updateProperty("heading", value)
                }
                placeholder="Enter heading"
              />

              <TextArea
                label="Description"
                value={selected.description || ""}
                onChange={(value) =>
                  updateProperty("description", value)
                }
                placeholder="Enter description"
              />

              <Field
                label="Button Text"
                value={selected.buttonText || ""}
                onChange={(value) =>
                  updateProperty("buttonText", value)
                }
                placeholder="Get Started"
              />
            </div>
          )}

          {/* SECTION */}
          {selected.type === "section" && (
            <div className="space-y-4">
              <Field
                label="Heading"
                value={selected.heading || ""}
                onChange={(value) =>
                  updateProperty("heading", value)
                }
                placeholder="Section heading"
              />

              <TextArea
                label="Content"
                value={selected.content || ""}
                onChange={(value) =>
                  updateProperty("content", value)
                }
                placeholder="Enter section content"
              />
            </div>
          )}

          {/* BUTTON */}
          {selected.type === "button" && (
            <div className="space-y-4">
              <Field
                label="Button Text"
                value={selected.text || ""}
                onChange={(value) =>
                  updateProperty("text", value)
                }
                placeholder="Click Me"
              />

              <Field
                label="Link"
                value={selected.link || ""}
                onChange={(value) =>
                  updateProperty("link", value)
                }
                placeholder="https://example.com"
              />
            </div>
          )}

          {/* ================= IMAGE ================= */}

          {selected.type === "image" && (
            <div className="space-y-5">

              {/* UPLOAD */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Upload Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <div className="text-2xl text-blue-500">
                    🖼️
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    Choose an image
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, JPEG, WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      if (!file.type.startsWith("image/")) {
                        alert("Please select an image file.");
                        return;
                      }

                      const reader = new FileReader();

                      reader.onload = () => {
                        const img = new Image();

                        img.onload = () => {
                          const MAX_WIDTH = 1200;
                          const MAX_HEIGHT = 1200;

                          let width = img.width;
                          let height = img.height;

                          // Resize large images
                          if (
                            width > MAX_WIDTH ||
                            height > MAX_HEIGHT
                          ) {
                            const widthRatio =
                              MAX_WIDTH / width;

                            const heightRatio =
                              MAX_HEIGHT / height;

                            const ratio = Math.min(
                              widthRatio,
                              heightRatio
                            );

                            width = Math.round(
                              width * ratio
                            );

                            height = Math.round(
                              height * ratio
                            );
                          }

                          const canvas =
                            document.createElement(
                              "canvas"
                            );

                          canvas.width = width;
                          canvas.height = height;

                          const ctx =
                            canvas.getContext("2d");

                          if (!ctx) {
                            alert(
                              "Unable to process image."
                            );
                            return;
                          }

                          ctx.drawImage(
                            img,
                            0,
                            0,
                            width,
                            height
                          );

                          // Compress image before saving
                          const compressedImage =
                            canvas.toDataURL(
                              "image/jpeg",
                              0.7
                            );

                          updateProperty(
                            "src",
                            compressedImage
                          );

                          updateProperty(
                            "imageName",
                            file.name
                          );
                        };

                        img.onerror = () => {
                          alert(
                            "Unable to load the selected image."
                          );
                        };

                        img.src = reader.result;
                      };

                      reader.readAsDataURL(file);

                      // Allow selecting the same image again
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {/* IMAGE NAME */}
              {selected.imageName && (
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-xs font-semibold text-green-700">
                    Uploaded Image
                  </p>

                  <p className="mt-1 truncate text-xs text-green-600">
                    {selected.imageName}
                  </p>
                </div>
              )}

              {/* URL */}
              <Field
                label="Image URL"
                value={
                  selected.src &&
                  !selected.src.startsWith("data:")
                    ? selected.src
                    : ""
                }
                onChange={(value) =>
                  updateProperty("src", value)
                }
                placeholder="https://example.com/image.jpg"
              />

              {/* ALT */}
              <Field
                label="Alt Text"
                value={selected.alt || ""}
                onChange={(value) =>
                  updateProperty("alt", value)
                }
                placeholder="Describe the image"
              />

              {/* WIDTH */}
              <NumberField
                label="Image Width"
                value={selected.imageWidth || ""}
                onChange={(value) =>
                  updateProperty(
                    "imageWidth",
                    value
                  )
                }
                placeholder="100"
                unit="%"
              />

              {/* HEIGHT */}
              <NumberField
                label="Image Height"
                value={selected.imageHeight || ""}
                onChange={(value) =>
                  updateProperty(
                    "imageHeight",
                    value
                  )
                }
                placeholder="300"
                unit="px"
              />

              {/* OBJECT FIT */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Image Fit
                </label>

                <select
                  value={
                    selected.objectFit || "cover"
                  }
                  onChange={(e) =>
                    updateProperty(
                      "objectFit",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="cover">
                    Cover
                  </option>

                  <option value="contain">
                    Contain
                  </option>

                  <option value="fill">
                    Fill
                  </option>

                  <option value="none">
                    Original Size
                  </option>
                </select>
              </div>

              {/* ALIGNMENT */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Image Alignment
                </label>

                <select
                  value={
                    selected.imageAlign || "center"
                  }
                  onChange={(e) =>
                    updateProperty(
                      "imageAlign",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="left">
                    Left
                  </option>

                  <option value="center">
                    Center
                  </option>

                  <option value="right">
                    Right
                  </option>
                </select>
              </div>

              {/* PREVIEW */}
              {selected.src && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-600">
                    Preview
                  </p>

                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 p-2">
                    <img
                      src={selected.src}
                      alt={
                        selected.alt ||
                        "Preview"
                      }
                      className="h-40 w-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CARD */}
          {selected.type === "card" && (
            <div className="space-y-4">
              <Field
                label="Title"
                value={selected.title || ""}
                onChange={(value) =>
                  updateProperty("title", value)
                }
                placeholder="Card Title"
              />

              <TextArea
                label="Description"
                value={selected.description || ""}
                onChange={(value) =>
                  updateProperty(
                    "description",
                    value
                  )
                }
                placeholder="Card description"
              />

              <Field
                label="Button Text"
                value={selected.buttonText || ""}
                onChange={(value) =>
                  updateProperty(
                    "buttonText",
                    value
                  )
                }
                placeholder="Learn More"
              />
            </div>
          )}

          {/* FORM */}
          {selected.type === "form" && (
            <div className="space-y-4">
              <Field
                label="Form Title"
                value={selected.title || ""}
                onChange={(value) =>
                  updateProperty("title", value)
                }
                placeholder="Contact Form"
              />

              <Field
                label="Name Placeholder"
                value={
                  selected.namePlaceholder || ""
                }
                onChange={(value) =>
                  updateProperty(
                    "namePlaceholder",
                    value
                  )
                }
                placeholder="Your Name"
              />

              <Field
                label="Email Placeholder"
                value={
                  selected.emailPlaceholder || ""
                }
                onChange={(value) =>
                  updateProperty(
                    "emailPlaceholder",
                    value
                  )
                }
                placeholder="Your Email"
              />

              <Field
                label="Button Text"
                value={
                  selected.buttonText || ""
                }
                onChange={(value) =>
                  updateProperty(
                    "buttonText",
                    value
                  )
                }
                placeholder="Submit"
              />
            </div>
          )}
        </section>

        {/* ================= STYLING ================= */}

        <section className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-sm font-bold text-slate-800">
            Styling
          </h3>

          <div className="space-y-4">

            {/* BACKGROUND */}
            <ColorField
              label="Background Color"
              value={
                selected.backgroundColor ||
                "#ffffff"
              }
              onChange={(value) =>
                updateProperty(
                  "backgroundColor",
                  value
                )
              }
            />

            {/* TEXT COLOR */}
            <ColorField
              label="Text Color"
              value={
                selected.textColor ||
                "#1e293b"
              }
              onChange={(value) =>
                updateProperty(
                  "textColor",
                  value
                )
              }
            />

            {/* FONT SIZE */}
            <NumberField
              label="Font Size"
              value={
                selected.fontSize || ""
              }
              onChange={(value) =>
                updateProperty(
                  "fontSize",
                  value
                )
              }
              placeholder="16"
              unit="px"
            />

            {/* BORDER RADIUS */}
            <NumberField
              label="Border Radius"
              value={
                selected.borderRadius || ""
              }
              onChange={(value) =>
                updateProperty(
                  "borderRadius",
                  value
                )
              }
              placeholder="12"
              unit="px"
            />

            {/* PADDING */}
            <NumberField
              label="Padding"
              value={
                selected.padding || ""
              }
              onChange={(value) =>
                updateProperty(
                  "padding",
                  value
                )
              }
              placeholder="20"
              unit="px"
            />

            {/* MARGIN */}
            <NumberField
              label="Margin"
              value={
                selected.margin || ""
              }
              onChange={(value) =>
                updateProperty(
                  "margin",
                  value
                )
              }
              placeholder="10"
              unit="px"
            />

            {/* TEXT ALIGN */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-600">
                Text Alignment
              </label>

              <select
                value={
                  selected.textAlign ||
                  "left"
                }
                onChange={(e) =>
                  updateProperty(
                    "textAlign",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="left">
                  Left
                </option>

                <option value="center">
                  Center
                </option>

                <option value="right">
                  Right
                </option>
              </select>
            </div>

            {/* FONT WEIGHT */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-600">
                Font Weight
              </label>

              <select
                value={
                  selected.fontWeight ||
                  "normal"
                }
                onChange={(e) =>
                  updateProperty(
                    "fontWeight",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="normal">
                  Normal
                </option>

                <option value="500">
                  Medium
                </option>

                <option value="600">
                  Semi Bold
                </option>

                <option value="700">
                  Bold
                </option>

                <option value="800">
                  Extra Bold
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* DELETE */}

        <section className="border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() =>
              onDeleteComponent &&
              onDeleteComponent(
                selected.id ||
                  selected._id
              )
            }
            className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Delete Component
          </button>
        </section>
      </div>
    </aside>
  );
}

/* =========================================
   TEXT FIELD
========================================= */

function Field({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* =========================================
   TEXT AREA
========================================= */

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* =========================================
   NUMBER FIELD
========================================= */

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  unit,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
        />

        <span className="flex items-center bg-gray-50 px-3 text-xs text-gray-500">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* =========================================
   COLOR FIELD
========================================= */

function ColorField({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
        />

        <input
          type="text"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}

export default PropertiesPanel;