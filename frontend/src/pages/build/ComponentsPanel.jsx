import componentData from "./componentData";

function ComponentsPanel({ onAddComponent }) {
  const categories = ["Layout", "Elements", "Forms"];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white">

      {/* Header */}

      <div className="shrink-0 border-b border-gray-200 px-5 py-4">

        <h2 className="text-sm font-bold text-slate-900">
          Components
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Drag components to your canvas
        </p>

      </div>

      {/* Components List */}

      <div className="min-h-0 flex-1 overflow-y-auto p-4">

        {categories.map((category) => {

          const categoryComponents = componentData.filter(
            (component) => component.category === category
          );

          return (
            <div
              key={category}
              className="mb-6 last:mb-0"
            >

              {/* Category */}

              <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {category}
              </h3>

              <div className="space-y-2">

                {categoryComponents.map((component) => {

                  const Icon = component.icon;

                  return (
                    <button
                      key={component.id}
                      type="button"
                      onClick={() => onAddComponent(component)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow"
                    >

                      {/* Icon */}

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-gray-500 transition-colors duration-200 group-hover:bg-blue-100 group-hover:text-blue-600">

                        <Icon />

                      </span>

                      {/* Component Name */}

                      <span>
                        {component.name}
                      </span>

                    </button>
                  );
                })}

              </div>

            </div>
          );
        })}

      </div>

    </aside>
  );
}

export default ComponentsPanel;