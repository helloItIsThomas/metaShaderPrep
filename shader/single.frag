#version 300 es
precision mediump float;

in vec2 vUV;
in float vAlpha;
in float vIndex;

uniform vec3 col1;
uniform vec3 col2;
uniform vec3 col3;
uniform float slider0;
uniform float slider1;
uniform float slider2;
uniform float time;

out vec4 fragColor;

void main() {

    vec2 center = vec2(0.5f, 0.5f);
    vec2 pos = vUV - center;
    float dist = length(pos);

    // Create multiple rings by using sin of distance and time
    float rings = sin(dist * slider0);
    float rings2 = sin(dist * 100.0f - atan(pos.y, pos.x) * 5.0f + (time * slider2 * 0.1f) * dist * 0.5f);

    float ringEffect = mix(rings, rings2, slider1 / 100.0f);

    float depth = 1.0f - pow(dist, 2.0f);

    float lighting = dot(normalize(pos), vec2(0.707f, 0.707f));
    ringEffect = smoothstep(0.0f, 0.1f, abs(ringEffect)) * depth;
    ringEffect *= (0.8f + 0.2f * lighting);

    vec3 baseColor = col1;
    vec3 midColor = col2;
    vec3 highlightColor = col3;

    vec3 myOutputColor = mix(mix(baseColor, midColor, ringEffect), highlightColor, lighting * ringEffect * 0.8f);

    fragColor = vec4(myOutputColor, 1.0f);
    // gl_FragColor = vec4(myOutputColor, 1.0f);
}
