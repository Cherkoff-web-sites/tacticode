import React from "react";
import { SHOW_COMPILING_PRELOADER } from "../config";

export function CompilingOverlay() {
  if (!SHOW_COMPILING_PRELOADER) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm"
      style={{ pointerEvents: "auto" }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-4 -mt-20">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00459D] animate-spin"
            style={{ animationDuration: "0.8s" }}
          />
        </div>
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          Rendering...
        </p>
      </div>
    </div>
  );
}
