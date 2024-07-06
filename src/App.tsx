import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { OrbitControls } from "@react-three/drei";
// import { OrbitControls } from "@react-three/drei";
function App() {
	console.log('wokring')
	return (
		<>
			<Canvas
				frameloop="always"
				shadows
				dpr={[1, 1.5]}
				camera={{
					position: [0, 1, 3],
					//rotation: [Math.PI / 2, 0, 0],
					fov: 40,
				}}
			>
				<ambientLight />
				<directionalLight position={[-1,1,1]} intensity={2}/>
				<Scene />
				{/* <OrbitControls/> */}
            {process.env.NODE_ENV === "development" && <axesHelper position={[0, 0.5, 0]} />}
			</Canvas>

		</>
	);
}

export default App;
