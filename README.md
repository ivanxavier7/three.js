# Three.js

* [Three.js Docs](https://threejs.org/docs/)

------

# Starting

1. Setup
2. Scene
3. Cameras
4. Objects
5. Renderer
6. Extras

------

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

# Extras

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

# 5 - Physics

``` javascript


```

------

# 6 - Production

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