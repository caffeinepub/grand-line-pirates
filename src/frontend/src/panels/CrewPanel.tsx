import { backend } from "@/services/backendService";
import { useGameStore } from "@/store/gameStore";
import { Plus, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function CrewPanel() {
  const { activePanel, setActivePanel, crews, setCrews, playerProfile } =
    useGameStore();
  const isOpen = activePanel === "crew";
  const [newCrewName, setNewCrewName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateCrew = async () => {
    if (!newCrewName.trim()) return;
    setCreating(true);
    try {
      await backend.createCrew(newCrewName.trim());
      const updated = await backend.getCrews();
      setCrews(updated);
      setNewCrewName("");
    } catch {
    } finally {
      setCreating(false);
    }
  };

  const handleJoinCrew = async (crewId: bigint) => {
    try {
      await backend.joinCrew(crewId);
      const updated = await backend.getCrews();
      setCrews(updated);
    } catch {}
  };

  const playerCrewId = playerProfile
    ? crews.find((c) => c.memberIds.includes(playerProfile.id))?.id
    : null;

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
            <h2 className="font-pirate text-xl text-gold">Crews</h2>
            <button
              type="button"
              data-ocid="panel.crew.close_button"
              onClick={() => setActivePanel("none")}
              className="p-1 rounded hover:bg-border/30 text-foreground/60 hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-full pb-20 space-y-4">
            {!playerCrewId && (
              <div>
                <h3 className="text-xs font-display font-bold text-foreground/50 uppercase tracking-widest mb-2">
                  Start a Crew
                </h3>
                <div className="flex gap-2">
                  <input
                    value={newCrewName}
                    onChange={(e) => setNewCrewName(e.target.value)}
                    placeholder="Crew name..."
                    className="flex-1 bg-background/50 border border-border/30 rounded px-2 py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50"
                  />
                  <button
                    type="button"
                    data-ocid="crew.create_button"
                    onClick={handleCreateCrew}
                    disabled={creating || !newCrewName.trim()}
                    className="p-2 rounded bg-gold/20 border border-gold/30 hover:bg-gold/30 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-display font-bold text-foreground/50 uppercase tracking-widest mb-2">
                Active Crews
              </h3>
              {crews.length === 0 ? (
                <div
                  data-ocid="crew.empty_state"
                  className="text-center py-8 text-foreground/30"
                >
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-display text-sm">No crews yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {crews.map((crew, i) => (
                    <div
                      key={crew.id.toString()}
                      className="p-3 rounded border border-border/30 bg-card/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display font-bold text-sm">
                            {crew.name}
                          </div>
                          <div className="text-xs text-foreground/50">
                            {crew.memberIds.length} members · ฿
                            {crew.bountyTotal.toString()}
                          </div>
                        </div>
                        {!playerCrewId && (
                          <button
                            type="button"
                            data-ocid={`crew.join.button.${i + 1}`}
                            onClick={() => handleJoinCrew(crew.id)}
                            className="text-xs px-2 py-1 rounded bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30 transition-colors"
                          >
                            Join
                          </button>
                        )}
                        {playerCrewId === crew.id && (
                          <span className="text-xs text-gold font-display">
                            ✓ Member
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
