#version 300 es
precision mediump float;

in vec2 vUV;
in float vAlpha;
in float vIndex;

uniform float time;

out vec4 fragColor;

void main() {

      vec2 center = vec2(0.5f, 0.5f);
      vec2 pos = vUV - center;
      float dist = length(pos);

      fragColor = vec4(sin(time * 0.1f), 1.0f, 0.0f, 1.0f);
}
