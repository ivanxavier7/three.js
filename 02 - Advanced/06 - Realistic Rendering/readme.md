# Realistic Rendering

1. Tone Maping
2. Antialiasing
3. Add Shadow to Environment Map
4. Textures

## 1 - Tone Maping

Convert HDR(High Dynamic Range) to LDR(Low Dynamic Range)

* `NoToneMapping` - Without mapping the tone
* `LinearToneMapping` - Lights everything
* `ReinhardToneMapping` - Realistic with a poorly set camera
* `CineonToneMapping` - High contrast
* `ACESFilmicToneMapping` - Higher contrast

``` javascript
// Tone Mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
```

## 2 - Antialiasing

Reduce ladder-like pixels when we zoom a lot and have high contrast

* SSAA/FSAA - Super Sampling or Fullscreen Sampling (4x more pixels and more time to render)
* MSSA - Multi Sampling (Check the neighbours and mix its colors on the geometry edges)

``` javascript
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
```

## 3 - Add Shadow to Environment Map

Create a Light, disable the default lighting and create shadowMaps

``` javascript

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            // (...)

            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight( '#ffffff', 2)
directionalLight.position.set(0, 7, 6)
directionalLight.target.position.set(0, 6.5, -2) // Target of the light
directionalLight.shadow.camera.far = 15 // limit the distante with the camera helper
directionalLight.shadow.mapSize.set(512, 512) // Optimize shadowmap
directionalLight.target.updateWorldMatrix()
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('lightZ')

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
directionalLight.castShadow = true

/*
// Light Helper for the shadow
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)
*/

gui.add(directionalLight, 'castShadow')

// Turn off default lighting, its irealistic
renderer.useLegacyLights = false
gui.add(renderer, 'useLegacyLights')

```

## 4 - Textures

[Poly Haven Textures](https://polyhaven.com/textures)

And choose the following options:

* Normal(GL) - PNG -  Normal
* AO/Rough/Metal - JPG - Ambient Occlusion, Roughness and Metalness
* Diffuse- JPG - Color

Change diffuse/color from linear to SRGB

``` javascript
colorTexture.colorSpace = three.SRGBColorSpace
```

If there are bugs between the shadows in the texture we can fix them with these parameters:

* `bias` - flat surfaces
* `normalBias` - rounded surfaces

Test the perfect value with gui
``` javascript
gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001)

directionalLight.shadow.bias = 0.01
```