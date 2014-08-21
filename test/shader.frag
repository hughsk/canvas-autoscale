precision mediump float;

void main() {
  for (int i = 0; i < 400; i++) {
    gl_FragColor = vec4(gl_FragCoord.xy / 1000.0, 1.0, 1.0);
  }
}
