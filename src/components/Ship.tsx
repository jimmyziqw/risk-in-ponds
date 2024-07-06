import React, { useRef, useEffect, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from "three";
export function Ship({shipRef}:{shipRef:MutableRefObject<THREE.Mesh | null>}) {
    // const shipRef = useRef();
    const movement = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'w':
                    movement.current.forward = true;
                    break;
                case 's':
                    movement.current.backward = true;
                    break;
                case 'a':
                    movement.current.left = true;
                    break;
                case 'd':
                    movement.current.right = true;
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event) => {
            switch (event.key) {
                case 'w':
                    movement.current.forward = false;
                    break;
                case 's':
                    movement.current.backward = false;
                    break;
                case 'a':
                    movement.current.left = false;
                    break;
                case 'd':
                    movement.current.right = false;
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        if (shipRef.current) {
            const position = shipRef.current.position;
            
            if (movement.current.forward) position.z -= 0.01;
            if (movement.current.backward) position.z += 0.01;
            if (movement.current.left) position.x -= 0.01;
            if (movement.current.right) position.x += 0.01;
        }
    });
    return (
        <mesh position={[0,0.01,1]} rotation={[-Math.PI/2,0,0]} ref={shipRef}>
            <meshBasicMaterial />
            <coneGeometry args={[0.05,0.2]}/>
        </mesh>
    );
}
