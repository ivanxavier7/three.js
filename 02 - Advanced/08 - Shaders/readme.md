# Shaders

A material rendered with custom shaders. A shader is a small program written in `GLSL` that runs on the GPU. 

Data sent to the shader:

* Vertices coordinates
* Mesh transformation
* Information about the camera
* Colors
* Textures
* Lights
* Fog
* Etc

To calculate which pixels are visible in the scene

Types of shaders:

* `vertex shader` position the vertices on the render
* `fragment shader` color each visible fragment (or pixel) of that geometry
* `frament shader` is executed after the `vertex shader`
* Changes between each vertices (like positions) are called attributes and can only be used in the vertex shader

## Why should use a custom shader

* Custom shaders can be very simple and performant
* Custom post-processing

### Documentation

* [Shaderific](https://shaderific.com/glsl.html)
* [Kronos group](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/indexflat.php)
* [Book of Shaders](https://thebookofshaders.com/)

``` bash
npm install vite-plugin-glsl
```

## Shader Material

`ShaderMaterial` - Code preset

`RawShaderMaterial` - Nothing inside


### Vertex Shader

`projectionMatrix` - Transform coordinates into the clip space coordinates
`viewMatrix` - Apply transformations relative to the `camera` (position, rotation, field of view, near and far)
`modelMatrix` - Apply transformations relative to the `Mesh` (position, rotation and scale)


`gl_Position` - Is a variable that already exists, contain the position of the vertex on the screen


### Fragment Shader

`precision` - Decides how precise can a float be (`highp`, `mediump`, `lowp`)

`gl_FragColor` - Is a variable that already exists, contain the color of the fragment

``` javascript


```
