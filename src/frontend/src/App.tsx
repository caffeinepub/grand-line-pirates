import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { CharacterCreationScreen } from "@/screens/CharacterCreationScreen";
import { GameScreen } from "@/screens/GameScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { backend, setBackendActor } from "@/services/backendService";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useState } from "react";

type AppPhase = "loading" | "login" | "character_creation" | "game";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { setPlayerProfile } = useGameStore();
  const [phase, setPhase] = useState<AppPhase>("loading");

  // Set the backend actor whenever it's ready
  useEffect(() => {
    if (actor) {
      setBackendActor(actor);
    }
  }, [actor]);

  useEffect(() => {
    if (isInitializing || isFetching || !actor) {
      if (!identity && !isInitializing) setPhase("login");
      else setPhase("loading");
      return;
    }
    if (!identity) {
      setPhase("login");
      return;
    }

    backend
      .getMyPlayerProfile()
      .then((profile) => {
        if (profile) {
          setPlayerProfile(profile);
          setPhase("game");
        } else {
          setPhase("character_creation");
        }
      })
      .catch(() => {
        setPhase("character_creation");
      });
  }, [identity, isInitializing, isFetching, actor, setPlayerProfile]);

  const handleCharacterCreated = async () => {
    try {
      const profile = await backend.getMyPlayerProfile();
      if (profile) setPlayerProfile(profile);
    } catch {}
    setPhase("game");
  };

  if (phase === "loading") {
    return (
      <div className="w-full h-screen bg-ocean-deep flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
          <p className="text-gold/60 font-display tracking-widest text-sm uppercase">
            Loading Grand Line...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {phase === "login" && <LoginScreen />}
      {phase === "character_creation" && (
        <CharacterCreationScreen onCreated={handleCharacterCreated} />
      )}
      {phase === "game" && <GameScreen />}
      <Toaster />
    </>
  );
}
