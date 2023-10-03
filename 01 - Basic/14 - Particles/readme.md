# Particles

[Particle Pack](https://www.kenney.nl/assets/particle-pack)

* Geometry
* Material
* Points

## Default Geometry
``` javascript
/**
 * Particles
 */
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)
```
## Custom Geometry
``` javascript
/**
 * Particles
 */
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)    // x,y,z * 3

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)
```

## Particles Map and AlphaMap

To clean the corners of the texture and the areas that we are not supposed to see on the particle

``` javascript
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    map: particlesTexture,
    color: new THREE.Color(0, 125, 125),
    transparent: true,
    alphaMap: particlesTexture,
    depthWrite: true,

    // Blending
    depthWrite: false,
    blending: THREE.AdditiveBlending    // Makes the particle in front of another brighter, impact the performance
})
```
## Randomize colors

We create a random value for R, G and B

``` javascript	
const positions = new Float32Array(count * 3)    // x,y,z * 3
const colors = new Float32Array(count * 3) // red, green, blue

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
```

## Animize particles


``` javascript	
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Particles
    // particles.rotation.y = elapsedTime * 0.1

    // Avoid this, you should use a custom shader for better performance
    for(let i=0; i<count; i++) {
        const i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        particlesGeometry.attributes.position.needsUpdate = true
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```