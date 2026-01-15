"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-liner-to-br from-slate-950 via-purple-900/20 to-slate-900 px-4">
      <div className="text-center max-w-md mx-auto space-y-8 relative">
        {/* Космический портал */}
        <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64 animate-pulse">
          {/* Внешнее кольцо */}
          <div
            className="absolute inset-0 w-full h-full border-4 rounded-full animate-spin-slow border-red-500/50 shadow-2xl shadow-red-500/20"
            style={{
              background:
                "linear-gradient(to right, rgba(239,68,68,0.3), rgba(251,146,60,0.3), rgba(251,191,36,0.3))",
            }}
          />

          <div
            className="absolute inset-16 w-full h-full rounded-full animate-core-pulse-404 shadow-2xl shadow-red-500/50"
            style={{
              background:
                "linear-gradient(to right, rgb(239,68,68), rgb(251,146,60), rgb(251,191,36))",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl font-black bg-liner-to-br from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
              404
            </div>
          </div>

          <div className="absolute inset-0">
            <div className="particle absolute w-3 h-3 bg-red-400 rounded-full animate-float1 top-8 left-8" />
            <div className="particle absolute w-2 h-2 bg-orange-400 rounded-full animate-float2 bottom-12 right-8" />
            <div className="particle absolute w-3 h-3 bg-yellow-400 rounded-full animate-float3 top-20 right-12" />
          </div>
        </div>

        {/* Заголовок - УБРАЛ градиентный текст */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Страница не найдена
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed drop-shadow-md">
            Кажется, ты заблудился в цифровой галактике.
            <br />
            <span className="text-cyan-400 animate-pulse font-semibold">
              Не волнуйся!
            </span>
          </p>
        </div>

        <Link
          href="/"
          className="group inline-block items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm border border-white/20"
          style={{
            background: "linear-gradient(to right, #06b6d4, #3b82f6)",
          }}
        >
          <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Вернуться на главную
        </Link>

        <div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl animate-float-slow opacity-50"
          style={{
            background:
              "linear-gradient(to right, rgba(147,51,234,0.1), rgba(6,182,212,0.1))",
          }}
        />
        <div
          className="absolute -top-20 -left-20 w-32 h-32 rounded-full blur-2xl animate-float-slow-delay opacity-40"
          style={{
            background:
              "linear-gradient(to right, rgba(251,146,60,0.1), rgba(251,191,36,0.1))",
          }}
        />
      </div>
    </div>
  );
}
