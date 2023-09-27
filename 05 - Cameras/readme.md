# Cameras

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

Built in Controls:
* DeviceOrientationControls (Android)
* FlyControls
* OrbitControls
* FirstPersonControls
* PointerLockControls

https://threejs.org/docs/#examples/en/controls/OrbitControls

```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Controls - Orbit Controls
const controls = new OrbitControls(camera, canvas)
```