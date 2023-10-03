import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorMatcapTexture = textureLoader.load('/textures/matcaps/10.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/nz.jpg',
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/pz.jpg',
])

/**
 * Objects
 */
//const material = new THREE.MeshBasicMaterial({})
//material.map = doorColorTexture
//material.wireframe = true
//material.transparent = true
//material.opacity = 0.5                    // need's transparent enabled
//material.alphaMap = doorAlphaTexture      // need's transparent enabled
//material.side = THREE.DoubleSide          // To see in both sides of the plane

//const material = new THREE.MeshNormalMaterial()
//material.flatShading = true                 // Enable flat surfaces between vertices

//const material = new THREE.MeshMatcapMaterial() // Can be edited in photoshop, uses reference picture, illusion that the objects are being illuminated
//material.matcap = doorMatcapTexture

//const material = new THREE.MeshDepthMaterial()  // Dont uses lights for reflection

//const material = new THREE.MeshLambertMaterial() // Uses lights for reflection, good performance, bad lines beetween colors

//const material = new THREE.MeshPhongMaterial()  //// Uses lights for reflection, medium performance, good lines beetween colors, can adjust the shininess
//material.shininess = 100
//material.specular = new THREE.Color(0x00ff00)  // Shine color

//const material = new THREE.MeshToonMaterial() // Cartoon mesh
//material.gradientMap = gradientTexture
//gradientTexture.minFilter = THREE.NearestFilter // Gradient picture is small, and minFilter and magFilter are smothing the differences
//gradientTexture.magFilter = THREE.NearestFilter
//gradientTexture.generateMipmaps = false

/*
const material = new THREE.MeshStandardMaterial()   // supports roughness and metalness
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 0.5
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.metalness = 0  // default values, others will change the map texture
material.roughness = 1  // default values, others will change the map texture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
material.transparent = true
material.alphaMap = doorAlphaTexture
*/

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2

material.envMap = environmentMapTexture


const gui = new GUI();
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)

sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)

torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.9)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()