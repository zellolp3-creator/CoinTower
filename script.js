const $=id=>document.getElementById(id);
function updateUI(){
  recalc();
  $("coins").textContent=fmt(game.coins);
  $("crystals").textContent=fmt(game.crystals);
  $("cores").textContent=fmt(game.cores);
  $("tokens").textContent=fmt(game.tokens);
  $("cps").textContent=fmt(game.cps);
  $("clickPower").textContent=fmt(game.click);
  $("towerLevel").textContent=1+Math.floor(game.upgradesBought/10);
  $("prestigeLevel").textContent=game.prestige;
  $("multiplier").textContent="×"+towerMultiplier().toLocaleString("de-DE",{maximumFractionDigits:2});
  $("critInfo").textContent=`${game.crit}% ×${game.critMulti}`;
  $("totalCoins").textContent=fmt(game.totalCoins);
  $("crits").textContent=fmt(game.crits);
  $("streak").textContent=game.streak;
  $("playtime").textContent=fmtTime(game.playtime);
  $("clickHint").textContent=`+${fmt(game.click)} 🪙`;
  $("towerName").textContent=towerTitle();
  $("towerDesc").textContent=towerDescription();
  renderShop();
  renderPrestige();
  renderBattle();
  renderStats();
  renderAchievements();
  renderTokenShop();
  $("floatToggle").classList.toggle("on",game.floating);
  $("autosaveToggle").classList.toggle("on",game.autosave);
}
function fmtTime(sec){
  sec=Math.floor(sec);const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;
  return h?`${h}h ${m}m`:m?`${m}m ${s}s`:`${s}s`;
}
function towerTitle(){
  const lv=1+Math.floor(game.upgradesBought/10);
  const titles=["Münzfundament","Kleiner Turm","Handwerksturm","Industrieturm","Finanzzitadelle","Megakomplex","Orbitalkoloss","Sternenfestung","Galaxienpalast","Ursprungsturm"];
  return titles[Math.min(titles.length-1,Math.floor(lv/5))];
}
function towerDescription(){return `Etage ${1+Math.floor(game.upgradesBought/10)} · ${game.upgradesBought} Ausbau-Stufen`;}

function collectCoins(){
  const crit=Math.random()*100<game.crit;
  let amount=game.click*(crit?game.critMulti:1);
  game.coins+=amount;game.totalCoins+=amount;game.clicks++;
  if(crit)game.crits++;
  game.streak++;
  const rect=$("coinButton").getBoundingClientRect();
  showFloat((crit?"💥 KRIT! ":"+")+fmt(amount)+" 🪙",rect.left+rect.width/2,rect.top+20,crit);
  pulseCoin(crit);
  if(game.clicks%25===0)showToast(`🔥 ${game.streak} Klicks Serie`);
  updateUI();
}
function renderPrestige(){
  const req=prestigeRequirement(), reward=prestigeReward(), mreq=megaRequirement(),mreward=megaReward();
  $("prestigeReq").textContent=fmt(req);$("prestigeReward").textContent=fmt(reward);
  $("prestigeBonus").textContent="×"+(1+game.prestige*.1).toFixed(2);
  $("megaReq").textContent=fmt(mreq);$("megaReward").textContent=fmt(mreward);
  $("megaBonus").textContent="×"+(1+game.mega*.5).toFixed(2);
  $("prestigeBtn").disabled=reward<1;
  $("megaBtn").disabled=mreward<1;
  const unlocked=game.prestige>=20;
  $("forgeStatus").textContent=unlocked?"AKTIV":"🔒 Prestige 20";
  $("forgeBtn").disabled=!unlocked||game.crystals<100;
}
function doPrestige(){
  const reward=prestigeReward();if(reward<1)return;
  game.crystals+=reward;game.prestige++;game.coins=0;game.levels=Array(50).fill(0);game.upgradesBought=0;game.streak=0;recalc();
  showModal("💎 Prestige!",`Du hast Prestige ${game.prestige} erreicht und ${reward} Kristalle erhalten. Dein permanenter Turm-Multiplikator steigt weiter.`);
  updateUI();save();
}
function doMega(){
  const reward=megaReward();if(reward<1)return;
  game.cores+=reward;game.mega++;game.crystals=0;game.coins=0;game.levels=Array(50).fill(0);game.upgradesBought=0;game.streak=0;recalc();
  showModal("🔷 MEGA PRESTIGE!",`Der Turm wurde auf kosmischer Ebene neu gestartet. +${reward} Kristallkerne.`);
  updateUI();save();
}
function forgeCore(){
  if(game.prestige<20||game.crystals<100)return;
  game.crystals-=100;game.cores++;showToast("🔷 100 Kristalle wurden zu 1 Kern geschmiedet!");updateUI();save();
}

