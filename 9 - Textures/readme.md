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


Update Notes:
``` javascript
// Start of the code
THREE.ColorManagement.enabled = false

// After instantiating the renderer
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
```