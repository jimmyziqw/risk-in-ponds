import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from 'three';
export default function useRespondAspectChange() {
    const { camera, size } = useThree();
    useEffect(() => {
      (camera as THREE.PerspectiveCamera).aspect = size.width / size.height;
      if (size.width >size.height ) {
        (camera as THREE.PerspectiveCamera).aspect = 1;
      } else {
        camera.updateProjectionMatrix();
      }

    }, [camera, size.width, size.height]);

  }
  