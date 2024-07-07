varying vec2 vUv;

void main(){
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1);
    gl_Position =  projectionMatrix * viewMatrix * worldPosition; 

}