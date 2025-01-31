vec4 getDrop(vec4 info, vec2 coord, vec2 center, float radius, float strength) {
    if (length(center) < 0.1) {return info;}
    const float PI = 3.141592653589793;
    float drop = max(0.00, 1.0 - length(center -coord)/radius);
    drop = 0.5 - cos(drop * PI) * 0.5;//0.5
    info.r += drop * strength;
    return info;
}

vec4 updateHeight(vec4 info, sampler2D map, vec2 coord, vec2 delta) {
    float average = (
        texture(map, coord - vec2(delta.x, 0.0)).r +
        texture(map, coord - vec2(0.0, delta.y)).r +
        texture(map, coord + vec2(delta.x, 0.0)).r +
        texture(map, coord + vec2(0.0, delta.y)).r
    ) * 0.25;
    float acc = (average - info.r) * 2.0; //2.0 stablibility s2/c2 >= delta t
    info.g += acc;
    info.g *= 0.90;  // Damp
    info.r += info.g ;
    return info;
} 

vec4 updateNormals(vec4 info, sampler2D map, vec2 coord, vec2 delta) {
    vec3 dx = vec3(delta.x, texture(map, vec2(coord.x + delta.x, coord.y)).r - info.r, 0.0);
    vec3 dy = vec3(0.0, texture(map, vec2(coord.x, coord.y + delta.y)).r - info.r, delta.y);
    info.ba = normalize(cross(dy, dx)).xz;
    return info;
}

uniform sampler2D map;
varying vec2 vUv;
uniform vec2 delta; 
uniform vec2 center;
uniform float radius;
uniform float strength;
uniform bool isInit;


void main() {
    vec4 info;
    // if (isInit) {
    //     info = vec4(0.5,0.0,0.0,1.0);
    // } else {
    info = texture(map, vUv);    
    info = updateHeight(info, map, vUv, delta);// update first.    
    info = updateNormals(info, map, vUv, delta); // be careful of the order
    info = getDrop(info, vUv, center, radius, strength);

    // }
    gl_FragColor = vec4(info);
}

