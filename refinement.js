'use strict';
const recoveredChapters=[
 ['The last passenger','The recorder contains a departure list, not a weapon schematic. Hundreds of names. One is circled: Mara Vale. Commander Vale goes silent on the radio. “My sister was on the last transport. They told me the gates were empty.” The crew now has someone to find.'],
 ['The shelter protocol','Beneath the ice, a transmitter is still counting heartbeats. Noor decodes its instructions: SEAL THE GATES. PRESERVE THE PASSENGERS. The guardians were built to protect the evacuation. Something kept renewing an emergency that should have ended years ago.'],
 ['A message that never arrived','A damaged relay holds the missing all-clear. Earth survived. The evacuation could have returned home. Mika tries to transmit it, but every guardian rejects the message as a forgery. You need the original navigation key, hidden across the remaining stations.'],
 ['The voice in the corridor','Mara answers. Her voice is older than the recording. “We are alive. The station keeps us safe, but it will not let us leave.” Vale promises to reach her. Noor warns that destroying the last guardian without restoring its rescue channel would strand everyone inside.'],
 ['The way through','The relic completes the rescue channel. Jun installs it in the Kestrel: a return beacon that can survive the final crossing. For the first time, this is a rescue plan with a way home. Vale asks you to bring everyone back, including yourself.'],
 ['Permission to leave','The Origin archive reveals the final command: nobody may leave while danger remains. The Sovereign has spent years inventing new threats to obey it. You carry the all-clear, the navigation key, and the return beacon. Defeat the Sovereign so the passengers can choose their own future.']
];
recoveredChapters.forEach((entry,i)=>storyBeats['rescue'+i]=entry);
storyBeats.universeClear=['The corridor answers','The last orbital relay reconnects. Across this universe, stations begin receiving each other’s calls. Vale marks the guardian’s coordinates: “The passage is still sealed. We have to get through.”'];
const originalStoryBeat=storyBeat;
storyBeat=function(id){if(id==='firstRelic'){if(!save.storyLog.includes('firstRelic'))save.storyLog.push('firstRelic');id='rescue'+save.universe;}originalStoryBeat(id);};
renderStory=function(){
 $('storySummary').textContent='THE RESCUE / '+Campaign.universes[save.universe].name+' · Recover relics to trace the missing passengers.';
 $('storyEntries').replaceChildren();for(const id of save.storyLog){if(id==='firstRelic'&&save.storyLog.includes('rescue0'))continue;const beat=storyBeats[id];if(!beat)continue;const article=document.createElement('article'),title=document.createElement('h3'),body=document.createElement('p');title.textContent=beat[0];body.textContent=beat[1];article.append(title,body);$('storyEntries').append(article);}
};
const originalFinishStory=finishStory;
finishStory=function(){originalFinishStory();if(mode==='ending'&&save.storyComplete){$('cinematicTitle').textContent='The passengers choose home.';$('cinematicText').textContent='The Sovereign falls silent. Mika transmits the all-clear through the restored relays. One by one, the evacuation ships answer. Mara calls the Ark: “Vale? Leave a light on.” For the first time in years, the gates open from both sides.';$('victory').querySelector('h2').textContent='Leave a light on.';}};
// Surface flight uses the same terrain and landed ship as exploration.
let descentVelocity=new V(),descentReturn='',descentHelp=null;
function launchSequenceTick(dt){
 transition.time+=dt;const t=transition.time;
 if(t<3){const advance=Math.max(0,t-.7);parkedShip.position.copy(transition.shipFrom).add(new V(0,Math.min(2,t),-advance*advance*8));camera.position.copy(parkedShip.position).add(new V(8,4,18));camera.lookAt(parkedShip.position);$('travelLabel').textContent=t<1?'ENGINE IGNITION / RELEASE CLAMPS':'DEPARTURE / CLEARING THE HANGAR';}
 else{groundActive=false;const progress=Math.min(1,(t-3)/3),distance=60+progress*150;
 if(groundKind==='station'){ship.position.set(0,0,-distance);ship.quaternion.identity();}
 else{ship.position.copy(groundPlanet.pos).add(new V(0,0,groundPlanet.radius+distance+210));ship.quaternion.setFromAxisAngle(upAxis,Math.PI);}
 camera.position.copy(ship.position).add(new V(22,12,groundKind==='station'?40:-40));camera.lookAt(ship.position);$('travelLabel').textContent=progress<.7?'ARK CONTROL / DEPARTURE CONFIRMED':'FREE FLIGHT / YOU HAVE CONTROL';}
 if(t>=6)finishLaunch();
}
function beginSurfaceDescent(){
 mode='descent';groundActive=true;clearInput();descentVelocity.set(0,0,0);$('notice').classList.remove('show');
 parkedShip.position.set(0,65,68);parkedShip.rotation.set(0,0,0);
 if(!descentHelp){descentHelp=document.createElement('section');descentHelp.id='descentHud';document.body.appendChild(descentHelp);}
 descentHelp.hidden=false;$('travel').classList.add('hidden');surfaceDescentTick(0);
}
function surfaceDescentTick(dt){
 const craft=parkedShip, braking=keys.KeyB;
 const desired=new V(((keys.KeyD?1:0)-(keys.KeyA?1:0))*14,((keys.KeyR?1:0)-(keys.KeyQ?1:0))*9,((keys.KeyS?1:0)-(keys.KeyW?1:0))*14);
 descentVelocity.lerp(braking?new V():desired,1-Math.exp(-dt*(braking?7:2)));
 craft.position.addScaledVector(descentVelocity,dt);craft.position.x=THREE.MathUtils.clamp(craft.position.x,-180,180);craft.position.z=THREE.MathUtils.clamp(craft.position.z,-180,180);
 const floor=heightAt(craft.position.x,craft.position.z)+1.4;
 craft.position.y=Math.min(140,craft.position.y);const altitude=Math.max(0,craft.position.y-floor);
 craft.rotation.z=THREE.MathUtils.damp(craft.rotation.z,-descentVelocity.x*.008,4,dt);
 camera.position.copy(craft.position).add(new V(17,12,27));camera.lookAt(craft.position.clone().add(new V(0,-4,-12)));
 const safe=Math.abs(descentVelocity.y)<=3.5&&Math.hypot(descentVelocity.x,descentVelocity.z)<=4;
 descentHelp.innerHTML='<div class="eyebrow">SURFACE APPROACH / '+groundPlanet.name+'</div><h2>'+altitude.toFixed(1)+' <small>m above terrain</small></h2><p>Vertical speed '+descentVelocity.y.toFixed(1)+' m/s · '+(safe?'GEAR READY':'BRAKE BEFORE CONTACT')+'</p><p>W / S forward & reverse · A / D lateral · Q descend · R rise · B brake · Esc pause</p>';
 if(craft.position.y<=floor){
  craft.position.y=floor;
  if(!safe){craft.position.y+=2;descentVelocity.set(0,3,0);toast('Landing gear overload · B to brake, then use short Q taps.');return;}
  craft.rotation.set(0,0,0);mode='walking';walker.copy(craft.position).add(new V(6,0,0));groundYaw=Math.PI/2;groundPitch=0;walkJump=walkVelocity=0;
  descentHelp.hidden=true;clearInput();updateGroundCamera();persist();toast('Touchdown confirmed · Leave the ship and explore. E to board again.');
 }
}
window.addEventListener('keydown',e=>{
 if(!['descent','descentPaused'].includes(mode))return;
 if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(mode==='descent'){mode='descentPaused';clearInput();descentHelp.innerHTML='<h2>Approach paused</h2><p>Press Escape to resume your descent.</p>';}else mode='descent';return;}
 if(!['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyR','KeyB'].includes(e.code)){e.stopImmediatePropagation();return;}
},true);
window.addEventListener('blur',()=>{if(mode==='descent'){mode='descentPaused';clearInput();descentHelp.innerHTML='<h2>Approach paused</h2><p>Press Escape to resume.</p>';}});

