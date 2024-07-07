import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Environment, OrbitControls } from "@react-three/drei";
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
					position: [0, 2, 3],
					//rotation: [Math.PI / 2, 0, 0],
					fov: 40,
				}}
			>
				<ambientLight />
				{/* <directionalLight position={[-1,1,1]} intensity={2}/> */}
				<Scene />
				<Environment files="textures/puresky_1k.hdr" background/>
				{/* <Environment files="textures/lake.jpg" background/> */}

				{/* <OrbitControls/> */}
            {process.env.NODE_ENV === "development" && <axesHelper position={[0, 0.5, 0]} />}
			</Canvas>

		</>
	);
}

export default App;
