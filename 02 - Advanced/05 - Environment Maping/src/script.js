import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox.js'

/**
 * Load Model
 */
const glTFLoader = new GLTFLoader()
glTFLoader.load(
    '/models/SirFrog/SirFrog.gltf',
    (gltf) => {
        gltf.scene.scale.set(5, 5, 5)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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

/*
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
*/

/*
const rgbeLoader = new RGBELoader()

rgbeLoader.load('/environmentMaps/3/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = environmentMap
    scene.background = environmentMap

    const skybox = new GroundProjectedSkybox(environmentMap)
    skybox.scale.setScalar(50)
    skybox.height = 10
    scene.add(skybox)

    gui.add(skybox, 'radius', 1, 200, 0.1).name('skyboxRadius')
    gui.add(skybox, 'height', 1, 200, 0.1).name('skyboxRadius')
})
*/

const textureLoader = new THREE.TextureLoader()

/*
// LDR Equirectangular
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg')


environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace
global.envMapIntensity = 3
scene.environment = environmentMap
scene.background = environmentMap
*/

/**
 * Real-Time Environment Map
 */
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap

gui.add(scene, 'backgroundBlurriness')
    .min(0)
    .max(10)
    .step(0.001)

gui.add(scene, 'backgroundIntensity')
    .min(0)
    .max(10)
    .step(0.001)

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 1,
        color: 0xaaaaaa
    })
)
torusKnot.position.x = -4
torusKnot.position.y = 4
scene.add(torusKnot)

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()