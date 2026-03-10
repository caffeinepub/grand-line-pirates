import { useGameStore } from "@/store/gameStore";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const RARITY_COLORS: Record<string, string> = {
  common: "#888888",
  rare: "#4488ff",
  epic: "#aa44ff",
  legendary: "#ffaa00",
};

export function InventoryPanel() {
  const { activePanel, setActivePanel, playerProfile } = useGameStore();
  const isOpen = activePanel === "inventory";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 h-full w-80 hud-panel rounded-none border-l pointer-events-auto"
          style={{ zIndex: 20 }}
        >
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <h2 className="font-pirate text-xl text-gold">Inventory</h2>
            <button
              type="button"
              data-ocid="panel.inventory.close_button"
              onClick={() => setActivePanel("none")}
              className="p-1 rounded hover:bg-border/30 text-foreground/60 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-full pb-20">
            {playerProfile?.devilFruit && (
              <div className="mb-6">
                <h3 className="text-xs font-display font-bold text-foreground/50 uppercase tracking-widest mb-3">
                  Devil Fruit
                </h3>
                <div
                  className="p-3 rounded-lg border-2 animate-glow-pulse"
                  style={{
                    background: "rgba(170,68,255,0.1)",
                    borderColor: "rgba(170,68,255,0.5)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍎</span>
                    <div>
                      <div className="font-display font-bold text-purple-300">
                        {playerProfile.devilFruit.name}
                      </div>
                      <div className="text-xs text-foreground/50">
                        {playerProfile.devilFruit.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <h3 className="text-xs font-display font-bold text-foreground/50 uppercase tracking-widest mb-3">
              Items
            </h3>
            {!playerProfile?.inventory ||
            playerProfile.inventory.length === 0 ? (
              <div
                data-ocid="inventory.empty_state"
                className="text-center py-12 text-foreground/30"
              >
                <div className="text-4xl mb-3">📦</div>
                <p className="font-display text-sm">Your chest is empty</p>
                <p className="text-xs mt-1">Explore islands to find items</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {playerProfile.inventory.map((item) => {
                  const rarityKey = Object.keys(item.rarity)[0];
                  const rarityColor = RARITY_COLORS[rarityKey] ?? "#888";
                  const itemEmoji = item.name.toLowerCase().includes("sword")
                    ? "⚔️"
                    : item.name.toLowerCase().includes("treasure")
                      ? "💎"
                      : "🛡️";
                  return (
                    <div
                      key={item.name}
                      className="p-2 rounded border text-center transition-transform hover:scale-105"
                      style={{
                        borderColor: rarityColor,
                        background: `${rarityColor}15`,
                      }}
                    >
                      <div className="text-xl mb-1">{itemEmoji}</div>
                      <div
                        className="text-xs font-display truncate"
                        style={{ color: rarityColor }}
                      >
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
