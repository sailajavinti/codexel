import {
    FaBars,
    FaHeading,
    FaMousePointer,
    FaImage,
    FaCreditCard,
    FaAlignLeft,
    FaWpforms,
} from "react-icons/fa";

function ComponentsPanel() {
    const components = [
        {
            name: "Navbar",
            icon: <FaBars />,
        },
        {
            name: "Hero",
            icon: <FaHeading />,
        },
        {
            name: "Section",
            icon: <FaAlignLeft />,
        },
        {
            name: "Button",
            icon: <FaMousePointer />,
        },
        {
            name: "Image",
            icon: <FaImage />,
        },
        {
            name: "Card",
            icon: <FaCreditCard />,
        },
        {
            name: "Form",
            icon: <FaWpforms />,
        },
    ];

    return (
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white">

            {/* Header */}

            <div className="border-b border-gray-200 px-5 py-4">

                <h2 className="text-sm font-bold text-slate-900">
                    Components
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Drag components to your canvas
                </p>

            </div>

            {/* Components */}

            <div className="overflow-y-auto p-4">

                {/* Layout */}

                <div>

                    <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Layout
                    </h3>

                    <div className="space-y-2">

                        {components.slice(0, 3).map((component) => (

                            <button
                                key={component.name}
                                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow"
                            >

                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-gray-500 transition group-hover:bg-blue-100">
                                    {component.icon}
                                </span>

                                {component.name}

                            </button>

                        ))}

                    </div>

                </div>

                {/* Elements */}

                <div className="mt-6">

                    <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Elements
                    </h3>

                    <div className="space-y-2">

                        {components.slice(3, 6).map((component) => (

                            <button
                                key={component.name}
                                className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                            >

                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-gray-500">
                                    {component.icon}
                                </span>

                                {component.name}

                            </button>

                        ))}

                    </div>

                </div>

                {/* Forms */}

                <div className="mt-6">

                    <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Forms
                    </h3>

                    <button
                        className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    >

                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-gray-500">
                            {components[6].icon}
                        </span>

                        {components[6].name}

                    </button>

                </div>

            </div>

        </aside>
    );
}

export default ComponentsPanel;