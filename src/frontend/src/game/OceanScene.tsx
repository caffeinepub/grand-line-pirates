import type { NPC } from "@/backend.d";
import type { AvatarClass } from "@/backend.d";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(2000, 2000, 80, 80), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const y =
        Math.sin(x * 0.05 + t * 0.8) * 2 + Math.sin(z * 0.04 + t * 0.6) * 1.5;
      pos.setZ(i, y);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geo}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
    >
      <meshStandardMaterial
        color="#0a2a50"
        roughness={0.1}
        metalness={0.6}
        side={THREE.DoubleSide}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 4, 0]}>
        <coneGeometry args={[3, 6, 6]} />
        <meshStandardMaterial color="#2d6e2d" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 5]} />
        <meshStandardMaterial color="#6b4226" />
      </mesh>
    </group>
  );
}

interface IslandProps {
  position: [number, number, number];
  name: string;
  radius?: number;
  color?: string;
  treeCount?: number;
}

export function IslandMesh({
  position,
  name,
  radius = 40,
  color = "#c8a85a",
  treeCount = 5,
}: IslandProps) {
  const treePositions = useMemo(() => {
    const positions: Array<{ pos: [number, number, number]; key: string }> = [];
    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2;
      const r = radius * 0.4 + (i % 3) * radius * 0.1;
      positions.push({
        pos: [Math.cos(angle) * r, 5, Math.sin(angle) * r],
        key: `tree-${name}-${i}`,
      });
    }
    return positions;
  }, [radius, treeCount, name]);

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius * 1.1, 5, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[radius - 2, radius, 1.5, 32]} />
        <meshStandardMaterial color="#4a8a3a" roughness={0.9} />
      </mesh>
      {treePositions.map(({ pos, key }) => (
        <Tree key={key} position={pos} />
      ))}
      <Html position={[0, 20, 0]} center>
        <div
          className="px-2 py-1 rounded text-xs font-display font-bold pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.7)",
            color: "#c8a03c",
            border: "1px solid rgba(200,160,60,0.4)",
            whiteSpace: "nowrap",
            textShadow: "0 0 8px rgba(200,160,60,0.6)",
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

const ELEMENT_COLORS: Record<string, string> = {
  fire: "#ff6a00",
  lightning: "#ffe000",
  ice: "#00e5ff",
  wind: "#00e680",
  shadow: "#8800ff",
  gravity: "#4400cc",
  metal: "#aaaaaa",
};

const CLASS_COLORS: Record<string, string> = {
  swordsman: "#e05555",
  navigator: "#5588e0",
  doctor: "#55d088",
  cook: "#e0c055",
  sniper: "#a0804a",
};

export function PlayerCharacter({
  position,
  avatarClass,
  devilFruitElement,
  isLocalPlayer = false,
}: {
  position: [number, number, number];
  avatarClass: AvatarClass;
  devilFruitElement?: string;
  isLocalPlayer?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const color = CLASS_COLORS[avatarClass] ?? "#ffffff";

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current && isLocalPlayer) {
      meshRef.current.rotation.y = t * 0.5;
    }
    if (auraRef.current) {
      auraRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      (auraRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.3 + Math.sin(t * 2) * 0.1;
    }
  });

  const auraColor = devilFruitElement
    ? (ELEMENT_COLORS[devilFruitElement] ?? "#ffffff")
    : null;

  return (
    <group position={position}>
      {auraColor && (
        <mesh ref={auraRef}>
          <sphereGeometry args={[4.5, 12, 12]} />
          <meshStandardMaterial
            color={auraColor}
            transparent
            opacity={0.35}
            emissive={auraColor}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
      <mesh ref={meshRef} position={[0, 3, 0]}>
        <capsuleGeometry args={[1.2, 2.5, 4, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, 6.5, 0]}>
        <sphereGeometry args={[1.1, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

const NPC_ISLAND_POSITIONS: Record<string, [number, number, number]> = {
  "0": [0, 3, 0],
  "1": [200, 3, -150],
  "2": [-180, 3, 200],
  "3": [300, 3, 100],
  "4": [-100, 3, -300],
};

export function NPCCharacter({
  npc,
  onClick,
}: { npc: NPC; onClick: () => void }) {
  const islandKey = npc.island.toString();
  const base = NPC_ISLAND_POSITIONS[islandKey] ?? [0, 3, 0];
  const nameHash = npc.name.length % 30;
  const offset: [number, number, number] = [
    base[0] + nameHash - 15,
    base[1],
    base[2] + nameHash * 0.7 - 10,
  ];

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js mesh doesn't support keyboard events
    <group position={offset} onClick={onClick}>
      <mesh position={[0, 3, 0]}>
        <capsuleGeometry args={[1.2, 2.5, 4, 8]} />
        <meshStandardMaterial
          color="#ffaa44"
          roughness={0.4}
          emissive="#ffaa44"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 6.5, 0]}>
        <sphereGeometry args={[1.1, 8, 8]} />
        <meshStandardMaterial color="#ffaa44" roughness={0.4} />
      </mesh>
      <Html position={[0, 10, 0]} center>
        <div
          className="px-2 py-1 rounded text-xs font-display font-bold pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.8)",
            color: "#ffaa44",
            border: "1px solid rgba(255,170,68,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          {npc.name}
        </div>
      </Html>
    </group>
  );
}

export function ShipMesh({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.8) * 0.05;
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.2) * 0.5;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 3, 18]} />
        <meshStandardMaterial color="#6b4226" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 12]} />
        <meshStandardMaterial color="#4a3010" />
      </mesh>
      <mesh position={[0, 6, -1]}>
        <planeGeometry args={[7, 8]} />
        <meshStandardMaterial color="#e8dcc0" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
