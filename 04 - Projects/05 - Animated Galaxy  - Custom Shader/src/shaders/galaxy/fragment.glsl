varying vec3 vColor;

void main()
{
    
    // Particle pattern
    // In particles instead of Uvv we need to use gl_PointCoord

    // Disc Particle Pattern
    //float strength = distance(gl_PointCoord, vec2(0.5));
    //strength = step(0.5, strength);
    //strength = 1.0 - strength;

    // Gradient Point Pattern - Not fadding eough
    //float strength = distance(gl_PointCoord, vec2(0.5));
    //strength *= 2.0;
    //strength = 1.0 - strength;

    // Gradient Point Pattern - Fading fast
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // Final Color
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, 1.0);
}