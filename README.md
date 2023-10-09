# Three.js

* [Three.js Docs](https://threejs.org/docs/)

------

## Basic

1. Setup
2. Scene
3. Cameras
4. Objects
5. Renderer
6. Extras

## Advanced

1. Physics
2. Production
3. Imported Models
4. RayCaster and Mouse Events
5. Custom Models - Blender
6. Environment Map
7. Realistic Render
8. Code Structure

## Projects

1. Simple House
2. Particles Galaxy
3. Scroll and Cursor Animation

------
# Basic 

# 1 - Setup

Setup project with `Vite`

Download [Node.js](https://nodejs.org/en/download/).

Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

------

# 2 - Scene

* Like a container
* To put objects, models, lights, etc. in it
* At some point we ask Three.js to render that scene

Basic scene example

``` javascript
// Scene
const scene = new THREE.Scene();


// Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000});
const mesh = new THREE.Mesh(geometry, material);
scene.add( mesh );

// Sizes
const sizes = {
    width: 800,
    height: 600
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);
camera.position.z = 3;
camera.position.x = 1;
camera.position.y = 1;

// Canvas
const canvas = document.querySelector('.webgl');

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
```
------

# 3 - Cameras

* Not visible without helpers
* Serve as point of view when doing a render
* Can have multiple and switch between them
* Different types
* Field of View (FOV) in Degrees
* Aspect Ratio (screen resolution)

Custom camera controls

``` javascript

/**
 * Custom Camera Cursor
 */
const cursor = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
    console.log(cursor)
})


// Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

//const aspectRatio = sizes.width / sizes.height
//const camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, aspectRatio, -aspectRatio, 0.1, 100) // Resolution of screen is the reference of aspect ratio


// Animate

// Animate

const tick = () =>
{
    // Update camera
    camera.position.x = Math.sin(cursor.x * 2) * 2 
    camera.position.z = Math.cos(cursor.x * 2) * 2
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

Built in Controls

* DeviceOrientationControls (Android)
* FlyControls
* OrbitControls
* FirstPersonControls
* PointerLockControls

[OrbitControls Documentation](https://threejs.org/docs/#examples/en/controls/OrbitControls)

``` javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Controls - Orbit Controls
const controls = new OrbitControls(camera, canvas)

// accelerating camera
controls.enableDamping = true

const tick = () =>
{

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

------

## Fullscreen

Fullscreen example

``` javascript
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
```

``` css
html,
body {
    overflow: hidden;
}

canvas.webgl {
    position: fixed;;
    top: 0;
    left: 0;
    outline: none;
}
```
Handle `resize` and `pixel ratio`

``` javascript
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes. width / sizes. height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

```

Handle `fullscreen`

``` javascript
// Fullscreen with safari support
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!fullscreenElement) {
        if(canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if(document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})
```

------

# 4 - Objects

To define an object we must take into account the following properties

1. Geometry
2. Texture
3. Material
4. Lighting
5. Shadows
------

## 4.1.1 - Geometry

Geometry is defined by the following properties

* width
* height
* depth
* widthSegments
* heightSegments
* depthSegments

``` javascript
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true     // to see the segments
})
```

### 4.1.2 - Custom Geometry

``` javascript

// Custom Geometry
const positions = new Float32Array(9)

// First vertice
positions[0] = 0
positions[1] = 0
positions[2] = 0

// Second vertice
positions[3] = 0
positions[4] = 1
positions[5] = 0

// Third vertice
positions[6] = 1
positions[7] = 0
positions[8] = 0

// or

const positionsArray = new Float32Array( [
    0, 0, 0,    // first vertex
    0, 1, 0,    // second vertex
    1, 0, 0,    // third vertex
])

const positionsAttribute = new THREE.BufferAttribute( positionsArray, 3)

const customGeometry = new THREE.BufferGeometry()
customGeometry.setAttribute('position', positionsAttribute)
const mesh2 = new THREE.Mesh( customGeometry, new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
}))
scene.add(mesh2)

```

------

## 4.2 - Textures

Textures are defined by the following properties
* Color or Albedo
* Alpha
* Height
* Normal
* Ambient occlusion
* Metalness
* Roughness

`Color`

The albedo texture is the most simple one. It'll only take the pixels of the texture and apply them to the geometry.

`Alpha`

The alpha texture is a grayscale image where white will be visible, and black won't.

`Height`

The height texture is a grayscale image that will move the vertices to create some relief. You'll need to add subdivision if you want to see it.

`Normal`

The normal texture will add small details. It won't move the vertices, but it will lure the light into thinking that the face is oriented differently.

`Ambient occlusion`

The ambient occlusion texture is a grayscale image that will fake shadow in the surface's crevices. While it's not physically accurate, it certainly helps to create contrast.

`Metalness`

The metalness texture is a grayscale image that will specify which part is metallic (white) and non-metallic (black). This information will help to create reflection.

`Roughness`

The roughness is a grayscale image that comes with metalness, and that will specify which part is rough (white) and which part is smooth (black). This information will help to dissipate the light.


Free textures

* [Polligon](https://www.poliigon.com/search/free?type=textures)
* [3D Textures](https://3dtextures.me/)
* [Arroway Textures](https://www.arroway-textures.ch/textures/)
* [Textures](https://www.textures.com/free)
* [FreeStockTextures](https://freestocktextures.com/texture/)
* [TextureLabs](https://texturelabs.org/)

You can use photoshop or something similar to edit or create textures

Texture used in the example

[3D Door Texture](https://3dtextures.me/2019/04/16/door-wood-001/)


### 4.2.1 - Loading Textures

Put the `image` in the `/static/` folder

``` javascript
/**
 * Texture
 */
const image = new Image()
const texture = new THREE.Texture(image)

image.addEventListener('load', () => {
    texture.needsUpdate = true
    console.log('Image loaded successfully!')
})

image.src = '/textures/door/color.jpg'

// Instead of using color:
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

// Change to map
const material = new THREE.MeshBasicMaterial({ map: texture })

```

### 4.2.2 - Loading Textures using `TextureLoader`

You should use this for loading textures

``` javascript
/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/door/color.jpg')

// maping the texture in the material
const material = new THREE.MeshBasicMaterial({ map: texture })
```

### 4.2.3 - Using the `LoadingManager`

Should be used when loading multiple textures and inform when everything is loaded

``` javascript

/**
 * Texture
 */
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log('Loading started')
}
loadingManager.onProgress = () => {
    console.log('Loading object')
}
loadingManager.onLoad = () => {
    console.log('Loading finished')
}
loadingManager.onError = () => {
    console.log('Error loading objects')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/door/checkerboard-1024x1024.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
```

### 4.2.4 - Texture transformation

How the texture is wrapped around the object, uses UV coordinates

``` javascript
const textureLoader = new THREE.TextureLoader(loadingManager)
//...

//Repeat texture
//colorTexture.repeat.x = 2
//colorTexture.repeat.y = 3
//colorTexture.wrapS = THREE.RepeatWrapping   // Let the texture repeat, without stretching the last pixels
//colorTexture.wrapT = THREE.MirroredRepeatWrapping

// Padding the texture
//colorTexture.offset.x = 0.1

// Rotate texture in the specified uv point
colorTexture.rotation = Math.PI * 0.25
colorTexture.center.x = 0.5
colorTexture.center.y = 0.5
```

### 4.2.5 - Filtering and MIPMapping

how the texture is processed near or far, for example a low pixel texture may be blurred with the wrong filter

* THREE.NearestFilter
* THREE.LinearFilter
* THREE.NearestMipmapNearestFilter
* THREE.NearestMipmapLinearFilter
* THREE.LinearMipmapNearestFilter
* THREE.LinearMipmapLinearFilter

``` javascript
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/minecraft.png')

// Change the object when it is far away
colorTexture.minFilter = THREE.LinearFilter

// MIPMaping is when you map smaller versions of the texture, we dont need in the THREE.NearestFilter, that's why we have to use resolutions multiples of 2^x, 8*8, 1024*1024...
colorTexture.generateMipmaps = false

// Change the object when it is close
// colorTexture.magFilter = THREE.LinearFilter // Default
colorTexture.magFilter = THREE.NearestFilter   // Best for performance
```

### 4.2.6 - Texture Optimization

* The weight
* The resolution
* The data type

`.jpg` - Lossy compression but usually lighter

`.png` - Lossless compression but usually heavier

[Compression Website - TinyPNG](https://tinypng.com/)

------

## 4.3 - Materials

To implement a material in a certain texture we must take into account the following properties

* Color
* Alpha
* AmbientOcclusion
* Height
* Normal
* Metalness
* Roughness

Algorithm that processes the pixels in a certain object to render, we will use some standard meshes

* MeshBasicMaterial
* MeshNormalMaterial
* MeshMatcapMaterial
* MeshDepthMaterial
* MeshLambertMaterial
* MeshPhongMaterial
* MeshToonMaterial
* MeshStandardMaterial  // Most used
* [MeshPhysicalMaterial](https://threejs.org/docs/index.html?q=physica#api/en/materials/MeshPhysicalMaterial)

[Matcaps Textures](https://github.com/nidorx/matcaps/tree/master)

``` javascript
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorMatcapTexture = textureLoader.load('/textures/matcaps/10.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

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
```

#### 4.3.1 - Environment Map

Image of the surroundings of the scene, allows you to create realistic reflections on objects

[Environment Map](https://hdri-haven.com/)

[Convert Photo to CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/)

------

## 4.4 - Lights

[Lights Docs](https://threejs.org/docs/?q=light#api/en/lights/AmbientLight)

Types of light

* AmbientLight      Minimal
* HemisphereLight   Minimal
* DirectionalLight  Moderate
* PointLight        Moderate
* SpotLight         High
* RectAreaLight     High


Lights cost a lot in performance, try to add as few lights as possible, and chose the most efficient ones

``` javascript
/**
 * Lights
 */

// Irrealistic, light's everything
//const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
//scene.add(ambientLight)

// Light from one side
//const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.3)
//directionalLight.position.set(1, 0.25, 0)
//scene.add(directionalLight)

// Light from one side and different color from the ground
//const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
//scene.add(hemisphereLight)

// Point Light
//const pointLight = new THREE.PointLight(0x00ff00, 0.5, 10, 2)
//pointLight.position.set(-1, 0.25, 0)
//scene.add(pointLight)

// Rectangle Light
//const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 5, 1)
//rectAreaLight.position.set(-1.5, 0, 1.5)
//rectAreaLight.lookAt(new THREE.Vector3())
//scene.add(rectAreaLight)

// SpotLight - FlashLight
const spotLight = new THREE.SpotLight(0x11AA55, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
spotLight.target.position.x = -0.75

scene.add(spotLight.target, spotLight)
```

### 4.4.1 - Light Helpers

Assit us positioning the lights

``` javascript
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Light Helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

scene.add(hemisphereLightHelper, directionalLightHelper, pointLightHelper, rectAreaLightHelper)
```

------

# 4.5 - Shadows

### Lights that support shadows
1. Enable Shadows
2. Optimize Shadows
3. ShadowMap Algorithms
4. PointLight
5. DirectionalLight
6. SpotLight
7. Baking Shadows


### 4.5.1 - Enable Shadows
``` javascript
// Enable shadows with this light
directionalLight.castShadow = true

// CastShadow
sphere.castShadow = true

// Receive shadow
plane.receiveShadow = true

// Enable shadows on the renderer
renderer.shadowMap.enabled = true
```

### 4.5.2 - Optimize shadows resolution

``` javascript
// Enable shadows with this light
directionalLight.castShadow = true

// Optimize shadow map, default is 512x512
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// Move Shadow
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

// Blur Shadow
//directionalLight.shadow.radius = 10

scene.add(directionalLight)
```

### 4.5.3 - ShadowMap Algorithms

Algorithms in order of increasing performance and decreasing quality:
* BasicShadowMaps
* PCFShadowMap
* PCFSoftShadowMap
* VSMShadowMap

``` javascript
renderer.shadowMap.type = THREE.PCFSoftShadowMap
```

### 4.5.4 - SpotLight


``` javascript
// SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)

spotLight.castShadow = true
spotLight.position.set(0, 2, 3)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

spotLight.shadow.camera.fov = 30

scene.add(spotLight, spotLight.target)
```

### 4.5.5 - PointLight

``` javascript
// PointLight
const pointLight = new THREE.PointLight(0xffffff, 0.3)

pointLight.castShadow = true

pointLight.position.set(-1, 1, 0)

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

scene.add(pointLight)
```

### 4.5.6 - Baking Shadows

Better performance, can't move the shadows or lights

``` javascript
renderer.shadowMap.enabled = false
directionalLight.castShadow = false
spotLight.castShadow = false
pointLight.castShadow = false

/**
 * Textures
 *
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')

// On the receiving
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
        map: bakedShadow
    })
)
```

------

# 5 - Renderer

Display the scene onto a HTML canvas

* Render from POV
* Result draw into a canvas
* Canvas is a HTML element in witch you can draw stuff
* Three.js use WebGL to draw inside the canvas

## Animating

`requestAnimationFrame` calls a function in the next frame

``` javascript

const tick = () => {
    mesh.position.x -= 0.005
    mesh.position.y += 0.002

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

```

To sync frames in any device we need time difference implementation

``` javascript

//Time
let time = Date.now()

// Animation
const tick = () => {

    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    mesh.rotation.x -= 0.0005 * deltaTime
    mesh.position.y += 0.00005 * deltaTime

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

```

The best way to implement time difference is using `Clock` class, we get per second interaction

``` javascript

//Time
let clock = new THREE.Clock()

// Animation
const tick = () => {

    // Clock
    const elapsedTime = clock.getElapsedTime()

    mesh.rotation.x -= 0.0005 * elapsedTime
    mesh.position.y += 0.00005 * elapsedTime

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

```

Animation suggestions for looping

``` javascript

    mesh.position.y = Math.sin(elapsedTime)
    mesh.position.x = Math.cos(elapsedTime)
    mesh.rotation.x += 0.0005 * Math.cos(elapsedTime)

    camera.lookAt(mesh.position)

```

For simpler animation controll, use `GSAP library`:

Install inside `client/frontend`, this moves the object 2 units in 1 second after 1 second delay

``` bash
npm install --save gsap@3.5.1
```
``` javascript
import gsap from 'gsap'

gsap.to(mesh.position, { duration: 1, delay:1, x: 2 })

// Animation
const tick = () => {
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

```

------

# 6 - Extras

1. Debug UI
2. Measure time loading resources
3. 3D Text
4. Particles
5. Physics
6. Production

## 1 - Debug UI

* [lil-gui](https://github.com/georgealways/lil-gui)

[npm lil-gui install](https://www.npmjs.com/package/lil-gui)

``` bash

npm install --save lil-gui

```

``` javascript
import GUI from 'lil-gui';

/**
 * Debug gui
 */
const gui = new GUI();

// Position
gui.add(mesh.position, 'x')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('X Position')

gui.add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('Y Position')

gui.add(mesh.position, 'z')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('Z Position')

// Rotation
gui.add(mesh.rotation, 'x')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('X Rotation')

gui.add(mesh.rotation, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('Y Rotation')

gui.add(mesh.rotation, 'z')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('Z Rotation')

// Booleans / Flags
gui.add(mesh, 'visible')
    .name('Show Mesh')
gui.add(material, 'wireframe')
    .name('Enable Wireframe')

//Colors
gui.addColor(material, 'color')
    .name('Color')

const functions = {
    spinX: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.x + Math.PI * 2})
    },
    spinY: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2})
    },
}

// Function Execution / Unitary Test
gui.add(functions, 'spinX')
gui.add(functions, 'spinY')
```

------

## 2- Measure Time loading resources

`console.time()`

`console.timeEnd()`

```javascript
// Monitor time to load something
console.time('donuts')

// 100 random Donuts
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

for(let i=0; i<200; i++) {
    const donut = new THREE.Mesh(donutGeometry, material)

    donut.position.set(
        1 + (Math.random() - 0.5) * 10,
        1 +(Math.random() - 0.5) * 10,
        1 + (Math.random() - 0.5) * 10,
    )

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}
console.timeEnd('donuts')
```

------

## 3 - 3D Text

`TextGeometry`
[TextGeometry Docs](https://threejs.org/docs/?q=textGe#examples/en/geometries/TextGeometry)


Default FaceTypes:
* helvetiker	helvetiker_regular.typeface.json
* helvetiker	helvetiker_bold.typeface.json
* optimer		optimer_regular.typeface.json
* optimer		optimer_bold.typeface.json
* gentilis	    gentilis_regular.typeface.json
* gentilis	    gentilis_bold.typeface.json
* droid sans	droid/droid_sans_regular.typeface.json
* droid sans	droid/droid_sans_bold.typeface.json
* droid serif	droid/droid_serif_regular.typeface.json
* droid serif	droid/droid_serif_bold.typeface.json

Inside `three/examples/fonts/`

```javascript
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
```

We should put the typeface file inside `/static/fonts`, and use de loader:

```javascript
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
```

Custom Facetype:
[Custom FaceTypes](https://gero3.github.io/facetype.js/)

``` javascript
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

/**
 * Fonts
 */
const fontLoader =  new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Ivan Xavier',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4,
            }
        )
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial( 
            {   
                matcap: matcapTexture
            } )
        const text = new THREE.Mesh(textGeometry, material)
        
        scene.add(text)
        console.log('Font loaded')
    }
)

```

------

------

# 4 - Particles

[Particle Pack](https://www.kenney.nl/assets/particle-pack)

* Geometry
* Material
* Points

## Default Geometry
``` javascript
/**
 * Particles
 */
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)
```
## Custom Geometry
``` javascript
/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)    // x,y,z * 3

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)
```

## Particles Map and AlphaMap

To clean the corners of the texture and the areas that we are not supposed to see on the particle

``` javascript
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    map: particlesTexture,
    color: new THREE.Color(0, 125, 125),
    transparent: true,
    alphaMap: particlesTexture,
    depthWrite: true,

    // Blending
    depthWrite: false,
    blending: THREE.AdditiveBlending    // Makes the particle in front of another brighter, impact the performance
})
```
## Randomize colors

We create a random value for R, G and B

``` javascript	
const positions = new Float32Array(count * 3)    // x,y,z * 3
const colors = new Float32Array(count * 3) // red, green, blue

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
```

## Animize particles


``` javascript	
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Particles
    // particles.rotation.y = elapsedTime * 0.1

    // Avoid this, you should use a custom shader for better performance
    for(let i=0; i<count; i++) {
        const i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        particlesGeometry.attributes.position.needsUpdate = true
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

------

# Advanced

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