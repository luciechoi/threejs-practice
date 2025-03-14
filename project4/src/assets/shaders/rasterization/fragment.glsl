varying vec2 vUv;
uniform sampler2D u_texture;

uniform float u_kernel[9];
uniform float u_kernel2[9];
uniform bool u_is_sobel_edge;
uniform float u_kernelWeight;
uniform vec2 u_textureSize;

void main() {
    vec4 color = texture2D(u_texture, vUv);
    gl_FragColor = color;
    // #include <colorspace_fragment>
}