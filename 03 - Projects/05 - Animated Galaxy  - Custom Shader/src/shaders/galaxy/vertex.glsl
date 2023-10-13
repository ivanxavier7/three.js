uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Animate Spin
    float angle = atan(modelPosition.x, modelPosition.z); 
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset; // Increases exponentially depending on the distance
    
    // Set animated positions
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Size
    gl_PointSize = uSize * aScale;  // Scale with pixel ratio
    gl_PointSize *= (1.0 / - viewPosition.z);   // Size attenuation

    // Varying
    vColor = color;
}