# Shaders - Modified Materials

we must load the Mesh and see which Shaders it is loading, then we use the `replace` method to modify the code where we want, we can manipulate the materials in this way, we must be careful with the mapping of the shadows on the object and its surroundings and the normals .

``` javascript
const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
})

const customUniforms = {
    uTime: { value: 0 }
}

material.onBeforeCompile = function(shader)
{
    console.log(shader) // To see the Vertex and Fragment shaders loaded, copy them to customize
    console.log(shader.uniforms) // To see the Vertex uniforms

    shader.uniforms.uTime = customUniforms.uTime

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )

    // Fix normals
    console.log(shader)
    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
            #include <beginnormal_vertex>

            float angle = (position.y + 4.0) * sin(uTime) * 0.4;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = objectNormal.xz * rotateMatrix;
        `
    )

    // <begin_vertex> Is handling position so we need to start replacing there
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            transformed.xz = transformed.xz * rotateMatrix;
        `
    )
}

// Fix Shadows
depthMaterial.onBeforeCompile = (shader) =>
{
    shader.uniforms.uTime = customUniforms.uTime

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )
    // <begin_vertex> Is handling position so we need to start replacing there
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            // Twist material
            float angle = (position.y + 4.0) * sin(uTime) * 0.4;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = transformed.xz * rotateMatrix;
        `
    )
}

/**
 * Models
 */
gltfLoader.load(
    '/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) =>
    {
        // (...)
        mesh.customDepthMaterial = depthMaterial
        // (...)

    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    // (...)

    // Update Vertex uTime
    customUniforms.uTime.value = elapsedTime

    // (...)
}

tick()
```
