# Shaders

When we try to animate particles or nature we must improve animation performance with custom shaders

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
01. Normal pattern
02. Normal pattern alternative
03. Simple Grey gradient 
04. Rotated Grey gradient 
05. Inverted Grey gradient
06. Grey gradient but with more white
07. Grey gradient repeating like roof tiles
08. Grey gradient repeating like roof tiles but more black space between tiles
09. Grey gradient repeating like roof tiles but more black space between tiles than pattern 8
10. Rotate last pattern 
11. Patern 9 and 10 added together to make multiple squares
12. Inverted 11 pattern, dots
13. Make the dots rectangles
14. Mix with 13 and 13 in other axis
15. Cross pattern with previous bars
16. Double vertical grey gradient
17. 4 Gradients in square with cross in the middle
18. 4 Gradients in triangles making a X
19. Square with empty square inside
20. Square with bigger empty square inside
21. Color palette of 10 grey colors
22. Color palette of 10*10 grey colors
23. Old tv pixels without channel using Random function
24. Old tv pixels with bigger pixel size, sent the vec2 to random
25. Old tv pixels with bigger pixel size offset (rotated and stretched)
26. Corner gradient 
27. Center gradient 
28. Center gradient but white in the center
29. Center gradient but small white like a sun
30. Same as 30 but stretch, elipse sun
31. Star
32. Rotated Star using function
33. Square empty circle in the middle
34. Eclipse with gradient inside and outside
35. Empty Circle
36. Circle
37. Elastic (Circle with waves)
38. Elastic with X (makes some particles)
39. Complex, like a CPU connector
40. Complex, like a CPU connector
41. 45 % angle gradient
42. 45% angle gradient and screen cuted in the middle
43. 45% gradient like a clock
44. Illusion with 20 triangles
45. Illusion with 20 triangles and bigger dark space
46. Waving circle
47. Perlin Noise - Clouds, Water, Fire, Terrain, Elevation and to animate Grass and Snow (Nature Algorithm)
48. Camouflage
49. Neon Camouflage
50. Celular ( random elastic Circles inside circles)
51. Color application in the Pattern

[Noise Templates](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)

3 - Modified Materials:
1. 
2. 
3. 

## 1 - Basics

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

## 2 - Shader Patterns

`fragment.glsl`

### 2.01 - Normal pattern

``` c
void main()
{
    gl_FragColor = vec4(vUv, 1.0, 1.0);
}
```

### 2.02 - Normal pattern alternative

``` c
void main()
{
    gl_FragColor = vec4(vUv, 0.5, 1.0);
}
```

### 2.03 - Simple Grey gradient  

