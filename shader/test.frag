#version 300 es
precision mediump float;

uniform float time;

out vec4 fragColor;

void main() {
      fragColor = vec4(1.0f, 1.0f, 0.0f, sin(time * 1.0f));
}