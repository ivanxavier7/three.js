# Shaders

Custom Shaders:
1. Basics
2. Shader Patterns
3. Modified Materials

1 - Basics:
1. Description
2. Documentation
3. Shader Material
4. Vertex Shader
5. Fragment Shader
6. Vertex and Fragment Shader
7. ShaderMaterial
8. More information about Shaders
9. Implementation

2 - Shader Patterns:
1. 
2. 
3. 

3 - Modified Materials:
1. 
2. 
3. 

## 8.1 - Basics

### 1.1 - Description

A material rendered with custom shaders. A shader is a small program written in `GLSL` that runs on the GPU. Calculate which pixels are visible in the scene.

Data sent to the shader:

* Vertices coordinates
* Mesh transformation
* Information about the camera
* Colors
* Textures
* Lights
* Fog
* Etc

Types of shaders:

* `vertex shader` position the vertices on the render
* `fragment shader` color each visible fragment (or pixel) of that geometry
* `frament shader` is executed after the `vertex shader`
* Changes between each vertices (like positions) are called attributes and can only be used in the vertex shader

* Custom shaders can be very simple and performant
* Custom post-processing

### 1.2 - Documentation

* [Shaderific](https://shaderific.com/glsl.html)
* [Kronos group](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php)
* [Book of Shaders](https://thebookofshaders.com/)

``` bash
npm install vite-plugin-glsl
```

### 1.3 - Shader Material

`ShaderMaterial` - Code preset

`RawShaderMaterial` - Nothing inside


### 1.4 - Vertex Shader

`projectionMatrix` - Transform coordinates into the clip space coordinates
`viewMatrix` - Apply transformations relative to the `camera` (position, rotation, field of view, near and far)
`modelMatrix` - Apply transformations relative to the `Mesh` (position, rotation and scale)


`gl_Position` - Is a variable that already exists, contain the position of the vertex on the screen


### 1.5 - Fragment Shader

`precision` - Decides how precise can a float be (`highp`, `mediump`, `lowp`)

`gl_FragColor` - Is a variable that already exists, contain the color of the fragment

### 1.6 - Vertex and Fragment Shader

Can be used in Vertex and Fragment shaders

`uniforms` - Same shader but different results, tweak values easly and 
animate values

### 1.7 - ShaderMaterial

pre-built uniforms, we can remove this variables:

* uniform mat4 projectionMatrix
* uniform mat4 viewMatrix
* uniform mat4 modelMatrix
* attribute vec3 position
* attribute vec2 uv
* precision mediump float

### 1.8 - More information about Shaders

* [The Book of Shaders](https://thebookofshaders.com/)
* [ShaderToy](https://www.shadertoy.com/)
* [The Art of Code](https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg)
* [Lewis Lepton](https://www.youtube.com/channel/UC8Wzk_R1GoPkPqLo-obU_kQ)

### 1.9 - Implementation

`vite.config.js`

``` javascript
import glsl from 'vite-plugin-glsl'

export default {

    //(...)
    ,
    plugins:
    [
        glsl()
    ]
}
```

`script.js`

``` javascript
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/flag-french.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i = 0; i < count; i++)
{
    randoms[i] = Math.random()
}

// attribute to be retrieved in the shader
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    //side: THREE.DoubleSide,
    transparent: true,
    //wireframe: true
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('cyan') },
        uTexture: { value: flagTexture }
    }
})

// GUI
gui.add(material.uniforms.uFrequency.value, 'x')
    .min(0)
    .max(20)
    .step(0.001)
    .name('Frequency - X')

gui.add(material.uniforms.uFrequency.value, 'y')
    .min(0)
    .max(20)
    .step(0.001)
    .name('Frequency - Y')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3
scene.add(mesh)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update uniform variable
    material.uniforms.uTime.value = elapsedTime

    // (...)
}

tick()
```

`vertex.glsl`

``` c
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
```

`fragment.glsl`

``` c
//precision mediump float;
//uniform vec3 uColor;
uniform sampler2D uTexture; // sampler for textures

varying vec2 vUv;
varying float vElevation;

// Variable sent through vertex.glsl
//varying float vRandom;

void main()
{   
    // gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 1.3 + 0.8; // Simulate shadows
    gl_FragColor = textureColor;
}
```