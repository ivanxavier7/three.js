# Three.js -  Advanced

* [Three.js Docs](https://threejs.org/docs/)

1. Physics
2. Imported Models
3. RayCaster and Mouse Events
4. Custom Models - Blender
5. Environment Map
6. Realistic Render
7. Code Structure - Object Oriented
8. Shaders
9. Production

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

# 7 - Structure for Bigger Projects - Object Oriented

* Modules
* Classes

## 7.1 -  Classes and Modules

`Robot.js`
``` javascript
export default class Robot
{
    constructor(name, legs)
    {
        this.name = name;
        this.legs = legs;
        console.log(`Robot ${name} created!`)
    }

    sayHi()
    {
        console.log(`Hello! My name is ${this.name}`)
    }
}
```

`FlyingRobot.js`
``` javascript
import Robot from './Robot.js';

export default class FlyingRobot extends Robot
{
    constructor(name, legs) {
        super(name, legs)
        this.canFly = true
    }
    sayHi()
    {
        super.sayHi()
        console.log(`Function overwriten`)
    }

    takeOff() {
        console.log(`Robot ${this.name} is taking off`)
    }

    land() {
        console.log(`Robot ${this.name} is landing`)
    }
}
```

`script.js`
``` javascript
import Robot from './Robot.js';
import FlyingRobot from './FlyingRobot';

const wallE = new Robot('Wall-E', 0)
const ultron = new FlyingRobot('Ultron', 2)
const astroBoy = new FlyingRobot('Astro Boy', 2)
const megaMan = new Robot('Mega-Man', 2)

wallE.sayHi()
megaMan.sayHi()

ultron.sayHi()
ultron.takeOff()
ultron.land()

```

## 7.2 -  Object Oriented Structure
- `intex.html`
- `script.js`
- `style.css`
- `/Application`
    - `Application.js` - Main application
    - `Camera.js` - Camera
    - `Renderer.js` - Renderer
    - `sources.js` - Array of sources paths to load 
    - `/Utils`
        - `Debug.js` - Debug console
        - `EventEmitter.js` - Returns a string whenever an event is triggered so that it can be accessed by other classes in a simple way
        - `Resources.js` - Loads the resources
        - `Sizes.js` - Handle the size and resize oh the window
        - `Time.js` - Handle the time for animations
    - `/World` - Objects
        - `Environment.js`
        - `Floor.js`
        - `Fox.js`
        - `World.js`

### index.html
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>27 - Code structuring</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <canvas class="webgl"></canvas>
    <script type="module" src="./script.js"></script>
</body>
</html>
```

### script.js
``` javascript
import Application from './Application/Application'

const application = new Application(document.querySelector('canvas.webgl'))
```

### style.css
``` css
*
{
    margin: 0;
    padding: 0;
}

html,
body
{
    overflow: hidden;
}

.webgl
{
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
}
```

## Application Folder

### Application.js
``` javascript
import * as THREE from 'three'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import Debug from './Utils/Debug.js'

import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'

import sources from "./sources";

let instance = null // singleton, we can instantiate multiple times but we will get the same instance

export default class Application
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        // Global access / Can access all variables and functions in the console
        window.application = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        this.sizes.on('resize', () =>       // Arrow function () => don lose the context (this.something), but function does
        {
            this.resize()
        })

        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy()
    {
        // Remove event listeners
        this.sizes.off('resize')
        this.time.off('tick')
        // Can remove the rest of the eventListener with js (removeEventListener)

        this.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                // Remove object
                child.geometry.dispose()

                // Remove object properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        // Remove camera controls
        this.camera.controls.dispose()

        // Remove renderer
        this.renderer.instance.dispose()

        // Remove debug
        if(this.debug.active)
        {
            this.debug.ui.destroy()
        }
    }
}
```

### Camera.js
``` javascript
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Application from "./Application"

export default class Camera
{
    constructor()
    {
        this.application = new Application()
        this.sizes = this.application.sizes
        this.scene = this.application.scene
        this.canvas = this.application.canvas

        this.setInstance()
        this.setControls()
        this.resize()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width /
            this.sizes.height,
            0.1,
            100)

