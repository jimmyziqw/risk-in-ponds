import { useRef, useEffect, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNodes } from "../utils/useNode";
const movingSpeed = 0.01;

export function Ship({ shipRef }: { shipRef: MutableRefObject<THREE.Mesh | null> }) {
	const duckMeshes = useNodes("duck");
	const movement = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false,
	});

	useEffect(() => {
		const handleKeyDown = (event: { key: any }) => {
			switch (event.key) {
				case "w":
					movement.current.forward = true;
					break;
				case "s":
					movement.current.backward = true;
					break;
				case "a":
					movement.current.left = true;
					break;
				case "d":
					movement.current.right = true;
					break;
				default:
					break;
			}
		};

		const handleKeyUp = (event: { key: any }) => {
			switch (event.key) {
				case "w":
					movement.current.forward = false;
					break;
				case "s":
					movement.current.backward = false;
					break;
				case "a":
					movement.current.left = false;
					break;
				case "d":
					movement.current.right = false;
					break;
				default:
					break;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useFrame(() => {
		if (shipRef.current) {
			const position = shipRef.current.position;
			const rotation = shipRef.current.rotation;
			if (movement.current.forward) {
				position.z -= movingSpeed;
				if (rotation.y != 0) {
					rotation.y = 0;
				}
			}
			if (movement.current.backward) {
				position.z += movingSpeed;
				if ((rotation.y! = Math.PI)) {
					rotation.y = Math.PI;
				}
			}
			if (movement.current.left) {
				position.x -= movingSpeed;
				rotation.y = Math.PI / 2;
			}
			if (movement.current.right) {
				position.x += movingSpeed;
				rotation.y = (Math.PI / 2) * 3;
			}
		}
	});
	return (
		<group ref={shipRef} position={[0, 0.15, 1]}>
			<group scale={0.1} rotation={[0, -Math.PI / 2, 0]}>
				{duckMeshes.map((node) => (
				<mesh
					geometry={node.geometry}
					material={node.material}
					position={node.position}
					rotation={node.rotation}
				/>
			))}
			</group>
			
		</group>
	);
}
