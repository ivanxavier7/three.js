# HTML and WebGL

Allows you to introduce points in space, for example to label the object, when you move the mouse over it a descriptive box will appear, when the point is behind the object it should not be visible

``` html
<body>
    
    <canvas class="webgl"></canvas>

    <div class="loading-bar"></div>

    <div class="point point-0">
        <div class="label">1</div>
        <div class="text">Front and top screen with HUD aggregating terrain and battle informations.</div>
    </div>
    <div class="point point-1">
        <div class="label">2</div>
        <div class="text">Ventilation with air purifier and detection of environment toxicity.</div>
    </div>
    <div class="point point-2">
        <div class="label">3</div>
        <div class="text">Cameras supporting night vision and heat vision with automatic adjustment.</div>
    </div>

    <script type="module" src="./script.js"></script>
</body>
```

``` css
.point
{
    position: absolute;
    top: 50%;
    left: 50%;
    font-family: Helvetica, Arial, sans-serif;
    color: #ffffff;
    font-weight: 100;
    font-size: 14px;
}

.point .label
{
    position: absolute;
    top: -20px;
    left: -20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #ffffff77;
    text-align: center;
    line-height: 40px;
    background: #00000077;
    cursor: help;
    transform: scale(0, 0);
    transition: transform 0.3s;
}

.point.visible .label{
    transform: scale(1, 1);
}

.point .label:hover
{
    background: #ce491477
}

.point .text
{
    position: absolute;
    top: 30px;
    left: -120px;
    width: 200px;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #ffffff77;
    background: #00000077;
    line-height: 1.3em;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
}

.point:hover .text{
    opacity: 1;
}
```

``` javascript
/**
 * Loaders
 */
let sceneReady = false
const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // (...)

        window.setTimeout(() =>
        {
            sceneReady = true
        }, 2000)
    },
    // (...)
)

/**
 * HTML Points of interest
 */
const raycaster = new THREE.Raycaster()

const points = [
    {
        position: new THREE.Vector3(1.55, 0.3, - 0.6),
        element: document.querySelector('.point-0')
    },
    {
        position: new THREE.Vector3(0.5, 0.8, - 1.6),
        element: document.querySelector('.point-1')
    },
    {
        position: new THREE.Vector3(1.6, - 1.3, - 0.7),
        element: document.querySelector('.point-2')
    }
]

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Check if the scene is ready
    if(sceneReady)
    {
        // Show Points of interest in the 3D space
        for(const point of points)
        {
            // We use 2D perspective to see if the point is visible in the 3D model
            const screenPosition = point.position.clone()
            screenPosition.project(camera)

            // Check if the Point is behind the object
            raycaster.setFromCamera(screenPosition, camera)
            const intersectsObject = raycaster.intersectObjects(scene.children, true)
            if(intersectsObject.length === 0) {
                point.element.classList.add('visible')
            }
            else{
                const intersectionDistance = intersectsObject[0].distance
                // Check Point distance to the object
                const pointDistance = point.position.distanceTo(camera.position)
                
                if(intersectionDistance < pointDistance) {
                    point.element.classList.remove('visible')
                }
                else
                {
                    point.element.classList.add('visible')
                }
            }

            // Attach the point to the 3D model
            const translateX = screenPosition.x * sizes.width * 0.5
            const translateY = - screenPosition.y * sizes.height * 0.5
            point.element.style.transform = `translateX(${ translateX }px) translateY(${ translateY }px)`
        }
    }

    // (...)
}

tick()
```