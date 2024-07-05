varying vec2 vUv;
// uniform sampler2D map;

void main(){
    vUv = uv;
    // vec4 info = texture(map, uv);
    vec4 worldPosition = modelMatrix * vec4(position, 1);
    // vec3 vWorldPosition = worldPosition.xyz;
    gl_Position =  projectionMatrix * viewMatrix * worldPosition; 

}