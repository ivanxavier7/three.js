import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

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
 * Mouse Events
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 - 1          // screen X between -1 and 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1     // screen Y between -1 and 1
})

scene.add(mouse)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

// Check mouseEnter or leave the object
let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    /*
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
    */

    


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

    // Animate spheres
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()