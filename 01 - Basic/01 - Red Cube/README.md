# Three.js
 Three.js

https://threejs.org/docs/

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