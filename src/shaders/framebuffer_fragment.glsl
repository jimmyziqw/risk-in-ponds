float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec4 getDrop(vec4 info, vec2 coord, vec2 center, float radius, float strength) {
    if (length(center) < 0.1) {
        return info;
    }
    float PI = 3.141592653589793;
    float RANDOM_SCALER = 0.03;

    float rand = random(center) * RANDOM_SCALER;
    float drop = max(0.00, 1.0 - length(center + rand - coord) / radius);

    drop = 0.5 - cos(drop * PI) * 0.5;
    info.r += drop * strength;
    return info;
}

// float getHeighborHeight(sampler2D map, vec2 coord, vec2 delta) {
//     if (neighborCoord.x + delta.x < 0) {
//         return 0.5
//     } else 
// }

vec4 updateHeight(vec4 info, sampler2D map, vec2 coord, vec2 delta) {
    float DAMP = 0.96;
    
    float left =  texture(map, coord - vec2(delta.x, 0.0) ).r ;
    if (coord.x - delta.x < 0.3){
        left = texture(map, coord).r;
    }
    if (coord.x - delta.x+0.0001 < 0.3) {
        
        return info;
    }
    float bottom = texture(map, coord - vec2(0.0, delta.y)).r ;
    float right = texture(map, coord + vec2(delta.x, 0.0)).r ;
    float up = texture(map, coord + vec2(0.0, delta.y)).r;
    float average = (left+bottom+right+up)*0.25;
    float acceleration = (average - info.r) * 2.0; //stablibility s2/c2 >= delta t

    float damp = DAMP;
    // if (coord.x <= 0.5){
    //     damp = 0.9;// throw away info on left...
    // }
    
    info.g += acceleration;
    info.g *= DAMP;  // Damp
    info.r += info.g;
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

void main() {
    vec4 info;
    info = texture(map, vUv);
    info = updateHeight(info, map, vUv, delta);// update first    
    info = updateNormals(info, map, vUv, delta);
    info = getDrop(info, vUv, center, radius, strength);

    gl_FragColor = vec4(info);
}
