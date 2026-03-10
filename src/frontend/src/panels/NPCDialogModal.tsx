import { useGameStore } from "@/store/gameStore";
import { ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const ROLE_LABEL: Record<string, string> = {
  questgiver: "Quest Giver",
  trainer: "Trainer",
  boss: "Boss",
};

export function NPCDialogModal() {
  const { selectedNPC, npcDialogueIndex, setSelectedNPC, advanceNPCDialogue } =
    useGameStore();

  return (
    <AnimatePresence>
      {selectedNPC && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-end justify-center pb-32 pointer-events-auto"
          style={{ zIndex: 30 }}
          onClick={() => setSelectedNPC(null)}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="hud-panel w-[480px] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                  <span className="text-xl">👒</span>
                </div>
                <div>
                  <div className="font-pirate text-lg text-gold">
                    {selectedNPC.name}
                  </div>
                  <div
                    className="text-xs font-display px-2 py-0.5 rounded inline-block"
                    style={{
                      background: "rgba(200,160,60,0.15)",
                      color: "#c8a03c",
                      border: "1px solid rgba(200,160,60,0.3)",
                    }}
                  >
                    {ROLE_LABEL[Object.keys(selectedNPC.role)[0]] ?? "NPC"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                data-ocid="npc.dialog.close_button"
                onClick={() => setSelectedNPC(null)}
                className="p-1 rounded hover:bg-border/30 text-foreground/60 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-background/50 rounded-lg p-4 border border-border/20 mb-4 min-h-[80px]">
              <p className="text-foreground/90 leading-relaxed">
                {selectedNPC.dialogue[npcDialogueIndex] ?? "..."}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/30 font-display">
                {npcDialogueIndex + 1} / {selectedNPC.dialogue.length}
              </span>
              {npcDialogueIndex < selectedNPC.dialogue.length - 1 ? (
                <button
                  type="button"
                  onClick={advanceNPCDialogue}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 transition-colors font-display text-sm"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedNPC(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-gold/30 border border-gold/50 text-gold hover:bg-gold/40 transition-colors font-display text-sm"
                >
                  Farewell
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
