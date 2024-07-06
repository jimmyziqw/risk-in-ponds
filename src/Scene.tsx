import { useCallback, useRef, useState } from "react";
// import Background from "./components/Background.tsx";
import useRespondAspectChange from "./utils/useRespondAspectChange.ts";
import { Pond } from "./components/Pond.tsx";
import { TestCube } from "./components/TestCube.tsx";
import { Ship } from "./components/Ship.tsx";
// import { StandardMesh } from "./components/StandardMesh.tsx";
import * as THREE from "three";
import { Cloud }  from "./components/Cloud.tsx";
export function Scene() {
	useRespondAspectChange();
	const shipRef = useRef<THREE.Mesh>(null);
	return (
		<>
			<Pond shipRef={shipRef}/>
			{/* <mesh>
				<boxGeometry/>
				<meshBasicMaterial color="orange"/>
			</mesh> */}
			{/* <TestCube /> */}
			<Cloud />
			<Ship shipRef={shipRef}/>
 

			{/* <Background name="background" texturePath="textures/solarium5.jpg" />
			<Background name="background001" texturePath="textures/solarium5.jpg" /> */}
		</>
	);
}
