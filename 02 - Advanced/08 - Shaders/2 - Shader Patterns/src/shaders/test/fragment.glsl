varying vec2 vUv;

#define PI 3.1415926535897932384626433832795    // 32 numbers of PI as constant

// Random function
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Rotate function
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

vec4 permute(vec4 x)
{
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

// Noise Template
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    // Pattern 1 - Normal pattern
    //gl_FragColor = vec4(vUv, 1.0, 1.0);

    // Pattern 2 - Normal pattern alternative
    //gl_FragColor = vec4(vUv, 0.5, 1.0);

    // Pattern 3 - Simple Grey gradient  
    //float strength = vUv.x;

    // Pattern 4 - Rotated Grey gradient  
    //float strength = vUv.y;

    // Pattern 5 - Inverted Grey gradient
    //float strength = 1.0 - vUv.y;

    // Pattern 6 - Grey gradient but with more white
    //float strength = vUv.y * 10.0;
    
    // Pattern 7 - Grey gradient repeating like roof tiles
    //float strength = mod(vUv.y * 10.0, 1.0);

    // Pattern 8 - Grey gradient repeating like roof tiles but more black space between tiles
    //float strength = mod(vUv.y * 10.0, 1.0);
    //strength = step(0.5, strength);

    // Pattern 9 - Grey gradient repeating like roof tiles but more black space between tiles than pattern 8
    //float strength = mod(vUv.y * 10.0, 1.0);
    //strength = step(0.8, strength);

    // Pattern 10 - Rotate last pattern
    //float strength = mod(vUv.x * 10.0, 1.0);
    //strength = step(0.8, strength);

    // Pattern 11 - Patern 9 and 10 added together to make multiple squares
    //float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    //strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 12 - Inverted 11 pattern, dots
    //float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    //strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 13 - Make the dots rectangles
    //float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    //strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // Pattern 14 - Mix with 13 and 13 in other axis
    //float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    //barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    //float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    //barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    //float strength = barX + barY;

    // Pattern 15 - Cross pattern with previous bars
    //float barX = step(0.4, mod(vUv.x * 10.0, 1.0));     // thickness 0.4 so + 0.2 to center
    //barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    //float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    //barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    //float strength = barX + barY;

    // Pattern 16 - Double vertical grey gradient
    //float strength = abs(vUv.x - 0.5);

    // Pattern 17 - 4 Gradients in square with cross in the middle
    //float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // Pattern 18 - 4 Gradients in triangles making a X
    //float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // Pattern 19 - Square with empty square inside
    //float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // Pattern 20 - Square with bigger empty square inside
    //float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // Oposite pattern, we can combine with *
    //float strength = 1.0 - step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    // Pattern 21 - Color palette of 10 grey colors
    //float strength = floor(vUv.x * 10.0) / 10.0;

    // Pattern 22 - Color palette of 10*10 grey colors
    //float hBars = floor(vUv.x * 10.0) / 10.0;
    //float vBars = floor(vUv.y * 10.0) / 10.0; 

    //float strength = hBars * vBars; // * to combine

    // Pattern 23 - Old tv pixels without channel using Random function
    //float strength = random(vUv);

    // Pattern 24 - Old tv pixels with bigger pixel size, sent the vec2 to random
    //vec2 gridUv = vec2(
    //    floor(vUv.x * 10.0) / 10.0,
    //    floor(vUv.y * 10.0) / 10.0
    //);

    // Pattern 25 - Old tv pixels with bigger pixel size offset (rotated and stretched)
    //vec2 gridUv = vec2(
    //    floor(vUv.x * 10.0) / 10.0,
    //    floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0
    //);

    // Pattern 26 - Corner gradient 
    //float strength = length(vUv);

    // Pattern 27 - Center gradient 
    //float strength = length(vUv - 0.5);
    // or
    //float strength = distance(vUv, vec2(0.5, 0.5)); // can controll the center

    // Pattern 28 - Center gradient but white in the center
    //float strength = 1.0 - (distance(vUv, vec2(0.5, 0.5))) * 0.8;

    // Pattern 29 - Center gradient but small white like a sun
    //float strength = 0.015 / distance(vUv, vec2(0.5, 0.5));

    // Pattern 30 - Same as 30 but stretch, elipse sun
    //vec2 lightUv = vec2(
    //    vUv.x * 0.1 + 0.45,
    //    vUv.y * 0.5 + 0.25
    //);
    //float strength = 0.015 / distance(lightUv, vec2(0.5, 0.5));

    // Pattern 31 - Star
    //vec2 lightUvX = vec2(
    //    vUv.x * 0.1 + 0.45,
    //    vUv.y * 0.5 + 0.25
    //);
    //float lightX = 0.015 / distance(lightUvX, vec2(0.5, 0.5));

    //vec2 lightUvY = vec2(
    //    vUv.y * 0.1 + 0.45,
    //    vUv.x * 0.5 + 0.25
    //);
    //float lightY = 0.015 / distance(lightUvY, vec2(0.5, 0.5));

    //float strength = lightX * lightY;

    // Pattern 32 - Rotated Star using function
    //vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));    // UVCoordinates, Angle, X, Y

    //vec2 lightUvX = vec2(
    //    rotatedUv.x * 0.1 + 0.45,
    //    rotatedUv.y * 0.5 + 0.25
    //);
    //float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    //vec2 lightUvY = vec2(
    //    rotatedUv.y * 0.1 + 0.45,
    //    rotatedUv.x * 0.5 + 0.25
    //);
    //float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    //float strength = lightX * lightY;

    // Pattern 33 - Square empty circle in the middle
    //float strength = step(0.25, distance(vUv, vec2(0.5)));

    // Pattern 34 - Eclipse with gradient inside and outside
    //float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // Pattern 35 - Empty Circle
    //float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // Pattern 36 - Circle
    //float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // Pattern 37 - Elastic (Circle with waves)
    //vec2 waveUv = vec2(
    //    vUv.x,
    //    vUv.y + sin(vUv.x * 35.0) * 0.1     // 35 Frequency
    //);

    //float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // Pattern 38 - Elastic with X (makes some particles)
    //vec2 waveUv = vec2(
    //    vUv.x + sin(vUv.y * 35.0) * 0.1,
    //    vUv.y + sin(vUv.x * 35.0) * 0.1     // 35 Frequency
    //);

    //float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // Pattern 39 - Complex, like a CPU connector
    //vec2 waveUv = vec2(
    //    vUv.x + sin(vUv.y * 300.0) * 0.1,
    //    vUv.y + sin(vUv.x * 300.0) * 0.1     // 35 Frequency
    //);

    //float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // Pattern 40 - Complex, like a CPU connector
    //vec2 waveUv = vec2(
    //    vUv.x + sin(vUv.y * 300.0) * 0.1,
    //    vUv.y + sin(vUv.x * 300.0) * 0.1     // 35 Frequency
    //);

    //float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // Pattern 41 - 45 % angle gradient
    //float angle = atan(vUv.x, vUv.y);
    //float strength = angle;

    // Pattern 42 - 45% angle gradient and screen cuted in the middle
    //float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //float strength = angle;

    // Pattern 43 - 45% gradient like a clock
    //float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //angle /= PI * 2.0;
    //angle += 0.5;
    //float strength = angle;

    // Pattern 44 - Illusion with 20 triangles
    //float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //angle /= PI * 2.0;
    //angle += 0.5;
    //angle *= 20.0;  // reach 1 faster
    //angle = mod(angle, 1.0); // jumps when reach 1 and repeat the texture
    //float strength = angle;

    // Pattern 45 - Illusion with 20 triangles
    //float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //angle /= PI * 2.0;
    //angle += 0.5;
    //float strength = sin(angle * 100.0);

    // Pattern 46 - Waving circle
    //float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    //angle /= PI * 2.0;
    //angle += 0.5;
    //float sinusoid = sin(angle * 100.0);   // 100.0 is the Frequency of the waves
    //float radius = 0.25 + sinusoid * 0.02; // 0.02 is the Intensity of the waves

    //float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // Pattern 47 - Perlin Noise - Clouds, Water, Fire, Terrain, Elevation and to animate Grass and Snow (Nature Algorithm)
    // Noise templates - https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    //float strength = cnoise(vUv * 20.0);

    // Pattern 48 - Camouflage
    //float strength = step(0.1, cnoise(vUv * 10.0));

    // Pattern 49 - Neon Camouflage
    //float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // Pattern 50 - Celular ( random elastic Circles inside circles)
    //float strength = step(0.9, sin(cnoise(vUv * 10.0) * 30.0));

    // Pattern 51 - Color application in the Pattern
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 30.0));
    // Mixed color with the pattern
    vec3 mixedColor = mix(blackColor, uvColor, strength);

    // When overlaping the strengh of the color makes it brighter than 1, we can disable with this (Patter 11, 14 or 15 for example)
    strength = clamp(strength, 0.0, 1.0); // makes colors higher than 1, 1

    gl_FragColor = vec4(vec3(strength), 1.0);   // 1 to 50 Pattern
    gl_FragColor = vec4(mixedColor, 1.0);          // 51 Pattern
}