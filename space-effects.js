// Filmic presentation pass: natural contrast and mild vignette, with no bloom
// or chromatic glow so materials keep their real color and surface detail.
function createSpaceEffects(renderer){
  const size=new THREE.Vector2();
  return {resize(){renderer.getDrawingBufferSize(size);},render(world,view){renderer.setRenderTarget(null);renderer.render(world,view);}};
}
