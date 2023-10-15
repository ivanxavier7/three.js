
# Performance

1. Post-processing
2. Performance
3. Loading and Intro
4. HTML and WebGl


------


## 1 - Post-processing

Small post-rendering modifications that can result in major changes to the final result, adding effects like:
* Depth of field
* Bloom
* God ray
* Motion blur
* Blitch effect
* Outlines
* Color variations
* Antialiasing
* Reflections and reflections
* etc

[Effects/Passes documentation](https://threejs.org/docs/index.html#examples/en/postprocessing/EffectComposer)

Import other passes to use other effects

To apply the effects and render multiple times we use the class:
`EffectComposer`

Types of Antialiasing:

* FXXA - Performant, but blurry
* SMAA - Better but less performant
* SSAA - Best quality but worst performance
* TTA - Balanced

``` javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// ShaderPass
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { MirrorShader } from 'three/examples/jsm/shaders/MirrorShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

// Antialising fix
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'


window.addEventListener('resize', () =>
{
    // (...)

    // Update Effect composer
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(sizes.width, sizes.height)
})

renderer.useLegacyLights = false
// renderer.outputColorSpace = THREE.SRGBColorSpace - Dont work with Shader passes
// We need to use GammaCorrectionShader to fix that instead

/**
 * Post-processing
 */
// Fix antialiasing with Shader Passes - Dont work with Safari

const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        samples: renderer.getPixelRatio() === 1 ? 4 : 0  // renable the antialiasing
    }
)

const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

// Render without effect
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// Apply effects

// Dot Screen Pass
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// Glitch Pass - Control and click in the pass to see the properties
const glitchPass = new GlitchPass()
glitchPass.enabled = false
glitchPass.goWild = false
effectComposer.addPass(glitchPass)

// Unreal Bloom Pass 
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = false
unrealBloomPass.strength = 0.3      // Glow
unrealBloomPass.radius = 1        // Speading
unrealBloomPass.treshold = 0.6      // When start to glow
effectComposer.addPass(unrealBloomPass)

// GUI Tweak
gui.add(unrealBloomPass, 'enabled')
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001).name('Unreal Bloom Strenght')
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001).name('Unreal Bloom Radius')
gui.add(unrealBloomPass, 'treshold').min(0).max(1).step(0.001).name('Unreal Bloom Treshold')

// Shader Passes

// Mirror Shader
const mirrorPass = new ShaderPass(MirrorShader)
mirrorPass.enabled = false
effectComposer.addPass(mirrorPass)

// RGB Shift Shader
const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

// sRGBEncoding not working fix with this Pass
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
gammaCorrectionPass.enabled = true
effectComposer.addPass(gammaCorrectionPass)

// Custom Passes

// Custom Tint
const TintShader = {
    uniforms:
    {
        tDiffuse: { value: null },
        uTint: { value: null },
    },
    vertexShader:
    `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader:
    `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform vec3 uTint;

        void main()
        {
            vec4 color = texture2D(tDiffuse, vUv);
            color.rgb += uTint;

            gl_FragColor = color;
        }
    `
}

const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3(0, 0.1, 0.1)
tintPass.enabled = true
effectComposer.addPass(tintPass)

// Antialising fix for safari browsers
if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2)
{
    // Fix antialising in all browsers but less performant, put it after all passes
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)
    console.log("Using SMAA Antialising")
}

// GUI Tint
gui.add(tintPass.material.uniforms.uTint.value, 'x').min(-1).max(1).step(0.001).name('Tint Value Red')
gui.add(tintPass.material.uniforms.uTint.value, 'y').min(-1).max(1).step(0.001).name('Tint Value Green')
gui.add(tintPass.material.uniforms.uTint.value, 'z').min(-1).max(1).step(0.001).name('Tint Value Blue')

// Custom Displacement
const DisplacementShader = {
    uniforms:
    {
        tDiffuse: { value: null },
        uTime: { value: null }      // animate
    },
    vertexShader:
    `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader:
    `
        uniform sampler2D tDiffuse;
        uniform float uTime;

        varying vec2 vUv;

        void main()
        {
            vec2 newUv = vec2(
                vUv.x,
                vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
            );
            vec4 color = texture2D(tDiffuse, newUv);

            gl_FragColor = color;
        }
    `
}

const displacementPass = new ShaderPass(DisplacementShader)
displacementPass.uniforms.uTime.value = 0
displacementPass.enabled = false
effectComposer.addPass(displacementPass)


// Mask - Normal texture Pass
const MaskShader = {
    uniforms:
    {
        tDiffuse: { value: null },
        uNormalMap: { value: null },
    },
    vertexShader:
    `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader:
    `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        void main()
        {
            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.9 - 1.0;
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color += lightness * 2.0;

            gl_FragColor = color;
        }
    `
}

const maskPass = new ShaderPass(MaskShader)
maskPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png')
maskPass.enabled = true
effectComposer.addPass(maskPass)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Pass
    //displacementPass.uniforms.uTime.value = elapsedTime

    // (...)
}

tick()
```

------

# 2 - Performance

* Target should be 60 FPS
* Less draws, the better

## Monitor FPS

We will use `stats.js`

``` bash
npm install --save stats.js 
```

``` javascript
import Stats from 'stats.js'

/**
 * Performance Monitor
 */
const stats = new Stats()
stats.showPanel( 1 );
document.body.appendChild( stats.dom )

