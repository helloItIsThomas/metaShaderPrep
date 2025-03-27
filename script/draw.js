import { Point } from "pixi.js";
import { sv } from "./variables.js";

export function draw(
  instancePositionBuffer,
  alphaBuffer,
  triangleMesh,
  totalTriangles,
  triangles
) {
  const data = instancePositionBuffer.data;
  const alphaData = alphaBuffer.data;

  const mouseVelocity = Math.abs(
    Math.sqrt(
      Math.pow(sv.mousePos.x - sv.prevMousePos.x, 2) +
        Math.pow(sv.mousePos.y - sv.prevMousePos.y, 2)
    )
  );

  const normMouseVel = mouseVelocity / window.innerWidth;
  const normMousePos = {
    x: sv.mousePos.x / window.innerWidth,
    y: sv.mousePos.y / window.innerHeight,
  };

  triangleMesh.shader.resources.waveUniforms.uniforms.mouseVelocity =
    normMouseVel;

  const clock = sv.pApp.ticker.lastTime * 0.1;
  let count = 0;
  for (let i = 0; i < totalTriangles; i++) {
    const triangle = triangles[i];
    const angle = (i / totalTriangles) * Math.PI * 2; // Distribute triangles in a circle
    const time = sv.pApp.ticker.lastTime * 0.1;

    const origin = sv.mousePos;

    // Calculate radius that grows over time
    const radius =
      (time * triangle.speed * 20) %
      (Math.max(sv.pApp.screen.width, sv.pApp.screen.height) * 0.1);

    const newPos = {
      x: 0.0,
      y: 0.0,
    };

    data[count++] = newPos.x;
    data[count++] = newPos.y;

    const mousePosVec = new Point(sv.mousePos.x, sv.mousePos.y);
    const trianglePosVec = new Point(newPos.x + origin.x, newPos.y + origin.y);
    // Calculate distance using Pythagorean theorem
    const distance = Math.sqrt(
      Math.pow(mousePosVec.x - trianglePosVec.x, 2) +
        Math.pow(mousePosVec.y - trianglePosVec.y, 2)
    );

    alphaData[i] = 1 - distance / (sv.pApp.screen.width * 0.1);
  }

  instancePositionBuffer.update();
  alphaBuffer.update();
}
