// src/shaders/test_fragment.glsl
precision mediump float;
varying vec3 vPosition;

void main() {
    gl_FragColor = vec4(abs(vPosition), 1.0);
}
