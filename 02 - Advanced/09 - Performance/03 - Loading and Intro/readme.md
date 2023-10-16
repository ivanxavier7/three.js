# Loading and Intro

Let's overlay an image on top and load a bar, when the resources are ready it will display the scene

## 1 - Lower the download speed

Browser -> Developer Tools -> Network
1. Disable cache
2. Whitout limitation -> add profile with 100000 speed (9.8mb/s) -> Choose that profile

## 2 - Implementation

``` javascript
import { gsap } from 'gsap'

/**
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar')

const loadingManager = new THREE.LoadingManager(
    () =>
    {
        // Last step dont have 0.5s transition so we give that with the timeout
        gsap.delayedCall(0.5, () => 
        {
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0})
            
            // Add ended class
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        })
    },
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${ progressRatio })`
        console.log(progressRatio)
    },
    () =>
    {
        console.log('Error loading the files!')
    }
)

const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uAlpha: { value : 1}
    },
    vertexShader: 
    `
        void main()
        {   
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader:
    `
        uniform float uAlpha;

        void main()
            {   
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
    `,
    //wireframe: true,
    transparent: true,
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)

scene.add(overlay)
```

``` html
<body>
    <canvas class="webgl"></canvas>
    <div class="loading-bar"></div>
    <script type="module" src="./script.js"></script>
</body>
```

``` css
.loading-bar
{
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    background: #ffffff;
    transform: scaleX(0);
    transform-origin: top left;
    transition: transform 0.5s;
    will-change: transform;
}

.loading-bar.ended
{
    transform: scaleX(0);
    transform-origin: top right;
    transition: transform 1.5s ease-in-out;
}
```
