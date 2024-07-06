varying vec2 vUv;
uniform sampler2D map;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vec3 worldPosition = (modelMatrix * vec4(position, 1)).xyz;

    vPosition = worldPosition;
    gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1);
}