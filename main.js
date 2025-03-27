import {
  Application,
  Assets,
  Buffer,
  BufferUsage,
  Container,
  Geometry,
  Mesh,
  Shader,
} from "pixi.js";
import { sv } from "./script/variables.js";
import { loadShadersVanilla } from "./script/loadShaders.js";
import { createProgram } from "./script/createProgram.js";
import { draw } from "./script/draw.js";

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

  const { vertex, fragment } = await loadShadersVanilla();

  const program = createProgram(vertex, fragment);

  console.log(program);

  let totalTriangles = 1;

  // need a buffer big enough to store x, y of totalTriangles
  const instancePositionBuffer = new Buffer({
    data: new Float32Array(totalTriangles * 2),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  const alphaBuffer = new Buffer({
    data: new Float32Array(totalTriangles),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  const triangles = [];

  for (let i = 0; i < totalTriangles; i++) {
    triangles[i] = {
      x: sv.sWidth * 0.0,
      y: sv.sHeight * 0.0,
      speed: 1 + Math.random() * 2,
    };
  }

  const cellW = sv.sWidth;
  const cellH = sv.sHeight;
  const geometry = new Geometry({
    topology: "triangle-strip",
    instanceCount: totalTriangles,
    attributes: {
      aPosition: [
        0.0,
        0.0,
        cellW,
        0.0,
        cellW,
        cellH,
        cellW,
        cellH,
        0.0,
        cellH,
        0.0,
        0.0,
      ],
      aUV: [0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0],
      aPositionOffset: {
        buffer: instancePositionBuffer,
        instance: true,
      },
      aAlpha: {
        buffer: alphaBuffer,
        instance: true,
      },
    },
  });

  const gl = { vertex, fragment };

  // const shader = Shader.from({
  // gl,
  // resources: {
  // waveUniforms: {
  // slider0: { value: 1.0, type: "f32" },
  // slider1: { value: 1.0, type: "f32" },
  // slider2: { value: 1.0, type: "f32" },
  // time: { value: sv.pApp.ticker.lastTime, type: "f32" },
  // col1: {
  // value: palette[0].map((value) => value / 255),
  // type: "vec3<f32>",
  // },
  // col2: {
  // value: palette[1].map((value) => value / 255),
  // type: "vec3<f32>",
  // },
  // col3: {
  // value: palette[2].map((value) => value / 255),
  // type: "vec3<f32>",
  // },
  // },
  // },
  // });

  // sv.triangleMesh = new Mesh({
  // geometry,
  // shader,
  // });

  const container = new Container();
  container.width = sv.sWidth;
  container.height = sv.sHeight;
  container.filterArea = { width: sv.sWidth, height: sv.sHeight };

  // container.addChild(sv.triangleMesh);

  // sv.pApp.ticker.add(() => {
  // const time = sv.pApp.ticker.lastTime * 0.01;
  // sv.triangleMesh.shader.resources.waveUniforms.uniforms.time = time;

  // draw(instancePositionBuffer, alphaBuffer, totalTriangles);
  // });
}

const sliders = document.querySelectorAll(".slider");

sliders.forEach((slider) => {
  slider.addEventListener("input", updateSlider);
});

function updateSlider(event) {
  const slider = event.target;
  const value = slider.value;
  if (slider.id === "slider0") {
    sv.triangleMesh.shader.resources.waveUniforms.uniforms.slider0 = value;
  } else if (slider.id === "slider1") {
    sv.triangleMesh.shader.resources.waveUniforms.uniforms.slider1 = value;
  } else if (slider.id === "slider2") {
    sv.triangleMesh.shader.resources.waveUniforms.uniforms.slider2 = value;
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

document.getElementById("imageUpload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = () => {
    const palette = new ColorThief().getPalette(image, 3);
    sv.triangleMesh.shader.resources.waveUniforms.uniforms.col1 =
      palette[0].map((value) => value / 255);
    sv.triangleMesh.shader.resources.waveUniforms.uniforms.col2 =
      palette[1].map((value) => value / 255);
    sv.triangleMesh.shader.resources.waveUniforms.uniforms.col3 =
      palette[2].map((value) => value / 255);

    palette.forEach((color) => {
      console.log(color.map((value) => value / 255));
    });
  };
});

window.addEventListener("mousemove", (event) => {
  sv.prevMousePos.x = sv.mousePos.x;
  sv.prevMousePos.y = sv.mousePos.y;
  sv.mousePos.x = event.clientX;
  sv.mousePos.y = event.clientY;
});
