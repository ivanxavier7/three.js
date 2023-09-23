## Lights

[Lights Docs](https://threejs.org/docs/?q=light#api/en/lights/AmbientLight)

* AmbientLight      Minimal
* HemisphereLight   Minimal
* DirectionalLight  Moderate
* PointLight        Moderate
* SpotLight         High
* RectAreaLight     High


Lights cost a lot in performance, try to add as few lights as possible, and chose the most efficient ones

``` javascript
/**
 * Lights
 */

// Irrealistic, light's everything
//const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
//scene.add(ambientLight)

// Light from one side
//const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.3)
//directionalLight.position.set(1, 0.25, 0)
//scene.add(directionalLight)

// Light from one side and different color from the ground
//const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
//scene.add(hemisphereLight)

// Point Light
//const pointLight = new THREE.PointLight(0x00ff00, 0.5, 10, 2)
//pointLight.position.set(-1, 0.25, 0)
//scene.add(pointLight)

// Rectangle Light
//const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 5, 1)
//rectAreaLight.position.set(-1.5, 0, 1.5)
//rectAreaLight.lookAt(new THREE.Vector3())
//scene.add(rectAreaLight)

// SpotLight - FlashLight
const spotLight = new THREE.SpotLight(0x11AA55, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
spotLight.target.position.x = -0.75

scene.add(spotLight.target, spotLight)
```

### Light Helpers

Assit us positioning the lights

``` javascript
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Light Helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

scene.add(hemisphereLightHelper, directionalLightHelper, pointLightHelper, rectAreaLightHelper)
```