``` c
void main()
{
    float strength = vUv.x;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.04 - Rotated Grey gradient 

``` c
void main()
{
    float strength = vUv.y;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.05 - Inverted Grey gradient

``` c
void main()
{
    float strength = 1.0 - vUv.y;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.06 - Grey gradient but with more white

``` c
void main()
{
    float strength = vUv.y * 10.0;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.07 - Grey gradient repeating like roof tiles

``` c
void main()
{
    float strength = mod(vUv.y * 10.0, 1.0);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.08 - Grey gradient repeating like roof tiles but more black space between tiles

``` c
void main()
{
    float strength = mod(vUv.y * 10.0, 1.0);
    strength = step(0.5, strength);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.09 - Grey gradient repeating like roof tiles but more black space between tiles than pattern 8

``` c
void main()
{
    float strength = mod(vUv.y * 10.0, 1.0);
    strength = step(0.8, strength);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.10 - Rotate last pattern

``` c
void main()
{
    float strength = mod(vUv.x * 10.0, 1.0);
    strength = step(0.8, strength);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 2.11 - Patern 9 and 10 added together to make multiple squares

``` c
void main()
{
    float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.12 - Inverted 11 pattern, dots

``` c
void main()
{
    float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.13 - Make the dots rectangles

``` c
void main()
{
    float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.14 - Mix with 13 and 13 in other axis

``` c
void main()
{
    float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    float strength = barX + barY;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.15 - Cross pattern with previous bars

``` c
void main()
{
    float barX = step(0.4, mod(vUv.x * 10.0, 1.0));     // thickness 0.4 so + 0.2 to center
    barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    float strength = barX + barY;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 2.16 - Double vertical grey gradient

``` c
void main()
{
    float strength = abs(vUv.x - 0.5);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.17 - 4 Gradients in square with cross in the middle
``` c
void main()
{
    float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.18 - 4 Gradients in triangles making a X

``` c
void main()
{
    float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));


    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.19 - Square with empty square inside

``` c
void main()
{
    float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));


    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.20 - Square with bigger empty square inside

``` c
void main()
{
    float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // Oposite pattern, we can combine with *
    float strength = 1.0 - step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));


    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 2.21 - Color palette of 10 grey colors

``` c
void main()
{
    float strength = floor(vUv.x * 10.0) / 10.0;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.22 - Color palette of 10*10 grey colors

``` c
void main()
{
    float hBars = floor(vUv.x * 10.0) / 10.0;
    float vBars = floor(vUv.y * 10.0) / 10.0; 

    float strength = hBars * vBars; // * to combine

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.23 - Old tv pixels without channel using Random function

``` c
// Random function
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main()
{
    float strength = random(vUv);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.24 - Old tv pixels with bigger pixel size, sent the vec2 to random

``` c
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main()
{
    float gridUv = random(vUv);

    vec2 gridUv = vec2(
        floor(vUv.x * 10.0) / 10.0,
        floor(vUv.y * 10.0) / 10.0
    );

    gl_FragColor = vec4(vec3(gridUv), 1.0);
}
```

### 2.25 - Old tv pixels with bigger pixel size offset (rotated and stretched)

``` c
void main()
{
    vec2 gridUv = vec2(
        floor(vUv.x * 10.0) / 10.0,
        floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0
    );

    gl_FragColor = vec4(vec3(gridUv), 1.0);
}
```
### 2.26 - Corner gradient 
``` c
void main()
{
    float strength = length(vUv);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.27 - Center gradient 
``` c
void main()
{
    float strength = length(vUv - 0.5);
    // or
    float strength = distance(vUv, vec2(0.5, 0.5)); // can controll the center

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.28 - Center gradient but white in the center

``` c
void main()
{
    float strength = 1.0 - (distance(vUv, vec2(0.5, 0.5))) * 0.8;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.29 - Center gradient but small white like a sun

``` c
void main()
{
    float strength = 0.015 / distance(vUv, vec2(0.5, 0.5));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.30 - Same as 30 but stretch, elipse sun

``` c
void main()
{
    vec2 lightUv = vec2(
        vUv.x * 0.1 + 0.45,
        vUv.y * 0.5 + 0.25
    );
    float strength = 0.015 / distance(lightUv, vec2(0.5, 0.5));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 2.31 - Star

``` c
void main()
{
    vec2 lightUvX = vec2(
        vUv.x * 0.1 + 0.45,
        vUv.y * 0.5 + 0.25
    );
    float lightX = 0.015 / distance(lightUvX, vec2(0.5, 0.5));

    vec2 lightUvY = vec2(
        vUv.y * 0.1 + 0.45,
        vUv.x * 0.5 + 0.25
    );
    float lightY = 0.015 / distance(lightUvY, vec2(0.5, 0.5));

    float strength = lightX * lightY;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.32 - Rotated Star using function

``` c
// Rotate function
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main()
{
    vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));    // UVCoordinates, Angle, X, Y

    vec2 lightUvX = vec2(
        rotatedUv.x * 0.1 + 0.45,
        rotatedUv.y * 0.5 + 0.25
    );
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    vec2 lightUvY = vec2(
        rotatedUv.y * 0.1 + 0.45,
        rotatedUv.x * 0.5 + 0.25
    );
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    float strength = lightX * lightY;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.33 - Square empty circle in the middle

``` c
void main()
{
    float strength = step(0.25, distance(vUv, vec2(0.5)));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.34 - Eclipse with gradient inside and outside

``` c
void main()
{
    float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.35 - Empty Circle

``` c
void main()
{
    float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 2.36 - Circle

``` c
void main()
{
    float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.37 - Elastic (Circle with waves)

``` c
void main()
{
    vec2 waveUv = vec2(
        vUv.x,
        vUv.y + sin(vUv.x * 35.0) * 0.1      35 Frequency
    );

    float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.38 - Elastic with X (makes some particles)

``` c
void main()
{
    vec2 waveUv = vec2(
        vUv.x + sin(vUv.y * 35.0) * 0.1,
        vUv.y + sin(vUv.x * 35.0) * 0.1      // 35 Frequency
    );

    float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.39 - Complex, like a CPU connector

``` c
void main()
{
    vec2 waveUv = vec2(
        vUv.x + sin(vUv.y * 300.0) * 0.1,
        vUv.y + sin(vUv.x * 300.0) * 0.1     // 35 Frequency
    );

    float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.40 - Complex, like a CPU connector

``` c
void main()
{
    vec2 waveUv = vec2(
        vUv.x + sin(vUv.y * 300.0) * 0.1,
        vUv.y + sin(vUv.x * 300.0) * 0.1     // 35 Frequency
    );

    float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 2.41 - 45 % angle gradient

``` c
void main()
{
    float angle = atan(vUv.x, vUv.y);
    float strength = angle;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.42 - 45% angle gradient and screen cuted in the middle

``` c
void main()
{
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    float strength = angle;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.43 - 45% gradient like a clock

``` c
void main()
{
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    float strength = angle;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.44 - Illusion with 20 triangles

``` c
void main()
{
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    angle *= 20.0;  // reach 1 faster
    angle = mod(angle, 1.0); // jumps when reach 1 and repeat the texture
    float strength = angle;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.45 - Illusion with 20 triangles

``` c
void main()
{
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    float strength = sin(angle * 100.0);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 2.46 - Waving circle

``` c
void main()
{
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    float sinusoid = sin(angle * 100.0);   // 100.0 is the Frequency of the waves
    float radius = 0.25 + sinusoid * 0.02; // 0.02 is the Intensity of the waves

    float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.47 - Perlin Noise - Clouds, Water, Fire, Terrain, Elevation and

[Noise Templates](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)

``` c
vec4 permute(vec4 x)
{
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

// Noise Template
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    float strength = cnoise(vUv * 20.0);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.48 - Camouflage

``` c
vec4 permute(vec4 x)
{
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

// Noise Template
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    float strength = step(0.1, cnoise(vUv * 10.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.49 - Neon Camouflage

``` c
vec4 permute(vec4 x)
{
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

// Noise Template
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    float strength = 1.0 - abs(cnoise(vUv * 10.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 2.50 - Celular ( random elastic Circles inside circles)

``` c
vec4 permute(vec4 x)
{
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

// Noise Template
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 30.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 2.51 - Color application in the Pattern

``` c
vec4 permute(vec4 x)
{
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

// Noise Template
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 30.0));

    // Mixed color with the pattern
    vec3 mixedColor = mix(blackColor, uvColor, strength);

    strength = clamp(strength, 0.0, 1.0); // makes colors higher than 1, 1

    gl_FragColor = vec4(mixedColor, 1.0);
}
```