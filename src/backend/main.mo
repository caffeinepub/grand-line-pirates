import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Data Types
  type Position = { x : Int; z : Int };
  type AvatarClass = { #swordsman; #navigator; #doctor; #cook; #sniper };
  type Element = { #fire; #ice; #lightning; #wind; #shadow; #gravity; #metal };
  type AbilityType = { #control; #transformation; #summon; #area_attack };
  type ItemType = { #sword; #equipment; #treasure };
  type ItemRarity = { #common; #rare; #epic; #legendary };
  type IslandType = { #town; #forest; #port; #treasure };
  type QuestReward = { xp : Nat; bounty : Nat };
  type NPCRole = { #questgiver; #trainer; #boss };

  type DevilFruit = {
    id : Nat;
    name : Text;
    element : Element;
    abilityType : AbilityType;
    description : Text;
    rarity : ItemRarity;
  };

  type InventoryItem = {
    name : Text;
    itemType : ItemType;
    rarity : ItemRarity;
    statBonus : Nat;
  };

  type PlayerStats = {
    strength : Nat;
    speed : Nat;
    defense : Nat;
    haki : Nat;
    stamina : Nat;
  };

  type PlayerProfile = {
    id : Nat;
    principal : Principal;
    characterName : Text;
    avatarClass : AvatarClass;
    level : Nat;
    xp : Nat;
    bounty : Nat;
    currentIsland : Nat;
    position : Position;
    stats : PlayerStats;
    devilFruit : ?DevilFruit;
    inventory : [InventoryItem];
    isOnline : Bool;
    lastSeen : Time.Time;
  };

  type UserProfile = {
    playerId : ?Nat;
    characterName : Text;
  };

  type Crew = {
    id : Nat;
    name : Text;
    captainId : Nat;
    memberIds : [Nat];
    islandControl : ?Nat;
    bountyTotal : Nat;
  };

  type Island = {
    id : Nat;
    name : Text;
    islandType : IslandType;
    description : Text;
    controlledBy : ?Nat;
  };

  type ChatMessage = {
    sender : Nat;
    content : Text;
    timestamp : Time.Time;
    islandId : ?Nat;
  };

  type Quest = {
    id : Nat;
    name : Text;
    description : Text;
    reward : QuestReward;
    completionCondition : Text;
  };

  type NPC = {
    name : Text;
    role : NPCRole;
    island : Nat;
    dialogue : [Text];
  };

  type CombatResult = {
    winnerId : Nat;
    loserId : Nat;
    bountyGained : Nat;
    timestamp : Time.Time;
  };

  // Modules
  module Position {
    public func compare(a : Position, b : Position) : Order.Order {
      if (a.x < b.x) { #less } else if (a.x > b.x) { #greater } else if (a.z < b.z) {
        #less;
      } else if (a.z > b.z) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  module PlayerStats {
    public func compare(a : PlayerStats, b : PlayerStats) : Order.Order {
      compareNat(a, b, #strength, #speed);
    };

    func compareNat(a : PlayerStats, b : PlayerStats, field1 : { #strength; #speed; #defense; #haki; #stamina }, field2 : { #strength; #speed; #defense; #haki; #stamina }) : Order.Order {
      #equal;
    };
  };

  // State
  let profiles = Map.empty<Nat, PlayerProfile>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let principalToPlayerId = Map.empty<Principal, Nat>();
  let crews = Map.empty<Nat, Crew>();
  let islands = Map.empty<Nat, Island>();
  let chatMessages = Map.empty<Nat, ChatMessage>();
  let quests = Map.empty<Nat, Quest>();
  let npcs = Map.empty<Nat, NPC>();
  let combatResults = Map.empty<Nat, CombatResult>();
  let questCompletions = Map.empty<Nat, Set.Set<Nat>>();
  var playerIdCounter = 0;
  var crewIdCounter = 0;
  var chatIdCounter = 0;
  var combatIdCounter = 0;

  // Authorization Mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Required User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to get player ID from caller
  func getPlayerIdFromCaller(caller : Principal) : ?Nat {
    principalToPlayerId.get(caller);
  };

  // Helper function to verify player ownership
  func verifyPlayerOwnership(caller : Principal, playerId : Nat) : Bool {
    switch (profiles.get(playerId)) {
      case (?profile) { Principal.equal(profile.principal, caller) };
      case (null) { false };
    };
  };

  // Helper function to verify crew captain
  func verifyCrewCaptain(playerId : Nat, crewId : Nat) : Bool {
    switch (crews.get(crewId)) {
      case (?crew) { crew.captainId == playerId };
      case (null) { false };
    };
  };

  // Player Functionality
  public query ({ caller }) func getPlayerProfileId(id : Nat) : async PlayerProfile {
    // Anyone can view player profiles (public leaderboard data)
    switch (profiles.get(id)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Cannot find player with id " # id.toText()) };
    };
  };

  public query ({ caller }) func getMyPlayerProfile() : async ?PlayerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) { profiles.get(playerId) };
      case (null) { null };
    };
  };

  public shared ({ caller }) func createPlayer(
    characterName : Text,
    avatarClass : AvatarClass,
  ) : async PlayerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create players");
    };

    // Check if player already exists for this principal
    switch (getPlayerIdFromCaller(caller)) {
      case (?_) { Runtime.trap("Player already exists for this principal") };
      case (null) {};
    };

    let playerId = playerIdCounter;
    playerIdCounter += 1;
    let newProfile : PlayerProfile = {
      id = playerId;
      principal = caller;
      characterName;
      avatarClass;
      level = 1;
      xp = 0;
      bounty = 0;
      currentIsland = 0;
      position = { x = 0; z = 0 };
      stats = { strength = 10; speed = 10; defense = 10; haki = 10; stamina = 10 };
      devilFruit = null;
      inventory = [];
      isOnline = true;
      lastSeen = Time.now();
    };
    profiles.add(playerId, newProfile);
    principalToPlayerId.add(caller, playerId);

    // Update user profile
    let userProfile : UserProfile = {
      playerId = ?playerId;
      characterName;
    };
    userProfiles.add(caller, userProfile);

    newProfile;
  };

  public shared ({ caller }) func updatePlayerPosition(x : Int, z : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update position");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        switch (profiles.get(playerId)) {
          case (?profile) {
            let updatedProfile = {
              profile with
              position = { x; z };
              isOnline = true;
              lastSeen = Time.now();
            };
            profiles.add(playerId, updatedProfile);
          };
          case (null) { Runtime.trap("Player profile not found") };
        };
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  public shared ({ caller }) func updatePlayerIsland(islandId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update island");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        switch (profiles.get(playerId)) {
          case (?profile) {
            let updatedProfile = {
              profile with
              currentIsland = islandId;
              isOnline = true;
              lastSeen = Time.now();
            };
            profiles.add(playerId, updatedProfile);
          };
          case (null) { Runtime.trap("Player profile not found") };
        };
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  public query ({ caller }) func getOnlinePlayers() : async [PlayerProfile] {
    // Anyone can see online players
    let fiveMinutesAgo = Time.now() - 5_000_000_000;
    let onlinePlayers = profiles.filter(
      func(_k, v) {
        v.isOnline and v.lastSeen >= fiveMinutesAgo;
      }
    );
    onlinePlayers.values().toArray();
  };

  // Crew Functionality
  public query ({ caller }) func getCrews() : async [Crew] {
    // Anyone can view crews
    crews.values().toArray();
  };

  public shared ({ caller }) func createCrew(name : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create crews");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        let newCrew : Crew = {
          id = crewIdCounter;
          name;
          captainId = playerId;
          memberIds = [playerId];
          islandControl = null;
          bountyTotal = 0;
        };

        crews.add(crewIdCounter, newCrew);
        let crewId = crewIdCounter;
        crewIdCounter += 1;
        crewId;
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  public shared ({ caller }) func joinCrew(crewId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join crews");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        switch (crews.get(crewId)) {
          case (?crew) {
            // Check if already a member
            let isMember = crew.memberIds.find(func(id) { id == playerId });
            switch (isMember) {
              case (?_) { Runtime.trap("Already a member of this crew") };
              case (null) {
                let updatedCrew = {
                  crew with
                  memberIds = crew.memberIds.concat([playerId]);
                };
                crews.add(crewId, updatedCrew);
              };
            };
          };
          case (null) { Runtime.trap("Crew not found") };
        };
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  public shared ({ caller }) func leaveCrew(crewId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can leave crews");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        switch (crews.get(crewId)) {
          case (?crew) {
            if (crew.captainId == playerId) {
              Runtime.trap("Captain cannot leave crew. Transfer captaincy first or disband crew");
            };

            let updatedMembers = crew.memberIds.filter(func(id) { id != playerId });
            let updatedCrew = {
              crew with
              memberIds = updatedMembers;
            };
            crews.add(crewId, updatedCrew);
          };
          case (null) { Runtime.trap("Crew not found") };
        };
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  public shared ({ caller }) func claimIsland(crewId : Nat, islandId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim islands");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        if (not verifyCrewCaptain(playerId, crewId)) {
          Runtime.trap("Unauthorized: Only crew captain can claim islands");
        };

        switch (crews.get(crewId)) {
          case (?crew) {
            let updatedCrew = {
              crew with
              islandControl = ?islandId;
            };
            crews.add(crewId, updatedCrew);

            // Update island
            switch (islands.get(islandId)) {
              case (?island) {
                let updatedIsland = {
                  island with
                  controlledBy = ?crewId;
                };
                islands.add(islandId, updatedIsland);
              };
              case (null) { Runtime.trap("Island not found") };
            };
          };
          case (null) { Runtime.trap("Crew not found") };
        };
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  // Chat Functionality
  public query ({ caller }) func getGlobalChat() : async [ChatMessage] {
    // Anyone can view global chat
    let globalMessages = chatMessages.filter(
      func(_k, v) {
        switch (v.islandId) {
          case (null) { true };
          case (?_) { false };
        };
      }
    );
    globalMessages.values().toArray();
  };

  public query ({ caller }) func getIslandChat(islandId : Nat) : async [ChatMessage] {
    // Anyone can view island chat
    let filteredMessages = chatMessages.filter(
      func(_k, v) {
        switch (v.islandId) {
          case (?id) { id == islandId };
          case (null) { false };
        };
      }
    );
    filteredMessages.values().toArray();
  };

  public shared ({ caller }) func sendGlobalMessage(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        let message : ChatMessage = {
          sender = playerId;
          content;
          timestamp = Time.now();
          islandId = null;
        };
        chatMessages.add(chatIdCounter, message);
        chatIdCounter += 1;
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  public shared ({ caller }) func sendIslandMessage(islandId : Nat, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        let message : ChatMessage = {
          sender = playerId;
          content;
          timestamp = Time.now();
          islandId = ?islandId;
        };
        chatMessages.add(chatIdCounter, message);
        chatIdCounter += 1;
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  // Combat Functionality
  public shared ({ caller }) func logCombatResult(loserId : Nat, bountyGained : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log combat");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?winnerId) {
        let result : CombatResult = {
          winnerId;
          loserId;
          bountyGained;
          timestamp = Time.now();
        };
        combatResults.add(combatIdCounter, result);
        combatIdCounter += 1;

        // Update winner's bounty
        switch (profiles.get(winnerId)) {
          case (?winnerProfile) {
            let updatedWinner = {
              winnerProfile with
              bounty = winnerProfile.bounty + bountyGained;
            };
            profiles.add(winnerId, updatedWinner);
          };
          case (null) {};
        };
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  public query ({ caller }) func getCombatResults() : async [CombatResult] {
    // Anyone can view combat results (public leaderboard)
    combatResults.values().toArray();
  };

  // Quest Functionality
  public query ({ caller }) func getQuests() : async [Quest] {
    // Anyone can view available quests
    quests.values().toArray();
  };

  public shared ({ caller }) func completeQuest(questId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete quests");
    };

    switch (getPlayerIdFromCaller(caller)) {
      case (?playerId) {
        // Check if already completed
        switch (questCompletions.get(playerId)) {
          case (?completedQuests) {
            if (completedQuests.contains(questId)) {
              Runtime.trap("Quest already completed");
            };
          };
          case (null) {};
        };

        // Mark as completed
        let completedQuests = switch (questCompletions.get(playerId)) {
          case (?set) { set };
          case (null) { Set.empty<Nat>() };
        };
        completedQuests.add(questId);
        questCompletions.add(playerId, completedQuests);

        // Award rewards
        switch (quests.get(questId)) {
          case (?quest) {
            switch (profiles.get(playerId)) {
              case (?profile) {
                let updatedProfile = {
                  profile with
                  xp = profile.xp + quest.reward.xp;
                  bounty = profile.bounty + quest.reward.bounty;
                };
                profiles.add(playerId, updatedProfile);
              };
              case (null) {};
            };
          };
          case (null) { Runtime.trap("Quest not found") };
        };
      };
      case (null) { Runtime.trap("No player associated with this principal") };
    };
  };

  // Island Functionality
  public query ({ caller }) func getIslands() : async [Island] {
    // Anyone can view islands
    islands.values().toArray();
  };

  // NPC Functionality
  public query ({ caller }) func getNPCs() : async [NPC] {
    // Anyone can view NPCs
    npcs.values().toArray();
  };

  // Admin Functions
  public shared ({ caller }) func addIsland(
    name : Text,
    islandType : IslandType,
    description : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add islands");
    };

    let islandId = islands.size();
    let newIsland : Island = {
      id = islandId;
      name;
      islandType;
      description;
      controlledBy = null;
    };
    islands.add(islandId, newIsland);
  };

  public shared ({ caller }) func addQuest(
    name : Text,
    description : Text,
    reward : QuestReward,
    completionCondition : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add quests");
    };

    let questId = quests.size();
    let newQuest : Quest = {
      id = questId;
      name;
      description;
      reward;
      completionCondition;
    };
    quests.add(questId, newQuest);
  };

  public shared ({ caller }) func addNPC(
    name : Text,
    role : NPCRole,
    island : Nat,
    dialogue : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add NPCs");
    };

    let npcId = npcs.size();
    let newNPC : NPC = {
      name;
      role;
      island;
      dialogue;
    };
    npcs.add(npcId, newNPC);
  };
};
