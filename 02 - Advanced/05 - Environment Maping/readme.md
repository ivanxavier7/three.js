# Environment Mapping and AI

1. Blur and Light
2. HDRI Equirectangular Environment Map
3. Generate HDRI
4. Bring object inside Environment Map closer to the ground
5. Real-Time Environment Map

See how to load models or environment maps in the basics part

Models
* [Sketchfab](https://sketchfab.com/)
* [Turbosquid](https://www.turbosquid.com/)
* [DownloadFree3D](https://downloadfree3d.com/file-format/gltf/)

HDRI
* [Poly Haven](https://polyhaven.com/)

Convert to 6 PNG, cube map textures with [HDRI to CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/)


``` javascript
scene.environment = environmentMap  // apply environment map as lighting to the whole scene
scene.background = environmentMap   // apply background
```

## 1 - Blur and Light

``` javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Load Model
 */
const glTFLoader = new GLTFLoader()
glTFLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    // Accessing All 3D objects in the scene
    scene.traverse((child) => {
        // Update only in the MeshStandardMaterial Objects
        if(child.isMesh && child.material.isMeshStandardMaterial){
            child.material.envMapIntensity = global.envMapIntensity  // light intensity
        }
    })
}

/**
 * Load EnvironmentMap
 */
global.envMapIntensity = 1
gui.add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/2/px.png',
    '/environmentMaps/2/nx.png',
    '/environmentMaps/2/py.png',
    '/environmentMaps/2/ny.png',
    '/environmentMaps/2/pz.png',
    '/environmentMaps/2/nz.png',
])

scene.backgroundBlurriness = 0    // Blur
scene.backgroundIntensity = 1       // Background brightness
scene.environment = environmentMap  // apply environment map as lighting to the whole scene
scene.background = environmentMap   // apply background

gui.add(scene, 'backgroundBlurriness')
    .min(0)
    .max(10)
    .step(0.001)

gui.add(scene, 'backgroundIntensity')
    .min(0)
    .max(10)
    .step(0.001)    
```

## 2 - HDRI Equirectangular Environment Map

High Dynamic Range Image, color valus stored have much higher values range than traditional images, only one file

`file.hdr`

`RGBELoader` - Red Green Blue Exponent, encoding for the HDR format

``` javascript
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const rgbeLoader = new RGBELoader()

rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
    console.log(environmentMap)
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.environment = environmentMap
    scene.background = environmentMap
    scene.backgroundBlurriness = 0.08
})
```

## 3 - Generate HDRI

### Blender

1. Reduce max sampling from 4096 to 512

2. Add black background to the scene

3. Change resolution to 2048x1024

4. Add camera in the middle of the scene

5. Change lens from perspective to panoramic and choose Equirectangular

6. To see the lights in the render go to Object->visibility-> enable camera

7. Save the image with radiance .hdr format

### AI NVidia Canvas

Only for Windows with NVidia RTX

[NVidia Canvas](https://www.nvidia.com/en-us/studio/canvas/)

### Skybox Lab

Write something to ask the AI and it will generate the HDRI, use generate depth

#### Load JPEG file

``` javascript
// LDR Equirectangular
const textureLoader = new THREE.TextureLoader()
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg')

environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace
global.envMapIntensity = 3
scene.environment = environmentMap
scene.background = environmentMap
```

## 4 - Bring object inside Environment Map closer to the ground


``` javascript
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox.js'


const rgbeLoader = new RGBELoader()

rgbeLoader.load('/environmentMaps/3/2k.hdr', (environmentMap) => {

    // (...)

    const skybox = new GroundProjectedSkybox(environmentMap)
    skybox.scale.setScalar(50)
    scene.add(skybox)
})

```

## 5 - Real-Time Environment Map

Allows an object to illuminate others and see its reflections with the environment map, we can organize it by layers

``` javascript	
/**
 * Light Donut
 */
const lightDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(10, 8, 8) }),
)

lightDonut.position.y = 3.5
lightDonut.layers.enable(1)
scene.add(lightDonut)

// Cube render target for the lights
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
    256,
    {
        type: THREE.FloatType
    }
)

scene.environment = cubeRenderTarget.texture

// Cube camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Animate light donut
    if(lightDonut) {
        lightDonut.rotation.x = Math.sin(elapsedTime) * 2

        cubeCamera.update(renderer, scene)
    }

    // (...)
}

tick()
```