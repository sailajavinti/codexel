import {
  FaBars,
  FaHeading,
  FaSquare,
  FaMousePointer,
  FaImage,
  FaIdCard,
} from "react-icons/fa";

const AVAILABLE_COMPONENTS = [
  { id: "navbar", name: "Navbar", category: "LAYOUT", icon: FaBars },
  { id: "hero", name: "Hero", category: "LAYOUT", icon: FaHeading },
  { id: "section", name: "Section", category: "LAYOUT", icon: FaSquare },
  { id: "button", name: "Button", category: "ELEMENTS", icon: FaMousePointer },
  { id: "image", name: "Image", category: "ELEMENTS", icon: FaImage },
  { id: "card", name: "Card", category: "ELEMENTS", icon: FaIdCard },
];

function ComponentsPanel({ onAddComponent }) {
  const handleDragStart = (e, comp) => {
    e.dataTransfer.setData("application/json", JSON.stringify(comp));
    e.dataTransfer.effectAllowed = "copy";
  };

  const layoutItems = AVAILABLE_COMPONENTS.filter((c) => c.category === "LAYOUT");
  const elementItems = AVAILABLE_COMPONENTS.filter((c) => c.category === "ELEMENTS");

  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900">Components</h2>
        <p className="text-xs text-gray-400">Drag components to your canvas</p>
      </div>

      <div className="space-y-6">
        {/* Layout Items */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Layout
          </span>
          <div className="mt-2 space-y-2">
            {layoutItems.map((comp) => {
              const Icon = comp.icon;
              return (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, comp)}
                  onClick={() => onAddComponent(comp)}
                  className="flex cursor-grab items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600 active:cursor-grabbing"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs">
                    <Icon className="text-gray-500" />
                  </div>
                  <span>{comp.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Elements Items */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Elements
          </span>
          <div className="mt-2 space-y-2">
            {elementItems.map((comp) => {
              const Icon = comp.icon;
              return (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, comp)}
                  onClick={() => onAddComponent(comp)}
                  className="flex cursor-grab items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600 active:cursor-grabbing"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs">
                    <Icon className="text-gray-500" />
                  </div>
                  <span>{comp.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ComponentsPanel;