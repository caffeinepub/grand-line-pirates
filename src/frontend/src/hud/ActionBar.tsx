import { useEffect, useRef, useState } from "react";

const ABILITIES = [
  { key: "Q", name: "Slash", color: "#e05555", cooldown: 2 },
  { key: "W", name: "Dodge", color: "#5588e0", cooldown: 4 },
  { key: "E", name: "Special", color: "#aa44ff", cooldown: 6 },
  { key: "R", name: "Haki", color: "#ffaa00", cooldown: 8 },
  { key: "F", name: "Fruit", color: "#55d088", cooldown: 10 },
];

function AbilitySlot({ ability }: { ability: (typeof ABILITIES)[0] }) {
  const [cooldownPct, setCooldownPct] = useState(0);
  const animRef = useRef<number | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === ability.key.toLowerCase() &&
        cooldownPct === 0
      ) {
        startRef.current = Date.now();
        setCooldownPct(100);
        const tick = () => {
          const elapsed = (Date.now() - startRef.current) / 1000;
          const pct = Math.max(0, 100 - (elapsed / ability.cooldown) * 100);
          setCooldownPct(pct);
          if (pct > 0) {
            animRef.current = requestAnimationFrame(tick);
          }
        };
        animRef.current = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("keydown", down);
    return () => {
      window.removeEventListener("keydown", down);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [ability, cooldownPct]);

  const circumference = 2 * Math.PI * 20;
  const dashOffset = circumference * (1 - cooldownPct / 100);

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="w-14 h-14 rounded-lg relative overflow-hidden border-2 transition-colors duration-200"
        style={{
          background:
            cooldownPct > 0 ? "rgba(0,0,0,0.8)" : `${ability.color}22`,
          borderColor:
            cooldownPct > 0 ? "rgba(255,255,255,0.2)" : ability.color,
        }}
      >
        {cooldownPct > 0 && (
          <svg
            className="absolute inset-0"
            viewBox="0 0 46 46"
            width="56"
            height="56"
            aria-hidden="true"
          >
            <circle
              cx="23"
              cy="23"
              r="20"
              fill="none"
              stroke={ability.color}
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xl font-bold"
            style={{
              color: cooldownPct > 0 ? "rgba(255,255,255,0.3)" : ability.color,
            }}
          >
            {ability.key}
          </span>
        </div>
      </div>
      <span className="text-xs text-foreground/40 mt-1 font-display">
        {ability.name}
      </span>
    </div>
  );
}

export function ActionBar() {
  return (
    <div className="hud-panel px-4 py-3 flex gap-2">
      {ABILITIES.map((a) => (
        <AbilitySlot key={a.key} ability={a} />
      ))}
    </div>
  );
}
