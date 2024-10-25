varying vec2 vUv;
uniform sampler2D diffuse;
uniform float uTime;

void main() {
    vec4 colors = texture(diffuse, vUv);
        gl_FragColor = colors;
    // gl_FragColor = vec4(colors.x +  cos(colors.z + uTime * 0.001), colors.y, colors.z  + sin(colors.y + uTime * 0.001), colors.w);
}