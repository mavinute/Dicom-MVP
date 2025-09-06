"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useMemo, useState, useEffect } from "react";
import { Group } from "three";

export default function ObjViewer({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  const [object, setObject] = useState<Group | null>(null);

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(
      url,
      (group) => setObject(group),
      undefined,
      (err) => console.error("Erro ao carregar OBJ:", err)
    );

    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <div className="w-[600px] h-[600px] border rounded shadow bg-white">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        {object && <primitive object={object} scale={0.02} />}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
