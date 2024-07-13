import { useRef } from "react";
import useRespondAspectChange from "./utils/useRespondAspectChange.ts";
import { Pond } from "./components/Pond.tsx";
import { Ship } from "./components/Ship.tsx";
import * as THREE from "three";
import { Cloud } from "./components/Cloud.tsx";
import React from "react";
import { Stone } from "./components/Stone.tsx";
import { Pepples } from "./components/Pepples.tsx";
import { Rocks } from "./components/Rocks.tsx";


const WaterScene = React.memo(() => {
	const shipRef = useRef<THREE.Group>(null);
	return (
		<>
			<Ship shipRef={shipRef} />
			<Pond shipRef={shipRef} />
		</>
	);
});

export function Scene() {
	// useRespondAspectChange();
	return (
		<>
			<WaterScene />
			<Pepples position={[1, 0.01,-2.5]}/>
			<Stone position={[0,0.1,-1]}/>
			<Stone position={[-2,0.1,-1]}/>
			<Rocks />

			{/* <Cloud /> */}
		</>
	);
}
