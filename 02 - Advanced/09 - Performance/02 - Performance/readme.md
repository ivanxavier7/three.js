# Performance

* Target should be 60 FPS
* Less draws, the better

## Monitor FPS

We will use `stats.js`

``` bash
npm install --save stats.js 
```

``` javascript
import Stats from 'stats.js'

/**
 * Performance Monitor
 */
const stats = new Stats()
stats.showPanel( 1 );
document.body.appendChild( stats.dom )

const tick = () =>
{
    stats.begin()

    // (...)

    stats.end()
}
```

## Monitor Drawns

Chrome extension:
* [Spectorjs](https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk)

With the extension, record one frame and see the order the objects are been drawn

To see what is been drawned in the renderer we can use:
```javascript
console.log(renderer.info)
```

## Performance Tips

### 1. Dispose textures and materials after removing the object

``` javascript
scene.remove(cube)
cube.geometry.dispose()
cube.material.dispose()
```

### 2. Lights 

* Avoid Lights
* Use cheap lights like AmbientLight DirectionalLight or HemisphereLight
* Bake the lights in the texture
* Avoid adding and removing lights, all the materials will be recompiled

### 3. Shadows

* Avoid shadows
* Bake the shadows in the texture
* Optimize shadowMaps and mapSize with cameraHelpers
* Avoid CastShadow and ReceiveShadow when possible
* Deactivate shadow auto-update when we have static shadows

``` javascript
// Optimize shadowMap and mapSize
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.right = 6
directionalLight.shadow.camera.left = - 6
directionalLight.shadow.camera.bottom = - 3
directionalLight.shadow.camera.far = 10
directionalLight.shadow.mapSize.set(1024, 1024)

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(cameraHelper)

// Deactivate shadow auto-update
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true
```

### 4. Textures

* Small resolution as possible
* Use power of 2 resolutions: 256, 512, 1024
* Use files with the right format
* Reduce TinyPNG to reduce the weight of PNG or JPEG

### 5. Geometries