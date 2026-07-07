import { useEffect, useState } from "react";
import { trpc } from "@/providers/trpc";

export default function RunningText() {
  const { data: runningTextList } = trpc.desa.runningText.list.useQuery();
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    if (!runningTextList || runningTextList.length === 0) return;

    const interval = setInterval(() => {
      setDisplayIndex((prev) => (prev + 1) % runningTextList.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [runningTextList]);

  if (!runningTextList || runningTextList.length === 0) return null;

  const current = runningTextList[displayIndex];

  return (
    <div
      className="sticky bottom-0 z-50 w-full overflow-hidden"
      style={{ backgroundColor: current.backgroundColor || "#dc2626" }}
    >
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .running-text-container {
          animation: scroll-left ${(100 / (current.kecepatan || 50)) * 10}s linear infinite;
          white-space: nowrap;
          padding: 12px 20px;
          display: inline-block;
        }

        .running-text-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* “Window” running text diperkecil + center */}
      <div className="max-w-5xl mx-auto px-4 py-0">
        <div className="running-text-wrapper">
          <div
            className="running-text-container"
            style={{
              color: current.warna || "#ffffff",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            📢 {current.teks}
          </div>
        </div>
      </div>
    </div>
  );
}
