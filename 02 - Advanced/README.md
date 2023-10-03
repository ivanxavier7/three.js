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

# 5 - Production

``` javascript


```

------


Update Notes:
``` javascript
// Start of the code
THREE.ColorManagement.enabled = false

// After instantiating the renderer
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
```

------

#### README Axiliary Material:

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")