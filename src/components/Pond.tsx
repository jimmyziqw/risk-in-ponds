import * as THREE from "three";
// import { fragmentShader, vertexShader } from "../shaders/frameBuffer.glsl";
import { fragmentShader as fs, vertexShader as vs } from "../shaders/water.glsl";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import vertexShader from "../shaders/framebuffer_vertex.glsl"
import fragmentShader from "../shaders/framebuffer_fragment.glsl"

export function Pond() {
	const ref = useRef<THREE.Mesh>(null);
	const { scene, raycaster, mouse, camera } = useThree();
	const bufferScene = new THREE.Scene();
	const floorTexture = useTexture("textures/floor3.jpg");
	const wallTexture = useTexture("textures/beigeWall.jpg");
	const foamTexture = useTexture("textures/seaFoam2.jpg");
	const petalTexture = useTexture("textures/petal.png");
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
		radius: { value: 0.02 },
		strength: { value: 0.05 },
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
		waveOn: { value: true },
		transitionProgress: { value: 0 },
		planePosition: { value: new THREE.Vector3(0, 1, 0) },
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

	const handlePointerEvent = (mouseDown: boolean) => {
		if (!ref.current) return;
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObject(ref.current);
		if (intersects && intersects.length > 0) {
			const material = bufferObject.material as THREE.ShaderMaterial;
			const uv = intersects[0].uv;
			if (!mouseDown) {
				material.uniforms.center.value.set(null);
			} else material.uniforms.center.value = uv;
		}
	};

	let time = 0;

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
	});
	let isDragging = false;
	document.onmousedown = function () {
		handlePointerEvent(true);
		isDragging = true;
	};
	document.onmouseup = function () {
		handlePointerEvent(false);
		isDragging = false;
	};
	document.onmousemove = function () {
		if (isDragging) handlePointerEvent(true);
	};

	return (
		<group visible={true}>
			<mesh ref={ref} material={material} rotation={[-Math.PI/2,0,0]}>
				<planeGeometry args={[3,3,64,64]} />
			</mesh>
            {/* <mesh rotation={[-Math.PI/2,0,0]}>
				<planeGeometry args={[3,3,64,64]} />
                <meshBasicMaterial color="orange"/>
			</mesh> */}
		</group>
	);
}

// function minMaxScaler(x: number, min: number, max: number) {
//     if (max === min) {
//         console.warn("zero division in minMaxScaler");
//         return 1;
//     } else if (x >= max) return 1.0;
//     else if (x <= min) return 0.0;
//     return (x - min) / (max - min);
// }
