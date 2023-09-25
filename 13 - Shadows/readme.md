## Shadows

Lights that support shadows:
* PointLight
* DirectionalLight
* SpotLight

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

### Optimize shadows resolution

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

### ShadowMap Algorithms

Algorithms in order of increasing performance and decreasing quality:
* BasicShadowMaps
* PCFShadowMap
* PCFSoftShadowMap
* VSMShadowMap

``` javascript
renderer.shadowMap.type = THREE.PCFSoftShadowMap
```

### SpotLight


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

### PointLight

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

### Baking Shadows

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