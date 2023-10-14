
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