import { useState } from "react";
import { FaImage, FaTrash } from "react-icons/fa";

function Canvas({
  components = [],
  selectedComponent,
  setSelectedComponent,
  onDropComponent,
  onDeleteComponent,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;

    try {
      const comp = JSON.parse(rawData);
      if (onDropComponent) {
        onDropComponent(comp);
      }
    } catch (err) {
      console.error("Drop parsing error:", err);
    }
  };

  const handleDelete = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteComponent) {
      onDeleteComponent(targetId);
    }
  };

  const renderComponent = (component) => {
    switch (component.type) {
      case "navbar":
        return (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Navbar</h3>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Home</span>
                <span>About</span>
                <span>Contact</span>
              </div>
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="rounded-xl bg-blue-600 p-10 text-center text-white">
            <h1 className="text-3xl font-bold">Build Your Website</h1>
            <p className="mt-3 text-blue-100">
              Create beautiful websites visually with CodeXel.
            </p>
            <button className="mt-5 rounded-lg bg-white px-5 py-2 font-semibold text-blue-600">
              Get Started
            </button>
          </div>
        );

      case "section":
        return (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-800">Section</h2>
            <p className="mt-2 text-gray-500">Your section content goes here.</p>
          </div>
        );

      case "button":
        return (
          <div className="flex justify-center rounded-xl border border-gray-200 bg-white p-8">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">
              Button
            </button>
          </div>
        );

      case "image":
        return (
          <div className="flex h-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
            <div className="text-center text-gray-400">
              <FaImage className="mx-auto text-3xl" />
              <p className="mt-2 text-sm">Image</p>
            </div>
          </div>
        );

      case "card":
        return (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800">Card Title</h3>
            <p className="mt-2 text-gray-500">This is a sample card component.</p>
            <button className="mt-4 text-sm font-semibold text-blue-600">
              Learn More →
            </button>
          </div>
        );

      case "form":
        return (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800">Contact Form</h3>
            <input
              type="text"
              placeholder="Name"
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600"
            />
            <input
              type="email"
              placeholder="Email"
              className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-600"
            />
            <button className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white">
              Submit
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main
      className="min-w-0 flex-1 bg-slate-100 p-6"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`h-full w-full overflow-auto rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
          isDragOver
            ? "border-2 border-dashed border-blue-500 bg-blue-50/20 ring-4 ring-blue-100"
            : "border-gray-200"
        }`}
      >
        <div className="mx-auto min-h-full w-full max-w-4xl space-y-5 p-8">
          {components.length === 0 ? (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                  ✦
                </div>
                <h2 className="mt-5 text-lg font-semibold text-slate-800">
                  Start Building Your Website
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Drag a component from the left panel to start designing your website.
                </p>
              </div>
            </div>
          ) : (
            components.map((component, index) => {
              const compKey = component.id || component._id || index;
              const isSelected = selectedComponent === compKey;

              return (
                <div
                  key={compKey}
                  onClick={() => setSelectedComponent(compKey)}
                  className={`group relative cursor-pointer rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:ring-1 hover:ring-blue-300"
                  }`}
                >
                  {/* Delete Trash Button: hidden by default, visible only on hover */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, compKey)}
                    className="absolute -right-3 -top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-red-500 opacity-0 shadow-md transition-all duration-150 group-hover:opacity-100 hover:scale-110 hover:bg-red-50 hover:text-red-700 pointer-events-auto"
                    title="Delete Component"
                  >
                    <FaTrash className="pointer-events-none text-xs" />
                  </button>

                  {renderComponent(component)}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

export default Canvas;