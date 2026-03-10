# Grand Line Pirates

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full browser-based pirate RPG game with 3D ocean world using Three.js / React Three Fiber
- User registration, login, character creation (name, avatar class selection)
- Player stats: strength, speed, defense, haki, stamina, level, XP
- 3D ocean map with islands (town, forest, port, treasure areas)
- Ship sailing mechanic for ocean travel
- Real-time-style multiplayer via polling (show other players on map)
- Global chat and local chat
- PvP combat system with sword attacks, dash/dodge, special abilities, cooldown timers
- HP and stamina bars
- Devil Fruit power system: fire, lightning, ice, gravity, shadow, wind
- AI Fruit Generator combining elements and ability types procedurally
- NPC pirates (quest givers, trainers, bosses) inspired by One Piece legends
- Bounty system: gain bounty from kills, become target for bounty hunters
- Ship ownership and ship-to-ship battles
- Inventory: swords, fruits, treasure, equipment
- HUD: health bar, stamina bar, bounty display, minimap, inventory menu, crew interface
- Crew creation and management
- Anime-inspired visual style

### Modify
- None

### Remove
- None

## Implementation Plan
1. Select `authorization` component for user login/registration
2. Generate Motoko backend: player profiles, stats, inventory, crews, bounties, chat, world state, fruits
3. Build Three.js/R3F frontend: ocean world scene, islands, character controller, combat, HUD, menus
4. Wire authorization flow: registration, login, character creation
5. Connect game state to backend via polling for pseudo-multiplayer
6. Implement Devil Fruit generator and power system
7. Add NPC system, quest UI, bounty display
8. Add ship sailing, inventory, crew management
