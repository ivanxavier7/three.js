import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import firefliesShaderVertex from './shaders/fireflies/vertex.glsl'
import firefliesShaderFragment from './shaders/fireflies/fragment.glsl'
import portalShaderVertex from './shaders/portal/vertex.glsl'
import portalShaderFragment from './shaders/portal/fragment.glsl'

/**
 * Base
 */
// Debug
const debugObject = {
    backgroundColor: '0x0b0f06',
    portalColorStart: '0x275f62',
    portalColorEnd: '0xe8e8e8',
    poleLightColor: '0xCF9B52',
}
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

/**
 * Baked Material
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.colorspace = THREE.SRGBClorSpace

// Emission material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: '#ffe3bd' })

gui.addColor(debugObject, 'poleLightColor').onChange(() => 
{
    poleLightMaterial.color.set(debugObject.poleLightColor)
})

// Portal Mesh
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0},
        uColorStart: { value: new THREE.Color(0x275f62) },
        uColorEnd: { value: new THREE.Color(0xe8e8e8)}
    },
    vertexShader: portalShaderVertex,
    fragmentShader: portalShaderFragment
})

gui.addColor(debugObject, 'portalColorStart').onChange(() => 
{
    portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart)
})

gui.addColor(debugObject, 'portalColorEnd').onChange(() => 
{
    portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
})

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        /*
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })
        scene.add(gltf.scene)
        */

        const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
        // Get emission objects
        const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')
        const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight')

        bakedMesh.material = bakedMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
        portalLightMesh.material = portalLightMaterial
        scene.add(gltf.scene)
    }
)

/**
 * Particles
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 100
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount * 3)

for(let i = 0; i < firefliesCount; i++)
{
    // Generate random positions for the particles
    positionArray[i * 3 + 0] = (Math.random()  - 0.5) * 4
    positionArray[i * 3 + 1] = Math.random() * 2.5 + 0.1
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 6 + 1
    scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 3))

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
    vertexShader: firefliesShaderVertex,
    fragmentShader: firefliesShaderFragment,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2)},
        uSize: { value: 50 },
        uTime: { value: 0 }
    },
})

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).name('Fireflies size')

// Object
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)


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

    // Update fireflies
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3.1
camera.position.y = 2.5
camera.position.z = -3.1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Background color
renderer.setClearColor(debugObject.backgroundColor)

gui.addColor(debugObject, 'backgroundColor').name('Background Color').onChange( () =>
    {
        renderer.setClearColor(debugObject.backgroundColor)
    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update materials
    firefliesMaterial.uniforms.uTime.value = elapsedTime
    portalLightMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()