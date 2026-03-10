import { useGameStore } from "@/store/gameStore";
import { Anchor, Package, ScrollText, Skull, Users } from "lucide-react";
import { ActionBar } from "./ActionBar";
import { ChatPanel } from "./ChatPanel";
import { MinimapCanvas } from "./MinimapCanvas";

export function PlayerHUD() {
  const { playerProfile, setActivePanel, activePanel } = useGameStore();

  if (!playerProfile) return null;

  const hp = Number(playerProfile.stats.stamina);
  const maxHp = 100;
  const hpPct = Math.min(100, (hp / maxHp) * 100);
  const staPct = Math.min(
    100,
    (Number(playerProfile.stats.stamina) / maxHp) * 100,
  );

  const QUICK_ACTIONS = [
    {
      icon: Package,
      label: "Inventory",
      panel: "inventory" as const,
      ocid: "hud.inventory_button",
    },
    {
      icon: Users,
      label: "Crew",
      panel: "crew" as const,
      ocid: "hud.crew_button",
    },
    {
      icon: ScrollText,
      label: "Quests",
      panel: "quest" as const,
      ocid: "hud.quest_button",
    },
    {
      icon: Anchor,
      label: "Ship",
      panel: "none" as const,
      ocid: "hud.inventory_button",
    },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 10 }}
    >
      {/* TOP LEFT: Player stats */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="hud-panel p-4 min-w-[220px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
              <Skull className="w-4 h-4 text-gold" />
            </div>
            <div>
              <div className="font-display font-bold text-foreground text-sm">
                {playerProfile.characterName}
              </div>
              <div className="text-xs text-gold">
                Lv.{playerProfile.level.toString()} {playerProfile.avatarClass}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs text-foreground/50 mb-1">
              <span>HP</span>
              <span>
                {hp}/{maxHp}
              </span>
            </div>
            <div className="h-2 bg-border/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${hpPct}%`, background: "#e05555" }}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-foreground/50 mb-1">
              <span>STA</span>
              <span>
                {Math.round(staPct)}/{maxHp}
              </span>
            </div>
            <div className="h-2 bg-border/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${staPct}%`, background: "#e0c055" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Skull className="w-3 h-3 text-gold" />
            <span className="text-gold font-display font-bold">
              ฿{playerProfile.bounty.toString()}
            </span>
            <span className="text-foreground/40 text-xs">Bounty</span>
          </div>

          {playerProfile.devilFruit && (
            <div
              className="mt-2 px-2 py-1 rounded text-xs font-display"
              style={{
                background: "rgba(200,100,255,0.15)",
                border: "1px solid rgba(200,100,255,0.3)",
                color: "#cc66ff",
              }}
            >
              🍎 {playerProfile.devilFruit.name}
            </div>
          )}
        </div>
      </div>

      {/* TOP RIGHT: Minimap */}
      <div className="absolute top-4 right-4">
        <div className="hud-panel p-2">
          <div className="text-xs text-gold/60 font-display text-center mb-1">
            MAP
          </div>
          <MinimapCanvas />
        </div>
      </div>

      {/* BOTTOM RIGHT: Quick access */}
      <div className="absolute bottom-24 right-4 pointer-events-auto flex flex-col gap-2">
        {QUICK_ACTIONS.map(({ icon: Icon, label, panel, ocid }) => (
          <button
            key={label}
            type="button"
            data-ocid={ocid}
            onClick={() =>
              setActivePanel(activePanel === panel ? "none" : panel)
            }
            className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
              activePanel === panel
                ? "bg-gold/30 border border-gold shadow-gold"
                : "hud-panel hover:border-gold/50 hover:bg-gold/10"
            }`}
            title={label}
          >
            <Icon
              className={`w-5 h-5 ${activePanel === panel ? "text-gold" : "text-foreground/60"}`}
            />
          </button>
        ))}
      </div>

      {/* BOTTOM CENTER: Action bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <ActionBar />
      </div>

      {/* BOTTOM LEFT: Chat */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <ChatPanel />
      </div>
    </div>
  );
}
