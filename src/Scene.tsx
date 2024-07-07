import { useRef } from "react";
import useRespondAspectChange from "./utils/useRespondAspectChange.ts";
import { Pond } from "./components/Pond.tsx";
import { Ship } from "./components/Ship.tsx";
import * as THREE from "three";
import { Cloud } from "./components/Cloud.tsx";
import React from "react";


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
			{/* <Cloud /> */}
		</>
	);
}
