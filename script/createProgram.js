import { sv } from "./variables.js";

function checkShaderCompileStatus(shader) {
  console.log(sv.gl.getShaderParameter(shader, sv.gl.COMPILE_STATUS));
  if (!sv.gl.getShaderParameter(shader, sv.gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", sv.gl.getShaderInfoLog(shader));
  }
}

export function createProgram(vertex, fragment) {
  const vertexShader = compileShader(sv.gl.VERTEX_SHADER, vertex);
  const fragmentShader = compileShader(sv.gl.FRAGMENT_SHADER, fragment);

  checkShaderCompileStatus(fragmentShader);

  const program = sv.gl.createProgram();
  sv.gl.attachShader(program, vertexShader);
  sv.gl.attachShader(program, fragmentShader);
  sv.gl.linkProgram(program);

  if (!sv.gl.getProgramParameter(program, sv.gl.LINK_STATUS)) {
    console.error("Program failed to link:", sv.gl.getProgramInfoLog(program));
    return null;
  }

  return program;
}

function compileShader(type, source) {
  const shader = sv.gl.createShader(type);
  sv.gl.shaderSource(shader, source);
  sv.gl.compileShader(shader);

  if (!sv.gl.getShaderParameter(shader, sv.gl.COMPILE_STATUS)) {
    console.error(sv.gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}
