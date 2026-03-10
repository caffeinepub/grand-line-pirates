import { backend } from "@/services/backendService";
import { useGameStore } from "@/store/gameStore";
import { ScrollText, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function QuestPanel() {
  const { activePanel, setActivePanel, quests } = useGameStore();
  const isOpen = activePanel === "quest";

  const handleComplete = async (questId: bigint) => {
    try {
      await backend.completeQuest(questId);
    } catch {}
  };

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
            <h2 className="font-pirate text-xl text-gold">Quests</h2>
            <button
              type="button"
              data-ocid="panel.quest.close_button"
              onClick={() => setActivePanel("none")}
              className="p-1 rounded hover:bg-border/30 text-foreground/60 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-full pb-20 space-y-3">
            {quests.length === 0 ? (
              <div
                data-ocid="quest.empty_state"
                className="text-center py-12 text-foreground/30"
              >
                <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-display text-sm">No quests available</p>
                <p className="text-xs mt-1">Talk to NPCs for quests</p>
              </div>
            ) : (
              quests.map((quest, i) => (
                <div
                  key={quest.id.toString()}
                  className="p-3 rounded-lg border border-border/30 bg-card/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-display font-bold text-sm text-foreground">
                        {quest.name}
                      </div>
                      <div className="text-xs text-foreground/50 mt-1 leading-relaxed">
                        {quest.description}
                      </div>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-gold">
                          +{quest.reward.xp.toString()} XP
                        </span>
                        <span className="text-gold">
                          +฿{quest.reward.bounty.toString()}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-ocid={`quest.complete_button.${i + 1}`}
                      onClick={() => handleComplete(quest.id)}
                      className="shrink-0 text-xs px-2 py-1 rounded bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
