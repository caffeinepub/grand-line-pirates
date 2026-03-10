import type {
  ChatMessage,
  Crew,
  Island,
  NPC,
  PlayerProfile,
  Quest,
} from "@/backend.d";
import { create } from "zustand";

export type ActivePanel = "none" | "inventory" | "crew" | "quest";

interface GameState {
  playerProfile: PlayerProfile | null;
  onlinePlayers: PlayerProfile[];
  islands: Island[];
  selectedIsland: Island | null;
  chatMessages: ChatMessage[];
  crews: Crew[];
  npcs: NPC[];
  quests: Quest[];
  playerPos: { x: number; z: number };
  activePanel: ActivePanel;
  combatTarget: PlayerProfile | null;
  selectedNPC: NPC | null;
  npcDialogueIndex: number;
  chatTab: "global" | "island";
  chatOpen: boolean;

  setPlayerProfile: (p: PlayerProfile | null) => void;
  setOnlinePlayers: (players: PlayerProfile[]) => void;
  setIslands: (islands: Island[]) => void;
  setSelectedIsland: (island: Island | null) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setCrews: (crews: Crew[]) => void;
  setNpcs: (npcs: NPC[]) => void;
  setQuests: (quests: Quest[]) => void;
  setPlayerPos: (pos: { x: number; z: number }) => void;
  setActivePanel: (panel: ActivePanel) => void;
  setCombatTarget: (target: PlayerProfile | null) => void;
  setSelectedNPC: (npc: NPC | null) => void;
  advanceNPCDialogue: () => void;
  setChatTab: (tab: "global" | "island") => void;
  setChatOpen: (open: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerProfile: null,
  onlinePlayers: [],
  islands: [],
  selectedIsland: null,
  chatMessages: [],
  crews: [],
  npcs: [],
  quests: [],
  playerPos: { x: 0, z: 0 },
  activePanel: "none",
  combatTarget: null,
  selectedNPC: null,
  npcDialogueIndex: 0,
  chatTab: "global",
  chatOpen: false,

  setPlayerProfile: (p) => set({ playerProfile: p }),
  setOnlinePlayers: (players) => set({ onlinePlayers: players }),
  setIslands: (islands) => set({ islands }),
  setSelectedIsland: (island) => set({ selectedIsland: island }),
  setChatMessages: (messages) => set({ chatMessages: messages }),
  setCrews: (crews) => set({ crews }),
  setNpcs: (npcs) => set({ npcs }),
  setQuests: (quests) => set({ quests }),
  setPlayerPos: (pos) => set({ playerPos: pos }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setCombatTarget: (target) => set({ combatTarget: target }),
  setSelectedNPC: (npc) => set({ selectedNPC: npc, npcDialogueIndex: 0 }),
  advanceNPCDialogue: () =>
    set((state) => ({
      npcDialogueIndex: state.selectedNPC
        ? (state.npcDialogueIndex + 1) %
          (state.selectedNPC.dialogue.length || 1)
        : 0,
    })),
  setChatTab: (tab) => set({ chatTab: tab }),
  setChatOpen: (open) => set({ chatOpen: open }),
}));
