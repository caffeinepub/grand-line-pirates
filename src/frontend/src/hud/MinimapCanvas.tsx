import { useGameStore } from "@/store/gameStore";
import { useEffect, useRef } from "react";

const ISLAND_POSITIONS = [
  { x: 0, z: 0 },
  { x: 200, z: -150 },
  { x: -180, z: 200 },
  { x: 300, z: 100 },
  { x: -100, z: -300 },
];

export function MinimapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playerPos, onlinePlayers } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 150;
    const H = 150;
    const WORLD = 600;

    const toCanvas = (wx: number, wz: number) => ({
      cx: (wx / WORLD + 0.5) * W,
      cy: (wz / WORLD + 0.5) * H,
    });

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(2, 13, 31, 0.9)";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(200,160,60,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const x = (i / 6) * W;
      const y = (i / 6) * H;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    for (const { x, z } of ISLAND_POSITIONS) {
      const { cx, cy } = toCanvas(x, z);
      ctx.fillStyle = "#c8a03c";
      ctx.fillRect(cx - 4, cy - 4, 8, 8);
    }

    for (const p of onlinePlayers) {
      const { cx, cy } = toCanvas(Number(p.position.x), Number(p.position.z));
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ff4444";
      ctx.fill();
    }

    const { cx, cy } = toCanvas(playerPos.x, playerPos.z);
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#c8a03c";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = "rgba(200,160,60,0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);
  }, [playerPos, onlinePlayers]);

  return (
    <canvas
      ref={canvasRef}
      width={150}
      height={150}
      className="rounded"
      style={{ display: "block" }}
    />
  );
}