        this.instance.position.set(6, 4, 8)

        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDampling = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}
```

### Renderer.js
``` javascript
import Application from "./Application";

import * as THREE from 'three'

export default class Renderer
{
    constructor()
    {
        this.application = new Application()
        this.canvas = this.application.canvas
        this.sizes = this.application.sizes
        this.scene = this.application.scene
        this.camera = this.application.camera

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        
        this.instance.useLegacyLights = false
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}
```

### sources.js
``` javascript
export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'models/Fox/glTF/Fox.gltf'
    }
]
```

## Utils Folder

### Debug.js
``` javascript
import * as dat from 'lil-gui'

export default class Debug
{
    constructor()
    {
        this.active = window.location.hash == '#debug'

        if(this.active)
        {
            this.ui = new dat.GUI()
        }
    }
}
```

### EventEmitter.js
``` javascript
export default class EventEmitter
{
    constructor()
    {
        this.callbacks = {}
        this.callbacks.base = {}
    }

    on(_names, callback)
    {
        // Errors
        if(typeof _names === 'undefined' || _names === '')
        {
            console.warn('wrong names')
            return false
        }

        if(typeof callback === 'undefined')
        {
            console.warn('wrong callback')
            return false
        }

        // Resolve names
        const names = this.resolveNames(_names)

        // Each name
        names.forEach((_name) =>
        {
            // Resolve name
            const name = this.resolveName(_name)

            // Create namespace if not exist
            if(!(this.callbacks[ name.namespace ] instanceof Object))
                this.callbacks[ name.namespace ] = {}

            // Create callback if not exist
            if(!(this.callbacks[ name.namespace ][ name.value ] instanceof Array))
                this.callbacks[ name.namespace ][ name.value ] = []

            // Add callback
            this.callbacks[ name.namespace ][ name.value ].push(callback)
        })

        return this
    }

    off(_names)
    {
        // Errors
        if(typeof _names === 'undefined' || _names === '')
        {
            console.warn('wrong name')
            return false
        }

        // Resolve names
        const names = this.resolveNames(_names)

        // Each name
        names.forEach((_name) =>
        {
            // Resolve name
            const name = this.resolveName(_name)

            // Remove namespace
            if(name.namespace !== 'base' && name.value === '')
            {
                delete this.callbacks[ name.namespace ]
            }

            // Remove specific callback in namespace
            else
            {
                // Default
                if(name.namespace === 'base')
                {
                    // Try to remove from each namespace
                    for(const namespace in this.callbacks)
                    {
                        if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ name.value ] instanceof Array)
                        {
                            delete this.callbacks[ namespace ][ name.value ]

                            // Remove namespace if empty
                            if(Object.keys(this.callbacks[ namespace ]).length === 0)
                                delete this.callbacks[ namespace ]
                        }
                    }
                }

                // Specified namespace
                else if(this.callbacks[ name.namespace ] instanceof Object && this.callbacks[ name.namespace ][ name.value ] instanceof Array)
                {
                    delete this.callbacks[ name.namespace ][ name.value ]

                    // Remove namespace if empty
                    if(Object.keys(this.callbacks[ name.namespace ]).length === 0)
                        delete this.callbacks[ name.namespace ]
                }
            }
        })

        return this
    }

    trigger(_name, _args)
    {
        // Errors
        if(typeof _name === 'undefined' || _name === '')
        {
            console.warn('wrong name')
            return false
        }

        let finalResult = null
        let result = null

        // Default args
        const args = !(_args instanceof Array) ? [] : _args

        // Resolve names (should on have one event)
        let name = this.resolveNames(_name)

        // Resolve name
        name = this.resolveName(name[ 0 ])

        // Default namespace
        if(name.namespace === 'base')
        {
            // Try to find callback in each namespace
            for(const namespace in this.callbacks)
            {
                if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ name.value ] instanceof Array)
                {
                    this.callbacks[ namespace ][ name.value ].forEach(function(callback)
                    {
                        result = callback.apply(this, args)

                        if(typeof finalResult === 'undefined')
                        {
                            finalResult = result
                        }
                    })
                }
            }
        }

        // Specified namespace
        else if(this.callbacks[ name.namespace ] instanceof Object)
        {
            if(name.value === '')
            {
                console.warn('wrong name')
                return this
            }

            this.callbacks[ name.namespace ][ name.value ].forEach(function(callback)
            {
                result = callback.apply(this, args)

                if(typeof finalResult === 'undefined')
                    finalResult = result
            })
        }

        return finalResult
    }

    resolveNames(_names)
    {
        let names = _names
        names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
        names = names.replace(/[,/]+/g, ' ')
        names = names.split(' ')

        return names
    }

    resolveName(name)
    {
        const newName = {}
        const parts = name.split('.')

        newName.original  = name
        newName.value     = parts[ 0 ]
        newName.namespace = 'base' // Base namespace

        // Specified namespace
        if(parts.length > 1 && parts[ 1 ] !== '')
        {
            newName.namespace = parts[ 1 ]
        }

        return newName
    }
}
```

### Resources.js
``` javascript
import * as THREE from 'three'

