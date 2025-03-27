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
import { loadShaders } from "./script/loadShaders.js";
import { draw } from "./script/draw.js";

async function mySetup(palette) {
  sv.pApp = new Application();

  await sv.pApp.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
    resolution: 3,
  });
  document.body.appendChild(sv.pApp.canvas);

  const { vertex, fragment } = await loadShaders();

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
      x: sv.pApp.screen.width * 0.0,
      y: sv.pApp.screen.height * 0.0,
      speed: 1 + Math.random() * 2,
    };
  }

  const cellW = sv.pApp.screen.width;
  const cellH = sv.pApp.screen.height;
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

  const shader = Shader.from({
    gl,
    resources: {
      waveUniforms: {
        slider0: { value: 1.0, type: "f32" },
        slider1: { value: 1.0, type: "f32" },
        slider2: { value: 1.0, type: "f32" },
        time: { value: sv.pApp.ticker.lastTime, type: "f32" },
        col1: {
          value: palette[0].map((value) => value / 255),
          type: "vec3<f32>",
        },
        col2: {
          value: palette[1].map((value) => value / 255),
          type: "vec3<f32>",
        },
        col3: {
          value: palette[2].map((value) => value / 255),
          type: "vec3<f32>",
        },
      },
    },
  });

  sv.triangleMesh = new Mesh({
    geometry,
    shader,
  });

  const container = new Container();
  container.width = sv.pApp.screen.width;
  container.height = sv.pApp.screen.height;
  container.filterArea = sv.pApp.screen;

  container.addChild(sv.triangleMesh);
  sv.pApp.stage.addChild(container);

  sv.pApp.ticker.add(() => {
    const time = sv.pApp.ticker.lastTime * 0.01;
    sv.triangleMesh.shader.resources.waveUniforms.uniforms.time = time;

    draw(instancePositionBuffer, alphaBuffer, totalTriangles);
  });
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
