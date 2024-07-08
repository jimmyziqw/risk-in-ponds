import { useRef, useEffect, MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useNodes } from "../utils/useNode";

const movingSpeed = 0.02;
const rotationSpeed = 0.005;

export function Ship({ shipRef }: { shipRef: MutableRefObject<THREE.Group | null> }) {
	const duckMeshes = useNodes("duck");
	const movement = useRef({
		forward: false,
		backward: false,
		left: false,
		right: false,
	});
	const mouseMovement = useRef({
		x: 0,
		y: 0,
	});
	const { camera } = useThree();

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

		const handleMouseMove = (event: MouseEvent) => {
			mouseMovement.current.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouseMovement.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	useFrame(() => {
		if (shipRef.current) {
			const position = shipRef.current.position;
			const rotation = shipRef.current.rotation;

			let moveX = 0;
			let moveZ = 0;

			if (movement.current.forward) moveZ -= 1;
			if (movement.current.backward) moveZ += 1;
			if (movement.current.left) moveX -= 1;
			if (movement.current.right) moveX += 1;

			// Normalize movement to handle diagonal movement
			const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
			if (length > 0) {
				moveX /= length;
				moveZ /= length;
			}
			// console.log(moveX,moveZ)
			position.x += moveX*movingSpeed;
			position.z += moveZ*movingSpeed;
			if (moveX !== 0 || moveZ !== 0) {
				rotation.y = Math.atan2(moveX, moveZ)+Math.PI;
			}
			// Update the camera position and rotation
			camera.position.copy(position).add(new THREE.Vector3(0, 1.3, 3));
			camera.lookAt(position);

			// Apply mouse movement to camera rotation
			camera.rotation.y -= mouseMovement.current.x * rotationSpeed;
			camera.rotation.x -= mouseMovement.current.y * rotationSpeed;
		}
	});

	return (
		<group ref={shipRef} position={[0, 0.15, 1]}>
			<group scale={0.1} position={[0, 0, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
				{duckMeshes.map((node) => (
					<mesh
						key={node.id}
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