function renderBattle(){
  const e=enemies[game.enemyIndex];
  $("attack").textContent=fmt(battleAttack());$("maxHp").textContent=fmt(game.battleMaxHp);
  $("battleReward").textContent=fmt(battleReward());$("battleTokens").textContent=game.tokens;
  $("wins").textContent=game.wins;
  $("enemyTier").textContent=`ARENA · STUFE ${e.id+1}`;
  $("enemyAvatar").textContent=e.avatar;$("enemyName").textContent=e.name;
  const pct=Math.max(0,Math.min(100,game.enemyHp/game.enemyMaxHp*100));
  $("enemyHp").style.width=pct+"%";$("enemyHpText").textContent=`${fmt(game.enemyHp)} / ${fmt(game.enemyMaxHp)} HP`;
  $("attackBtn").disabled=game.battleOver;$("heavyBtn").disabled=game.battleOver;
  $("healBtn").disabled=!game.battleOver && game.battleHp>=game.battleMaxHp;
  if(game.battleHp<=0){$("battleLog").textContent="💀 Besiegt. Heilen oder nächsten Gegner wählen."}
  else $("battleLog").textContent ||= "Wähle einen Angriff.";
}
function showBattleLog(t){$("battleLog").textContent=t;renderBattle()}
function renderTokenShop(){
  $("tokenBalance").textContent=game.tokens;
  $("tokenShopList").innerHTML=tokenItems.map(i=>{
    const lv=getTokenLevel(i.id),ok=game.tokens>=i.cost&&lv<i.max;
    return `<div class="token-item"><div class="icon">${i.icon}</div><div><b>${i.name} · Lv.${lv}/${i.max}</b><small>${i.desc}</small></div><button class="token-buy ${ok?"ok":""}" data-token="${i.id}" ${ok?"":"disabled"}>${i.cost} 🏅</button></div>`;
  }).join("");
  document.querySelectorAll("[data-token]").forEach(b=>b.onclick=()=>{if(buyToken(b.dataset.token)){updateUI();save()}});
}
function renderStats(){
  const rows=[
    ["🪙 Münzen gesamt",fmt(game.totalCoins)],["👆 Klicks",fmt(game.clicks)],["💥 Kritische Treffer",fmt(game.crits)],
    ["💸 Ausgaben",fmt(game.spent)],["🛒 Upgrades gekauft",fmt(game.upgradesBought)],["⏱️ Spielzeit",fmtTime(game.playtime)],
    ["💎 Prestige",game.prestige],["🔷 Mega Prestige",game.mega],["🏆 Siege",game.wins],["💀 Niederlagen",game.losses],
    ["🏅 Battle Tokens",fmt(game.tokens)],["🏗️ Gesamt-Level",fmt(game.levels.reduce((a,b)=>a+b,0))]
  ];
  $("statsGrid").innerHTML=rows.map(r=>`<div class="stat"><small>${r[0]}</small><b>${r[1]}</b></div>`).join("");
}
function renderAchievements(){
  let done=0;
  $("achievementList").innerHTML=achievements.map(a=>{
    const isDone=game.achievements.includes(a[0])||a[3]();
    if(isDone)done++;
    return `<div class="achievement ${isDone?"done":""}"><b>${isDone?"✅":"⬜"} ${a[1]}</b><small>${a[2]}</small></div>`;
  }).join("");
  $("achievementCount").textContent=`${done}/${achievements.length}`;
  achievements.forEach(a=>{
    if(!game.achievements.includes(a[0])&&a[3]()){
      game.achievements.push(a[0]);showToast(`🏆 Achievement: ${a[1]}!`);
    }
  });
}
function go(screen){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.querySelectorAll(".nav").forEach(n=>n.classList.remove("active"));
  const id=screen==="tower"?"towerScreen":screen+"Screen";
  $(id).classList.add("active");
  document.querySelector(`.nav[data-go="${screen}"]`)?.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
function wire(){
  $("coinButton").onclick=collectCoins;
  $("saveBtn").onclick=()=>{save();showToast("💾 Spielstand gespeichert");};
  $("prestigeBtn").onclick=doPrestige;$("megaBtn").onclick=doMega;$("forgeBtn").onclick=forgeCore;
  $("attackBtn").onclick=()=>{battleAttackAction(false);updateUI();save()};
  $("heavyBtn").onclick=()=>{battleAttackAction(true);updateUI();save()};
  $("healBtn").onclick=()=>{healBattle();updateUI();save()};
  $("nextEnemyBtn").onclick=()=>{nextEnemy();updateUI()};
  $("floatToggle").onclick=()=>{game.floating=!game.floating;updateUI();save()};
  $("autosaveToggle").onclick=()=>{game.autosave=!game.autosave;updateUI();save()};
  $("exportBtn").onclick=exportSave;
  $("importBtn").onclick=()=>$("importFile").click();
  $("importFile").onchange=e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=()=>importSaveText(r.result);r.readAsText(f)}};
  $("resetBtn").onclick=resetSave;
  $("modalClose").onclick=()=>$("modal").classList.remove("show");
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelectorAll("#buybar button").forEach(b=>b.onclick=()=>{
    buyMode=b.dataset.mode==="MAX"?"MAX":Number(b.dataset.mode);
    document.querySelectorAll("#buybar button").forEach(x=>x.classList.remove("on"));b.classList.add("on");renderShop();
  });
}
function gameTick(){
  const income=game.cps;
  if(income>0){game.coins+=income;game.totalCoins+=income}
  game.playtime++;
  if(game.autosave && game.playtime%15===0)save();
  updateUI();
}
wire();
const hadSave=load();
recalc();spawnEnemy();updateUI();
if(!hadSave){
  setTimeout(()=>showModal("🪙 Willkommen bei Coin Tower 1.0!", "Baue deinen Turm auf, kaufe 50 verschiedene Jobs, prestigiere für Kristalle, bezwinge die Arena und erreiche den ultimativen Coin-Tower-Kern."),300);
}
setInterval(gameTick,1000);
