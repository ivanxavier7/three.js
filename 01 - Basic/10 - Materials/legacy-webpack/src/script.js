import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Textures
 */
 const loadingManager = new THREE.LoadingManager()
 const cubeTextureLoader = new THREE.CubeTextureLoader()

 const textureLoader = new THREE.TextureLoader(loadingManager)

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')
const gradientTexture = textureLoader.load('/textures/matcaps/5.png')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
//const material = new THREE.MeshBasicMaterial({ map: doorColorTexture})
//const material = new THREE.MeshNormalMaterial()
//const material = new THREE.MeshMatcapMaterial()
//const material = new THREE.MeshDepthMaterial()
// Os proximos reagem com a luz
//const material = new THREE.MeshLambertMaterial()  // Desempenho elevado mas as linhas nao sao bem definidas
//const material = new THREE.MeshPhongMaterial()
// brilho:
//material.shininess = 100
//material.specular = new THREE.Color(0x1188ff)

// Desenho animado
//const material = new THREE.MeshToonMaterial()
//material.gradientMap = gradientTexture

// Mais usada, usa PBR - Physically Based Rendering para simular realidade
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2

// Set Ambient Scene
material.envMap = environmentMapTexture

/**
 * Debug Tweaks
 */
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// Depois de instanciar podemos alterar pela propriedade
//material.map == doorColorTexture
//material.color.set('yellow' ou #ff00ff)

// Mistura a cor com a textura
//material.color = new THREE.Color('cyan')

// Ligar Wireframe
//material.wireframe = true
//material.transparent = true
//material.opacity = 0.5

// Alpha é opacidade e AlphaMap é o mapeamento do que é visível na textura
material.alphaMap = doorAlphaTexture

// Controlar se vemos a parte de tras da textura o default é frontside
// Frontside || BackSide || DoubleSide
material.side = THREE.DoubleSide

// Planifica as faces
//material.flatShading =true

// Cruza as cores de uma textura com a normal

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    material
)

sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material 
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
    material
)

torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Profundidade com mapeamento de ambientOcclusion
 */
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
// intensidade
material.aoMapIntensity = 0.5
// add to gui
gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.0001)

/**
 * Relevo
 */
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
gui.add(material, 'displacementScale').min(0).max(0.1).step(0.0001)


/**
 * Mapeamento do Metalico e do Roughness
 */
material.metalness = 0
material.roughness = 1
material.metalessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture

/**
 * Normal Map, adiciona detalhes sem subdivisao
 */
material.normalMap = doorNormalTexture
material.normalScale.set(0.8, 0.8)

/**
 * Transparencia
 */
material.transparent = true
material.alphaMap = doorAlphaTexture

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects
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