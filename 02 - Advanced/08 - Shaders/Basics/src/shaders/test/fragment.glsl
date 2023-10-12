//precision mediump float;
//uniform vec3 uColor;
uniform sampler2D uTexture; // sampler for textures

varying vec2 vUv;
varying float vElevation;

// Variable sent through vertex.glsl
//varying float vRandom;

void main()
{   
    // gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 1.3 + 0.8; // Simulate shadows
    gl_FragColor = textureColor;
}