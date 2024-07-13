import { useLoader } from "@react-three/fiber";
import { useNodes } from "../utils/useNode";
import { useMemo } from "react";
import * as THREE from "three";
export function Rocks(){
    const meshes = useNodes("Cube");
    const [diffMap, normalMap, armMap, dispMap] = useLoader(THREE.TextureLoader, [
		"textures/mossy-rock/diff.jpg",
		"textures/mossy-rock/nor.jpg",
		"textures/mossy-rock/arm.jpg",
		// "textures/mossy-rock/disp.jpg",
	]);
	const material = useMemo(() => {
		return new THREE.MeshStandardMaterial({
			map: diffMap,
			normalMap: normalMap,
			// displacementMap: dispMap,
            // displacementScale:0.1,
			aoMap: armMap,
			roughnessMap: armMap,
			metalnessMap: armMap,
		});
	}, []);
    return (
        <group scale={1} position={[0, 0, 0.05]}>
            {meshes.map((node) => (
                <mesh
                    key={node.id}
                    geometry={node.geometry}
                    material={material}
                    position={node.position}
                    rotation={node.rotation}
                />
            ))}
        </group>
        
    )
}