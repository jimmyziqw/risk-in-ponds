// import { useFrame, useThree } from "@react-three/fiber";
// import { useMemo, useRef } from "react";
// import useNode from "../../hooks/useNode";
// import * as THREE from "three";
// import { useTexture } from "@react-three/drei";
// import backgroundMaterial from "../../materials/backgroundMaterial";

// export default function Petal({ bufferObject, waterRef }: any) {
// 	const petalRef = useRef<THREE.Mesh>(null);
// 	const petal = useNode("petal");
// 	const texture = useTexture("textures/petal.png");
// 	texture.flipY = false;

// 	const { initPosition, fallingSpeed } = useMemo(() => {
// 		return {
// 			initPosition: petal.position.clone(),
// 			fallingSpeed: -1.8,
// 		};
// 	}, []);
// 	let time = 0;
// 	let isPetalFalled = false;
// 	let isRippleTriggered = false;
// 	const radius = 0.5;
// 	const phase = -Math.PI;
// 	const { camera } = useThree();
// 	useFrame((_, delta) => {
// 		const petal = petalRef.current;
// 		const clampedDelta = Math.min(0.02, delta);

// 		if (petal) {
// 			if (camera.rotation.y > (40 * Math.PI) / 180 && !isPetalFalled) {
// 				petal.position.copy(initPosition);
// 				isPetalFalled = true;
// 			}
// 			// if (camera.rotation.y < 20*Math.PI/180 && isPetalFalled){
// 			//   // petal.position.copy(new);
// 			//   isPetalFalled = false;
// 			// }

// 			let height = petal.position.y;
// 			if (height > 0.5) {
// 				time += clampedDelta;

// 				petal.position.y += delta * fallingSpeed;
// 				petal.position.x = -radius * Math.cos(time * 3 + phase);
// 				petal.position.z = -radius * Math.sin(time * 3 + phase);
// 				// petal.rotation.x += Math.sin(time * 0.01);
// 				petal.rotation.y += Math.sin(time);
// 				petal.rotation.x += Math.sin(time);
// 			}

// 			if (height > 0.2 && height <= 0.5 && waterRef.current) {
// 				const uv = new THREE.Vector2(
// 					petal.position.x / 3 + 0.5,
// 					-petal.position.z / 3 + 0.5
// 				);
// 				if (!isRippleTriggered) {
// 					bufferObject.material.uniforms.center.value = uv; //update logic
// 					isRippleTriggered = true;
// 					time = 0;
// 				} else {
// 					bufferObject.material.uniforms.center.value.set(null);
// 				}
// 				petal.position.y += clampedDelta * -0.2;
// 				waterRef.current.material.uniforms.planePosition.value = new THREE.Vector3(
// 					petal.position.x,
// 					height,
// 					petal.position.z
// 				); //update visual
// 			}
// 		}
// 	});

// 	// const clickHandler = () => {
// 	//   const petal = petalRef.current;
// 	//   if (petal) {
// 	//     petal.position.copy(initPosition);
// 	//   }
// 	// };
// 	return (
// 		<>
// 			{/* <mesh scale={0.1} position={initPosition} //ref={flowerRef} onClick={clickHandler}
// 			>
// 				<boxGeometry />
// 				<meshLambertMaterial color="red" />
// 			</mesh> */}
// 			<mesh
// 				ref={petalRef}
// 				scale={1.0}
// 				geometry={petal.geometry}
// 				material={backgroundMaterial(texture, false)}
// 				position={initPosition}
// 			/>
// 		</>
// 	);
// }
