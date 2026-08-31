function PropertiesPanel(props) {
  console.log("PropertiesPanel props:", props);

  const components = props.components || [];
  const selectedComponent = props.selectedComponent;

  const selected = components.find(
    (component) => component.id === selectedComponent
  );

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-l border-gray-200 bg-white">

      {/* Header */}

      <div className="shrink-0 border-b border-gray-200 px-5 py-4">

        <h2 className="text-sm font-bold text-slate-900">
          Properties
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Customize your selected component
        </p>

      </div>

      {/* Content */}

      <div className="min-h-0 flex-1 overflow-y-auto p-5">

        {!selected ? (

          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-gray-400">
                ⚙
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No Component Selected
              </h3>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Select a component from the canvas to view and edit its
                properties.
              </p>

            </div>

          </div>

        ) : (

          <div>

            {/* Selected Component */}

            <div className="rounded-xl bg-blue-50 p-4">

              <p className="text-xs font-medium text-blue-600">
                Selected Component
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {selected.name}
              </h3>

            </div>

            {/* Component Type */}

            <div className="mt-6">

              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Component Type
              </label>

              <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                {selected.type}
              </div>

            </div>

          </div>

        )}

      </div>

    </aside>
  );
}

export default PropertiesPanel;