#version 300 es

in vec2 aPosition;
// in vec2 aUV;

void main() {

    gl_Position = vec4(aPosition, 0.0f, 1.0f);
}