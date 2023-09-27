import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)

// Position
mesh.position.x = 0.7
mesh.position.y = -0.6
mesh.position.z = 1

const group = new THREE.Group() // Group the objects

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.25, 2),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
)

cube1.position.set(-2, 1, -2)
cube2.position.set(2, 0.5, -2)

group.add(cube1, mesh, cube2)
group.position.y = -1
group.scale.y = 0.5
group.rotation.y = Math.PI / 0.55

scene.add(group)

// Lenght between object and center of scene
console.log(mesh.position.length())

// Normalize, reduce the vector distance to 1
mesh.position.normalize()
console.log(mesh.position.length())

// Other way to move the object
mesh.position.set(0.7, -0.1, 1)

// Scale of the object
mesh.scale.x = 1.85
mesh.scale.set(1.85, 0.25, 0.5)

// Rotate the object
mesh.rotation.reorder('YXZ') // Defines rotation order
mesh.rotation.x = Math.PI / 2   // PI number to align the object
mesh.rotation.y = Math.PI * 0.25   // PI number to align the object



// Axes helper
const axesHelper =  new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.x = 1
camera.position.y = 1

scene.add(camera)

// Distance from the cube to the camera
console.log(mesh.position.distanceTo(camera.position))

// Look at some object
camera.lookAt(mesh.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)