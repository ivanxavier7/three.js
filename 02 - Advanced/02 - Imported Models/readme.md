# Imported Models

3d models can be imported in different [formats](https://en.wikipedia.org/wiki/List_of_file_formats#3dgrapichs), the most popular being:

1. glTF - JSON-Based
2. OBJ
3. FBX
4. STL
5. PLY
6. COLLADA
7. 3DS - 3DSMax

Let's use glTF, increasingly popular because it was made by the Khronos group (OpenGL, WebGL, Vulkan, Collada) and with several partnerships, such as NVidia, AMD, Google, Apple, Nintendo and others

Supports:
* Geometries
* Materials
* Cameras
* Lights
* Scenes
* Animations
* Skeletons
* Morphing
* (...)

[glTF free models](https://github.com/KhronosGroup/glTF-Sample-Models)

### glTF Formats

1. glTF - Default   - JSON representation
2. glTF - Binary    - Binary representation
3. glTF - Embedded  - JSON and Binary representation
4. glTF - Draco     - JSON representation


### 1. glTF - Default

* Multiple files
* Model.gltf - JSON that contains cameras, lights, scenes, materials and object transformations
* Model0.bin - Binary file that contains geometries (vertices positions, UV coordinates, normals, colors, etc)
* ModelCM.png - The texture

### 2. glTF - Binary

* Only one file
* Contains all data compiled in binary
* lighter that default
* harder to modify

### 3. glTF - Embedded

* One file
* JSON format
* Texture and Geometries are embedded inside the JSON with binary
* Heavier

### 4. glTF - Draco

* Multiple Files
* Lighter than default
* Draco is popular in glTF formats
* Google algorithm under open-source license
* Need DRACOLoader instance - Models with exaggerated size or too much diversity of models

### Loading the model

``` javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

/**
 * Models
 */

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')   // Decoder already in the static path

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    //'/models/Duck/glTF/Duck.gltf',
    //'/models/Duck/glTF-Binary/Duck.glb',
    //'/models/Duck/glTF-Embedded/Duck.gltf',
    '/models/Duck/glTF-Draco/Duck.gltf',

    //'/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        console.log('success')
        console.log(gltf)       // We can import everything from this object or just what we need

        // After adding, extracting from the scene, as it reduces the number of children in the scene, reduces the number of cycles and does not load all objects
        /*
        const children = [...gltf.scene.children]
        for(const child of children){
            scene.add(gltf.scene.children[0])
        }
        */

        scene.add(gltf.scene)   // add everything
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
)
```

### Animations inside the model

Imported models can have `AnimationClips`, to use them we need to create an `AnimationMixer`

``` javascript

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])     // First Animation

        action.play()

        gltf.scene.scale.set(0.025, 0.025, 0.025)

        scene.add(gltf.scene)   // add everything
    }
)

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update Mixer
    if(mixer !== null) {
        mixer.update(deltaTime)
    }
    // (...)
}
```

### THREE.js Online Editor

We can use the online editor to preview the models before importing them
[THREE.js Editor](https://threejs.org/editor/)

* Add Ambient Light
* Add Directional Light
* Import Model