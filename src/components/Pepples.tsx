import { useMemo } from "react";
import useNode from "../utils/useNode";
import { useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
// import { EXRLoader } from "three-stdlib/loaders/EXRLoader";
import { EXRExporter } from "three/addons/exporters/EXRExporter.js";

import * as THREE from "three";
export function Pepples({ ...props }) {
	const mesh = useNode("stone");
	const [diffMap, normalMap, armMap, dispMap] = useLoader(THREE.TextureLoader, [
		"textures/river-pepples/diff.jpg",
		"textures/river-pepples/nor.jpg",
		"textures/river-pepples/arm.jpg",
		"textures/river-pepples/disp.jpg",
	]);
	const material = useMemo(() => {
		return new THREE.MeshStandardMaterial({
			map: diffMap,
			normalMap: normalMap,
			displacementMap: dispMap,
            displacementScale:0.1,
			aoMap: armMap,
			roughnessMap: armMap,
			metalnessMap: armMap,
		});
	}, []);
	return (
		<group {...props}>
			<mesh material={material} rotation={[-Math.PI / 2.5, 0, 0]}>
				<planeGeometry args={[2,2,32,32]}/>
			</mesh>
		</group>
	);
}
