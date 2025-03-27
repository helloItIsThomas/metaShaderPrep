// import {
//   Application,
//   Assets,
//   Buffer,
//   BufferUsage,
//   Container,
//   Geometry,
//   Mesh,
//   Shader,
// } from "pixi.js";
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

  sv.gl.clearColor(0.0, 0.0, 1.0, 1.0); // Red color

  const { vertex, fragment } = await loadShadersVanilla();
  const program = createProgram(vertex, fragment);
  sv.gl.useProgram(program);

  const cellW = sv.sWidth / 2;
  const cellH = sv.sHeight / 2;

  const quadVertices = new Float32Array([
    -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1,
  ]);

  const quadUVs = new Float32Array([0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0]);

  const positionBuffer = sv.gl.createBuffer();
  sv.gl.bindBuffer(sv.gl.ARRAY_BUFFER, positionBuffer);
  sv.gl.bufferData(sv.gl.ARRAY_BUFFER, quadVertices, sv.gl.STATIC_DRAW);

  const uvBuffer = sv.gl.createBuffer();
  sv.gl.bindBuffer(sv.gl.ARRAY_BUFFER, uvBuffer);
  sv.gl.bufferData(sv.gl.ARRAY_BUFFER, quadUVs, sv.gl.STATIC_DRAW);

  const aPositionLoc = sv.gl.getAttribLocation(program, "aPosition");
  sv.gl.enableVertexAttribArray(aPositionLoc);
  sv.gl.bindBuffer(sv.gl.ARRAY_BUFFER, positionBuffer);
  sv.gl.vertexAttribPointer(aPositionLoc, 2, sv.gl.FLOAT, false, 0, 0);

  const aUVLoc = sv.gl.getAttribLocation(program, "aUV");
  sv.gl.enableVertexAttribArray(aUVLoc);
  sv.gl.bindBuffer(sv.gl.ARRAY_BUFFER, uvBuffer);
  sv.gl.vertexAttribPointer(aUVLoc, 2, sv.gl.FLOAT, false, 0, 0);

  sv.uniforms = {
    time: sv.gl.getUniformLocation(program, "time"),
    slider0: sv.gl.getUniformLocation(program, "slider0"),
  };

  renderVanilla();
}

const sliders = document.querySelectorAll(".slider");

sliders.forEach((slider) => {
  slider.addEventListener("input", updateSlider);
});

function updateSlider(event) {
  const slider = event.target;
  const value = slider.value;
  if (slider.id === "slider0") {
    sv.gl.uniform1f(uniforms[slider0], value);
  } else if (slider.id === "slider1") {
    sv.gl.uniform1f(uniforms[slider1], value);
  } else if (slider.id === "slider2") {
    sv.gl.uniform1f(uniforms[slider2], value);
  }
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
