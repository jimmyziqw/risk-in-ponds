import { useCallback, useState } from "react";
// import Background from "./components/Background.tsx";
import useRespondAspectChange from "./utils/useRespondAspectChange.ts";
import { Pond } from "./components/Pond.tsx";
import { TestCube } from "./components/TestCube.tsx";
// import { StandardMesh } from "./components/StandardMesh.tsx";

export function Scene() {
	useRespondAspectChange();
	return (
		<>
			<Pond />
			{/* <mesh>
				<boxGeometry/>
				<meshBasicMaterial color="orange"/>
			</mesh> */}
			<TestCube/>
 

			{/* <Background name="background" texturePath="textures/solarium5.jpg" />
			<Background name="background001" texturePath="textures/solarium5.jpg" /> */}
		</>
	);
}
