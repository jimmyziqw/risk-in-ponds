import fragmentShader from '../shaders/test_fragment.glsl';
import vertexShader from '../shaders/test_vertex.glsl';
import * as THREE from "three";
export function TestCube(){
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {},
    }
    )
    return (
        <mesh material={material}>
            <boxGeometry/>
        </mesh>
    )
}