// A chart of actual X/Z positions, including the station, ship and selected route.
renderStarChart=function(){
 const grid=$('planetGrid');grid.replaceChildren();grid.classList.add('spatialChart');
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1000 800');svg.classList.add('starChart');svg.setAttribute('aria-label','Galaxy chart: planet positions in the X/Z plane');
 const extent=Math.max(16000,...planets.flatMap(p=>[Math.abs(p.pos.x),Math.abs(p.pos.z)]),Math.abs(ship.position.x),Math.abs(ship.position.z))*1.12;
 const point=p=>[500+p.x/extent*435,400+p.z/extent*340];
 const el=(tag,attrs,text)=>{const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text)n.textContent=text;return n;};
 for(let x=65;x<1000;x+=87)svg.append(el('line',{x1:x,y1:45,x2:x,y2:755,class:'chartGrid'}));
 for(let y=60;y<800;y+=68)svg.append(el('line',{x1:40,y1:y,x2:960,y2:y,class:'chartGrid'}));
 const [sx,sy]=point(groundActive?stationPoint.pos:ship.position),[tx,ty]=point(allPlanets[selected].pos);
 svg.append(el('line',{x1:sx,y1:sy,x2:tx,y2:ty,class:'selectedRoute'}));
 planets.forEach(p=>{
  const [x,y]=point(p.pos),g=el('g',{transform:'translate('+x+' '+y+')',class:'chartNode'+(selected===p.id?' chartSelected':''),role:'button',tabindex:0,'aria-label':p.name+' — '+(getEncounter(p).cleared?'landing unlocked':'hostile orbit')});
  g.append(el('circle',{r:17,class:'chartHalo'}),el('circle',{r:6,fill:getEncounter(p).cleared?'#a6b395':'#bf927b'}),el('text',{x:x>820?-24:24,y:-3,'text-anchor':x>820?'end':'start',class:'chartLabel'},p.name),el('text',{x:x>820?-24:24,y:13,'text-anchor':x>820?'end':'start',class:'chartSub'},'LV '+p.tier+' / '+(getEncounter(p).cleared?'OPEN':'HOSTILE')));
  const select=()=>{selected=p.id;renderMap();};g.onclick=select;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}};svg.append(g);
 });
 svg.append(el('rect',{x:493,y:393,width:14,height:14,fill:'#ddd5c2'}),el('text',{x:520,y:406,class:'chartLabel'},'ARK / HOME'));
 if(!groundActive)svg.append(el('path',{d:'M '+sx+' '+(sy-10)+' l -7 17 7 -4 7 4 Z',fill:'#fff'}));
 grid.append(svg);const legend=document.createElement('p');legend.className='chartLegend';legend.textContent='TOP-DOWN X / Z · SQUARE: STATION · TRIANGLE: YOU · GREEN: LANDING OPEN · LINE: SELECTED COURSE';grid.append(legend);
};
decorateWorkshop=function(){
 const dock=document.querySelector('.dock');let course=$('coursePanel');if(!course){course=document.createElement('section');course.id='coursePanel';dock.prepend(course);course.append($('selection'),$('warp'));}
 const metrics={weapon:n=>(14+n*7)+' damage / cannon',shield:n=>(100+(n-1)*30)+' hull',engine:n=>Math.round(120*(1+(n-1)*.15))+' m/s forward',rapid:n=>((.19-(save.weapon-1)*.011)/(1+(n-1)*.12)).toFixed(3)+' s / volley',nova:n=>(190+(n-1)*25)+' m radius'};
 for(const k of Object.keys(upgradeTypes)){const b=$(k+'Upgrade'),n=save[k];b.classList.add('upgradeCard');b.innerHTML='<span class="upgradeName">'+upgradeTypes[k].name+'</span><span>MK '+n+'</span><small>'+metrics[k](n)+(n<8?' → '+metrics[k](n+1):' · Maximum')+'</small><strong>'+(n===8?'FULLY UPGRADED':'INSTALL · ◈ '+n*100)+'</strong>';}
};

