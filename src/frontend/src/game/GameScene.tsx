import { AvatarClass } from "@/backend.d";
import { backend } from "@/services/backendService";
import { useGameStore } from "@/store/gameStore";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  IslandMesh,
  NPCCharacter,
  Ocean,
  PlayerCharacter,
  ShipMesh,
} from "./OceanScene";

const ISLAND_CONFIGS = [
  {
    id: 0,
    name: "Foosha Village",
    pos: [0, 0, 0] as [number, number, number],
    color: "#c8a85a",
  },
  {
    id: 1,
    name: "Syrup Village",
    pos: [200, 0, -150] as [number, number, number],
    color: "#8aaa60",
  },
  {
    id: 2,
    name: "Baratie",
    pos: [-180, 0, 200] as [number, number, number],
    color: "#b07a40",
  },
  {
    id: 3,
    name: "Arlong Park",
    pos: [300, 0, 100] as [number, number, number],
    color: "#7a9a60",
  },
  {
    id: 4,
    name: "Loguetown",
    pos: [-100, 0, -300] as [number, number, number],
    color: "#c09060",
  },
];

const KEYS: Record<string, boolean> = {};

function PlayerController() {
  const { camera } = useThree();
  const playerRef = useRef<THREE.Group>(null);
  const posRef = useRef({ x: 0, z: 0 });
  const lastUpdateRef = useRef(0);
  const { playerProfile, setPlayerPos } = useGameStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      KEYS[e.key] = true;
    };
    const up = (e: KeyboardEvent) => {
      KEYS[e.key] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame(({ clock }) => {
    if (!playerRef.current) return;
    const speed = 0.8;
    let dx = 0;
    let dz = 0;
    if (KEYS.w || KEYS.W || KEYS.ArrowUp) dz -= speed;
    if (KEYS.s || KEYS.S || KEYS.ArrowDown) dz += speed;
    if (KEYS.a || KEYS.A || KEYS.ArrowLeft) dx -= speed;
    if (KEYS.d || KEYS.D || KEYS.ArrowRight) dx += speed;
    posRef.current.x += dx;
    posRef.current.z += dz;
    playerRef.current.position.set(posRef.current.x, 2, posRef.current.z);
    const camTarget = new THREE.Vector3(posRef.current.x, 2, posRef.current.z);
    camera.position.lerp(
      new THREE.Vector3(posRef.current.x - 30, 40, posRef.current.z + 60),
      0.08,
    );
    camera.lookAt(camTarget);
    const now = clock.getElapsedTime();
    if (now - lastUpdateRef.current > 2) {
      lastUpdateRef.current = now;
      setPlayerPos({ x: posRef.current.x, z: posRef.current.z });
      backend
        .updatePlayerPosition(
          BigInt(Math.round(posRef.current.x)),
          BigInt(Math.round(posRef.current.z)),
        )
        .catch(() => {});
    }
  });

  const avatarClass = playerProfile?.avatarClass ?? AvatarClass.swordsman;
  const devilFruitElement = playerProfile?.devilFruit
    ? Object.values(playerProfile.devilFruit.element)[0]
    : undefined;

  return (
    <group ref={playerRef} position={[0, 2, 0]}>
      <PlayerCharacter
        position={[0, 0, 0]}
        avatarClass={avatarClass}
        devilFruitElement={devilFruitElement}
        isLocalPlayer
      />
    </group>
  );
}

export function GameScene() {
  const { onlinePlayers, playerProfile, npcs, setSelectedNPC } = useGameStore();

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[100, 100, 50]} intensity={1.2} castShadow />
      <pointLight position={[0, 80, 0]} intensity={0.5} color="#4488ff" />
      <fog attach="fog" args={["#020d1f", 150, 600]} />
      <mesh>
        <sphereGeometry args={[800, 32, 32]} />
        <meshBasicMaterial color="#020d1f" side={THREE.BackSide} />
      </mesh>
      <Ocean />
      {ISLAND_CONFIGS.map((island) => (
        <IslandMesh
          key={island.id}
          position={island.pos}
          name={island.name}
          color={island.color}
        />
      ))}
      <ShipMesh position={[20, 0, 20]} />
      <PlayerController />
      {onlinePlayers
        .filter((p) => playerProfile && p.id !== playerProfile.id)
        .map((player) => (
          <group
            key={player.id.toString()}
            position={[Number(player.position.x), 2, Number(player.position.z)]}
          >
            <PlayerCharacter
              position={[0, 0, 0]}
              avatarClass={player.avatarClass}
              devilFruitElement={
                player.devilFruit
                  ? Object.values(player.devilFruit.element)[0]
                  : undefined
              }
            />
          </group>
        ))}
      {npcs.slice(0, 8).map((npc) => (
        <NPCCharacter
          key={npc.name}
          npc={npc}
          onClick={() => setSelectedNPC(npc)}
        />
      ))}
    </>
  );
}
