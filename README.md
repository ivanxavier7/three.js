# Three.js
 Three.js

https://threejs.org/docs/

------

# Setup project with Vite

## Setup
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

## Starting

* Scene
* Objects
* Camera
* Renderer

------

#### Scene

* Like a container
* To put objects, models, lights, etc. in it
* At some point we ask Three.js to render that scene

------

#### Objects

* Primitive geometries
* Imported models
* Particles
* Lights
* Etc.
* Mesh

Mesh is the combination of a geometry and a material to create an object

------

#### Camera

* Not visible
* Serve as point of view when doing a render
* Can have multiple and switch between them
* Different types
* Field of View (FOV) in Degrees
* Aspect Ratio (screen resolution)

------

#### Renderer

* Render from POV
* Result draw into a canvas
* Canvas is a HTML element in witch you can draw stuff
* Three.js use WebGL to draw inside the canvas

```javascript
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

#### Animations

requestAnimationFrame calls a function in the next frame

```javascript

const tick = () => {
    mesh.position.x -= 0.005
    mesh.position.y += 0.002

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()

```

To sync frames in any device we need time difference implementation

```javascript

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

The best way to implement time difference is using Clock class, we get per second interaction

```javascript

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

```javascript

    mesh.position.y = Math.sin(elapsedTime)
    mesh.position.x = Math.cos(elapsedTime)
    mesh.rotation.x += 0.0005 * Math.cos(elapsedTime)

    camera.lookAt(mesh.position)

```

------

#### Cameras

```javascript

```

```javascript

```

------

For better animation controll, use GSAP library

install inside client/frontend

this moves the object 2 units in 1 second after 1 second delay

```bash
npm install --save gsap@3.5.1
```
```javascript
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



| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")