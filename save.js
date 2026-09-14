function save(){
  game.last=Date.now();
  localStorage.setItem(SAVE_KEY,JSON.stringify({...game,version:VERSION}));
}
function load(){
  const rawSave=localStorage.getItem(SAVE_KEY);
  if(!rawSave)return false;
  try{
    const s=JSON.parse(rawSave);
    Object.keys(game).forEach(k=>{if(s[k]!==undefined)game[k]=s[k]});
    if(!Array.isArray(game.levels))game.levels=Array(50).fill(0);
    while(game.levels.length<50)game.levels.push(0);
    game.levels=game.levels.slice(0,50);
    const now=Date.now(), elapsed=Math.max(0,(now-(s.last||now))/1000);
    const capped=Math.min(elapsed,8*60*60);
    recalc();
    const offline=Math.floor(game.cps*capped);
    if(offline>0){
      game.coins+=offline;game.totalCoins+=offline;
      setTimeout(()=>showToast(`🌙 Während deiner Abwesenheit: +${fmt(offline)} 🪙`),400);
    }
    game.last=now;
    return true;
  }catch(e){console.error(e);return false}
}
function exportSave(){
  save();
  const blob=new Blob([localStorage.getItem(SAVE_KEY)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Coin_Tower_1.0_Save.json";a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function importSaveText(text){
  try{
    const s=JSON.parse(text);
    if(!s || !Array.isArray(s.levels) || s.levels.length!==50)throw new Error("invalid");
    localStorage.setItem(SAVE_KEY,JSON.stringify(s));
    location.reload();
  }catch(e){showToast("❌ Ungültiger Spielstand.")}
}
function resetSave(){
  if(confirm("Wirklich den kompletten Coin Tower Spielstand löschen?")){
    localStorage.removeItem(SAVE_KEY);location.reload();
  }
}
