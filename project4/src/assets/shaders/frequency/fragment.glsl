varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2 u_resolution;

const float PI = 3.1415926535897932384626433832795;

vec2 complexMul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 fft1D(sampler2D tex, vec2 uv, int N) {
  vec2 sum = vec2(0.0);
  for (int i = 0; i < N; i++) {
    float theta = - PI * 2.0 * float(i) * uv.x / float(N);
    vec2 twiddle = vec2(cos(theta), sin(theta));
    
    vec2 sampleUv = vec2(float(i) / float(N), uv.y);
    vec2 sampleVal = texture2D(tex, sampleUv).rg; // Fetch grayscale intensity
    sum += complexMul(twiddle, sampleVal);
  }
  return sum;
}

void main() {
    // Assume square image.
    int N = int(u_resolution.x);
    vec2 rowFft = fft1D(u_texture, vUv, N);
    float magnitude = log(1.0 + length(rowFft)); // Log-scale visualization
    magnitude = clamp(magnitude, 0.0, 1.0);
    gl_FragColor = vec4(vec3(magnitude), 1.0);


    // vec4 color = texture2D(u_texture, vUv);
    // 1. Convert to grayscale image
    // float grayscale = dot(color.rgb, vec3(0.299, 0.587, 0.0));
    // vec4 new_color = vec3(grayscale);
    // gl_FragColor = vec4(vec3(grayscale), 1.0);
}