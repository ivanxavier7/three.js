# Geometries

```javascript	

// Custom Geometry
const positions = new Float32Array(9)

// First vertice
positions[0] = 0
positions[1] = 0
positions[2] = 0

// Second vertice
positions[3] = 0
positions[4] = 1
positions[5] = 0

// Third vertice
positions[6] = 1
positions[7] = 0
positions[8] = 0

// or

const positionsArray = new Float32Array( [
    0, 0, 0,    // first vertex
    0, 1, 0,    // second vertex
    1, 0, 0,    // third vertex
])

const positionsAttribute = new THREE.BufferAttribute( positionsArray, 3)

const customGeometry = new THREE.BufferGeometry()
customGeometry.setAttribute('position', positionsAttribute)
const mesh2 = new THREE.Mesh( customGeometry, new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
}))
scene.add(mesh2)

```