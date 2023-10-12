//uniform mat4 projectionMatrix;
//uniform mat4 viewMatrix;
//uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

//attribute vec3 position;
attribute float aRandom;

//attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

// Canot import aRandom in the fragment.glsl but we can send through vertex
//varying float vRandom;
/*
float functionExample(float f)
{
    float d = 1.2;

    return d + f;
}

void functionVoidExample()
{
    float d = 1.2;
    float f = 2.3;
}
*/
void main()
{
    /*
    vRandom = aRandom;

    vec2 vec2D = vec2(1.2, 2.0);
    vec2D *= 2.0;

    vec3 vec3D = vec3(1.2, 2.0, 3.3);

    vec3D.x = 2.2;
    vec3D.y = 1.2;
    vec3D.z = 3.0;

    vec3D.r = 2.2;
    vec3D.g = 1.2;
    vec3D.z = 3.0;

    vec3 vec3D2 = vec3(vec2D, 3.3);
    vec2 vec2D3 = vec3D.xy;

    vec4 vec4D = vec4(1.2, 2.0, 3.3, 4.4);

    float a = 1.12;
    float functResult = functionExample(a);
    */

    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z = elevation;
    vElevation = elevation;

    // Get attribute from script.js
    //modelPosition.z += aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}