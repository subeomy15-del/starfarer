// Lightweight post-processing keeps the flight view crisp while adding bloom,
// cinematic contrast, subtle chromatic separation, and a restrained film grain.
function createSpaceEffects(renderer){
  const size=new THREE.Vector2();
  renderer.getDrawingBufferSize(size);
  const make=(w,h)=>new THREE.WebGLRenderTarget(w,h,{type:THREE.HalfFloatType,depthBuffer:false});
  const main=make(size.x,size.y); main.depthBuffer=true;
  const blurA=make(Math.ceil(size.x/3),Math.ceil(size.y/3));
  const blurB=make(Math.ceil(size.x/3),Math.ceil(size.y/3));
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const vertex='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
  const blur=new THREE.ShaderMaterial({
    depthTest:false,depthWrite:false,toneMapped:false,
    uniforms:{source:{value:null},stepSize:{value:new THREE.Vector2()},threshold:{value:0}},
    vertexShader:vertex,
    fragmentShader:`varying vec2 vUv;uniform sampler2D source;uniform vec2 stepSize;uniform float threshold;
      vec3 sampleLight(vec2 p){vec3 c=texture2D(source,p).rgb;float peak=max(c.r,max(c.g,c.b));return c*max(0.,peak-threshold)/max(.001,peak);}
      void main(){vec3 c=sampleLight(vUv)*.227027;c+=(sampleLight(vUv+stepSize*1.384615)+sampleLight(vUv-stepSize*1.384615))*.316216;c+=(sampleLight(vUv+stepSize*3.230769)+sampleLight(vUv-stepSize*3.230769))*.070270;gl_FragColor=vec4(c,1.);}`
  });
  const composite=new THREE.ShaderMaterial({
    depthTest:false,depthWrite:false,
    uniforms:{source:{value:main.texture},bloom:{value:blurB.texture}},vertexShader:vertex,
    fragmentShader:`varying vec2 vUv;uniform sampler2D source;uniform sampler2D bloom;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec2 center=vUv-.5; float radius=length(center); float vignette=1.-smoothstep(.22,.82,radius)*.28;
        vec2 ca=normalize(center+vec2(.0001))*.0016;
        vec3 c=vec3(texture2D(source,vUv+ca).r,texture2D(source,vUv).g,texture2D(source,vUv-ca).b);
        c+=texture2D(bloom,vUv).rgb*.46;
        float lum=dot(c,vec3(.2126,.7152,.0722)); c=mix(vec3(lum),c,1.12);
        c=(c-.5)*1.08+.5; c*=vignette;
        c+=vec3((hash(vUv*vec2(1600.,900.))-.5)/255.);
        gl_FragColor=vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),blur); scene.add(quad);
  return {
    resize(){renderer.getDrawingBufferSize(size);main.setSize(size.x,size.y);blurA.setSize(Math.ceil(size.x/3),Math.ceil(size.y/3));blurB.setSize(blurA.width,blurA.height);},
    render(world,view){
      renderer.setRenderTarget(main); renderer.render(world,view);
      quad.material=blur; blur.uniforms.source.value=main.texture; blur.uniforms.threshold.value=.82; blur.uniforms.stepSize.value.set(1.5/blurA.width,0);
      renderer.setRenderTarget(blurA); renderer.render(scene,camera);
      blur.uniforms.source.value=blurA.texture; blur.uniforms.threshold.value=0; blur.uniforms.stepSize.value.set(0,1.5/blurA.height);
      renderer.setRenderTarget(blurB); renderer.render(scene,camera);
      quad.material=composite; renderer.setRenderTarget(null); renderer.render(scene,camera);
    }
  };
}
