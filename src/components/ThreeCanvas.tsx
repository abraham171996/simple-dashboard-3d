import React, { useMemo, useRef, useState } from "react";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSnackbar } from "notistack";
import { useAppStore } from "../app/store";
import { SceneObject } from "../models/sceneObject";

function Ground({
  onDoubleClick,
}: {
  onDoubleClick: (p: [number, number, number]) => void;
}) {
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    [],
  );
  const { camera } = useThree();

  const onDbl = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const ray = new THREE.Raycaster();
    ray.setFromCamera(e.pointer, camera);
    const p = new THREE.Vector3();
    ray.ray.intersectPlane(plane, p);
    onDoubleClick([p.x, 0.5, p.z]);
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} onDoubleClick={onDbl}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#eaeef6" />
    </mesh>
  );
}

function sizeToScale(size: SceneObject["size"]) {
  if (size === "small") return 0.7;
  if (size === "large") return 1.4;
  return 1.0;
}

function DraggableBox({ obj }: { obj: SceneObject }) {
  const selectObject = useAppStore((s) => s.selectObject);
  const selectedObjectId = useAppStore((s) => s.selectedObjectId);
  const updateObject = useAppStore((s) => s.updateObject);

  const isSelected = selectedObjectId === obj.id;
  const [hovered, setHovered] = useState(false);

  const dragRef = useRef(false);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    [],
  );
  const { camera } = useThree();
  const ray = useMemo(() => new THREE.Raycaster(), []);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    selectObject(obj.id);
    dragRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dragRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = async (e: ThreeEvent<PointerEvent>) => {
    if (!dragRef.current) return;
    e.stopPropagation();

    ray.setFromCamera(e.pointer, camera);
    const p = new THREE.Vector3();
    ray.ray.intersectPlane(plane, p);

    await updateObject(obj.id, { position: [p.x, obj.position[1], p.z] });
  };

  const scale = sizeToScale(obj.size);

  return (
    <mesh
      position={obj.position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        e.stopPropagation();
        selectObject(obj.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered || isSelected ? "#FFDD00" : obj.color}
        roughness={0.35}
        metalness={0.1}
      />
    </mesh>
  );
}

function Scene() {
  const { enqueueSnackbar } = useSnackbar();
  const objects = useAppStore((s) => s.objects);
  const addObjectAt = useAppStore((s) => s.addObjectAt);
  const selectObject = useAppStore((s) => s.selectObject);

  const onAdd = async (p: [number, number, number]) => {
    const res = await addObjectAt(p);
    if (!res.ok) {
      enqueueSnackbar(res.reason ?? "Something went wrong", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <Grid
        args={[60, 60]}
        cellSize={1}
        cellThickness={1}
        sectionSize={5}
        sectionThickness={1.5}
        fadeDistance={40}
      />

      <Ground onDoubleClick={onAdd} />

      {objects.map((obj) => (
        <DraggableBox key={obj.id} obj={obj} />
      ))}
      <mesh
        position={[0, 0, 0]}
        onClick={() => selectObject(null)}
        visible={false}
      >
        <boxGeometry args={[1000, 0.001, 1000]} />
        <meshBasicMaterial />
      </mesh>

      <OrbitControls makeDefault />
    </>
  );
}

export default function ThreeCanvas() {
  return (
    <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
      <Scene />
    </Canvas>
  );
}
