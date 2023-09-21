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

#### Event handlers inside `TextureLoader`

``` javascript
/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(
        '/textures/door/color.jpg',
        () => {
            console.log('When the texture loaded successfully')
        },
        () => {
            console.log('When the loading is progressing')
        },
        () => {
            console.log('When something went wrong')
        }
    )

// maping the texture in the material
const material = new THREE.MeshBasicMaterial({ map: texture })

// Start of the code
THREE.ColorManagement.enabled = false

// After instantiating the renderer
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
```