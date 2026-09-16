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
  FaAlignLeft,
  FaUserLock,
  FaComments,
  FaQuestionCircle,
} from "react-icons/fa";
import { AVAILABLE_COMPONENTS } from "./components/constants";

const ICON_MAP = {
  navbar: FaBars,
  hero: FaHeading,
  section: FaSquare,
  features: FaThLarge,
  pricing: FaTags,
  testimonials: FaComments,
  faq: FaQuestionCircle,
  footer: FaRegWindowMinimize,
  heading: FaFont,
  paragraph: FaAlignLeft,
  button: FaMousePointer,
  image: FaImage,
  card: FaIdCard,
  divider: FaMinus,
  form: FaWpforms,
  authForm: FaUserLock,
};

function ComponentsPanel({ onAddComponent }) {
  const [openCategories, setOpenCategories] = useState({
    LAYOUT: true,
    ELEMENTS: true,
    FORMS: true,
  });

  const toggleCategory = (cat) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleDragStart = (e, comp) => {
    e.dataTransfer.setData("application/json", JSON.stringify(comp));
    e.dataTransfer.effectAllowed = "copy";
  };

  const categories = [
    { key: "LAYOUT", title: "Layout & Sections", items: AVAILABLE_COMPONENTS.filter((c) => c.category === "LAYOUT") },
    { key: "ELEMENTS", title: "Design Elements", items: AVAILABLE_COMPONENTS.filter((c) => c.category === "ELEMENTS") },
    { key: "FORMS", title: "Forms & Security", items: AVAILABLE_COMPONENTS.filter((c) => c.category === "FORMS") },
  ];

  return (
    <aside className="w-64 h-full min-h-0 flex flex-col border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-100 shrink-0">
        <h2 className="text-sm font-bold text-gray-900">Components</h2>
        <p className="text-xs text-gray-400">Click or drag elements to canvas</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {categories.map(({ key, title, items }) => {
          const isOpen = Boolean(openCategories[key]);
          return (
            <div key={key} className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
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

              {isOpen && (
                <div className="p-2 pt-0 space-y-1.5">
                  {items.map((comp) => {
                    const Icon = ICON_MAP[comp.id] || FaSquare;
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