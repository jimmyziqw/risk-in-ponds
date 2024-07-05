export const vertexShader = /* glsl */ `
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = viewPosition.xyz;
    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
}`;

export const fragmentShader = /* glsl */ `
uniform float time;
uniform sampler2D map;
uniform float speed;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    precision highp float;
    float xOffset = vUv.x - speed*time;
    vec2 uv = vec2(xOffset, vUv.y);

    gl_FragColor = texture2D(map, uv);
}`;

