import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "models/summer-sale.glb";

// assert mesh type
export default function useNode(name: string, modelPath: string = MODEL_PATH) {
	const { nodes } = useGLTF(modelPath);
	const object = nodes[name];
	if (!(object instanceof THREE.Mesh)) {
		throw new Error(`expect a mesh, got ${object}`);
	}
	return object;
}


// loading meshes for prototype
export function useNodes(prefix: string, modelPath: string = MODEL_PATH) {
	const { nodes } = useGLTF(modelPath);
	const filteredNodes = Object.keys(nodes)
		.filter(key => key.startsWith(prefix))
		.map(key => {
			const object = nodes[key];
			if (!(object instanceof THREE.Mesh)) {
				throw new Error(`expect a mesh, got ${object}`);
			}
			return object;
		});
	return filteredNodes;
}