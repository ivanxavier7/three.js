# Raycaster and Mouse Events

This Casts an ray in specific direction and trigger a event if so, consumes a lot of resources

### Usage examples:
* Collision with an wall
* Shooting a gun in a game
* Something under the mouse pointer
* Show alert message if player is leaving the map

Intersect and Intersects objects contains:
* `distance` - Distance between the origin of the ray and the collision point
* `face` -  What face of geometry was hit by the ray
* `faceIndex` - The index of the face
* `object` - Object concerned by the collision
* `Point` - Vector3 of the exact point of the collision
* `uv` -  UV coordinates in that geometry

### Horizontal Ray

Tests when three spheres pass through the beam and changes its color when that happens

``` JavaScript
/**
 * Raycaster
 */
object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()
const raycaster = new THREE.Raycaster()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Cast a ray
    const rayOrigin = new THREE.Vector3(-3, 0, 0)
    const rayDirection = new THREE.Vector3(10, 0, 0)
    rayDirection.normalize() // We need a vector with 1 length(unit vector), normalize do that with the same direction

    raycaster.set(rayOrigin, rayDirection)

    // Check ray intersections
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    console.log(intersects)

    for(const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }

    // See intersected objects
    for(const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    // Animate spheres
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // (...)

tick()
```

### Mouse Event

Tests when the mouse pointer is above the object and changes its color

1. Hovering
2. Clicking

### 1. Hovering

We also have a section dedicated to when the mouse pointer is inside or outside the object

``` javascript
/**
 * Mouse Events
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 - 1          // screen X between -1 and 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1     // screen Y between -1 and 1
})

scene.add(mouse)

/**
 * Animate
 */
const clock = new THREE.Clock()

// Check mouseEnter or leave the object
let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for(const object of objectsToTest) {
        object.material.color.set('#ff0000')
        object.scale.set(1, 1, 1)
    }

    for(const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
        intersect.object.scale.set(1.2, 1.2, 1.2)
    }

    if(intersects.length) {
        if(!currentIntersect) {         // Test if it is new
            console.log('mouse enter')
        }

        currentIntersect = intersects[0]
    } else {
        if(currentIntersect) {          // Test if it is old
            console.log('mouse out')
        }

        currentIntersect = null
    }

    // (...)
}

tick()
```

### 2. Clicking

``` javascript
/**
 * Mouse Events
 */
const mouse = new THREE.Vector2()

window.addEventListener('click', (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 - 1          // screen X between -1 and 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1     // screen Y between -1 and 1
})
```