import EventEmitter from "./EventEmitter";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
        // Add draco compression if needed
    }

    startLoading()
    {
        // Load sources
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file

        //console.log(this.items)

        this.loaded++

        if(this.loaded === this.toLoad)
        {
            this.trigger('resourcesLoaded')
        }
    }
}
```

### Sizes.js
``` javascript
import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super() // Needed for event emitter override the constructor

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Resize
        window.addEventListener('resize', () =>
        {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.max(window.devicePixelRatio, 2)

            this.trigger('resize')  // Trigger 'resize' when the event occur
        })
    }
}
```

### Time.js
``` javascript
import EventEmitter from "./EventEmitter"

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        window.requestAnimationFrame(() => 
        {
            this.tick()
        })
    }

    tick()
    {
        const currentTime = Date.now()
        
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => 
        {
            this.tick()
        })
    }
}
```

## World Folder

### Environment.js
``` javascript
import * as THREE from 'three'

import Application from "../Application";

export default class Environment
{
    constructor()
    {
        this.application = new Application();
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.debug = this.application.debug

        // Debug Folder
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Environment')
        }

        // Setup
        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightPositionX')
                .min(-10)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightPositionY')
                .min(-10)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightPositionZ')
                .min(-10)
                .max(10)
                .step(0.001)
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            // Apply environmentMap to all objects in the scene
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}
```

### Floor.js
``` javascript
import * as THREE from 'three'

import Application from "../Application";

export default class Floor
{
    constructor()
    {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources

        // Setup
        this.setGeometry()
        this.setTexture()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.CircleGeometry(5, 64)
    }

    setTexture()
    {
        this.textures = {}

        this.textures.color = this.resources.items.grassColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        this.textures.color.repeat.set([1.5, 1.5])

        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping


    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true

        this.scene.add(this.mesh)
    }
}
```

### Fox.js
``` javascript
import * as THREE from 'three'
import Application from '../Application.js'

export default class Fox
{
    constructor()
    {
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.time = this.application.time
        this.debug = this.application.debug

        // Debug Folder
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Fox')
        }

        // Setuo
        this.resource = this.resources.items.foxModel

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') },
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}
```

### World.js
``` javascript
import Application from "../Application.js";
import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';

