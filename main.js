import { sv } from "./script/variables.js";
import { loadShadersVanilla } from "./script/loadShaders.js";
import { createProgram } from "./script/createProgram.js";
import { renderVanilla } from "./script/draw.js";

async function mySetup(palette) {
  sv.sWidth = window.innerWidth;
  sv.sHeight = window.innerHeight;
  sv.canvas = document.getElementById("canvas");
  sv.canvas.width = sv.sWidth;
  sv.canvas.height = sv.sHeight;
  document.body.appendChild(sv.canvas);

  sv.gl = sv.canvas.getContext("webgl2");
  if (!sv.gl) {
    console.error("WebGL2 not supported");
    return;
  }

  sv.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const { vertex, fragment } = await loadShadersVanilla();
  const program = createProgram(vertex, fragment);

  sv.gl.useProgram(program);

  const quadVertices = new Float32Array([
    -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1,
  ]);

  const positionBuffer = sv.gl.createBuffer();
  sv.gl.bindBuffer(sv.gl.ARRAY_BUFFER, positionBuffer);
  sv.gl.bufferData(sv.gl.ARRAY_BUFFER, quadVertices, sv.gl.STATIC_DRAW);

  const aPositionLoc = sv.gl.getAttribLocation(program, "aPosition");
  sv.gl.enableVertexAttribArray(aPositionLoc);
  sv.gl.bindBuffer(sv.gl.ARRAY_BUFFER, positionBuffer);
  sv.gl.vertexAttribPointer(aPositionLoc, 2, sv.gl.FLOAT, false, 0, 0);

  sv.uniforms = {
    time: sv.gl.getUniformLocation(program, "time"),
  };

  console.log(sv.gl.getProgramInfoLog(program));

  const error = sv.gl.getError();
  if (error !== sv.gl.NO_ERROR) {
    console.error("WebGL Error before render:", error);
  }

  renderVanilla();
}

window.addEventListener("load", () => {
  const colorThief = new ColorThief();
  const image = new Image();
  image.src = "/assets/art0.jpg";
  image.addEventListener("load", function () {
    let palette = colorThief.getPalette(image, 3);
    mySetup(palette);
  });
});
