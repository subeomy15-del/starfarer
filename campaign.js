'use strict';
// Campaign rules are shared by gameplay and the regression checks.
const Campaign = (() => {
  const worldsPerUniverse = 24;
  const universes = [
    {name:'The Verdant Reach', color:0x62e8cf, boss:'The Rift Warden', chapter:'A signal in the dark'},
    {name:'The Glass Expanse', color:0x8bcaff, boss:'The Crystal Regent', chapter:'Echoes beneath the ice'},
    {name:'The Ember Kingdom', color:0xff9a62, boss:'The Cinder Colossus', chapter:'What the fire remembers'},
    {name:'The Violet Abyss', color:0xc49aff, boss:'The Dream Eater', chapter:'A memory of home'},
    {name:'The Golden Divide', color:0xffd989, boss:'The Last Sentinel', chapter:'The price of the crossing'},
    {name:'The Silent Origin', color:0xff759d, boss:'The Null Sovereign', chapter:'Where the signal began'}
  ];
  const level=n=>Math.max(1,Math.min(8,Math.floor(Number(n)||1)));
  const ids=(a,max)=>[...new Set((Array.isArray(a)?a:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<max))];
  function restore(raw={}) {
    if(!raw||typeof raw!=='object')raw={};
    const bosses=ids(raw.bosses,6);
    let unlocked=0;while(unlocked<5&&bosses.includes(unlocked))unlocked++;
    const universe=Math.max(0,Math.min(unlocked,Math.floor(Number(raw.universe)||0)));
    const count=n=>Number.isFinite(n)?Math.max(0,Math.floor(n)):0;
    return {credits:count(Number(raw.credits)),weapon:level(raw.weapon),shield:level(raw.shield),engine:level(raw.engine),rapid:level(raw.rapid),nova:level(raw.nova),cleared:ids(raw.cleared,144),last:0,universe,bosses,storyComplete:bosses.length===6,introSeen:raw.introSeen===true,pendingWake:raw.pendingWake===true,storyLog:[...new Set((Array.isArray(raw.storyLog)?raw.storyLog:[]).filter(s=>typeof s==='string'&&s.length<180))],crewClaims:[...new Set((Array.isArray(raw.crewClaims)?raw.crewClaims:[]).filter(s=>/^[0-5]:(medical|research)$/.test(s)))],inventory:{alloy:count(raw.inventory?.alloy),crystal:count(raw.inventory?.crystal),relic:count(raw.inventory?.relic)},collected:[...new Set((Array.isArray(raw.collected)?raw.collected:[]).filter(s=>typeof s==='string'&&/^(?:\d{1,3}):[0-7]$/.test(s)&&Number(s.split(':')[0])<144))]};
  }
  function secured(save,u=save.universe){return new Set(save.cleared.filter(id=>Math.floor(id/24)===u)).size;}
  function ready(save){return secured(save)===24&&!save.bosses.includes(save.universe);}
  function victory(save){if(!ready(save))return false;save.bosses.push(save.universe);save.storyComplete=save.bosses.length===6;if(save.universe<5)save.universe++;return true;}
  function collect(save,planet,slot,type){const id=`${planet}:${slot}`;if(!save.cleared.includes(planet)||save.collected.includes(id)||!['alloy','crystal','relic'].includes(type)||slot<0||slot>7)return false;save.collected.push(id);save.inventory[type]++;save.credits+=type==='relic'?90:type==='crystal'?35:20;return true;}
  return {worldsPerUniverse,universes,restore,secured,ready,victory,collect};
})();
if(typeof module!=='undefined')module.exports=Campaign;