const tick = () =>
{
    stats.begin()

    // (...)

    stats.end()
}
```

## 2.1 - Monitor Drawns

Chrome extension:
* [Spectorjs](https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk)

With the extension, record one frame and see the order the objects are been drawn

To see what is been drawned in the renderer we can use:
```javascript
console.log(renderer.info)
```

## 2.2 - Performance Tips

### 1. Geometry

* Dispose textures and materials after removing the object

``` javascript
scene.remove(cube)
cube.geometry.dispose()
cube.material.dispose()
```

* Avoid update the vertices inside animations, do vertex shaders for performance
* Use the same texture and material in the object if possible
* We can merge geometries to been drawn at the same time

``` javascript
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const geometries = []

for(let i = 0; i < 50; i++)
{
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

    geometry.translate(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
    )

    geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
    geometry.rotateY((Math.random() - 0.5) * Math.PI * 2)

    geometries.push(geometry)
}

const mergedGeometries = BufferGeometryUtils.mergeGeometries(geometries)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(mergedGeometries, material)
mesh.position.x = (Math.random() - 0.5) * 10
mesh.position.y = (Math.random() - 0.5) * 10
mesh.position.z = (Math.random() - 0.5) * 10
mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

scene.add(mesh)
```


### 2. Light

* Avoid Lights
* Use cheap lights like AmbientLight DirectionalLight or HemisphereLight
* Bake the lights in the texture
* Avoid adding and removing lights, all the materials will be recompiled


### 3. Shadow

* Avoid shadows
* Bake the shadows in the texture
* Optimize shadowMaps and mapSize with cameraHelpers
* Avoid CastShadow and ReceiveShadow when possible
* Deactivate shadow auto-update when we have static shadows

``` javascript
// Optimize shadowMap and mapSize
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.right = 6
directionalLight.shadow.camera.left = - 6
directionalLight.shadow.camera.bottom = - 3
directionalLight.shadow.camera.far = 10
directionalLight.shadow.mapSize.set(1024, 1024)

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(cameraHelper)

// Deactivate shadow auto-update
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true
```


### 4. Texture

* Small resolution as possible
* Use power of 2 resolutions: 256, 512, 1024
* Use files with the right format
* Reduce TinyPNG to reduce the weight of PNG or JPEG


### 5. Material

* Use the same materials for different objects
* Avoid expensive materials like MeshStandardMaterial or MeshPhysicalMaterial


### 6. Mesh

* Create one IntanceMesh and provide transformation matrix with Matrix4

``` javascript
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.InstancedMesh(geometry, material, 50)
// Animate need dynamic matrix, activate this if needed in the tick()
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
scene.add(mesh)

for(let i = 0; i < 50; i++)
{
    const position = new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    )

    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(new THREE.Euler(
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2
    ))

    const matrix = new THREE.Matrix4()
    matrix.makeRotationFromQuaternion(quaternion)
    matrix.setPosition(position)
    mesh.setMatrixAt(i, matrix)

    scene.add(mesh)
}
```

### 7. Model

* When have alot of objects use Draco compression, freeze in the begining while decompress but its faster
* GZIP - Compression in the server side, for `.glb`, `.gltf`, `.obj`


### 8. Camera

* Reduce the field of view, when we have something that we dont see and dont want to render
* Reduce near and far render the objects that we can see and are closer
* Use camera helpers

### 9. Renderer

* Use the device pixel ratio function, don't use the default one
* Use this property in the rederer to reserve high-power

``` javascript
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance',
    antialias: true
})
```


### 10. Post-processing

* Limit the passes, less is better
* 4 passes with pixel ratio 2 = 1920 * 2 * 1080 * 2 * 4 = 33177600 Pixels to renderer, less performant exponentially 

### 11. Shader

* Reduce the precision of the shader
* Simplifies the mathematical algorithm as much as possible
* Use `clamp` instead of "if's"
* Don't mix the colors with the r, g,b use `mix()` function
* Avoid perling noise whenever possible, use similar textures alternatively
* Use Defines instead of uniforms when we have a satatic value
* Do the calculations in the vertex shader and use varying to send the fragment

``` javascript
const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

const shaderMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        defines:    // Alternative for defining static values
        {
            uDisplacementStrength: 0.5,
        },
        precision: 'lowp',  //
        uDisplacementTexture: { value: displacementTexture },
        uDisplacementStrength: { value: 1.5 }
    },
    vertexShader: `
        uniform sampler2D uDisplacementTexture;
        //uniform float uDisplacementStrength;
        #define uDisplacementStrength 1.5   // Static value

        varying vec2 vUv;
        varying vec3 vFinalColor;

        void main()
        {
            // Position
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            //if(elevation < 0.5)
            //{
            //    elevation = 0.5;
            //}
            modelPosition.y = clamp(elevation, 0.5, 1.0) * uDisplacementStrength;

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            // Color
            float colorElevation = max(elevation, 0.25);
            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 finalColor = mix(depthColor, surfaceColor, colorElevation);

            vUv = uv;
            vFinalColor = finalColor;
        }
    `,
    fragmentShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;
        varying vec3 vFinalColor;

        void main()
        {
            //float elevation = texture2D(uDisplacementTexture, vUv).r;
            //if(elevation < 0.25)
            //{
            //    elevation = 0.25;
            //}

            //vec3 depthColor = vec3(1.0, 0.1, 0.1);
            //vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            //vec3 finalColor = vec3(0.0);
            //finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
            //finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
            //finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;

            //vec3 finalColor = mix(depthColor, surfaceColor, elevation);

            gl_FragColor = vec4(vFinalColor, 1.0);
        }
    `
})

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
shaderMesh.rotation.x = - Math.PI * 0.5
scene.add(shaderMesh)
```