import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlayerStats {
    stamina: bigint;
    haki: bigint;
    speed: bigint;
    strength: bigint;
    defense: bigint;
}
export interface UserProfile {
    characterName: string;
    playerId?: bigint;
}
export type Time = bigint;
export interface PlayerProfile {
    id: bigint;
    xp: bigint;
    principal: Principal;
    characterName: string;
    inventory: Array<InventoryItem>;
    isOnline: boolean;
    currentIsland: bigint;
    bounty: bigint;
    level: bigint;
    avatarClass: AvatarClass;
    stats: PlayerStats;
    devilFruit?: DevilFruit;
    position: Position;
    lastSeen: Time;
}
export interface Island {
    id: bigint;
    name: string;
    islandType: IslandType;
    description: string;
    controlledBy?: bigint;
}
export interface Crew {
    id: bigint;
    islandControl?: bigint;
    name: string;
    bountyTotal: bigint;
    memberIds: Array<bigint>;
    captainId: bigint;
}
export interface InventoryItem {
    statBonus: bigint;
    name: string;
    itemType: ItemType;
    rarity: ItemRarity;
}
export interface Position {
    x: bigint;
    z: bigint;
}
export interface DevilFruit {
    id: bigint;
    element: Element;
    name: string;
    description: string;
    abilityType: AbilityType;
    rarity: ItemRarity;
}
export interface Quest {
    id: bigint;
    reward: QuestReward;
    completionCondition: string;
    name: string;
    description: string;
}
export interface ChatMessage {
    content: string;
    sender: bigint;
    islandId?: bigint;
    timestamp: Time;
}
export interface CombatResult {
    winnerId: bigint;
    loserId: bigint;
    timestamp: Time;
    bountyGained: bigint;
}
export interface QuestReward {
    xp: bigint;
    bounty: bigint;
}
export interface NPC {
    name: string;
    role: NPCRole;
    island: bigint;
    dialogue: Array<string>;
}
export enum AbilityType {
    transformation = "transformation",
    control = "control",
    summon = "summon",
    area_attack = "area_attack"
}
export enum AvatarClass {
    navigator = "navigator",
    doctor = "doctor",
    cook = "cook",
    sniper = "sniper",
    swordsman = "swordsman"
}
export enum Element {
    ice = "ice",
    metal = "metal",
    shadow = "shadow",
    fire = "fire",
    wind = "wind",
    gravity = "gravity",
    lightning = "lightning"
}
export enum IslandType {
    port = "port",
    town = "town",
    treasure = "treasure",
    forest = "forest"
}
export enum ItemRarity {
    epic = "epic",
    legendary = "legendary",
    rare = "rare",
    common = "common"
}
export enum ItemType {
    equipment = "equipment",
    sword = "sword",
    treasure = "treasure"
}
export enum NPCRole {
    boss = "boss",
    questgiver = "questgiver",
    trainer = "trainer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addIsland(name: string, islandType: IslandType, description: string): Promise<void>;
    addNPC(name: string, role: NPCRole, island: bigint, dialogue: Array<string>): Promise<void>;
    addQuest(name: string, description: string, reward: QuestReward, completionCondition: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimIsland(crewId: bigint, islandId: bigint): Promise<void>;
    completeQuest(questId: bigint): Promise<void>;
    createCrew(name: string): Promise<bigint>;
    createPlayer(characterName: string, avatarClass: AvatarClass): Promise<PlayerProfile>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCombatResults(): Promise<Array<CombatResult>>;
    getCrews(): Promise<Array<Crew>>;
    getGlobalChat(): Promise<Array<ChatMessage>>;
    getIslandChat(islandId: bigint): Promise<Array<ChatMessage>>;
    getIslands(): Promise<Array<Island>>;
    getMyPlayerProfile(): Promise<PlayerProfile | null>;
    getNPCs(): Promise<Array<NPC>>;
    getOnlinePlayers(): Promise<Array<PlayerProfile>>;
    getPlayerProfileId(id: bigint): Promise<PlayerProfile>;
    getQuests(): Promise<Array<Quest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinCrew(crewId: bigint): Promise<void>;
    leaveCrew(crewId: bigint): Promise<void>;
    logCombatResult(loserId: bigint, bountyGained: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendGlobalMessage(content: string): Promise<void>;
    sendIslandMessage(islandId: bigint, content: string): Promise<void>;
    updatePlayerIsland(islandId: bigint): Promise<void>;
    updatePlayerPosition(x: bigint, z: bigint): Promise<void>;
}
