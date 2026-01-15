"use client";

import { useState, useEffect } from "react";

export default function CosmicLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-liner-to-br from-slate-950 via-purple-900/20 to-slate-900 transition-all duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80 animate-pulse">
        <div className="absolute inset-0 w-full h-full border-4 border-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-spin-slow shadow-2xl shadow-cyan-500/30" />

        <div className="absolute inset-8 w-full h-full border-2 border-gradient-to-r from-purple-400 via-pink-500 to-orange-400 rounded-full animate-pulse-ring" />

        <div className="absolute inset-16 w-full h-full bg-liner-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-core-pulse shadow-2xl shadow-cyan-500/50" />

        <div className="absolute inset-20 w-full h-full bg-white/10 backdrop-blur-xl rounded-full animate-inner-glow" />

        <div className="absolute inset-0">
          <div className="particle absolute w-2 h-2 bg-cyan-400 rounded-full animate-float1" />
          <div className="particle absolute w-1.5 h-1.5 bg-purple-400 rounded-full animate-float2" />
          <div className="particle absolute w-2 h-2 bg-pink-400 rounded-full animate-float3" />
          <div className="particle absolute w-1 h-1 bg-orange-400 rounded-full animate-float4" />
        </div>
      </div>

      <div className="absolute text-center mt-32 md:mt-40">
        <div className="text-2xl md:text-3xl font-bold bg-liner-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-text-shimmer mb-2">
          Инициализация AI...
        </div>
        <div className="text-lg md:text-xl text-slate-400 animate-fade-in-up tracking-wider">
          Загрузка нейросети
        </div>
        <div className="flex justify-center items-center gap-2 mt-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce-1" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce-2" />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce-3" />
        </div>
      </div>
    </div>
  );
}
