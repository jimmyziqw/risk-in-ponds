import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

export function Cloud() {
	const meshRef = useRef<THREE.Mesh>(null);
	const texture = useTexture("textures/loopingCloud.jpeg");
	const material = useMemo(() => {
		texture.wrapS = THREE.RepeatWrapping; //st => uv direction
		const material = cloudMaterial(texture);
		return material;
	}, []);

	useFrame((_, delta) => {
		if (meshRef.current) {
			const material = meshRef.current.material as THREE.ShaderMaterial;
			material.uniforms.time.value += delta;
		}
	});

	return (
		<mesh ref={meshRef} position={[0, 0, -3]} rotation={[0, 0, 0]} material={material}>
			<planeGeometry args={[5, 3]} />
		</mesh>
	);
}

const vertexShader = /* glsl */ `
varying vec3 vPosition;
varying vec2 vUv;
void main() {
    vUv = uv;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = viewPosition.xyz;
    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
}`;

const fragmentShader = /* glsl */ `
uniform float time;
uniform sampler2D map;
uniform float speed;
varying vec3 vPosition;
varying vec2 vUv;
void main() {
    precision highp float;
    float xOffset = vUv.x - speed*time;
    vec2 uv = vec2(xOffset, vUv.y);
    gl_FragColor = texture2D(map, uv);
}`;

function cloudMaterial(texture: THREE.Texture, isClipped = false, speed = 0.015) {
	const uniforms = {
		map: { value: texture },
		time: { value: 0 },
		speed: { value: speed },
		isClipped: { value: isClipped },
	};
	return new THREE.ShaderMaterial({
		vertexShader,
		fragmentShader,
		uniforms,
		depthTest: true,
		side: THREE.DoubleSide,
	});
}
