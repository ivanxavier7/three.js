## 3D Text

`TextGeometry`
[TextGeometry Docs](https://threejs.org/docs/?q=textGe#examples/en/geometries/TextGeometry)


Default FaceTypes:
* helvetiker	helvetiker_regular.typeface.json
* helvetiker	helvetiker_bold.typeface.json
* optimer		optimer_regular.typeface.json
* optimer		optimer_bold.typeface.json
* gentilis	    gentilis_regular.typeface.json
* gentilis	    gentilis_bold.typeface.json
* droid sans	droid/droid_sans_regular.typeface.json
* droid sans	droid/droid_sans_bold.typeface.json
* droid serif	droid/droid_serif_regular.typeface.json
* droid serif	droid/droid_serif_bold.typeface.json

Inside `three/examples/fonts/`

```javascript
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
```

We should put the typeface file inside `/static/fonts`, and use de loader:

```javascript
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
```

Custom Facetype:
[Custom FaceTypes](https://gero3.github.io/facetype.js/)

``` javascript
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

/**
 * Fonts
 */
const fontLoader =  new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Ivan Xavier',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4,
            }
        )
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial( 
            {   
                matcap: matcapTexture
            } )
        const text = new THREE.Mesh(textGeometry, material)
        
        scene.add(text)
        console.log('Font loaded')
    }
)

```

------

### Measure Time loading resources

`console.time()`

`console.timeEnd()`

```javascript
// Monitor time to load something
console.time('donuts')

// 100 random Donuts
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

for(let i=0; i<200; i++) {
    const donut = new THREE.Mesh(donutGeometry, material)

    donut.position.set(
        1 + (Math.random() - 0.5) * 10,
        1 +(Math.random() - 0.5) * 10,
        1 + (Math.random() - 0.5) * 10,
    )

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}
console.timeEnd('donuts')
```