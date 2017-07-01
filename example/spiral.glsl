uniform vec2 resolution;
const float PI = 3.14159265359;
uniform vec4 mouse;
uniform float time;
uniform float freq2;
uniform float freq;
uniform float f_rad;
uniform float f_inv;
uniform float f_sin;
uniform float a_sin;
uniform float f2_sin;

float grid(vec2 xy, float thickness, float count)
{
    vec2 uv_mod = mod(xy * count, 1.0);
    float x1 = uv_mod.x < thickness ? 1.0 : 0.0;
    float y1 = uv_mod.y < thickness ? 1.0 : 0.0;
    //return x1 + y1;
    return uv_mod.x - uv_mod.y;
}

vec2 rect2polar(vec2 xy)
{
    vec2 polar = vec2(sqrt(xy.x * xy.x + xy.y * xy.y), atan(xy.y, xy.x));
    return polar;
}

void main()
{
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    // Correct aspect:
    uv.x = uv.x * resolution.x / resolution.y;

    // Normalize mouse position:
    vec2 m = vec2(mouse.x/resolution.x, 1.0 - mouse.y/resolution.y);
    m.x = m.x * resolution.x / resolution.y;

    vec2 polar = rect2polar(uv - m);
    // Radius:
    polar.x = polar.x - time * freq2;
    float rad2 = 0.02*sin(5.0*polar.y + 2.0*time + 5.0*polar.x);
    // Angle:
    polar.y = (polar.y / PI) + time * freq;
    polar.y += polar.x * f_rad + f_inv / (polar.x + 0.000001) + a_sin*sin(f_sin*polar.x + time*f2_sin);
    polar.x += rad2;
    float grey = grid(polar, 0.05, 10.0);
    
    gl_FragColor = vec4(grey, grey, grey, 1.0);
}

/*
[
    {
        "type": "float",
        "value": -0.04,
        "min": -1,
        "max": 1,
        "name": "freq",
        "GUIName": "Freq1"
    },
    {
        "type": "float",
        "value": 0.08,
        "min": -1,
        "max": 1,
        "name": "freq2",
        "GUIName": "Freq2"
    },
    {
        "type": "float",
        "value": 0.4,
        "min": -1,
        "max": 1,
        "name": "f_rad",
        "GUIName": "Rad"
    },
    {
        "type": "float",
        "value": 3800,
        "min": -10000,
        "max": 10000,
        "name": "f_inv",
        "GUIName": "Inv"
    },
    {
        "type": "float",
        "value": 5.4,
        "min": -10,
        "max": 10,
        "name": "f_sin",
        "GUIName": "SinAmp"
    },
    {
        "type": "float",
        "value": 0.2,
        "min": -1,
        "max": 1,
        "name": "a_sin",
        "GUIName": "SinFreq"
    },
    {
        "type": "float",
        "value": 2.8,
        "min": -10,
        "max": 10,
        "name": "f2_sin",
        "GUIName": "SinFreq2"
    }
]    
*/