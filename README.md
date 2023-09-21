# Three.js

* [Three.js Docs](https://threejs.org/docs/)

------

# Setup project with Vite

## Setup

#### Download [Node.js](https://nodejs.org/en/download/).

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

# Starting

* `Scene`
* `Objects`
* `Camera`
* `Renderer`

------

## Scene

* Like a container
* To put objects, models, lights, etc. in it
* At some point we ask Three.js to render that scene

------

## Objects

* Primitive geometries
* Imported models
* Particles
* Lights
* Etc.
* Mesh

#### `Mesh` is the combination of a geometry and a material to create an object.

------

## Camera

* Not visible
* Serve as point of view when doing a render
* Can have multiple and switch between them
* Different types
* Field of View (FOV) in Degrees
* Aspect Ratio (screen resolution)

------

## Renderer

* Render from POV
* Result draw into a canvas
* Canvas is a HTML element in witch you can draw stuff
* Three.js use WebGL to draw inside the canvas

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

## Animations

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

#### To sync frames in any device we need time difference implementation

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

#### The best way to implement time difference is using `Clock` class, we get per second interaction

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

#### Animation suggestions for looping

``` javascript

    mesh.position.y = Math.sin(elapsedTime)
    mesh.position.x = Math.cos(elapsedTime)
    mesh.rotation.x += 0.0005 * Math.cos(elapsedTime)

    camera.lookAt(mesh.position)

```

#### For simpler animation controll, use `GSAP library`

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

## Cameras

#### Custom camera controls

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

#### Built in Controls:
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
#### Handle `resize` and `pixel ratio`

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

#### Handle `fullscreen`

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

## Geometries

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

#### Custom Geometry

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

## Debug UI

* [lil-gui](https://github.com/georgealways/lil-gui)

[npm lil-gui install](https://www.npmjs.com/package/lil-gui)

``` bash

npm install --save dat.gui

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

## Textures

* Color or Albedo
* Alpha
* Height
* Normal
* Ambient occlusion
* Metalness
* Roughness

Color: The albedo texture is the most simple one. It'll only take the pixels of the texture and apply them to the geometry.

Alpha: The alpha texture is a grayscale image where white will be visible, and black won't.

Height: The height texture is a grayscale image that will move the vertices to create some relief. You'll need to add subdivision if you want to see it.

Normal: The normal texture will add small details. It won't move the vertices, but it will lure the light into thinking that the face is oriented differently.

Ambient occlusion: The ambient occlusion texture is a grayscale image that will fake shadow in the surface's crevices. While it's not physically accurate, it certainly helps to create contrast.

Metalness: The metalness texture is a grayscale image that will specify which part is metallic (white) and non-metallic (black). This information will help to create reflection.

Roughness: The roughness is a grayscale image that comes with metalness, and that will specify which part is rough (white) and which part is smooth (black). This information will help to dissipate the light.


Free textures
* [Polligon](https://www.poliigon.com/search/free?type=textures)
* [3D Textures](https://3dtextures.me/)
* [Arroway Textures](https://www.arroway-textures.ch/textures/)
* [Textures](https://www.textures.com/free)
* [FreeStockTextures](https://freestocktextures.com/texture/)
* [TextureLabs](https://texturelabs.org/)

You can use photoshop or something similar to edit or create textures

Texture used in the example:
[3D Door Texture](https://3dtextures.me/2019/04/16/door-wood-001/)


#### Loading Textures

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

#### Loading Textures using `TextureLoader`

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

#### Using the `LoadingManager`

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

#### Texture transformation

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

#### Filtering and MIPMapping

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

#### Texture Optimization

* The weight
* The resolution
* The data type

`.jpg` - Lossy compression but usually lighter

`.png` - Lossless compression but usually heavier

[Compression Website - TinyPNG](https://tinypng.com/)

------

## Materials


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