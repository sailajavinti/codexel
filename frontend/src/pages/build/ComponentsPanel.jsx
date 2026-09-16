import { useState } from "react";
import {
  FaBars,
  FaHeading,
  FaSquare,
  FaMousePointer,
  FaImage,
  FaIdCard,
  FaWpforms,
  FaTags,
  FaThLarge,
  FaFont,
  FaMinus,
  FaRegWindowMinimize,
  FaChevronDown,
} from "react-icons/fa";

const AVAILABLE_COMPONENTS = [
  { id: "navbar", name: "Navbar", category: "LAYOUT", icon: FaBars },
  { id: "hero", name: "Hero", category: "LAYOUT", icon: FaHeading },
  { id: "section", name: "Section", category: "LAYOUT", icon: FaSquare },
  { id: "features", name: "Features Grid", category: "LAYOUT", icon: FaThLarge },
  { id: "pricing", name: "Pricing Table", category: "LAYOUT", icon: FaTags },
  { id: "footer", name: "Footer", category: "LAYOUT", icon: FaRegWindowMinimize },
  { id: "heading", name: "Heading / Text", category: "ELEMENTS", icon: FaFont },
  { id: "button", name: "Button", category: "ELEMENTS", icon: FaMousePointer },
  { id: "image", name: "Image", category: "ELEMENTS", icon: FaImage },
  { id: "card", name: "Card", category: "ELEMENTS", icon: FaIdCard },
  { id: "divider", name: "Divider", category: "ELEMENTS", icon: FaMinus },
  { id: "form", name: "Contact Form", category: "FORMS", icon: FaWpforms },
];

function ComponentsPanel({ onAddComponent }) {
  // Track open state for each category independently
  const [openCategories, setOpenCategories] = useState({
    LAYOUT: true,
    ELEMENTS: false,
    FORMS: false,
  });

  const toggleCategory = (cat) => {
    setOpenCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const handleDragStart = (e, comp) => {
    e.dataTransfer.setData("application/json", JSON.stringify(comp));
    e.dataTransfer.effectAllowed = "copy";
  };

  const categories = [
    { key: "LAYOUT", title: "Layout", items: AVAILABLE_COMPONENTS.filter((c) => c.category === "LAYOUT") },
    { key: "ELEMENTS", title: "Elements", items: AVAILABLE_COMPONENTS.filter((c) => c.category === "ELEMENTS") },
    { key: "FORMS", title: "Forms", items: AVAILABLE_COMPONENTS.filter((c) => c.category === "FORMS") },
  ];

  return (
    <aside className="w-64 h-full min-h-0 flex flex-col border-r border-gray-200 bg-white">
      {/* Pinned Header */}
      <div className="p-4 border-b border-gray-100 shrink-0">
        <h2 className="text-sm font-bold text-gray-900">Components</h2>
        <p className="text-xs text-gray-400">Drag components to your canvas</p>
      </div>

      {/* Scrollable Category Accordions */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {categories.map(({ key, title, items }) => {
          const isOpen = Boolean(openCategories[key]);

          return (
            <div key={key} className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
              {/* Toggle Header Button */}
              <button
                type="button"
                onClick={() => toggleCategory(key)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left transition hover:bg-gray-100/70"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    {title}
                  </span>
                  <span className="rounded-full bg-gray-200 px-1.5 py-0.2 text-[10px] font-semibold text-gray-600">
                    {items.length}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-[10px] text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Collapsible List */}
              {isOpen && (
                <div className="p-2 pt-0 space-y-1.5">
                  {items.map((comp) => {
                    const Icon = comp.icon;
                    return (
                      <div
                        key={comp.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, comp)}
                        onClick={() => onAddComponent(comp)}
                        className="flex cursor-grab items-center gap-3 rounded-lg border border-gray-200/60 bg-white p-2.5 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 active:cursor-grabbing select-none"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50 shadow-xs">
                          <Icon className="text-gray-500 text-xs" />
                        </div>
                        <span>{comp.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default ComponentsPanel;