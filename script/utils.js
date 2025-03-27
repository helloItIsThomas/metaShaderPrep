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
