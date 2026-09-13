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
        <h2 className="text-lg font-bold text-slate-800">Properties</h2>
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            Select a component on the canvas to edit its properties and styles.
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
          <h3 className="mb-4 text-sm font-bold text-slate-800">Content</h3>

          {/* NAVBAR */}
          {selected.type === "navbar" && (
            <div className="space-y-4">
              <Field
                label="Brand Name"
                value={selected.brand || ""}
                onChange={(value) => updateProperty("brand", value)}
                placeholder="Your Brand"
              />
              <Field
                label="Home"
                value={selected.home || ""}
                onChange={(value) => updateProperty("home", value)}
                placeholder="Home"
              />
              <Field
                label="About"
                value={selected.about || ""}
                onChange={(value) => updateProperty("about", value)}
                placeholder="About"
              />
              <Field
                label="Contact"
                value={selected.contact || ""}
                onChange={(value) => updateProperty("contact", value)}
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
                onChange={(value) => updateProperty("heading", value)}
                placeholder="Enter heading"
              />
              <TextArea
                label="Description"
                value={selected.description || ""}
                onChange={(value) => updateProperty("description", value)}
                placeholder="Enter description"
              />
              <Field
                label="Button Text"
                value={selected.buttonText || ""}
                onChange={(value) => updateProperty("buttonText", value)}
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
                onChange={(value) => updateProperty("heading", value)}
                placeholder="Section heading"
              />
              <TextArea
                label="Content"
                value={selected.content || ""}
                onChange={(value) => updateProperty("content", value)}
                placeholder="Enter section content"
              />
            </div>
          )}

          {/* FEATURES GRID */}
          {selected.type === "features" && (
            <div className="space-y-4">
              <Field
                label="Feature 1 Title"
                value={selected.featureTitle1 || ""}
                onChange={(v) => updateProperty("featureTitle1", v)}
              />
              <Field
                label="Feature 1 Description"
                value={selected.featureDesc1 || ""}
                onChange={(v) => updateProperty("featureDesc1", v)}
              />
              <Field
                label="Feature 2 Title"
                value={selected.featureTitle2 || ""}
                onChange={(v) => updateProperty("featureTitle2", v)}
              />
              <Field
                label="Feature 2 Description"
                value={selected.featureDesc2 || ""}
                onChange={(v) => updateProperty("featureDesc2", v)}
              />
              <Field
                label="Feature 3 Title"
                value={selected.featureTitle3 || ""}
                onChange={(v) => updateProperty("featureTitle3", v)}
              />
              <Field
                label="Feature 3 Description"
                value={selected.featureDesc3 || ""}
                onChange={(v) => updateProperty("featureDesc3", v)}
              />
            </div>
          )}

          {/* PRICING TABLE */}
          {selected.type === "pricing" && (
            <div className="space-y-4">
              <Field
                label="Plan Name"
                value={selected.pricingPlan || ""}
                onChange={(v) => updateProperty("pricingPlan", v)}
              />
              <Field
                label="Price"
                value={selected.pricingPrice || ""}
                onChange={(v) => updateProperty("pricingPrice", v)}
              />
              <Field
                label="Billing Cycle"
                value={selected.pricingPeriod || ""}
                onChange={(v) => updateProperty("pricingPeriod", v)}
              />
              <TextArea
                label="Features (one per line)"
                value={selected.pricingFeatures || ""}
                onChange={(v) => updateProperty("pricingFeatures", v)}
              />
              <Field
                label="Button Text"
                value={selected.pricingButtonText || ""}
                onChange={(v) => updateProperty("pricingButtonText", v)}
              />
            </div>
          )}

          {/* FOOTER */}
          {selected.type === "footer" && (
            <div className="space-y-4">
              <Field
                label="Copyright Text"
                value={selected.copyright || ""}
                onChange={(v) => updateProperty("copyright", v)}
              />
              <Field
                label="Link 1"
                value={selected.footerLink1 || ""}
                onChange={(v) => updateProperty("footerLink1", v)}
              />
              <Field
                label="Link 2"
                value={selected.footerLink2 || ""}
                onChange={(v) => updateProperty("footerLink2", v)}
              />
            </div>
          )}

          {/* HEADING / TYPOGRAPHY */}
          {selected.type === "heading" && (
            <div className="space-y-4">
              <Field
                label="Heading Text"
                value={selected.title || ""}
                onChange={(v) => updateProperty("title", v)}
              />
              <TextArea
                label="Subtitle / Description"
                value={selected.subtitle || ""}
                onChange={(v) => updateProperty("subtitle", v)}
              />
            </div>
          )}

          {/* DIVIDER */}
          {selected.type === "divider" && (
            <div className="space-y-4">
              <ColorField
                label="Line Color"
                value={selected.dividerColor || "#e2e8f0"}
                onChange={(v) => updateProperty("dividerColor", v)}
              />
              <NumberField
                label="Thickness"
                value={selected.dividerThickness || "1"}
                onChange={(v) => updateProperty("dividerThickness", v)}
                unit="px"
              />
            </div>
          )}

          {/* BUTTON */}
          {selected.type === "button" && (
            <div className="space-y-4">
              <Field
                label="Button Text"
                value={selected.text || ""}
                onChange={(value) => updateProperty("text", value)}
                placeholder="Click Me"
              />
              <Field
                label="Link"
                value={selected.link || ""}
                onChange={(value) => updateProperty("link", value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          {/* IMAGE */}
          {selected.type === "image" && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Upload Image
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <div className="text-2xl text-blue-500">🖼️</div>
                  <p className="mt-2 text-sm font-semibold text-gray-700">Choose an image</p>
                  <p className="mt-1 text-xs text-gray-400">PNG, JPG, JPEG, WEBP</p>
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

                          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                            width = Math.round(width * ratio);
                            height = Math.round(height * ratio);
                          }

                          const canvas = document.createElement("canvas");
                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext("2d");
                          if (!ctx) return;

                          ctx.drawImage(img, 0, 0, width, height);
                          const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

                          updateProperty("src", compressedImage);
                          updateProperty("imageName", file.name);
                        };
                        img.src = reader.result;
                      };
                      reader.readAsDataURL(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {selected.imageName && (
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-xs font-semibold text-green-700">Uploaded Image</p>
                  <p className="mt-1 truncate text-xs text-green-600">{selected.imageName}</p>
                </div>
              )}

              <Field
                label="Image URL"
                value={selected.src && !selected.src.startsWith("data:") ? selected.src : ""}
                onChange={(value) => updateProperty("src", value)}
                placeholder="https://example.com/image.jpg"
              />
              <Field
                label="Alt Text"
                value={selected.alt || ""}
                onChange={(value) => updateProperty("alt", value)}
                placeholder="Describe the image"
              />
              <NumberField
                label="Image Width"
                value={selected.imageWidth || ""}
                onChange={(value) => updateProperty("imageWidth", value)}
                placeholder="100"
                unit="%"
              />
              <NumberField
                label="Image Height"
                value={selected.imageHeight || ""}
                onChange={(value) => updateProperty("imageHeight", value)}
                placeholder="300"
                unit="px"
              />
            </div>
          )}

          {/* CARD */}
          {selected.type === "card" && (
            <div className="space-y-4">
              <Field
                label="Title"
                value={selected.cardTitle || selected.title || ""}
                onChange={(value) => updateProperty("cardTitle", value)}
                placeholder="Card Title"
              />
              <TextArea
                label="Description"
                value={selected.cardContent || selected.content || ""}
                onChange={(value) => updateProperty("cardContent", value)}
                placeholder="Card description"
              />
            </div>
          )}

          {/* FORM */}
          {selected.type === "form" && (
            <div className="space-y-4">
              <Field
                label="Form Title"
                value={selected.formTitle || selected.title || ""}
                onChange={(value) => updateProperty("formTitle", value)}
                placeholder="Contact Form"
              />
              <Field
                label="Name Placeholder"
                value={selected.namePlaceholder || ""}
                onChange={(value) => updateProperty("namePlaceholder", value)}
                placeholder="Your Name"
              />
              <Field
                label="Email Placeholder"
                value={selected.emailPlaceholder || ""}
                onChange={(value) => updateProperty("emailPlaceholder", value)}
                placeholder="Your Email"
              />
            </div>
          )}
        </section>

        {/* ================= STYLING ================= */}

        <section className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-sm font-bold text-slate-800">Styling</h3>

          <div className="space-y-4">
            {/* COLORS */}
            <ColorField
              label="Background Color"
              value={selected.backgroundColor || "#ffffff"}
              onChange={(value) => updateProperty("backgroundColor", value)}
            />

            <ColorField
              label="Text Color"
              value={selected.textColor || "#1e293b"}
              onChange={(value) => updateProperty("textColor", value)}
            />

            {/* TYPOGRAPHY */}
            <NumberField
              label="Font Size"
              value={selected.fontSize || ""}
              onChange={(value) => updateProperty("fontSize", value)}
              placeholder="16"
              unit="px"
            />

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-600">
                Font Weight
              </label>
              <select
                value={selected.fontWeight || "normal"}
                onChange={(e) => updateProperty("fontWeight", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
                <option value="800">Extra Bold</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-600">
                Text Alignment
              </label>
              <select
                value={selected.textAlign || "left"}
                onChange={(e) => updateProperty("textAlign", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            {/* SPACING & CORNERS */}
            <NumberField
              label="Padding"
              value={selected.padding !== undefined ? selected.padding : ""}
              onChange={(value) => updateProperty("padding", value)}
              placeholder="20"
              unit="px"
            />

            <NumberField
              label="Margin"
              value={selected.margin !== undefined ? selected.margin : ""}
              onChange={(value) => updateProperty("margin", value)}
              placeholder="0"
              unit="px"
            />

            <NumberField
              label="Border Radius"
              value={selected.borderRadius !== undefined ? selected.borderRadius : ""}
              onChange={(value) => updateProperty("borderRadius", value)}
              placeholder="0"
              unit="px"
            />

            {/* BORDER SETTINGS */}
            <div className="border-t border-gray-100 pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Border & Line
              </span>
              <div className="mt-3 space-y-4">
                <NumberField
                  label="Border Width"
                  value={selected.borderWidth || ""}
                  onChange={(value) => updateProperty("borderWidth", value)}
                  placeholder="0"
                  unit="px"
                />

                <ColorField
                  label="Border Color"
                  value={selected.borderColor || "#e2e8f0"}
                  onChange={(value) => updateProperty("borderColor", value)}
                />

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Border Style
                  </label>
                  <select
                    value={selected.borderStyle || "solid"}
                    onChange={(e) => updateProperty("borderStyle", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* EFFECTS (SHADOW & OPACITY) */}
            <div className="border-t border-gray-100 pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Effects
              </span>
              <div className="mt-3 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-600">
                    Box Shadow
                  </label>
                  <select
                    value={selected.boxShadow || "none"}
                    onChange={(e) => updateProperty("boxShadow", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Opacity
                    </label>
                    <span className="text-xs text-gray-400">
                      {selected.opacity !== undefined ? selected.opacity : 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={selected.opacity !== undefined ? selected.opacity : 100}
                    onChange={(e) => updateProperty("opacity", Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DELETE */}
        <section className="border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() =>
              onDeleteComponent &&
              onDeleteComponent(selected.id || selected._id)
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

function Field({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function NumberField({ label, value, onChange, placeholder, unit }) {
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
          onChange={(e) => onChange(e.target.value)}
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

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}

export default PropertiesPanel;