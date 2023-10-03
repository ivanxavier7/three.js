import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

THREE.ColorManagement.enabled = false

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

debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() * 0.5) * 3,
            y: 3,
            z: (Math.random() * 0.5) * 3,
        })
}
gui.add(debugObject, 'createBox')

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

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    //console.log(collision.contact.getImpactVelocityAlongNormal())     // Impact speed
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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics World
 */
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)  // Earth gravity   -1 * 9.82
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

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

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

const createBox = (widht, height, depth, position) => {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)

    mesh.castShadow = true
    mesh.position.copy(position)
    mesh.scale.set(widht, height, depth)

    scene.add(mesh)

    // Physics Body
    const shape = new CANNON.Box(new CANNON.Vec3(widht * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })

    body.position.copy(position)

    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    // Save Objects
    objectsToUpdate.push({
        mesh,
        body
    })
}

// Body or Objects
createSphere(0.5, {x: 0, y: 3, z: 0})
createSphere(0.5, {x: 2, y: 3, z: 2})
createSphere(0.5, {x: 3, y: 3, z: 2})
createBox(0.5, 0.5, 0.5, {x: 0, y: 3, z: 0})


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
    world.step(1 / 60, deltaTime, 3)

    for(const obj of objectsToUpdate) {
        obj.mesh.position.copy(obj.body.position)
        // Rotating objects after colliding something
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