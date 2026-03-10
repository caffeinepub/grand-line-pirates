import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Anchor, Skull, Wind } from "lucide-react";
import { motion } from "motion/react";

const PARTICLE_IDS = [
  "p0",
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
  "p10",
  "p11",
];

export function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-ocean-deep">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/login-bg.dim_1920x1080.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/80 via-transparent to-ocean-deep/80" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLE_IDS.map((id, i) => (
          <motion.div
            key={id}
            className="absolute w-1 h-1 rounded-full bg-gold"
            style={{ left: `${10 + i * 8}%`, top: `${20 + (i % 4) * 20}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Skull className="w-12 h-12 text-gold" />
            </motion.div>
            <h1
              className="pirate-title text-7xl md:text-8xl text-gold"
              style={{
                textShadow:
                  "0 0 40px rgba(200,160,60,0.5), 0 4px 20px rgba(0,0,0,0.8)",
              }}
            >
              GRAND LINE
            </h1>
            <motion.div
              animate={{ rotate: [5, -5, 5] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Skull className="w-12 h-12 text-gold" />
            </motion.div>
          </div>
          <h2
            className="pirate-title text-4xl md:text-5xl text-gold-light tracking-widest"
            style={{ textShadow: "0 0 20px rgba(200,160,60,0.4)" }}
          >
            PIRATES
          </h2>
          <p className="mt-4 text-foreground/60 text-lg tracking-widest uppercase font-display">
            Sail the seas. Conquer islands. Become King.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex gap-8 mb-12 text-foreground/50 text-sm"
        >
          {[
            { icon: Anchor, label: "Open World" },
            { icon: Skull, label: "Devil Fruits" },
            { icon: Wind, label: "Real-time PvP" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-gold/60" />
              <span className="font-display tracking-wide">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
        >
          <Button
            data-ocid="login.primary_button"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="relative px-12 py-5 text-xl font-display font-bold tracking-widest uppercase bg-gold hover:bg-gold-light text-ocean-deep border-2 border-gold-light shadow-gold-lg transition-all duration-300 hover:scale-105"
            style={{ minWidth: 280 }}
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-ocean-deep/40 border-t-ocean-deep rounded-full animate-spin" />
                Setting Sail...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Anchor className="w-5 h-5" />
                Set Sail!
              </span>
            )}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 text-foreground/30 text-xs font-display tracking-widest"
        >
          Powered by Internet Identity
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ocean-deep to-transparent" />
    </div>
  );
}
