import { useState } from "react";
import { FaTimes, FaPalette, FaSun, FaMoon, FaUndo } from "react-icons/fa";
import { DEFAULT_THEME } from "./components/constants";

const THEME_PRESETS = [
  {
    name: "Default Light",
    theme: {
      mode: "light",
      fontFamily: "Inter, system-ui, sans-serif",
      primaryColor: "#2563eb",
      accentColor: "#4f46e5",
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      surfaceColor: "#f8fafc",
      borderRadius: 8,
    },
  },
  {
    name: "Midnight Dark",
    theme: {
      mode: "dark",
      fontFamily: "Inter, system-ui, sans-serif",
      primaryColor: "#3b82f6",
      accentColor: "#6366f1",
      backgroundColor: "#0f172a",
      textColor: "#f8fafc",
      surfaceColor: "#1e293b",
      borderRadius: 8,
    },
  },
  {
    name: "Emerald Studio",
    theme: {
      mode: "light",
      fontFamily: "Inter, system-ui, sans-serif",
      primaryColor: "#059669",
      accentColor: "#0d9488",
      backgroundColor: "#ffffff",
      textColor: "#132a13",
      surfaceColor: "#f0fdf4",
      borderRadius: 6,
    },
  },
  {
    name: "Modern Serif",
    theme: {
      mode: "light",
      fontFamily: "Georgia, Cambria, serif",
      primaryColor: "#991b1b",
      accentColor: "#b45309",
      backgroundColor: "#fffbeb",
      textColor: "#451a03",
      surfaceColor: "#fef3c7",
      borderRadius: 4,
    },
  },
  {
    name: "Cyberpunk Tech",
    theme: {
      mode: "dark",
      fontFamily: "ui-monospace, monospace",
      primaryColor: "#ec4899",
      accentColor: "#06b6d4",
      backgroundColor: "#050505",
      textColor: "#f4f4f5",
      surfaceColor: "#18181b",
      borderRadius: 0,
    },
  },
];

const FONT_OPTIONS = [
  { label: "Modern Sans-Serif (Inter, system-ui)", value: "Inter, system-ui, sans-serif" },
  { label: "Classic Serif (Georgia, Cambria)", value: "Georgia, Cambria, serif" },
  { label: "Monospace (SFMono, ui-monospace)", value: "ui-monospace, monospace" },
];

function ThemeModal({ isOpen, onClose, theme = DEFAULT_THEME, onUpdateTheme }) {
  const [prevTheme, setPrevTheme] = useState(theme);
  const [localTheme, setLocalTheme] = useState(theme);

  if (theme !== prevTheme) {
    setPrevTheme(theme);
    setLocalTheme(theme);
  }

  if (!isOpen) return null;

  const handleChange = (key, val) => {
    const updated = { ...localTheme, [key]: val };
    setLocalTheme(updated);
    if (onUpdateTheme) onUpdateTheme(updated);
  };

  const applyPreset = (presetTheme) => {
    setLocalTheme(presetTheme);
    if (onUpdateTheme) onUpdateTheme(presetTheme);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <FaPalette className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Global Design System & Themes</h2>
              <p className="text-xs text-gray-500">Configure global color tokens, typography, and styling</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Presets */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Quick Theme Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_PRESETS.map((preset) => {
                const isActive = localTheme.mode === preset.theme.mode && localTheme.primaryColor === preset.theme.primaryColor;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset.theme)}
                    className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs font-semibold transition ${
                      isActive
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xs"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.theme.primaryColor }}
                    />
                    <span className="truncate">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Mode */}
          <div className="border-t border-gray-100 pt-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Color Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  handleChange("mode", "light");
                  if (localTheme.backgroundColor === "#0f172a" || localTheme.backgroundColor === "#050505") {
                    handleChange("backgroundColor", "#ffffff");
                    handleChange("textColor", "#0f172a");
                    handleChange("surfaceColor", "#f8fafc");
                  }
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                  localTheme.mode === "light"
                    ? "border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaSun className="text-amber-500" /> Light Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChange("mode", "dark");
                  if (localTheme.backgroundColor === "#ffffff" || !localTheme.backgroundColor) {
                    handleChange("backgroundColor", "#0f172a");
                    handleChange("textColor", "#f8fafc");
                    handleChange("surfaceColor", "#1e293b");
                  }
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                  localTheme.mode === "dark"
                    ? "border-indigo-600 bg-slate-900 text-white ring-1 ring-indigo-500"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaMoon className="text-indigo-400" /> Dark Mode
              </button>
            </div>
          </div>

          {/* Typography */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Typography Font Family
            </label>
            <select
              value={localTheme.fontFamily || FONT_OPTIONS[0].value}
              onChange={(e) => handleChange("fontFamily", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 outline-none focus:border-indigo-500"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Color Tokens */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Theme Color Tokens
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="mb-1 block text-xs font-semibold text-gray-600">Primary Brand Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.primaryColor || "#2563eb"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={localTheme.primaryColor || "#2563eb"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <span className="mb-1 block text-xs font-semibold text-gray-600">Accent Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.accentColor || "#4f46e5"}
                    onChange={(e) => handleChange("accentColor", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={localTheme.accentColor || "#4f46e5"}
                    onChange={(e) => handleChange("accentColor", e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <span className="mb-1 block text-xs font-semibold text-gray-600">Canvas Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.backgroundColor || "#ffffff"}
                    onChange={(e) => handleChange("backgroundColor", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={localTheme.backgroundColor || "#ffffff"}
                    onChange={(e) => handleChange("backgroundColor", e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <span className="mb-1 block text-xs font-semibold text-gray-600">Base Text Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localTheme.textColor || "#0f172a"}
                    onChange={(e) => handleChange("textColor", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={localTheme.textColor || "#0f172a"}
                    onChange={(e) => handleChange("textColor", e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            type="button"
            onClick={() => applyPreset(DEFAULT_THEME)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-white transition"
          >
            <FaUndo className="text-[10px]" /> Reset to Default
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeModal;

