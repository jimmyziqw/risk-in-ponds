//https://catlikecoding.com/unity/tutorials/flow/waves/
//https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models
//https://www.youtube.com/watch?v=QAH1Kep3zRM
// https://ubm-twvideo01.s3.amazonaws.com/o1/vault/gdc08/slides/S6509i1.pdf

import { gerstner } from "./gerstnerWave.glsl.ts";
import { lightHelper, updateBoundary } from "./waveHelper.glsl.ts";
export const vertexShader= /*glsl*/ `

varying vec2 vUv;
uniform sampler2D map;
varying vec3 vScaledPosition;
varying vec3 vNormal;
varying vec3 vPosition;
uniform float time;
uniform float transitionProgress; // [0,1]
uniform vec3 deskCenter;
uniform bool waveOn;
${gerstner}
${updateBoundary}

void main(){
    vUv = uv;
    vec4 info = texture(map, uv);
    vec3 worldPosition = (modelMatrix * vec4(position, 1)).xyz;
    // float k0 = 8.28; //float k = k0 /time;//=> inif
    // float c0 = 1.2; //=> 0
    // float s = 0.7;
  // if (worldPosition.y > 0.0 ){ 
  //   worldPosition.y = info.r ;//at 0.5;

 
      // GerstnerWave Wave = getWaves(worldPosition.xyz, time, s*transitionProgress, k0, c0 );
      // vec3 wavePosition = Wave.position;
      // wavePosition = updateBaseline(position, wavePosition, time);//elevation only when wave is on
      // worldPosition = clipBoundary(wavePosition);
      // vScaledPosition = worldPosition;//+transitionProgress-1.0; //make this amplitude => work on this...
      // worldPosition.y = max(0.5, worldPosition.y + transitionProgress); //still water height



  vPosition = worldPosition;
  gl_Position =  projectionMatrix * viewMatrix * vec4(worldPosition,1); 
}
`;

export const fragmentShader = /*glsl*/ `
uniform sampler2D map;
varying vec2 vUv;
uniform bool isInit;
uniform sampler2D tiles[2];
varying vec3 vScaledPosition;
uniform sampler2D foamMap;
uniform sampler2D petalMap;
varying vec3 vNormal;
varying vec3 vPosition;
uniform bool waveOn;
uniform float transitionProgress;
uniform vec3 planePosition;
${lightHelper}

void main() {    // vec3 WAVE_DIRECTION = normalize(vec3(1,1,1));
    precision highp float;
    // vec3 planePosition = vec3(0, planeHeight, 0);
    vec4 res = addLight(map, vUv, vPosition, cameraPosition, planePosition, petalMap );
    vec3 seaColor = vec3(0.3,0.5,0.9);
    vec3 lakeColor = vec3(0.3,0.7,0.7);

    vec3 flatColor = mix(lakeColor, seaColor, transitionProgress);
    vec3 rawColor = mix(flatColor, res.rgb, 0.8); //diffusion;
    vec4 foamTexture = texture(foamMap, vUv);


    float foamMixFactor= pow(vScaledPosition.y*6.28+0.5,3.); //put more weight at the peak
    foamMixFactor = mix(0.0, foamMixFactor, transitionProgress);
    vec3 mixColor = mix(rawColor, foamTexture.rgb, foamMixFactor);
    gl_FragColor = vec4(mixColor, 1);

}
`;
