import { Point } from "pixi.js";
import { sv } from "./variables.js";

export function draw(instancePositionBuffer, alphaBuffer, totalTriangles) {
  const data = instancePositionBuffer.data;
  const alphaData = alphaBuffer.data;

  let count = 0;
  for (let i = 0; i < totalTriangles; i++) {
    const origin = sv.mousePos;

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

    alphaData[i] = 1 - distance / (sv.sWidth * 0.1);
  }

  instancePositionBuffer.update();
  alphaBuffer.update();
}
