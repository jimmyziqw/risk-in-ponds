import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import vertexShader from "../shaders/framebuffer_vertex.glsl";
import fragmentShader from "../shaders/framebuffer_fragment.glsl";
import vs from "../shaders/pond_vertex.glsl";
import fs from "../shaders/pond_fragment.glsl";
const pondSize = 5;
export function Pond({ shipRef }: { shipRef: React.RefObject<THREE.Group> }) {
	const ref = useRef<THREE.Mesh>(null);
	const { scene } = useThree();
	const bufferScene = new THREE.Scene();
	const floorTexture = useTexture("textures/stone.jpg");
	const wallTexture = useTexture("textures/sand.jpg");
	const foamTexture = useTexture("textures/seaFoam2.jpg");
	const petalTexture = useTexture("textures/petal.png");
	const skyTexture = useTexture("textures/skyTree.jpg");

	petalTexture.flipY = false;
	let read = new THREE.WebGLRenderTarget(1024, 1024, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		type: THREE.FloatType,
	});

	let write = new THREE.WebGLRenderTarget(1024, 1024, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		type: THREE.FloatType,
	});

	const bufferUniforms = {
		map: { value: null },
		center: { value: new THREE.Vector2(0.0, 0.0) },
		radius: { value: 0.015 },
		strength: { value: 0.03 },
		delta: { value: new THREE.Vector2(1 / 256, 1 / 256) },
		isInit: { value: true },
	};

	const uniforms = {
		map: { value: null },
		isInit: { value: true },
		tiles: { value: [floorTexture, wallTexture] },
		time: { value: 0 },
		foamMap: { value: foamTexture },
		petalMap: { value: petalTexture },
		skyMap: { value: skyTexture },

		waveOn: { value: true },
		transitionProgress: { value: 0 },
		planePosition: { value: new THREE.Vector3(0, 1, 0) },
		pondSize: {value: pondSize}
	};

	const material = new THREE.ShaderMaterial({
		vertexShader: vs,
		fragmentShader: fs,
		uniforms: uniforms,
		wireframe: false,
		side: THREE.DoubleSide,
	});

	const cameraOrtho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	const bufferMaterial = new THREE.ShaderMaterial({
		uniforms: bufferUniforms,
		vertexShader,
		fragmentShader,
	});

	const plane = new THREE.PlaneGeometry(2, 2);
	let bufferObject = new THREE.Mesh(plane, bufferMaterial);
	bufferScene.add(bufferObject);

	let time = 0;
	const keyState: { [key: string]: boolean } = {};

	const updateShipPosition = () => {
		if (!ref.current || !shipRef.current) return;
		const shipPosition = shipRef.current.position;

		const material = bufferObject.material as THREE.ShaderMaterial;
		const uv = new THREE.Vector2(shipPosition.x / pondSize + 0.5, -shipPosition.z / pondSize + 0.5);

		if (Object.values(keyState).some((value) => value)) {
			material.uniforms.center.value = uv;
			// console.log("key down")
		} else {
			material.uniforms.center.value.set(null);
		}
	};

	// useEffect(() => {
	const handleKeyDown = (event: KeyboardEvent) => {
		keyState[event.key] = true;
		updateShipPosition();
	};

	const handleKeyUp = (event: KeyboardEvent) => {
		keyState[event.key] = false;
		updateShipPosition();
	};

	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);

	// 	return () => {
	// 		window.removeEventListener('keydown', handleKeyDown);
	// 		window.removeEventListener('keyup', handleKeyUp);
	// 	};
	// }, []);

	useFrame(({ gl, camera }, delta) => {
		if (ref.current) {
			time += delta;
			const shaderMaterial = ref.current.material as THREE.ShaderMaterial;
			gl.setRenderTarget(read);
			gl.render(bufferScene, cameraOrtho);

			const temp = write;
			write = read;
			read = temp;

			shaderMaterial.uniforms.map.value = read.texture;
			shaderMaterial.uniforms.time.value = time;
			shaderMaterial.uniforms.isInit.value = false;

			bufferObject.material.uniforms.map.value = write.texture;
			bufferObject.material.uniforms.isInit.value = false;

			gl.setRenderTarget(null);
			gl.render(scene, camera);
		}
		updateShipPosition(); // Update ship position every frame
	});

	return (
		<group visible={true}>
			<mesh ref={ref} material={material} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[pondSize, pondSize, 64, 64]} />
			</mesh>
		</group>
	);
}
