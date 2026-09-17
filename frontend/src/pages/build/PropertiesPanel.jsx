import React from "react";
import { FaCopy, FaTrash, FaPlus, FaTimes, FaArrowUp, FaArrowDown } from "react-icons/fa";

const WIDTH_OPTIONS = ["Auto", "25%", "33.33%", "50%", "66.67%", "75%", "100%"];
const HOVER_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Lift Card (-4px & Shadow)", value: "lift" },
  { label: "Scale Up (102%)", value: "scale" },
  { label: "Outer Glow", value: "glow" },
  { label: "Soft Dim", value: "dim" },
];

function PropertiesPanel({
  components = [],
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  pages = [],
}) {
  const selected = components.find((c) => (c.id || c._id) === selectedComponent);

  const updateProperty = (prop, val) => {
    if (!selected || !onUpdateComponent) return;
    onUpdateComponent(selected.id || selected._id, { [prop]: val });
  };

  const moveArrayItem = (listKey, index, direction) => {
    const list = [...(selected[listKey] || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const [movedItem] = list.splice(index, 1);
    list.splice(targetIndex, 0, movedItem);
    updateProperty(listKey, list);
  };

  if (!selected) {
    return (
      <aside className="w-80 h-full min-h-0 flex flex-col border-l border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-800">Properties</h2>
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            Select an element on the canvas to configure content, layout, interactions, and styles.
          </p>
        </div>
      </aside>
    );
  }

  const compId = selected.id || selected._id;
  const isButton = selected.type === "button";

  return (
    <aside className="w-80 h-full min-h-0 flex flex-col border-l border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-5 shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Selected Component</p>
        <h2 className="mt-1 text-xl font-bold capitalize text-slate-800">{selected.type}</h2>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6">
        {/* ================= 1. LAYOUT & SIZING ================= */}
        <section>
          <h3 className="mb-3 text-sm font-bold text-slate-800">Layout & Width</h3>
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-600">Width (% of Row)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {WIDTH_OPTIONS.map((w) => {
                const isCurrent = w === "Auto" ? selected.width === "auto" : (selected.width || "100%") === w;
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => updateProperty("width", w === "Auto" ? "auto" : w)}
                    className={`py-1.5 text-xs font-semibold rounded border transition ${
                      isCurrent
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-xs"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3">
            <NumberField
              label="Min Height"
              value={selected.minHeight || ""}
              onChange={(v) => updateProperty("minHeight", v)}
              placeholder="Auto"
              unit="px"
            />
          </div>
        </section>

        {/* ================= 2. CONTENT CONFIGURATION ================= */}
        <section className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-sm font-bold text-slate-800">Content Configuration</h3>

          {/* NAVBAR */}
          {selected.type === "navbar" && (
            <div className="space-y-4">
              <Field label="Brand Name" value={selected.brand || ""} onChange={(v) => updateProperty("brand", v)} />
              <ColorField label="Brand Text Color" value={selected.brandColor || "#0f172a"} onChange={(v) => updateProperty("brandColor", v)} />
              <ColorField label="Nav Link Color" value={selected.navLinkColor || "#475569"} onChange={(v) => updateProperty("navLinkColor", v)} />

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Nav Links ({(selected.navLinks || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [
                        ...(selected.navLinks || []),
                        { id: `link-${Date.now()}`, label: `Link ${(selected.navLinks || []).length + 1}`, targetPageId: "" },
                      ];
                      updateProperty("navLinks", next);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <FaPlus className="text-[9px]" /> Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {(selected.navLinks || []).map((link, idx) => (
                    <div key={link.id || idx} className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Link #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveArrayItem("navLinks", idx, "up")}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Up"
                          >
                            <FaArrowUp className="text-[10px]" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === selected.navLinks.length - 1}
                            onClick={() => moveArrayItem("navLinks", idx, "down")}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Down"
                          >
                            <FaArrowDown className="text-[10px]" />
                          </button>
                          {(selected.navLinks || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => updateProperty("navLinks", selected.navLinks.filter((_, i) => i !== idx))}
                              className="text-gray-400 hover:text-red-500 ml-1"
                              title="Delete Link"
                            >
                              <FaTimes className="text-[10px]" />
                            </button>
                          )}
                        </div>
                      </div>
                      <Field
                        label="Label"
                        value={link.label || ""}
                        onChange={(v) =>
                          updateProperty(
                            "navLinks",
                            selected.navLinks.map((l, i) => (i === idx ? { ...l, label: v } : l))
                          )
                        }
                      />
                      <PageSelectField
                        label="Target Page"
                        value={link.targetPageId || ""}
                        pages={pages}
                        onChange={(v) =>
                          updateProperty(
                            "navLinks",
                            selected.navLinks.map((l, i) => (i === idx ? { ...l, targetPageId: v } : l))
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navbar CTA */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 uppercase">Navbar Action Button</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={selected.showNavCta === true}
                      onChange={(e) => updateProperty("showNavCta", e.target.checked)}
                      className="accent-blue-600 rounded"
                    />
                    Enable
                  </label>
                </div>
                {selected.showNavCta === true && (
                  <>
                    <Field label="Button Text" value={selected.navCtaText || ""} onChange={(v) => updateProperty("navCtaText", v)} />
                    <PageSelectField
                      label="Target Project Page"
                      value={selected.navCtaPageId || ""}
                      pages={pages}
                      onChange={(v) => updateProperty("navCtaPageId", v)}
                    />
                    <ColorField label="Button Background" value={selected.navCtaBg || "#2563eb"} onChange={(v) => updateProperty("navCtaBg", v)} />
                    <ColorField label="Button Text Color" value={selected.navCtaColor || "#ffffff"} onChange={(v) => updateProperty("navCtaColor", v)} />
                  </>
                )}
              </div>
            </div>
          )}

          {/* HERO */}
          {selected.type === "hero" && (
            <div className="space-y-4">
              <TextArea label="Heading (supports line breaks)" value={selected.heading || ""} onChange={(v) => updateProperty("heading", v)} rows={2} />
              <TextArea label="Description (supports line breaks)" value={selected.description || ""} onChange={(v) => updateProperty("description", v)} rows={3} />

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 uppercase">Primary CTA Button</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={selected.showHeroButton !== false}
                      onChange={(e) => updateProperty("showHeroButton", e.target.checked)}
                      className="accent-blue-600 rounded"
                    />
                    Enable
                  </label>
                </div>
                {selected.showHeroButton !== false && (
                  <>
                    <Field label="Button Text" value={selected.buttonText || ""} onChange={(v) => updateProperty("buttonText", v)} />
                    <Field label="External URL or #" value={selected.heroButtonLink || ""} onChange={(v) => updateProperty("heroButtonLink", v)} />
                    <PageSelectField label="Target Page" value={selected.heroButtonPageId || ""} pages={pages} onChange={(v) => updateProperty("heroButtonPageId", v)} />
                    <ColorField label="Background Color" value={selected.heroButtonBg || "#ffffff"} onChange={(v) => updateProperty("heroButtonBg", v)} />
                    <ColorField label="Text Color" value={selected.heroButtonTextColor || "#2563eb"} onChange={(v) => updateProperty("heroButtonTextColor", v)} />
                  </>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase">Secondary CTA Button</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={selected.showSecondaryButton !== false}
                      onChange={(e) => updateProperty("showSecondaryButton", e.target.checked)}
                      className="accent-blue-600 rounded"
                    />
                    Enable
                  </label>
                </div>
                {selected.showSecondaryButton !== false && (
                  <>
                    <Field label="Button Text" value={selected.secondaryButtonText || ""} onChange={(v) => updateProperty("secondaryButtonText", v)} />
                    <Field label="External URL or #" value={selected.secondaryButtonLink || ""} onChange={(v) => updateProperty("secondaryButtonLink", v)} />
                    <PageSelectField label="Target Page" value={selected.secondaryButtonPageId || ""} pages={pages} onChange={(v) => updateProperty("secondaryButtonPageId", v)} />
                  </>
                )}
              </div>
            </div>
          )}

          {/* SECTION */}
          {selected.type === "section" && (
            <div className="space-y-4">
              <TextArea label="Heading (supports line breaks)" value={selected.heading || ""} onChange={(v) => updateProperty("heading", v)} rows={2} />
              <TextArea label="Content (supports line breaks)" value={selected.content || ""} onChange={(v) => updateProperty("content", v)} rows={4} />
            </div>
          )}

          {/* PARAGRAPH */}
          {selected.type === "paragraph" && (
            <div className="space-y-4">
              <TextArea label="Paragraph Content" value={selected.content || ""} onChange={(v) => updateProperty("content", v)} rows={6} />
            </div>
          )}

          {/* HEADING */}
          {selected.type === "heading" && (
            <div className="space-y-4">
              <TextArea label="Title" value={selected.title || ""} onChange={(v) => updateProperty("title", v)} rows={2} />
              <TextArea label="Subtitle" value={selected.subtitle || ""} onChange={(v) => updateProperty("subtitle", v)} rows={3} />
            </div>
          )}

          {/* FEATURES GRID */}
          {selected.type === "features" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Box Hover Animation</label>
                <select
                  value={selected.boxHoverEffect || "none"}
                  onChange={(e) => updateProperty("boxHoverEffect", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs outline-none"
                >
                  {HOVER_OPTIONS.map((h) => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Feature Boxes ({(selected.featuresList || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = [
                      ...(selected.featuresList || []),
                      { id: `feat-${Date.now()}`, title: "New Feature", desc: "Description here..." },
                    ];
                    updateProperty("featuresList", next);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <FaPlus className="text-[9px]" /> Add Box
                </button>
              </div>

              <div className="space-y-3">
                {(selected.featuresList || []).map((box, idx) => (
                  <div key={box.id || idx} className="p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Box #{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveArrayItem("featuresList", idx, "up")}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                          title="Move Up"
                        >
                          <FaArrowUp className="text-[10px]" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === selected.featuresList.length - 1}
                          onClick={() => moveArrayItem("featuresList", idx, "down")}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                          title="Move Down"
                        >
                          <FaArrowDown className="text-[10px]" />
                        </button>
                        {(selected.featuresList || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => updateProperty("featuresList", selected.featuresList.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-red-500 ml-1"
                            title="Delete Box"
                          >
                            <FaTimes className="text-[10px]" />
                          </button>
                        )}
                      </div>
                    </div>
                    <Field
                      label="Title"
                      value={box.title}
                      onChange={(v) =>
                        updateProperty(
                          "featuresList",
                          selected.featuresList.map((b, i) => (i === idx ? { ...b, title: v } : b))
                        )
                      }
                    />
                    <TextArea
                      label="Description"
                      value={box.desc}
                      rows={2}
                      onChange={(v) =>
                        updateProperty(
                          "featuresList",
                          selected.featuresList.map((b, i) => (i === idx ? { ...b, desc: v } : b))
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADVANCED FOOTER */}
          {selected.type === "footer" && (
            <div className="space-y-4">
              <Field label="Brand / Company" value={selected.brand || ""} onChange={(v) => updateProperty("brand", v)} />
              <TextArea label="Bio / About Text" value={selected.footerAbout || ""} onChange={(v) => updateProperty("footerAbout", v)} rows={2} />
              <Field label="Copyright Line" value={selected.copyright || ""} onChange={(v) => updateProperty("copyright", v)} />

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Footer Columns ({(selected.footerColumns || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [
                        ...(selected.footerColumns || []),
                        { id: `col-${Date.now()}`, title: "New Column", items: [{ label: "Link 1", link: "#", targetPageId: "" }] },
                      ];
                      updateProperty("footerColumns", next);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <FaPlus className="text-[9px]" /> Add Column
                  </button>
                </div>

                <div className="space-y-3">
                  {(selected.footerColumns || []).map((col, cIdx) => (
                    <div key={col.id || cIdx} className="p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <Field
                          label="Column Title"
                          value={col.title}
                          onChange={(v) =>
                            updateProperty(
                              "footerColumns",
                              selected.footerColumns.map((c, i) => (i === cIdx ? { ...c, title: v } : c))
                            )
                          }
                        />
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            type="button"
                            disabled={cIdx === 0}
                            onClick={() => moveArrayItem("footerColumns", cIdx, "up")}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Column Up"
                          >
                            <FaArrowUp className="text-[10px]" />
                          </button>
                          <button
                            type="button"
                            disabled={cIdx === selected.footerColumns.length - 1}
                            onClick={() => moveArrayItem("footerColumns", cIdx, "down")}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Column Down"
                          >
                            <FaArrowDown className="text-[10px]" />
                          </button>
                          {(selected.footerColumns || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => updateProperty("footerColumns", selected.footerColumns.filter((_, i) => i !== cIdx))}
                              className="text-gray-400 hover:text-red-500 text-xs ml-1"
                              title="Delete Column"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Sub Links</span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextItems = [...(col.items || []), { label: "New Link", link: "#", targetPageId: "" }];
                              updateProperty(
                                "footerColumns",
                                selected.footerColumns.map((c, i) => (i === cIdx ? { ...c, items: nextItems } : c))
                              );
                            }}
                            className="text-[10px] text-blue-600 font-bold"
                          >
                            + Add Link
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(col.items || []).map((item, iIdx) => (
                            <div key={iIdx} className="p-2 border border-gray-200 rounded bg-white space-y-1 relative">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-gray-400">Link #{iIdx + 1}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={iIdx === 0}
                                    onClick={() => {
                                      const items = [...col.items];
                                      const [moved] = items.splice(iIdx, 1);
                                      items.splice(iIdx - 1, 0, moved);
                                      updateProperty(
                                        "footerColumns",
                                        selected.footerColumns.map((c, i) => (i === cIdx ? { ...c, items } : c))
                                      );
                                    }}
                                    className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                                    title="Move Link Up"
                                  >
                                    <FaArrowUp className="text-[9px]" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={iIdx === col.items.length - 1}
                                    onClick={() => {
                                      const items = [...col.items];
                                      const [moved] = items.splice(iIdx, 1);
                                      items.splice(iIdx + 1, 0, moved);
                                      updateProperty(
                                        "footerColumns",
                                        selected.footerColumns.map((c, i) => (i === cIdx ? { ...c, items } : c))
                                      );
                                    }}
                                    className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                                    title="Move Link Down"
                                  >
                                    <FaArrowDown className="text-[9px]" />
                                  </button>
                                  {(col.items || []).length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtered = col.items.filter((_, idx) => idx !== iIdx);
                                        updateProperty(
                                          "footerColumns",
                                          selected.footerColumns.map((c, i) => (i === cIdx ? { ...c, items: filtered } : c))
                                        );
                                      }}
                                      className="text-gray-400 hover:text-red-500 text-[9px] ml-1"
                                      title="Delete Link"
                                    >
                                      <FaTimes />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <input
                                type="text"
                                value={item.label}
                                placeholder="Label"
                                onChange={(e) => {
                                  const updated = col.items.map((it, idx) => (idx === iIdx ? { ...it, label: e.target.value } : it));
                                  updateProperty(
                                    "footerColumns",
                                    selected.footerColumns.map((c, i) => (i === cIdx ? { ...c, items: updated } : c))
                                  );
                                }}
                                className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                              />
                              <PageSelectField
                                label="Target Page"
                                value={item.targetPageId || ""}
                                pages={pages}
                                onChange={(v) => {
                                  const updated = col.items.map((it, idx) => (idx === iIdx ? { ...it, targetPageId: v } : it));
                                  updateProperty(
                                    "footerColumns",
                                    selected.footerColumns.map((c, i) => (i === cIdx ? { ...c, items: updated } : c))
                                  );
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTACT FORM */}
          {selected.type === "form" && (
            <div className="space-y-4">
              <Field label="Form Title" value={selected.formTitle || ""} onChange={(v) => updateProperty("formTitle", v)} />
              <Field label="Submit Button Label" value={selected.submitButtonText || "Send Message"} onChange={(v) => updateProperty("submitButtonText", v)} />

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Form Fields ({(selected.formFields || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [
                        ...(selected.formFields || []),
                        { id: `f-${Date.now()}`, label: "New Input", type: "text", placeholder: "Enter value", required: false },
                      ];
                      updateProperty("formFields", next);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <FaPlus className="text-[9px]" /> Add Field
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(selected.formFields || []).map((f, idx) => (
                    <div key={f.id || idx} className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Field #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveArrayItem("formFields", idx, "up")}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Up"
                          >
                            <FaArrowUp className="text-[10px]" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === selected.formFields.length - 1}
                            onClick={() => moveArrayItem("formFields", idx, "down")}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Down"
                          >
                            <FaArrowDown className="text-[10px]" />
                          </button>
                          {(selected.formFields || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => updateProperty("formFields", selected.formFields.filter((_, i) => i !== idx))}
                              className="text-gray-400 hover:text-red-500 ml-1"
                              title="Delete Field"
                            >
                              <FaTimes className="text-[10px]" />
                            </button>
                          )}
                        </div>
                      </div>
                      <Field
                        label="Label"
                        value={f.label}
                        onChange={(v) => updateProperty("formFields", selected.formFields.map((it, i) => (i === idx ? { ...it, label: v } : i)))}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Type</label>
                          <select
                            value={f.type}
                            onChange={(e) => updateProperty("formFields", selected.formFields.map((it, i) => (i === idx ? { ...it, type: e.target.value } : it)))}
                            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="number">Number</option>
                            <option value="tel">Phone</option>
                            <option value="textarea">Textarea</option>
                          </select>
                        </div>
                        <Field
                          label="Placeholder"
                          value={f.placeholder}
                          onChange={(v) => updateProperty("formFields", selected.formFields.map((it, i) => (i === idx ? { ...it, placeholder: v } : it)))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AUTH FORM */}
          {selected.type === "authForm" && (
            <div className="space-y-4">
              <Field label="Form Title" value={selected.authTitle || ""} onChange={(v) => updateProperty("authTitle", v)} />
              <TextArea label="Subtitle" value={selected.authSubtitle || ""} onChange={(v) => updateProperty("authSubtitle", v)} rows={2} />
              <Field label="Submit Button Text" value={selected.submitButtonText || "Sign In"} onChange={(v) => updateProperty("submitButtonText", v)} />

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                <span className="text-xs font-bold text-gray-700 uppercase">Features & Toggles</span>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.showSocialLogin !== false}
                    onChange={(e) => updateProperty("showSocialLogin", e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  Social Login Buttons (Google / GitHub)
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.showRememberMe !== false}
                    onChange={(e) => updateProperty("showRememberMe", e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  "Remember Me" Checkbox
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.showForgotPassword !== false}
                    onChange={(e) => updateProperty("showForgotPassword", e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  "Forgot Password?" Link
                </label>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Input Fields ({(selected.authFields || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [
                        ...(selected.authFields || []),
                        { id: `af-${Date.now()}`, label: "Username", type: "text", placeholder: "username", required: true },
                      ];
                      updateProperty("authFields", next);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <FaPlus className="text-[9px]" /> Add Field
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(selected.authFields || []).map((field, idx) => (
                    <div key={field.id || idx} className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Field #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveArrayItem("authFields", idx, "up")}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Up"
                          >
                            <FaArrowUp className="text-[10px]" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === selected.authFields.length - 1}
                            onClick={() => moveArrayItem("authFields", idx, "down")}
                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                            title="Move Down"
                          >
                            <FaArrowDown className="text-[10px]" />
                          </button>
                          {(selected.authFields || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => updateProperty("authFields", selected.authFields.filter((_, i) => i !== idx))}
                              className="text-gray-400 hover:text-red-500 ml-1"
                              title="Delete Field"
                            >
                              <FaTimes className="text-[10px]" />
                            </button>
                          )}
                        </div>
                      </div>
                      <Field
                        label="Label"
                        value={field.label}
                        onChange={(v) => updateProperty("authFields", selected.authFields.map((f, i) => (i === idx ? { ...f, label: v } : f)))}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Type</label>
                          <select
                            value={field.type}
                            onChange={(e) => updateProperty("authFields", selected.authFields.map((f, i) => (i === idx ? { ...f, type: e.target.value } : f)))}
                            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="password">Password</option>
                            <option value="tel">Phone</option>
                          </select>
                        </div>
                        <Field
                          label="Placeholder"
                          value={field.placeholder}
                          onChange={(v) => updateProperty("authFields", selected.authFields.map((f, i) => (i === idx ? { ...f, placeholder: v } : f)))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRICING TABLE */}
          {selected.type === "pricing" && (
            <div className="space-y-4">
              <Field label="Plan Name" value={selected.pricingPlan || ""} onChange={(v) => updateProperty("pricingPlan", v)} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Price" value={selected.pricingPrice || ""} onChange={(v) => updateProperty("pricingPrice", v)} />
                <Field label="Frequency" value={selected.pricingPeriod || ""} onChange={(v) => updateProperty("pricingPeriod", v)} />
              </div>
              <Field label="Header Badge" value={selected.pricingBadge || ""} onChange={(v) => updateProperty("pricingBadge", v)} />
              <Field label="Button Label" value={selected.pricingButtonText || ""} onChange={(v) => updateProperty("pricingButtonText", v)} />
              <PageSelectField
                label="Button Target Page"
                value={selected.pricingButtonPageId || ""}
                pages={pages}
                onChange={(v) => updateProperty("pricingButtonPageId", v)}
              />

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Features Checklist ({(selected.pricingFeaturesList || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [
                        ...(selected.pricingFeaturesList || []),
                        { id: `pf-${Date.now()}`, text: "New Plan Benefit", included: true },
                      ];
                      updateProperty("pricingFeaturesList", next);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <FaPlus className="text-[9px]" /> Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {(selected.pricingFeaturesList || []).map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                      <input
                        type="checkbox"
                        checked={item.included}
                        onChange={(e) =>
                          updateProperty(
                            "pricingFeaturesList",
                            selected.pricingFeaturesList.map((it, i) => (i === idx ? { ...it, included: e.target.checked } : it))
                          )
                        }
                        className="accent-blue-600 rounded"
                        title="Included?"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) =>
                          updateProperty(
                            "pricingFeaturesList",
                            selected.pricingFeaturesList.map((it, i) => (i === idx ? { ...it, text: e.target.value } : it))
                          )
                        }
                        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveArrayItem("pricingFeaturesList", idx, "up")}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                          title="Move Up"
                        >
                          <FaArrowUp className="text-[10px]" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === selected.pricingFeaturesList.length - 1}
                          onClick={() => moveArrayItem("pricingFeaturesList", idx, "down")}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                          title="Move Down"
                        >
                          <FaArrowDown className="text-[10px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateProperty(
                              "pricingFeaturesList",
                              selected.pricingFeaturesList.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-gray-400 hover:text-red-500 ml-1"
                          title="Delete Item"
                        >
                          <FaTimes className="text-[10px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TESTIMONIALS */}
          {selected.type === "testimonials" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Testimonials ({(selected.testimonialsList || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = [
                      ...(selected.testimonialsList || []),
                      {
                        id: `t-${Date.now()}`,
                        author: "New Author",
                        role: "Product Manager",
                        quote: "Amazing experience using this product!",
                        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                        rating: 5,
                      },
                    ];
                    updateProperty("testimonialsList", next);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <FaPlus className="text-[9px]" /> Add Testimonial
                </button>
              </div>

              <div className="space-y-3">
                {(selected.testimonialsList || []).map((t, idx) => (
                  <div key={t.id || idx} className="p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Testimonial #{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveArrayItem("testimonialsList", idx, "up")}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                          title="Move Up"
                        >
                          <FaArrowUp className="text-[10px]" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === selected.testimonialsList.length - 1}
                          onClick={() => moveArrayItem("testimonialsList", idx, "down")}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                          title="Move Down"
                        >
                          <FaArrowDown className="text-[10px]" />
                        </button>
                        {(selected.testimonialsList || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => updateProperty("testimonialsList", selected.testimonialsList.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-red-500 ml-1"
                            title="Delete"
                          >
                            <FaTimes className="text-[10px]" />
                          </button>
                        )}
                      </div>
                    </div>
                    <Field
                      label="Author"
                      value={t.author}
                      onChange={(v) =>
                        updateProperty(
                          "testimonialsList",
                          selected.testimonialsList.map((item, i) => (i === idx ? { ...item, author: v } : item))
                        )
                      }
                    />
                    <Field
                      label="Role / Company"
                      value={t.role}
                      onChange={(v) =>
                        updateProperty(
                          "testimonialsList",
                          selected.testimonialsList.map((item, i) => (i === idx ? { ...item, role: v } : item))
                        )
                      }
                    />
                    <TextArea
                      label="Quote"
                      value={t.quote}
                      rows={2}
                      onChange={(v) =>
                        updateProperty(
                          "testimonialsList",
                          selected.testimonialsList.map((item, i) => (i === idx ? { ...item, quote: v } : item))
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {selected.type === "faq" && (
            <div className="space-y-4">
              <Field label="Section Title" value={selected.faqTitle || ""} onChange={(v) => updateProperty("faqTitle", v)} />
              <Field label="Section Subtitle" value={selected.faqSubtitle || ""} onChange={(v) => updateProperty("faqSubtitle", v)} />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Questions ({(selected.faqList || []).length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = [
                      ...(selected.faqList || []),
                      { id: `faq-${Date.now()}`, question: "New Question?", answer: "Answer goes here." },
                    ];
                    updateProperty("faqList", next);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <FaPlus className="text-[9px]" /> Add FAQ
                </button>
              </div>

              <div className="space-y-3">
                {(selected.faqList || []).map((faq, idx) => (
                  <div key={faq.id || idx} className="p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">FAQ #{idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveArrayItem("faqList", idx, "up")}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                          title="Move Up"
                        >
                          <FaArrowUp className="text-[10px]" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === selected.faqList.length - 1}
                          onClick={() => moveArrayItem("faqList", idx, "down")}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30"
                          title="Move Down"
                        >
                          <FaArrowDown className="text-[10px]" />
                        </button>
                        {(selected.faqList || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => updateProperty("faqList", selected.faqList.filter((_, i) => i !== idx))}
                            className="text-gray-400 hover:text-red-500 ml-1"
                            title="Delete"
                          >
                            <FaTimes className="text-[10px]" />
                          </button>
                        )}
                      </div>
                    </div>
                    <Field
                      label="Question"
                      value={faq.question}
                      onChange={(v) =>
                        updateProperty(
                          "faqList",
                          selected.faqList.map((item, i) => (i === idx ? { ...item, question: v } : item))
                        )
                      }
                    />
                    <TextArea
                      label="Answer"
                      value={faq.answer}
                      rows={2}
                      onChange={(v) =>
                        updateProperty(
                          "faqList",
                          selected.faqList.map((item, i) => (i === idx ? { ...item, answer: v } : item))
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUTTON */}
          {isButton && (
            <div className="space-y-4">
              <Field label="Button Text" value={selected.text || ""} onChange={(v) => updateProperty("text", v)} />
              <Field label="External URL or #" value={selected.link || ""} onChange={(v) => updateProperty("link", v)} />
              <PageSelectField label="Target Project Page" value={selected.targetPageId || ""} pages={pages} onChange={(v) => updateProperty("targetPageId", v)} />
              <ColorField label="Background Color" value={selected.btnBgColor || "#2563eb"} onChange={(v) => updateProperty("btnBgColor", v)} />
              <ColorField label="Text Color" value={selected.btnTextColor || "#ffffff"} onChange={(v) => updateProperty("btnTextColor", v)} />
              <div className="grid grid-cols-2 gap-2">
                <NumberField label="Pad X" value={selected.btnPaddingX ?? 20} onChange={(v) => updateProperty("btnPaddingX", v)} unit="px" />
                <NumberField label="Pad Y" value={selected.btnPaddingY ?? 10} onChange={(v) => updateProperty("btnPaddingY", v)} unit="px" />
              </div>
            </div>
          )}

          {/* IMAGE */}
          {selected.type === "image" && (
            <div className="space-y-4">
              <Field label="Image Source URL" value={selected.src || ""} onChange={(v) => updateProperty("src", v)} />
              <Field label="Alt Text" value={selected.alt || ""} onChange={(v) => updateProperty("alt", v)} />
              <NumberField label="Width (%)" value={selected.imageWidth || "100"} onChange={(v) => updateProperty("imageWidth", v)} unit="%" />
              <NumberField label="Height (px)" value={selected.imageHeight || ""} onChange={(v) => updateProperty("imageHeight", v)} placeholder="Auto" unit="px" />
            </div>
          )}
        </section>

        {/* ================= 3. HOVER & INTERACTION ================= */}
        <section className="border-t border-gray-200 pt-6">
          <h3 className="mb-2 text-sm font-bold text-slate-800">Interactivity & Hover Animation</h3>
          <select
            value={selected.hoverEffect || "none"}
            onChange={(e) => updateProperty("hoverEffect", e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none"
          >
            {HOVER_OPTIONS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </section>

        {/* ================= 4. COMPLETE CSS STYLING CONTROLS ================= */}
        <section className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Visual Styling</h3>

          {!isButton && (
            <>
              <ColorField label="Background Color" value={selected.backgroundColor || "#ffffff"} onChange={(v) => updateProperty("backgroundColor", v)} />
              <ColorField label="Text Color" value={selected.textColor || "#1e293b"} onChange={(v) => updateProperty("textColor", v)} />
              <NumberField label="Padding" value={selected.padding ?? ""} onChange={(v) => updateProperty("padding", v)} placeholder="20" unit="px" />
            </>
          )}

          <NumberField label="Margin" value={selected.margin ?? ""} onChange={(v) => updateProperty("margin", v)} placeholder="0" unit="px" />
          <NumberField label="Font Size" value={selected.fontSize || ""} onChange={(v) => updateProperty("fontSize", v)} placeholder="16" unit="px" />

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Font Weight</label>
            <select
              value={selected.fontWeight || "normal"}
              onChange={(e) => updateProperty("fontWeight", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none"
            >
              <option value="normal">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Text Alignment</label>
            <select
              value={selected.textAlign || "left"}
              onChange={(e) => updateProperty("textAlign", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <NumberField label="Border Radius" value={selected.borderRadius ?? ""} onChange={(v) => updateProperty("borderRadius", v)} placeholder="0" unit="px" />

          {/* Border Settings */}
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Border & Line</span>
            <NumberField label="Border Width" value={selected.borderWidth || ""} onChange={(v) => updateProperty("borderWidth", v)} placeholder="0" unit="px" />
            <ColorField label="Border Color" value={selected.borderColor || "#e2e8f0"} onChange={(v) => updateProperty("borderColor", v)} />
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Border Style</label>
              <select
                value={selected.borderStyle || "solid"}
                onChange={(e) => updateProperty("borderStyle", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none"
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </div>

          {/* Box Shadow & Opacity */}
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Effects</span>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Box Shadow</label>
              <select
                value={selected.boxShadow || "none"}
                onChange={(e) => updateProperty("boxShadow", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none"
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
                <label className="text-xs font-semibold text-gray-600">Opacity</label>
                <span className="text-xs text-gray-400">{selected.opacity !== undefined ? selected.opacity : 100}%</span>
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
        </section>

        {/* Actions */}
        <section className="border-t border-gray-200 pt-6 space-y-2">
          <button
            type="button"
            onClick={() => onDuplicateComponent && onDuplicateComponent(compId)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition"
          >
            <FaCopy className="text-xs" /> Duplicate (Ctrl+D)
          </button>
          <button
            type="button"
            onClick={() => onDeleteComponent && onDeleteComponent(compId)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            <FaTrash className="text-xs" /> Delete Component
          </button>
        </section>
      </div>
    </aside>
  );
}

function PageSelectField({ label, value, pages = [], onChange }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none"
      >
        <option value="">None (External URL or #)</option>
        {pages.map((p) => (
          <option key={p.id} value={p.id}>Navigate to: {p.name}</option>
        ))}
      </select>
    </div>
  );
}

function Field({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none bg-white text-gray-900"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder = "" }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none bg-white text-gray-900"
      />
    </div>
  );
}

function NumberField({ label, value, onChange, placeholder, unit }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <div className="flex rounded-lg border border-gray-300 focus-within:border-blue-500">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 px-3 py-1.5 text-xs outline-none"
        />
        {unit && <span className="flex items-center bg-gray-50 px-2.5 text-[11px] text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded border border-gray-300 bg-white p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs uppercase outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}

export default PropertiesPanel;