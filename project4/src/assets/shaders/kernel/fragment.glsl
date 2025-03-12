varying vec2 vUv;
uniform sampler2D u_texture;

uniform float u_kernel[9];
uniform float u_kernel2[9];
uniform bool u_is_sobel_edge;
uniform float u_kernelWeight;
uniform vec2 u_textureSize;

vec4 getColor(float[9] kernel) {
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
    vec4 colorSum
        = texture2D(u_texture, vUv + onePixel * vec2(-1, -1)) * kernel[0]
        + texture2D(u_texture, vUv + onePixel * vec2(0, -1)) * kernel[1]
        + texture2D(u_texture, vUv + onePixel * vec2(1, -1)) * kernel[2]
        + texture2D(u_texture, vUv + onePixel * vec2(-1, 0)) * kernel[3]
        + texture2D(u_texture, vUv + onePixel * vec2(0, 0)) * kernel[4]
        + texture2D(u_texture, vUv + onePixel * vec2(1, 0)) * kernel[5]
        + texture2D(u_texture, vUv + onePixel * vec2(-1, 1)) * kernel[6]
        + texture2D(u_texture, vUv + onePixel * vec2(0, 1)) * kernel[7]
        + texture2D(u_texture, vUv + onePixel * vec2(1, 1)) * kernel[8];
    return colorSum;
}

void main() {
    if (u_is_sobel_edge) {
        vec4 gy = getColor(u_kernel);
        vec4 gx = getColor(u_kernel2);
        vec4 g = sqrt((gx * gx) + (gy * gy));
        vec3 color = g.rgb / u_kernelWeight;
        gl_FragColor = vec4(color, 1.0);
    } else {
        vec4 colorSum = getColor(u_kernel);
        vec3 color = colorSum.rgb / u_kernelWeight;
        gl_FragColor = vec4(color, 1.0);
    }
}