// Neutral materials and broadleaf canopies provide form without emissive decoration.
const originalSurfaceWorld=surfaceWorld;
const originalStationWorld=stationWorld;
stationWorld=function(){originalStationWorld();groundRoot.traverse(o=>{if(o.isSprite)o.visible=false;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(!m)continue;if(m.emissive)m.emissive.setHex(0);if(m.color&&o.isMesh){const hsl={};m.color.getHSL(hsl);m.color.setHSL(hsl.h,hsl.s*.22,hsl.l);}}if(o.isPointLight)o.color.setHex(0xffe9c9);});};
surfaceWorld=function(p){
 originalSurfaceWorld(p);groundAmbient.color.setHex(0xd9e0d4);groundAmbient.groundColor.setHex(0x49483d);groundAmbient.intensity=1.5;
 groundScene.background.setHex([0xb6c6c1,0xbecad0,0x8b8178,0x9d9da8,0xcbbd9f,0x9fbdc1][p.id%6]);groundScene.fog.color.copy(groundScene.background);groundScene.fog.density=.0032;
 groundRoot.traverse(o=>{if(o.isSprite)o.visible=false;if(o.material?.emissive)o.material.emissive.setHex(0);if(o.isInstancedMesh&&o.count===280)o.material.color.setHex(0x77766b);if(o.isInstancedMesh&&o.count===220&&(p.id%6===0||p.id%6===5))o.visible=false;});
 const terrainColors=[0x65734b,0xabb8be,0x64564b,0x777274,0xb3a17a,0x68796b];
 groundTerrain.material.dispose();groundTerrain.material=new THREE.MeshStandardMaterial({color:terrainColors[p.id%6],roughness:1});
 groundTerrain.material.onBeforeCompile=s=>{s.vertexShader='varying vec3 terrainPoint;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nterrainPoint=position;');s.fragmentShader='varying vec3 terrainPoint;\n'+noiseGLSL+'\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb*=.82+fbm(terrainPoint*.035)*.34+noise(terrainPoint*1.5)*.035;');};
 if(p.id%6===0||p.id%6===5){
 const crowns=new THREE.InstancedMesh(expGeo.rock,new THREE.MeshStandardMaterial({color:p.id%6===0?0x4e6341:0x526b58,roughness:1}),180),trunks=new THREE.InstancedMesh(expGeo.cylinder,new THREE.MeshStandardMaterial({color:0x514536,roughness:1}),180),m=new THREE.Object3D();
 for(let i=0;i<180;i++){const a=i*2.39996,r=48+(i*17%185),x=Math.cos(a)*r,z=Math.sin(a)*r,h=8+i%8;m.position.set(x,heightAt(x,z)+h*.5,z);m.scale.set(.6,h,.6);m.rotation.set(0,i,0);m.updateMatrix();trunks.setMatrixAt(i,m.matrix);m.position.y+=h*.48;m.scale.set(5+i%4,4+i%3,5+i%4);m.updateMatrix();crowns.setMatrixAt(i,m.matrix);}crowns.castShadow=trunks.castShadow=true;groundRoot.add(crowns,trunks);
 }
};
