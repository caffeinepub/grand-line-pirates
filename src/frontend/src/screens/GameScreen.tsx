import { GameScene } from "@/game/GameScene";
import { PlayerHUD } from "@/hud/PlayerHUD";
import { CrewPanel } from "@/panels/CrewPanel";
import { InventoryPanel } from "@/panels/InventoryPanel";
import { NPCDialogModal } from "@/panels/NPCDialogModal";
import { QuestPanel } from "@/panels/QuestPanel";
import { backend } from "@/services/backendService";
import { useGameStore } from "@/store/gameStore";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";

export function GameScreen() {
  const { setOnlinePlayers, setIslands, setCrews, setNpcs, setQuests } =
    useGameStore();

  // Load game data
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [islands, crews, npcs, quests] = await Promise.all([
          backend.getIslands(),
          backend.getCrews(),
          backend.getNPCs(),
          backend.getQuests(),
        ]);
        setIslands(islands);
        setCrews(crews);
        setNpcs(npcs);
        setQuests(quests);
      } catch {}
    };
    loadAll();
  }, [setIslands, setCrews, setNpcs, setQuests]);

  // Poll online players
  useEffect(() => {
    const poll = async () => {
      try {
        const players = await backend.getOnlinePlayers();
        setOnlinePlayers(players);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [setOnlinePlayers]);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-ocean-deep">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [-30, 40, 60], fov: 60 }}
        shadows
        gl={{ antialias: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <GameScene />
        </Suspense>
      </Canvas>

      {/* 2D HUD overlay */}
      <PlayerHUD />
      <InventoryPanel />
      <CrewPanel />
      <QuestPanel />
      <NPCDialogModal />

      {/* Controls hint */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 hud-panel px-4 py-2 text-xs text-foreground/40 font-display pointer-events-none"
        style={{ zIndex: 5 }}
      >
        WASD / Arrow Keys — Move · SPACE — Combat · Q/W/E/R/F — Abilities
      </div>
    </div>
  );
}
