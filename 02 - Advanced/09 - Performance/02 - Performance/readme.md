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

1. Geometry
2. Light
3. Shadow
4. Texture
5. Material
6. Mesh
7. Model
8. Camera
9. Renderer
10. Post-processing
11. Shader

[More Tips](https://discoverthreejs.com/tips-and-tricks/)

### 1. Geometry

* Dispose textures and materials after removing the object

``` javascript
scene.remove(cube)
cube.geometry.dispose()
cube.material.dispose()
```

* Avoid update the vertices inside animations, do vertex shaders for performance
* Use the same texture and material in the object if possible
* We can merge geometries to been drawn at the same time

``` javascript
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const geometries = []

for(let i = 0; i < 50; i++)
{
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

    geometry.translate(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
    )

    geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
    geometry.rotateY((Math.random() - 0.5) * Math.PI * 2)

    geometries.push(geometry)
}

const mergedGeometries = BufferGeometryUtils.mergeGeometries(geometries)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(mergedGeometries, material)
mesh.position.x = (Math.random() - 0.5) * 10
mesh.position.y = (Math.random() - 0.5) * 10
mesh.position.z = (Math.random() - 0.5) * 10
mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

scene.add(mesh)
```


### 2. Light

* Avoid Lights
* Use cheap lights like AmbientLight DirectionalLight or HemisphereLight
* Bake the lights in the texture
* Avoid adding and removing lights, all the materials will be recompiled


### 3. Shadow

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


### 4. Texture

* Small resolution as possible
* Use power of 2 resolutions: 256, 512, 1024
* Use files with the right format
* Reduce TinyPNG to reduce the weight of PNG or JPEG


### 5. Material

* Use the same materials for different objects
* Avoid expensive materials like MeshStandardMaterial or MeshPhysicalMaterial


### 6. Mesh

* Create one IntanceMesh and provide transformation matrix with Matrix4

``` javascript
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.InstancedMesh(geometry, material, 50)
// Animate need dynamic matrix, activate this if needed in the tick()
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
scene.add(mesh)

for(let i = 0; i < 50; i++)
{
    const position = new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    )

    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(new THREE.Euler(
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2
    ))

    const matrix = new THREE.Matrix4()
    matrix.makeRotationFromQuaternion(quaternion)
    matrix.setPosition(position)
    mesh.setMatrixAt(i, matrix)

    scene.add(mesh)
}
```

### 7. Model

* When have alot of objects use Draco compression, freeze in the begining while decompress but its faster
* GZIP - Compression in the server side, for `.glb`, `.gltf`, `.obj`


### 8. Camera

* Reduce the field of view, when we have something that we dont see and dont want to render
* Reduce near and far render the objects that we can see and are closer
* Use camera helpers

### 9. Renderer

* Use the device pixel ratio function, don't use the default one
* Use this property in the rederer to reserve high-power

``` javascript
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance',
    antialias: true
})
```


### 10. Post-processing

* Limit the passes, less is better
* 4 passes with pixel ratio 2 = 1920 * 2 * 1080 * 2 * 4 = 33177600 Pixels to renderer, less performant exponentially 

### 11. Shader

* Reduce the precision of the shader
* Simplifies the mathematical algorithm as much as possible
* Use `clamp` instead of "if's"
* Don't mix the colors with the r, g,b use `mix()` function
* Avoid perling noise whenever possible, use similar textures alternatively
* Use Defines instead of uniforms when we have a satatic value
* Do the calculations in the vertex shader and use varying to send the fragment

``` javascript
const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

const shaderMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        defines:    // Alternative for defining static values
        {
            uDisplacementStrength: 0.5,
        },
        precision: 'lowp',  //
        uDisplacementTexture: { value: displacementTexture },
        uDisplacementStrength: { value: 1.5 }
    },
    vertexShader: `
        uniform sampler2D uDisplacementTexture;
        //uniform float uDisplacementStrength;
        #define uDisplacementStrength 1.5   // Static value

        varying vec2 vUv;
        varying vec3 vFinalColor;

        void main()
        {
            // Position
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            //if(elevation < 0.5)
            //{
            //    elevation = 0.5;
            //}
            modelPosition.y = clamp(elevation, 0.5, 1.0) * uDisplacementStrength;

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            // Color
            float colorElevation = max(elevation, 0.25);
            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 finalColor = mix(depthColor, surfaceColor, colorElevation);

            vUv = uv;
            vFinalColor = finalColor;
        }
    `,
    fragmentShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;
        varying vec3 vFinalColor;

        void main()
        {
            //float elevation = texture2D(uDisplacementTexture, vUv).r;
            //if(elevation < 0.25)
            //{
            //    elevation = 0.25;
            //}

            //vec3 depthColor = vec3(1.0, 0.1, 0.1);
            //vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            //vec3 finalColor = vec3(0.0);
            //finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
            //finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
            //finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;

            //vec3 finalColor = mix(depthColor, surfaceColor, elevation);

            gl_FragColor = vec4(vFinalColor, 1.0);
        }
    `
})

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
shaderMesh.rotation.x = - Math.PI * 0.5
scene.add(shaderMesh)
```