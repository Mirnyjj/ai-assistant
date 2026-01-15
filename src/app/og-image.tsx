import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Chat Assistant | Frontend Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(90deg, transparent 98%, rgba(59,130,246,0.1) 98%), linear-gradient(0deg, transparent 98%, rgba(59,130,246,0.1) 98%)",
            backgroundSize: "40px 40px",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "60px",
            maxWidth: 1000,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              backgroundImage:
                "linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #38bdf8 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
            }}
          >
            AI Chat Assistant
          </div>

          <div
            style={{
              fontSize: 32,
              color: "#94a3b8",
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
            }}
          >
            Frontend Developer Portfolio
            <br />
            <span style={{ color: "#60a5fa" }}>
              Next.js • React • TypeScript • Tailwind
            </span>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
              padding: 32,
              maxWidth: 600,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 16,
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  background: "#60a5fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                U
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "12px 20px",
                  borderRadius: 20,
                  maxWidth: 300,
                  color: "#e2e8f0",
                }}
              >
                Создай портфолио на Next.js
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  padding: "12px 20px",
                  borderRadius: 20,
                  maxWidth: 300,
                  color: "white",
                }}
              >
                Готово! Посмотри живую демо 🚀
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  background: "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🤖
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
