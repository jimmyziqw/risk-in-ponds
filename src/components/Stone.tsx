import { useMemo } from "react";
import useNode from "../utils/useNode";
import { useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
// import { EXRLoader } from "three-stdlib/loaders/EXRLoader";
import { EXRExporter } from 'three/addons/exporters/EXRExporter.js';

import * as THREE from 'three';
export function Stone({...props}) {
    const mesh = useNode("stone");
    // const mesh = nodes.geometry;
    // const diffMap = useTexture("textures/aerial/diff.jpg")
    // const norMap = useTexture("textures/aerial/nor.exr")
    // const roughMap = useTexture("textures/aerial/rough.jpg")
    const [diffMap, normalMap, armMap] = useLoader(
        THREE.TextureLoader,[
        "textures/aerial-rock/diff.jpg",
        "textures/aerial-rock/nor.jpg",
        "textures/aerial-rock/arm.jpg"
    ]);
    const material = useMemo(()=>{
        return new THREE.MeshStandardMaterial({
            map:diffMap,
            normalMap: normalMap,
            aoMap: armMap,
            roughnessMap: armMap,
            metalnessMap: armMap
        })
    },[])
    return (
        <mesh scale={0.3} geometry={mesh.geometry} material={material} {...props}>

        </mesh>
    )
}