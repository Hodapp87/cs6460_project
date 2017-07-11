// Thank you to http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float grid_aa(vec2 xy, float thickness, float count)
{
    vec2 uv_mod = mod(xy * count, 1.0);
    float x1 = clamp(thickness - uv_mod.x, 0.0, 1.0);
    float y1 = clamp(thickness - uv_mod.y, 0.0, 1.0);
    return (min(x1, thickness-x1) + min(y1,thickness-y1))/thickness;
}
