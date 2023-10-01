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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Door
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')

// Walls
const wallsColorTexture = textureLoader.load('textures/walls/color.jpg')
const wallsAmbientOcclusionTexture = textureLoader.load('textures/walls/ambientOcclusion.jpg')
const wallsNormalTexture = textureLoader.load('textures/walls/normal.jpg')
const wallsRoughnessTexture = textureLoader.load('textures/walls/roughness.jpg')

// Grass
const grassColorTexture = textureLoader.load('textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg')

// Roof
const roofColorTexture = textureLoader.load('textures/roof/color.jpg')
const roofAmbientOcclusionTexture = textureLoader.load('textures/roof/ambientOcclusion.jpg')
const roofNormalTexture = textureLoader.load('textures/roof/normal.jpg')
const roofRoughnessTexture = textureLoader.load('textures/roof/roughness.jpg')
const roofHeightTexture = textureLoader.load('textures/roof/height.png')

// Graves
const gravesColorTexture = textureLoader.load('textures/graves/color.jpg')
const gravesAmbientOcclusionTexture = textureLoader.load('textures/graves/ambientOcclusion.jpg')
const gravesNormalTexture = textureLoader.load('textures/graves/normal.jpg')
const gravesRoughnessTexture = textureLoader.load('textures/graves/roughness.jpg')
const gravesHeightTexture = textureLoader.load('textures/graves/height.png')

// Bushes
const bushesColorTexture = textureLoader.load('textures/bushes/color.jpg')
const bushesAmbientOcclusionTexture = textureLoader.load('textures/bushes/ambientOcclusion.jpg')
const bushesNormalTexture = textureLoader.load('textures/bushes/normal.jpg')
const bushesRoughnessTexture = textureLoader.load('textures/bushes/roughness.jpg')
const bushesHeightTexture = textureLoader.load('textures/bushes/height.png')

/**
 * Fog
 */
scene.fog = new THREE.Fog('#252736', 1, 15)

/**
 * House
 */

// House Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallsColorTexture,
        aoMap: wallsAmbientOcclusionTexture,
        normalMap: wallsNormalTexture,
        roughnessMap: wallsRoughnessTexture
    },
    )
)

walls.position.y = 1.25
walls.receiveShadow = true

house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        transparent: true,
        aoMap: roofAmbientOcclusionTexture,
        displacementMap: roofHeightTexture,
        displacementScale: 0.0001,
        normalMap: roofNormalTexture,
        roughnessMap: roofRoughnessTexture
    })
)

roofColorTexture.repeat.set(8, 8)
roofAmbientOcclusionTexture.repeat.set(8, 8)
roofNormalTexture.repeat.set(8, 8)
roofRoughnessTexture.repeat.set(8, 8)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofColorTexture.wrapT = THREE.RepeatWrapping
roofAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
roofAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapT = THREE.RepeatWrapping
roofRoughnessTexture.wrapS = THREE.RepeatWrapping
roofRoughnessTexture.wrapT = THREE.RepeatWrapping


roofColorTexture.rotation = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI * 0.25

house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)

door.position.y = 1
door.position.z = 2 + 0.01
door.receiveShadow = true

house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    map: bushesColorTexture,
    transparent: true,
    aoMap: bushesAmbientOcclusionTexture,
    displacementMap: bushesHeightTexture,
    displacementScale: 0.0001,
    normalMap: bushesNormalTexture,
    roughnessMap: bushesRoughnessTexture
})

bushesColorTexture.repeat.set(8, 8)
bushesAmbientOcclusionTexture.repeat.set(8, 8)
bushesNormalTexture.repeat.set(8, 8)
bushesRoughnessTexture.repeat.set(8, 8)

bushesColorTexture.wrapS = THREE.RepeatWrapping
bushesColorTexture.wrapT = THREE.RepeatWrapping
bushesAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
bushesAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
bushesNormalTexture.wrapS = THREE.RepeatWrapping
bushesNormalTexture.wrapT = THREE.RepeatWrapping
bushesRoughnessTexture.wrapS = THREE.RepeatWrapping
bushesRoughnessTexture.wrapT = THREE.RepeatWrapping


const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.1, 2.2)
bush1.receiveShadow = true

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.3, 0.1, 2.1)
bush2.receiveShadow = true

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.receiveShadow = true

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.55)
bush4.receiveShadow = true

house.add(bush1, bush2, bush3, bush4)

/**
 * Graves
 */
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: gravesColorTexture,
    transparent: true,
    aoMap: gravesAmbientOcclusionTexture,
    displacementMap: gravesHeightTexture,
    displacementScale: -0.0001,
    normalMap: gravesNormalTexture,
    roughnessMap: gravesRoughnessTexture
})

for(let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    )

    grave.position.set(x, 0.3, z)
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.castShadow = true

    graves.add(grave)
}

/**
 * Grass
 */
const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
        transparent: true
    })
)

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

grass.rotation.x = - Math.PI * 0.5
grass.position.y = 0
grass.receiveShadow = true

scene.add(grass)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b8d4fB', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b8d4fB', 0.12)
moonLight.position.set(4, 5, - 2)

moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Doors light
const doorLight = new THREE.PointLight('#ff5d45', 1, 7)
doorLight.position.set(0, 2.2, 2.7)

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)

ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor('#252736')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Move Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle * 3)
    ghost1.position.z = Math.sin(ghost1Angle) * 4

    const ghost2Angle = elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5)
    ghost2.position.z = Math.sin(ghost2Angle) * 5

    const ghost3Angle = elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(elapsedTime * 2.5)
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 2.5))


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()