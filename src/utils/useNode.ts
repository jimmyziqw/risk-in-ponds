import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "models/model.glb";
export default function useNode(name: string, modelPath: string = MODEL_PATH) {
  const { nodes } = useGLTF(modelPath);
  const object = nodes[name];
  if (!(object instanceof THREE.Mesh)) {
    throw new Error(`Loading model ${name}; Expect a mesh, got ${object}`);
  }
  return object;
}
