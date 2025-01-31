import React from "react";
import { Diamond } from "lucide-react";

const LoadingSplash = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative animate-pulse">
          <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
          <div className="relative p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <Diamond className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        </div>
        <div className="text-2xl font-medium text-zinc-100">
          Web<span className="text-blue-400">Mine</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSplash;
