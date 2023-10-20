uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

varying vec2 vUv;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.1;
    modelPosition.x += cos(uTime + modelPosition.z) * 0.03;
    modelPosition.z += sin(uTime + modelPosition.y) * 0.01;
    modelPosition.y += cos(uTime + modelPosition.y) * 0.01;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}