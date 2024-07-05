//https://catlikecoding.com/unity/tutorials/flow/waves/
//https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models
//https://www.youtube.com/watch?v=QAH1Kep3zRM
// https://ubm-twvideo01.s3.amazonaws.com/o1/vault/gdc08/slides/S6509i1.pdf
export const heightmap = /*glsl*/ `
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
    info.g *= 0.991;  // Damp
    info.r += info.g ;
    return info;
} 

vec4 updateNormals(vec4 info, sampler2D map, vec2 coord, vec2 delta) {
    vec3 dx = vec3(delta.x, texture(map, vec2(coord.x + delta.x, coord.y)).r - info.r, 0.0);
    vec3 dy = vec3(0.0, texture(map, vec2(coord.x, coord.y + delta.y)).r - info.r, delta.y);
    info.ba = normalize(cross(dy, dx)).xz;
    return info;
}
`;

export const lightHelper = /*glsl*/`
vec2 intersectSquare(vec3 rayOrigin, vec3 rayDir, vec3 squareCenter, vec3 normal, vec3 u, vec3 v) {
  // Ensure the normal vector is a unit vector to correctly compute plane distance
  float SIDE_LENGTH = 0.05;
  vec3 unitNormal = normalize(normal);
  float planeDist = dot(unitNormal, squareCenter); // Compute plane distance from origin along the normal

  float denom = dot(unitNormal, rayDir);
  if (abs(denom) > 1e-6) { // Avoid division by zero (ensure not parallel)
      float t = (planeDist - dot(unitNormal, rayOrigin)) / denom;
      if (t >= 0.0) {
          vec3 p = rayOrigin + t * rayDir; // Calculate intersection point
          vec3 diff = p - squareCenter;
          float du = dot(diff, u);
          float dv = dot(diff, v);
          float halfSide = SIDE_LENGTH * 0.5;
          if (abs(du) <= halfSide && abs(dv) <= halfSide) {
              return vec2(du/SIDE_LENGTH+0.5, dv/SIDE_LENGTH+0.5); // Intersection within square bounds
          }
      }
  }
  return vec2(-1,-1); // No valid intersection
}

vec2 intersectCube(vec3 origin, vec3 ray, vec3 cubeMin, vec3 cubeMax) {
    
    vec3 tMin = (cubeMin - origin) / ray;
    vec3 tMax = (cubeMax - origin) / ray;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
  }
  vec2 intersectBoxOverload(vec3 origin, vec3 ray, vec3 boxCenter, vec3 boxSize) {
    vec3 boxMin = vec3(boxCenter) - vec3(boxSize) *0.5;
    vec3 boxMax = vec3(boxCenter) + vec3(boxSize) *0.5;
    return intersectCube(origin, ray, boxMin, boxMax);
  }
  
  vec3 getWallColor(vec3 point) { //hit
    vec3 wallColor;
    vec3 finalColor;
    vec3 normal;
    float _delta = 0.000001; //check edge
    float _mixDelta = 0.02; //blender artifact with low frame buffer resolution

    vec2 _uv = (vec2(point.x, point.z)/3.0+0.5);
   vec3 floorColor = texture(tiles[0], _uv).rgb;
   vec3 wallBaseColor = texture(tiles[1], _uv).rgb;
   wallColor = floorColor;

    if (_uv.x< _mixDelta || _uv.y> 1.0-_mixDelta){ //smooth color at edge
    float mixRatio = smoothstep(  _mixDelta,0.0, min(_uv.x, 1.0-_uv.y));
    wallColor = mix(floorColor, wallBaseColor, mixRatio );
    }
    if (abs(point.x) > 1.5-_delta) {
      wallColor = texture(tiles[1], point.zy * 0.5 + 0.5).rgb;
      normal = vec3(-point.x, 0.0, 0.0);
     
    } else if (abs(point.z) > 1.5-_delta) {
      wallColor = texture(tiles[1], point.xy * 0.5 + vec2(0.5, 0.5)).rgb;
      normal = vec3(0.0, 0.0, -point.z);
    }

    return wallColor;
  }
// vec3 getImageColor(vec3 point, vec3 color, vec3 origin, vec3 ray) {

// } 

vec3 getDeskColor(vec3 point, vec3 color, vec3 origin, vec3 ray){
  vec3 deskCenter =vec3(-0.0,0.5,0.0);
        vec3 deskSize = vec3(0.673,0.5,0.32);
        vec3 boxSize = vec3(0.05, 0.8, 0.05);
        float boxHeight = 0.6;//min(origin.y*0.5, boxSize.y*0.5); ///height is for the water surface , not the goemtry
        vec3[6] boxCenters = vec3[6](
          vec3(deskCenter.x+deskSize.x, boxHeight, deskCenter.z + deskSize.z),
          vec3(deskCenter.x-deskSize.x, boxHeight, deskCenter.z + deskSize.z),
          vec3(deskCenter.x+deskSize.x, boxHeight, deskCenter.z - deskSize.z),
          vec3(deskCenter.x-deskSize.x, boxHeight, deskCenter.z - deskSize.z),
          vec3(deskCenter.x-deskSize.x, 0.25, deskCenter.z),
          vec3(deskCenter.x+deskSize.x, 0.25, deskCenter.z)
        );
        
          float closestDistance = 1.0e30; // Use a large initial value
          vec3 closestColor = color; // Initialize with current color if no intersection is closer
          
          for (int i = 0; i < 6; i++) {
              if (i>=4){
                boxSize = vec3(0.05,0.05,deskSize.z*2.);
              }
              vec2 t = intersectBoxOverload(origin, ray, boxCenters[i], boxSize);
              if (t.x < t.y && t.x < closestDistance) {
                  closestDistance = t.x;
                  closestColor = vec3(0.7,0.3,0.2); // Red color for closest box
              }
          }
          
          color = closestColor;
          return color;
}

vec3 getSurfaceRayColor(vec3 origin, vec3 light, vec3 ray, vec3 waterColor, vec3 squareCenter, sampler2D petalMap) {
    vec3 color;
    float poolHeight = 0.5;
    float l = 1.5;
    float w = 1.5;
    float floorHeight = 0.2;
    if (ray.y < 0.0) {
        vec2 t = intersectCube(origin, ray, vec3(-l, floorHeight, -w), vec3(l, 1.2, w));
        color = vec3(origin + ray*t.y);
        vec3 point = origin + ray * t.y;
        color = getWallColor(point);
        color = getDeskColor(point, color, origin, ray);
        if (squareCenter.y <= 0.5){
          vec3 _u= vec3(1,0,0);
          vec3 _v = vec3(0,0,1);
          vec3 _normal = vec3(0,1,0);

          vec2  _uv = intersectSquare(origin, ray, squareCenter, _normal,  _u,  _v);
          

          if (_uv.x > 0.0 && _uv.y>0.0) {
            vec4 petalTexture = texture(petalMap, _uv);
            if (petalTexture.a > 0.5) {
              color = petalTexture.rgb;
            }

          }
        }
        

    } 
    else {
    vec3 specularColor = vec3(0.7, 0.8, 0.6);
  }
return color;
}
vec4 addLight(sampler2D map, vec2 coord, vec3 position, vec3 eye, vec3 planePosition, sampler2D petalMap) {
        vec3 abovewaterColor = vec3(0.25, 1.0, 1.25);
        vec3 underwaterColor = vec3(0.4, 0.9, 1.0);
    
        vec4 info = texture(map, coord);
         for (int i = 0; i < 5; i++) {
          coord += info.ba * 0.005;
          info = texture(map, coord);
        } 
        vec3 normal;
        normal = vec3(info.b, sqrt(1.0 - dot(info.ba, info.ba)), info.a);
        
        vec3 incomingRay = normalize(position - eye);
        // normal = -normal;
        vec3 reflectedRay = reflect(incomingRay, normal);
        vec3 refractedRay = refract(incomingRay, normal, 1.0 / 1.333);
        float fresnel = mix(0.25, 1.0, pow(1.0 - dot(normal, -incomingRay), 3.0));
        
        vec3 reflectedColor = getSurfaceRayColor(position, incomingRay, reflectedRay, abovewaterColor, planePosition, petalMap);
        vec3 refractedColor = getSurfaceRayColor(position, incomingRay, refractedRay, abovewaterColor, planePosition, petalMap);
        if (position.x > 1.499 || position.z<-1.499){ //bypass lightupdate
          refractedColor = getSurfaceRayColor(position, incomingRay, incomingRay, abovewaterColor, planePosition, petalMap);
          return vec4(refractedColor*0.3,1);
        }
     
        gl_FragColor = vec4(mix(refractedColor, reflectedColor, fresnel), 1.0);

        return gl_FragColor;
    }`

export const updateBoundary = /*glsl*/`

vec3 updateBaseline(vec3 worldPosition, vec3 cumulativePosition, float time){  
  vec3 refPosition = worldPosition; 
  refPosition.y = 0.25-0.25*sin(1.0*worldPosition.x - 0.1*worldPosition.z );
  float mixFactor = min(worldPosition.x, -0.7*worldPosition.z) + 1.8;
  vec3 position = mix(refPosition, cumulativePosition, mixFactor);
  return position;
}

vec3 clipBoundary(vec3 worldPosition ){
  float l = 1.5;
  float dl = 3./64.0;
  float delta = 0.001;//prevent z fighting
  float threshold = l-0.01;

  vec3 position = worldPosition;
  if ( l-dl < position.z && position.z < l+dl ){
      position.z = l-delta;
  } 
  if ( -l-dl < position.z && position.z < -l+dl ){
      position.z = -l+delta;
  }
  if ( l-1.*dl < position.x && position.x < l+10.0*dl){ //TODO rebound the propagation
    position.x = l-delta;
      
  } 
  else if (-l-dl < position.x && position.x < -l+dl  ){
      position.x = -l+delta;
  }
  
  return position;
}
`