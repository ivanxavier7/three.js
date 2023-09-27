# Debug UI

* [lil-gui](https://github.com/georgealways/lil-gui)

[npm lil-gui install](https://www.npmjs.com/package/lil-gui)

```bash

npm install --save lil-gui

```

```javascript
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