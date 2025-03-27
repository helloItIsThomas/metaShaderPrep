import { sv } from "./variables.js";

export async function loadShadersVanilla() {
  const [vertex, fragment] = await Promise.all([
    fetch("/shader/vert.vert").then((res) => res.text()),
    fetch("/shader/test.frag").then((res) => res.text()),
  ]);

  return { vertex, fragment };
}
