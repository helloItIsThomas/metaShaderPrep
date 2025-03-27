#version 300 es

in vec2 aPosition;
in vec2 aUV;
in vec2 aPositionOffset;
in float aAlpha;

out vec2 vUV;
out float vAlpha;
uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;

void main() {

    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition + aPositionOffset, 1.0f)).xy, 0.0f, 1.0f);

    vUV = aUV;
    vAlpha = aAlpha;
}