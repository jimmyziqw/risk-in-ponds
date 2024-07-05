//https://catlikecoding.com/unity/tutorials/flow/waves/
//https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models
//https://www.youtube.com/watch?v=QAH1Kep3zRM
// https://ubm-twvideo01.s3.amazonaws.com/o1/vault/gdc08/slides/S6509i1.pdf

export const gerstner = /*glsl*/ `
const float k0 = 3.14159/1.;
    // const float amp = 3.0;
    const float c0 = sqrt(9.8/k0) ;
    // const float s = 1.0 ;

struct GerstnerWave {
    vec3 position;
    vec3 normal;
};
GerstnerWave getOneWave(vec3 worldPosition, float time, vec3 d, float s, float k, float c) {
    GerstnerWave wave; 
    d = normalize(d);
    vec3 _worldPosition;
    float phase =k*(dot(d.xz, worldPosition.xz)  -c* time);//need constant
    _worldPosition.x = worldPosition.x + d.x*s/k*cos(phase);
    _worldPosition.y = s/k*sin(phase);
    _worldPosition.z = worldPosition.z + d.z*s/k*cos(phase);
    vec3 tangent = vec3(
        1.0 - d.x*d.x*s * sin(phase),
        d.x*s * cos(phase),
        -d.x*d.z*s*sin(phase)
    );
    vec3 binormal = vec3(
        -d.x * d.z * (s * sin(phase)),
        d.z * (s * cos(phase)),
        1.0 - d.z * d.z * (s * sin(phase))
    );
    vec3 normal = normalize(cross(binormal, tangent));
    wave.position = _worldPosition;
    wave.normal = normal;
    return wave;
}




struct WaveParams {
    vec3 direction; // Direction of the wave 
    float k;        // Wave number, which determines the frequency
    float c;        // Speed constant, determining the speed of the wave
};

WaveParams waves[4];
void initWaves() {
    waves[0] = WaveParams(vec3(1.2, 0.0, 0.9), 1.0, 0.91);
    waves[1] = WaveParams(vec3(1.1, 0.0, 1.2), 1.22, 0.7);
    waves[2] = WaveParams(vec3(0.7, 0.0, -0.3), 1.13, 1.32);
    waves[3] = WaveParams(vec3(0.9, 0.0, 0.1), 1.37, 0.9);
}
GerstnerWave getWaves(vec3 worldPosition, float time, float s, float k0, float c0) {
    vec3 cumulativePosition = vec3(0.0);  
    vec3 cumulativeNormal = vec3(0.0);

    initWaves();
    
    for (int i = 0; i < 4; i++) {
        GerstnerWave wave = getOneWave(worldPosition, time, waves[i].direction, s, waves[i].k*k0, waves[i].c*c0);
        cumulativePosition += wave.position/4.0 ;  
        cumulativeNormal += wave.normal;
    }
    // GerstnerWave wave = getOneWave(worldPosition, time, vec3(1.0, 0.0, 1.0), 6.28, 2.0);
    cumulativeNormal = normalize(cumulativeNormal);  
    GerstnerWave result;
    result.position = cumulativePosition;
    result.normal = cumulativeNormal;
    return result;
}
`;

