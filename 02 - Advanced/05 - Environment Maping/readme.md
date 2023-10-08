# Environment Mapping and AI

See how to load models or environment maps in the basics part


[Poly Haven](https://polyhaven.com/)

Convert to 6 PNG, cube map textures with [HDRI to CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/)


``` javascript
scene.environment = environmentMap  // apply environment map as lighting to the whole scene
scene.background = environmentMap   // apply background
```

### Blur and Light

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