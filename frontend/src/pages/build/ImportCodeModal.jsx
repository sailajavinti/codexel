import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { FaCode, FaTimes } from "react-icons/fa";
import { parseHTMLToComponents } from "./code-import/codeParser";

const ImportCodeModal = ({ isOpen, onClose, onImport }) => {
  const [code, setCode] = useState(`<!-- Paste your HTML code here -->

<div class="p-6">
  <h1 class="text-3xl font-bold">
    Hello CodeXel
  </h1>

  <p class="mt-2 text-gray-600">
    Edit this code visually in CodeXel.
  </p>

  <button class="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg">
    Get Started
  </button>
</div>`);

  const handleImport = () => {
    const components = parseHTMLToComponents(code);

    if (components.length === 0) {
      alert("No supported HTML components were found.");
      return;
    }

    onImport(components);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FaCode />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Import Existing Code
              </h2>

              <p className="text-sm text-gray-500">
                Paste HTML code and import it into the CodeXel canvas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Editor */}
        <div className="min-h-0 flex-1 bg-[#1e1e1e]">
          <Editor
            height="100%"
            defaultLanguage="html"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              tabSize: 2,
              padding: {
                top: 12,
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            V1 supports HTML elements and basic Tailwind classes.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleImport}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Import to Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCodeModal;