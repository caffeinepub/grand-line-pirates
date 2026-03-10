import { AvatarClass } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { backend } from "@/services/backendService";
import { Anchor, Skull } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const CLASS_INFO = [
  {
    value: AvatarClass.swordsman,
    label: "Swordsman",
    icon: "⚔️",
    desc: "Master of blades. High strength & speed.",
    color: "#e05555",
    stats: { STR: 90, SPD: 80, DEF: 60, HAKI: 50, STA: 70 },
  },
  {
    value: AvatarClass.navigator,
    label: "Navigator",
    icon: "🧭",
    desc: "Ocean scholar. High haki & speed.",
    color: "#5588e0",
    stats: { STR: 50, SPD: 85, DEF: 60, HAKI: 90, STA: 65 },
  },
  {
    value: AvatarClass.doctor,
    label: "Doctor",
    icon: "💊",
    desc: "Combat medic. High stamina & defense.",
    color: "#55d088",
    stats: { STR: 55, SPD: 65, DEF: 75, HAKI: 70, STA: 95 },
  },
  {
    value: AvatarClass.cook,
    label: "Cook",
    icon: "🍳",
    desc: "All-rounder fighter. Balanced stats.",
    color: "#e0c055",
    stats: { STR: 70, SPD: 70, DEF: 70, HAKI: 65, STA: 80 },
  },
  {
    value: AvatarClass.sniper,
    label: "Sniper",
    icon: "🎯",
    desc: "Precision striker. High defense & range.",
    color: "#a0804a",
    stats: { STR: 60, SPD: 65, DEF: 85, HAKI: 65, STA: 75 },
  },
];

interface Props {
  onCreated: () => void;
}

export function CharacterCreationScreen({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<AvatarClass | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim() || !selectedClass) {
      setError("Please enter a name and select a class.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await backend.createPlayer(name.trim(), selectedClass);
      onCreated();
    } catch {
      setError("Failed to create character. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ocean-deep flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/login-bg.dim_1920x1080.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/80 via-ocean-deep/60 to-ocean-deep" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Skull className="w-8 h-8 text-gold" />
            <h1 className="pirate-title text-4xl text-gold">
              Create Your Pirate
            </h1>
            <Skull className="w-8 h-8 text-gold" />
          </div>
          <p className="text-foreground/50 font-display">
            Choose your path on the Grand Line
          </p>
        </div>

        <div className="hud-panel p-6 mb-6">
          <p className="text-gold font-display font-bold mb-3 tracking-wider uppercase text-sm">
            Pirate Name
          </p>
          <Input
            data-ocid="character.name_input"
            id="pirate-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your legendary pirate name..."
            className="bg-background/50 border-gold/30 text-foreground placeholder:text-foreground/30 text-lg py-3 focus:border-gold"
            maxLength={30}
          />
        </div>

        <div className="hud-panel p-6 mb-6">
          <p className="text-gold font-display font-bold mb-4 tracking-wider uppercase text-sm">
            Choose Your Class
          </p>
          <div className="grid grid-cols-5 gap-3">
            {CLASS_INFO.map((cls, i) => (
              <motion.button
                key={cls.value}
                type="button"
                data-ocid={`character.class.${cls.value}`}
                onClick={() => setSelectedClass(cls.value)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedClass === cls.value
                    ? "border-gold bg-gold/10 shadow-gold"
                    : "border-border/40 bg-card/50 hover:border-gold/50"
                }`}
              >
                <div className="text-3xl mb-2">{cls.icon}</div>
                <div
                  className="font-display font-bold text-sm"
                  style={{ color: cls.color }}
                >
                  {cls.label}
                </div>
                <div className="text-foreground/50 text-xs mt-1 leading-tight">
                  {cls.desc}
                </div>
                <div className="mt-3 space-y-1">
                  {Object.entries(cls.stats).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-1">
                      <span className="text-foreground/40 text-xs w-8">
                        {key}
                      </span>
                      <div className="flex-1 h-1 rounded-full bg-border/30 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${val}%`, background: cls.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {selectedClass === cls.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                    <span className="text-ocean-deep text-xs font-bold">✓</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded bg-destructive/20 border border-destructive/40 text-destructive-foreground text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          <Button
            data-ocid="character.submit_button"
            onClick={handleCreate}
            disabled={loading || !name.trim() || !selectedClass}
            className="px-12 py-5 text-xl font-display font-bold tracking-widest uppercase bg-gold hover:bg-gold-light text-ocean-deep border-2 border-gold-light shadow-gold transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-ocean-deep/40 border-t-ocean-deep rounded-full animate-spin" />
                Creating Legend...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Anchor className="w-5 h-5" />
                Set Sail!
              </span>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
