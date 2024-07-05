import { heightmap } from "./waveHelper.glsl";
import { gerstner } from "./gerstnerWave.glsl";
export const vertexShader = /*glsl*/ `
${heightmap}
uniform float time;
uniform vec3 interaction;
varying vec3 vColor;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;
uniform vec2 delta; 
uniform vec2 center;
uniform float radius;
uniform float strength;
uniform sampler2D map;
uniform vec3 deskCentor;
void main(){
    vUv = uv;
    vec4 info = texture(map, uv);
    vec4 worldPosition = modelMatrix * vec4(position, 1);
    vec3 vWorldPosition = worldPosition.xyz;
    gl_Position =  projectionMatrix * viewMatrix * worldPosition; 

}
`;

export const fragmentShader = /*glsl*/ `
${heightmap}
${gerstner}
uniform sampler2D map;
varying vec2 vUv;
uniform vec2 delta; 
uniform vec2 center;
uniform float radius;
uniform float strength;
uniform bool isInit;
varying vec3 vWorldPosition;
// uniform float planePosition;
// uniform float time 

void main() {
    vec4 info;
    if (isInit) {
        info = vec4(0.5,0.0,0.0,1.0);
    } else {
        info = texture(map, vUv);    
        info = updateHeight(info, map, vUv, delta);// update first.    
        info = updateNormals(info, map, vUv, delta); // be careful of the order
        info = getDrop(info, vUv, center, radius, strength);

    }
    gl_FragColor = vec4(info);
}
`;
