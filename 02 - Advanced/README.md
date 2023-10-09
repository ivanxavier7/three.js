# Three.js

* [Three.js Docs](https://threejs.org/docs/)

------

# 1 - Physics

We need to create a physical world and associate it with the THREE.js world

### 3D Physics Libraries
1. [Ammo.js](https://github.com/kripken/ammo.js)
2. [Cannon.js](https://github.com/schteppe/cannon.js?files=1)
3. [Oimo.js](https://github.com/lo-th/Oimo.js/)
4. [Rapier](https://github.com/dimforge/rapier)

### 2D Physics Libraries
1. [Matter.js](https://github.com/liabru/matter-js)
2. [P2.js](https://github.com/schteppe/p2.js)
3. [Planck.js](https://github.com/shakiba/planck.js)
4. [Box2D.js](https://github.com/kripken/box2d.js/)
5. [Rapier](https://github.com/dimforge/rapier)

Cannon.js example

``` bash
npm install --save cannon
```

``` javascript
import CANNON from 'cannon'

/**
 * Physics World
 */
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)  // Earth gravity   -1 * 9.82

// Materials 
//const concreteMaterial = new CANNON.Material('concrete')
//const plasticMaterial = new CANNON.Material('plastic')
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    //concreteMaterial,
    //plasticMaterial,
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,              // friction
        restitution: 0.9            // how much does it bounce, 0.3 is default
    }
)

world.addContactMaterial(defaultContactMaterial)

// Body or Objects

// Sphere
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    // material: defaultContactMaterial,
})

world.addBody(sphereBody)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    // material: defaultContactMaterial,
})

// Set material on the world
world.defaultContactMaterial = defaultContactMaterial

floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
)

world.addBody(floorBody)

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// ...

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update Physics World
    world.step(1 / 60, oldElapsedTime, 3)
    sphere.position.copy(sphereBody.position)

    // ...
}

tick()
```

### Apply Forces

* applyForce           Apply force from a specified point in space
* applyImpulse         Apply force to the velocity instead of the force
* applyLocalForce      Apply force in a specific coordinate
* applyLocalImpulse    Same as applyImpulse in a specific coordinate

``` javascript
// Ball push
sphereBody.applyLocalForce(new CANNON.Vec3(150,0,0), new CANNON.Vec3(0,0,0))

world.addBody(sphereBody)

//...
const tick = () =>
{
    // ...

    // Wind
    sphereBody.applyForce(new CANNON.Vec3( -0.5, 0, 0), sphereBody.position)
    
    //...
}
tick()
```

### Handle Multiple Objects

``` javascript
/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}

debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() * 0.5) * 3,
            y: 3,
            z: (Math.random() * 0.5) * 3,
        })
}
gui.add(debugObject, 'createSphere')


/**
 * Utils
 */
const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createSphere = (radius, position) => {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)

    mesh.castShadow = true
    mesh.position.copy(position)
    mesh.scale.set(radius, radius, radius)

    scene.add(mesh)

    // Physics Body
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })

    body.position.copy(position)
    world.addBody(body)

    // Save objects to update
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

// Body or Objects
createSphere(0.5, {x: 0, y: 3, z: 0})
createSphere(0.5, {x: 2, y: 3, z: 2})
createSphere(0.5, {x: 3, y: 3, z: 2})

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update Physics World
    world.step(1 / 60, deltaTime, 3)

    for(const obj of objectsToUpdate) {
        obj.mesh.position.copy(obj.body.position)
        // Rotating objects after hitting something
        obj.mesh.quaternion.copy(obj.body.quaternion)
    }
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

### Performance

`Broadphase`
* NaiveBroadphase - Test collisions between bodies against other bodies
* GridBroadphase - quadrilles the world and oly teste bodies agains other bodies in the same grid box
* SAPBroadphase (Sweep And Prune) - Teste Bodies on arbitrary axes

``` javascript
/**
 * Physics World
 */
const world = new CANNON.World()
world.gravity.set(0, -1, 0)  // Earth gravity   -1 * 9.82
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
```

Allow sleep prevents calculations on objects that are stationary

### Events

* Colide
* Sleep
* Wakeup


``` javascript
/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    console.log(collision.contact.getImpactVelocityAlongNormal())     // Impact speed
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5) {
        
        hitSound.currentTime = 0
        hitSound.play()
    }

    if(impactStrength > 10) {
        hitSound.volume = (1 * Math.random()).toFixed(2)
        console.log((1 * Math.random()).toFixed(2))
    } else if (impactStrength > 7.5) {
        hitSound.volume = 0.75
        console.log((1 * Math.random()).toFixed(2))
    } else if (impactStrength > 5) {
        hitSound.volume = 0.5
        console.log((1 * Math.random()).toFixed(2))
    } else if (impactStrength > 1.5){
        hitSound.volume = 0.25
        console.log((1 * Math.random()).toFixed(2))
    }
}


const createBox = (widht, height, depth, position) => {

    // ...

    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    // ...
}

```

### Remove Objects

``` javascript
/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}

debugObject.reset = () => {
    for(const obj of objectsToUpdate) {
        // Remove Body
        obj.body.removeEventListener('collide', playHitSound)   // remove event listener
        world.removeBody(obj.body)

        // Remove Mesh
        scene.remove(obj.mesh)
    }
    // Empty Array
    objectsToUpdate.slice(0, objectsToUpdate.length)
}
gui.add(debugObject, 'reset')
```

### Constraints

Enable constraints between bodies

* HingeConstraint - acts like a door hinge
* DistanceConstraint - forces the bodies to keep a distance betwwen each other
* LockConstraint - Merges the bodies like if they were one piece
* PointToPointCoinstraint - Glues the bodies to a specific point

[Cannon docs](http://schteppe.github.io/cannon.js/docs/)
You can extract examples, such as cars with their physics in the documentation.

### Workers
Workers allow dividing the processor's work between several threads, allowing to improve performance

### Change to Cannon-es
More recent

``` bash
npm uninstall --save cannon
npm install --save cannon-es@0.15.1
```
``` javascript
import * as CANNON from 'cannon-es'
```

### Ammo.js

* Bullet physics engine
* WebAssembly Support (low-level language)
* More Popular
* More Features
* Harder

### Physijs

* Uses Ammo and uses workers natively
* Creates body and mesh in the same object

------

# 2 - Imported Models

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

------

# 3 - Raycaster and Mouse Events

This Casts an ray in specific direction and trigger a event if so, consumes a lot of resources

### Usage examples:
* Collision with an wall
* Shooting a gun in a game
* Something under the mouse pointer
* Show alert message if player is leaving the map

Intersect and Intersects objects contains:
* `distance` - Distance between the origin of the ray and the collision point
* `face` -  What face of geometry was hit by the ray
* `faceIndex` - The index of the face
* `object` - Object concerned by the collision
* `Point` - Vector3 of the exact point of the collision
* `uv` -  UV coordinates in that geometry

### Horizontal Ray

Tests when three spheres pass through the beam and changes its color when that happens

``` JavaScript
/**
 * Raycaster
 */
object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()
const raycaster = new THREE.Raycaster()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Cast a ray
    const rayOrigin = new THREE.Vector3(-3, 0, 0)
    const rayDirection = new THREE.Vector3(10, 0, 0)
    rayDirection.normalize() // We need a vector with 1 length(unit vector), normalize do that with the same direction

    raycaster.set(rayOrigin, rayDirection)

    // Check ray intersections
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    console.log(intersects)

    for(const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }

    // See intersected objects
    for(const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    // Animate spheres
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // (...)

tick()
```

### Mouse Event

Tests when the mouse pointer is above the object and changes its color

1. Hovering
2. Clicking

### 1. Hovering

We also have a section dedicated to when the mouse pointer is inside or outside the object

``` javascript
/**
 * Mouse Events
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 - 1          // screen X between -1 and 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1     // screen Y between -1 and 1
})

scene.add(mouse)

/**
 * Animate
 */
const clock = new THREE.Clock()

// Check mouseEnter or leave the object
let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for(const object of objectsToTest) {
        object.material.color.set('#ff0000')
        object.scale.set(1, 1, 1)
    }

    for(const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
        intersect.object.scale.set(1.2, 1.2, 1.2)
    }

    if(intersects.length) {
        if(!currentIntersect) {         // Test if it is new
            console.log('mouse enter')
        }

        currentIntersect = intersects[0]
    } else {
        if(currentIntersect) {          // Test if it is old
            console.log('mouse out')
        }

        currentIntersect = null
    }

    // (...)
}

tick()
```

### 2. Clicking

``` javascript
/**
 * Mouse Events
 */
const mouse = new THREE.Vector2()

window.addEventListener('click', (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 - 1          // screen X between -1 and 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1     // screen Y between -1 and 1
})
```

------

# 3 - Custom Models

[Blender](https://docs.blender.org/)
* Free
* Good performance
* Light
* Works on most OS
* Features
* Community

## Blender Shortcuts

1. Layout
2. Scene
3. View
4. Object
5. Selection
6. Modes
7. Edition
8. Curves
9. Render
10. Timeline


## 3.1 - Layout
| Shortcut                  | Description                       |
| ------------------------  |:-------------------------------:  |
| `N`                       | Toggle sidebar                    |
| `T`                       | Toggle Tools                      |
| `Space` + `Control`       | Maximize area                     |
| `Q`                       | Favorites                         |
| `F3`                      | Search action                     |
| `Z` +  `Control`          | Undo                              |
| `Z` + `Space` + `Control` | Redo                              |


## 3.2 - Scene
| Shortcut              | Description          |
| --------------------  |:------------------:  |
| `C`                   | New collection       |
| `M`                   | Move to collection   |


## 3.3 - View
| Shortcut                               | Description                 |
| -------------------------------------  |:-------------------------:  |
| `Middle Wheel`                         | Rotate                      |
| `Middle Wheel` + `Shift`               | Pan                         |
| `Middle Wheel` + `Control`             | Zoom                        |
| `Middle Wheel` + `Control` + `Shift`   | Dolly                       |
| `.` or `,`                             | Focus section               |
| `5`                                    | Ortho/Perspective           |
| `1` or `3` or `7`                      | Axis (Control to invert)    |
| `7` +  `Shift`                         | Position in front           |
| `0`                                    | Position on Camera          |
| `0` + `Control`                        | Position on active camera   |
| `Z`                                    | Shading wheel               |
| `Z` + `Alt`                            | X-ray                       |
| `S` +  `Shift`                         | Change cursor position      |
| `C` +  `Shift`                         | Focus scene                 |
| `Q` + `Alt` + `Control`                | Quad view                   |


## 3.4 - Object
| Shortcut                        | Description                 |
| ------------------------------  |:-------------------------:  |
| `A` +  `Shift`                  | Create an object            |
| `F9`                            | Re-open creation option     |
| `X`                             | Delete                      |
| `A` + `Control`                 | Apply transformations       |
| `G`                             | Translate                   |
| `X` or `Y` or `Z`               | Force axis                  |
| `X` or `Y` or `Z` + `Shift`     | Axis with precision         |
| `X` or `Y` or `Z` + `Control`   | Axis rounded                |
| `R`                             | Rotate                      |
| `S`                             | Scale                       |
| `G` + `Alt`                     | Reset position              |
| `R` + `Alt`                     | Reset rotation              |
| `S` + `Alt`                     | Reset scale                 |
| `Tab` + `Shift`                 | Toggle snap                 |
| `D` + `Shift`                   | Duplicate                   |
| `D` + `Alt`                     | Link-duplicate              |
| `H`                             | Hide selection              |
| `H` + `Shift`                   | Isolate                     |
| `/`                             | Isolate and focus           |
| `H` + `Alt`                     | Unhide all                  |
| `J` + `Control`                 | Merge                       |
| `R` + `Shift`                   | Repeat last                 |


## 3.5 - Selection
| Shortcut                        | Description                 |
| ------------------------------  |:-------------------------:  |
| `A`                             | Select all                  |
| `A` + `A`                       | Unselect all                |
| `B`                             | Border section              |
| `C`                             | Circle section              |
| `Mouse Wheel`                   | Change size                 |
| `I` + `Control`                 | Invert selection            |
| `Left Click` + `Shift`          | To/remove from selection    |
| `.`                             | Go to selected object       |


## 3.6 - Modes
| Shortcut                        | Description                 |
| ------------------------------  |:-------------------------:  |
| `Tab` + `Control`               | Change mode                 |

## 3.7 - Edition
| Shortcut                           | Description                 |
| ---------------------------------  |:-------------------------:  |
| `Tab`                              | Toggle edition              |
| `1`                                | Vertex                      |
| `2`                                | Edges                       |
| `3`                                | Faces                       |
| `Left Click` + `Alt`               | Edge loop selection         |
| `Left Click` + `Alt` + `Control`   | Parallel edge selection     |
| `G` + `G`                          | Translate on edge           |
| `E`                                | Extrude                     |
| `E` + `Alt`                        | Extrude with options        |
| `I`                                | Inset                       |
| `I` + `I`                          | Individual inset            |
| `B` + `Control`                    | Bevel                       |
| `R` + `Control`                    | Loop cut                    |
| `J`                                | Connect vertices            |
| `K`                                | Knife cut                   |
| `Z`                                | Cut through                 |
| `P`                                | Separate                    |
| `F`                                | Create edge or face         |
| `V`                                | Rip                         |
| `T` + `Control`                    | Triangulate                 |
| `M` + `Alt`                        | Merge                       |
| `L` + `Control`                    | Select island               |
| `E` + `Shift`                      | Change crease               |
| `U`                                | Unwrap menu                 |
| `M`                                | Merge                       |


## 3.8 - Curves
| Shortcut        | Description          |
| -------------   |:------------------:  |
| `C`             | Toggle open          |
| `V`             | Change handle type   |
| `S` + `Alt`     | Change thickness     |
| `F`             | Change brush size    |


## 3.9 - Render
| Shortcut                  | Description          |
| ------------------------  |:------------------:  |
| `F12`                     | Render               |
| `B` + `Control`           | Set render region    |
| `B` + `Alt` + `Control`   | Reset render region  |


## 3.10 - Timeline
| Shortcut        | Description          |
| --------------  |:------------------:  |
| `Arrow Right`   | Next frame           |
| `Arrow Left`    | Previous frame       |
| `Arrow Up`      | Next keyframe        |
| `Arrow Down`    | Previous keyframe    |
| `,`             | Focus selection      |
| `I`             | Insert keyframe      |
| `T`             | Choose interpolation |
| `P`             | Define range         |
| `P` + `Alt`     | Reset range          |
| `V`             | Handle type          |

## Export model

1. Select objects to be exported
2. File -> Export -> glTF 2.0
3. Choose file format
4. Choose project static/models folder

## More Blender Youtube resources

[Blender Guru](https://www.youtube.com/@blenderguru)
[Grant Abbitt](https://www.youtube.com/@grabbitt)
[CGFastTrack](https://www.youtube.com/@CGFastTrack)
[CGCookie](https://www.youtube.com/@cg_cookie)

------

# 5 - Environment Mapping and AI

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

## 5.1 - Blur and Light

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

## 5.2 - HDRI Equirectangular Environment Map

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

## 5.3 - Generate HDRI

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

## 5.4 - Bring object inside Environment Map closer to the ground


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

## 5.5 - Real-Time Environment Map

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

------

# 6 - Realistic Rendering

1. Tone Maping
2. Antialiasing
3. Add Shadow to Environment Map
4. Textures

## 6.1 - Tone Maping

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

## 6.2 - Antialiasing

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

## 6.3 - Add Shadow to Environment Map

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

## 6.4 - Textures

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

# 7 - Structure for Bigger Projects