export default class World
{
    constructor()
    {
        this.application = new Application();
        this.scene = this.application.scene
        this.resources = this.application.resources

        // Waiting for the resources to load
        this.resources.on('resourcesLoaded', () =>
        {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.fox)
            this.fox.update()
    }
}
```

------

# 8 - Shaders

Custom Shaders:
1. Basics
2. Shader Patterns
3. Modified Materials

8.1 - Basics:
1. Description
2. Documentation
3. Shader Material
4. Vertex Shader
5. Fragment Shader
6. Vertex and Fragment Shader
7. ShaderMaterial
8. More information about Shaders
9. Implementation

8.2 - Shader Patterns:
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

8.3 - Modified Materials:

## 8.1 - Basics

### 8.1.1 - Description

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

### 8.1.2 - Documentation

* [Shaderific](https://shaderific.com/glsl.html)
* [Kronos group](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php)
* [Book of Shaders](https://thebookofshaders.com/)

``` bash
npm install vite-plugin-glsl
```

### 8.1.3 - Shader Material

`ShaderMaterial` - Code preset

`RawShaderMaterial` - Nothing inside


### 8.1.4 - Vertex Shader

`projectionMatrix` - Transform coordinates into the clip space coordinates
`viewMatrix` - Apply transformations relative to the `camera` (position, rotation, field of view, near and far)
`modelMatrix` - Apply transformations relative to the `Mesh` (position, rotation and scale)


`gl_Position` - Is a variable that already exists, contain the position of the vertex on the screen


### 8.1.5 - Fragment Shader

`precision` - Decides how precise can a float be (`highp`, `mediump`, `lowp`)

`gl_FragColor` - Is a variable that already exists, contain the color of the fragment

### 8.1.6 - Vertex and Fragment Shader

Can be used in Vertex and Fragment shaders

`uniforms` - Same shader but different results, tweak values easly and 
animate values

### 8.1.7 - ShaderMaterial

pre-built uniforms, we can remove this variables:

* uniform mat4 projectionMatrix
* uniform mat4 viewMatrix
* uniform mat4 modelMatrix
* attribute vec3 position
* attribute vec2 uv
* precision mediump float

### 8.1.8 - More information about Shaders

* [The Book of Shaders](https://thebookofshaders.com/)
* [ShaderToy](https://www.shadertoy.com/)
* [The Art of Code](https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg)
* [Lewis Lepton](https://www.youtube.com/channel/UC8Wzk_R1GoPkPqLo-obU_kQ)

### 8.1.9 - Implementation

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

## 8.2 - Shader Patterns

`fragment.glsl`

### 8.2.01 - Normal pattern

``` c
void main()
{
    gl_FragColor = vec4(vUv, 1.0, 1.0);
}
```

### 8.2.02 - Normal pattern alternative

``` c
void main()
{
    gl_FragColor = vec4(vUv, 0.5, 1.0);
}
```

### 8.2.03 - Simple Grey gradient  

``` c
void main()
{
    float strength = vUv.x;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.04 - Rotated Grey gradient 

``` c
void main()
{
    float strength = vUv.y;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.05 - Inverted Grey gradient

``` c
void main()
{
    float strength = 1.0 - vUv.y;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.06 - Grey gradient but with more white

``` c
void main()
{
    float strength = vUv.y * 10.0;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.07 - Grey gradient repeating like roof tiles

``` c
void main()
{
    float strength = mod(vUv.y * 10.0, 1.0);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.08 - Grey gradient repeating like roof tiles but more black space between tiles

``` c
void main()
{
    float strength = mod(vUv.y * 10.0, 1.0);
    strength = step(0.5, strength);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.09 - Grey gradient repeating like roof tiles but more black space between tiles than pattern 8

``` c
void main()
{
    float strength = mod(vUv.y * 10.0, 1.0);
    strength = step(0.8, strength);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.10 - Rotate last pattern

``` c
void main()
{
    float strength = mod(vUv.x * 10.0, 1.0);
    strength = step(0.8, strength);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 8.2.11 - Patern 9 and 10 added together to make multiple squares

``` c
void main()
{
    float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.12 - Inverted 11 pattern, dots

``` c
void main()
{
    float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.13 - Make the dots rectangles

``` c
void main()
{
    float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.14 - Mix with 13 and 13 in other axis

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

### 8.2.15 - Cross pattern with previous bars

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
### 8.2.16 - Double vertical grey gradient

``` c
void main()
{
    float strength = abs(vUv.x - 0.5);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.17 - 4 Gradients in square with cross in the middle
``` c
void main()
{
    float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.18 - 4 Gradients in triangles making a X

``` c
void main()
{
    float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));


    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.19 - Square with empty square inside

``` c
void main()
{
    float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));


    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.20 - Square with bigger empty square inside

``` c
void main()
{
    float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // Oposite pattern, we can combine with *
    float strength = 1.0 - step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));


    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 8.2.21 - Color palette of 10 grey colors

``` c
void main()
{
    float strength = floor(vUv.x * 10.0) / 10.0;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.22 - Color palette of 10*10 grey colors

``` c
void main()
{
    float hBars = floor(vUv.x * 10.0) / 10.0;
    float vBars = floor(vUv.y * 10.0) / 10.0; 

    float strength = hBars * vBars; // * to combine

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.23 - Old tv pixels without channel using Random function

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

### 8.2.24 - Old tv pixels with bigger pixel size, sent the vec2 to random

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

### 8.2.25 - Old tv pixels with bigger pixel size offset (rotated and stretched)

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
### 8.2.26 - Corner gradient 
``` c
void main()
{
    float strength = length(vUv);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.27 - Center gradient 
``` c
void main()
{
    float strength = length(vUv - 0.5);
    // or
    float strength = distance(vUv, vec2(0.5, 0.5)); // can controll the center

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.28 - Center gradient but white in the center

``` c
void main()
{
    float strength = 1.0 - (distance(vUv, vec2(0.5, 0.5))) * 0.8;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.29 - Center gradient but small white like a sun

``` c
void main()
{
    float strength = 0.015 / distance(vUv, vec2(0.5, 0.5));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.30 - Same as 30 but stretch, elipse sun

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
### 8.2.31 - Star

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

### 8.2.32 - Rotated Star using function

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

### 8.2.33 - Square empty circle in the middle

``` c
void main()
{
    float strength = step(0.25, distance(vUv, vec2(0.5)));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.34 - Eclipse with gradient inside and outside

``` c
void main()
{
    float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.35 - Empty Circle

``` c
void main()
{
    float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```
### 8.2.36 - Circle

``` c
void main()
{
    float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.37 - Elastic (Circle with waves)

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

### 8.2.38 - Elastic with X (makes some particles)

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

### 8.2.39 - Complex, like a CPU connector

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

### 8.2.40 - Complex, like a CPU connector

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
### 8.2.41 - 45 % angle gradient

``` c
void main()
{
    float angle = atan(vUv.x, vUv.y);
    float strength = angle;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.42 - 45% angle gradient and screen cuted in the middle

``` c
void main()
{
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    float strength = angle;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

### 8.2.43 - 45% gradient like a clock

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

### 8.2.44 - Illusion with 20 triangles

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

### 8.2.45 - Illusion with 20 triangles

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
### 8.2.46 - Waving circle

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

### 8.2.47 - Perlin Noise - Clouds, Water, Fire, Terrain, Elevation and

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

### 8.2.48 - Camouflage

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

### 8.2.49 - Neon Camouflage

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

### 8.2.50 - Celular ( random elastic Circles inside circles)

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
### 8.2.51 - Color application in the Pattern

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

## 8.3 - Modified Materials

We must load the Mesh and see which Shaders it is loading, then we use the `replace` method to modify the code where we want, we can manipulate the materials in this way, we must be careful with the mapping of the shadows on the object and its surroundings and the normals .

``` javascript
const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
})

const customUniforms = {
    uTime: { value: 0 }
}

material.onBeforeCompile = function(shader)
{
    console.log(shader) // To see the Vertex and Fragment shaders loaded, copy them to customize
    console.log(shader.uniforms) // To see the Vertex uniforms

    shader.uniforms.uTime = customUniforms.uTime

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )

    // Fix normals
    console.log(shader)
    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
            #include <beginnormal_vertex>

            float angle = (position.y + 4.0) * sin(uTime) * 0.4;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = objectNormal.xz * rotateMatrix;
        `
    )

    // <begin_vertex> Is handling position so we need to start replacing there
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            transformed.xz = transformed.xz * rotateMatrix;
        `
    )
}

// Fix Shadows
depthMaterial.onBeforeCompile = (shader) =>
{
    shader.uniforms.uTime = customUniforms.uTime

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )
    // <begin_vertex> Is handling position so we need to start replacing there
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            // Twist material
            float angle = (position.y + 4.0) * sin(uTime) * 0.4;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = transformed.xz * rotateMatrix;
        `
    )
}

/**
 * Models
 */
gltfLoader.load(
    '/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) =>
    {
        // (...)
        mesh.customDepthMaterial = depthMaterial
        // (...)

    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    // (...)

    // Update Vertex uTime
    customUniforms.uTime.value = elapsedTime

    // (...)
}

tick()
```