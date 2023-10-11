uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute float aRandom;

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

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    //modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
    // Get attribute from script.js
    //modelPosition.z += aRandom * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}