// Coin Tower 1.0 - zentrale Spielkonstanten und Zustandsmodell
const VERSION = "1.0.0";
const SAVE_KEY = "coinTower_v1";
const BUY_MODES = [1,10,25,100,"MAX"];
let buyMode = 1;

const game = {
  coins:0, crystals:0, cores:0, tokens:0,
  click:1, cps:0, crit:5, critMulti:2,
  prestige:0, mega:0,
  totalCoins:0, clicks:0, crits:0, spent:0, upgradesBought:0,
  playtime:0, wins:0, losses:0, streak:0,
  attackBonus:0, battleRewardBonus:1, defenseBonus:0,
  battleHp:100, battleMaxHp:100,
  enemyIndex:0, enemyHp:0, enemyMaxHp:0, battleOver:false,
  levels:Array(50).fill(0),
  achievements:[],
  floating:true, autosave:true, last:Date.now(),
  firstRun:true
};

const upgrades = [
  ["⛏️","Steinbruch","Handwerk",25,1,0,"Gewöhnlich"],
  ["🪵","Holzfäller","Handwerk",90,1,1,"Gewöhnlich"],
  ["🔨","Schmied","Handwerk",260,2,3,"Gewöhnlich"],
  ["🧱","Maurer","Handwerk",750,3,8,"Gewöhnlich"],
  ["🏗️","Baukran","Handwerk",2200,5,18,"Ungewöhnlich"],
  ["⚙️","Werkstatt","Industrie",6500,8,42,"Ungewöhnlich"],
  ["🏭","Fabrik","Industrie",19000,12,95,"Selten"],
  ["🚂","Lokomotive","Industrie",56000,18,220,"Selten"],
  ["🚢","Frachtflotte","Industrie",165000,26,510,"Selten"],
  ["✈️","Luftfahrt","Industrie",490000,36,1200,"Episch"],
  ["🏦","Bank","Wirtschaft",1450000,50,2900,"Episch"],
  ["💼","Investmenthaus","Wirtschaft",4300000,72,7000,"Episch"],
  ["📈","Börsenparkett","Wirtschaft",13000000,100,17000,"Legendär"],
  ["💎","Münzmine","Wirtschaft",39000000,145,42000,"Legendär"],
  ["🌐","Finanznetzwerk","Wirtschaft",120000000,210,105000,"Legendär"],
  ["🤖","Roboterfabrik","Zukunft",370000000,300,260000,"Mythisch"],
  ["🧠","Quantenrechner","Zukunft",1100000000,430,650000,"Mythisch"],
  ["⚡","Fusionsreaktor","Zukunft",3300000000,600,1600000,"Mythisch"],
  ["🛰️","Orbitalstation","Zukunft",10000000000,850,4000000,"Göttlich"],
  ["🚀","Weltraumbahnhof","Zukunft",30000000000,1200,10000000,"Göttlich"],
  ["🌙","Mondmine","Weltraum & Endgame",90000000000,1700,25000000,"Göttlich"],
  ["🪐","Marskolonie","Weltraum & Endgame",270000000000,2400,62000000,"Göttlich"],
  ["☄️","Asteroiden-Netz","Weltraum & Endgame",800000000000,3400,155000000,"Transzendent"],
  ["🌌","Sternenbörse","Weltraum & Endgame",2400000000000,4800,390000000,"Transzendent"],
  ["🌀","Wurmloch-Knoten","Weltraum & Endgame",7200000000000,6800,980000000,"Transzendent"],
  ["🌠","Galaxienhandel","Weltraum & Endgame",22000000000000,9500,2500000000,"Transzendent"],
  ["🔭","Kosmisches Auge","Weltraum & Endgame",65000000000000,13500,6200000000,"Transzendent"],
  ["✨","Sternenschmiede","Weltraum & Endgame",200000000000000,19000,15500000000,"Kosmisch"],
  ["🛸","Dimensionshafen","Weltraum & Endgame",600000000000000,27000,39000000000,"Kosmisch"],
  ["👑","Münzimperium","Weltraum & Endgame",1800000000000000,38000,100000000000,"Kosmisch"],
  ["🏛️","Ewiger Tresor","Weltraum & Endgame",5400000000000000,54000,250000000000,"Kosmisch"],
  ["🌍","Planetenbörse","Weltraum & Endgame",16000000000000000,76000,620000000000,"Kosmisch"],
  ["🌞","Sonnenkraftwerk","Weltraum & Endgame",48000000000000000,105000,1550000000000,"Kosmisch"],
  ["🌌","Galaxienfabrik","Weltraum & Endgame",145000000000000000,150000,3900000000000,"Kosmisch"],
  ["🧬","Realitätslabor","Weltraum & Endgame",430000000000000000,215000,9800000000000,"Kosmisch"],
  ["🕳️","Schwarzes Loch","Weltraum & Endgame",1300000000000000000,310000,25000000000000,"Transzendent"],
  ["♾️","Unendlichkeitskern","Weltraum & Endgame",3900000000000000000,450000,62000000000000,"Transzendent"],
  ["🔷","Kristallreaktor","Weltraum & Endgame",12000000000000000000,650000,155000000000000,"Transzendent"],
  ["💠","Kernschmiede","Weltraum & Endgame",36000000000000000000,950000,390000000000000,"Transzendent"],
  ["👁️","Allsehender Turm","Weltraum & Endgame",110000000000000000000,1400000,980000000000000,"Transzendent"],
  ["🧿","Schicksalsbörse","Weltraum & Endgame",330000000000000000000,2050000,2450000000000000,"Transzendent"],
  ["🔮","Realitätsbörse","Weltraum & Endgame",990000000000000000000,3000000,6200000000000000,"Transzendent"],
  ["🌠","Sternenmaschine","Weltraum & Endgame",3000000000000000000000,4400000,16000000000000000,"Kosmisch"],
  ["🪐","Multiversums-Tresor","Weltraum & Endgame",9000000000000000000000,6400000,42000000000000000,"Kosmisch"],
  ["♾️","Ewige Münzquelle","Weltraum & Endgame",27000000000000000000000,9300000,110000000000000000,"Kosmisch"],
  ["👑","Kaiser der Münzen","Weltraum & Endgame",81000000000000000000000,13500000,280000000000000000,"Kosmisch"],
  ["🌌","Galaxienherz","Weltraum & Endgame",240000000000000000000000,20000000,720000000000000000,"Kosmisch"],
  ["🌀","Ursprungsknoten","Weltraum & Endgame",720000000000000000000000,30000000,1900000000000000000,"Kosmisch"],
  ["💫","COIN TOWER","Weltraum & Endgame",2160000000000000000000000,50000000,5000000000000000000,"ULTIMATIV"]
].map((u,i)=>({id:i,icon:u[0],name:u[1],category:u[2],base:u[3],click:u[4],cps:u[5],rarity:u[6]}));

const enemies = [
  ["👺","Goblin-Kurier",50,8,25,1],
  ["🪨","Steinwächter",120,13,60,1],
  ["🗡️","Münzritter",280,22,150,2],
  ["🗿","Goldgolem",650,36,420,2],
  ["🐉","Bankdrache",1500,55,1100,3],
  ["🤖","Industrie-Titan",3800,82,3000,3],
  ["👾","Sternenbestie",9500,125,8500,4],
  ["🌌","Galaxie-Koloss",25000,190,25000,5],
  ["♾️","Ursprungswächter",70000,300,80000,6]
].map((e,i)=>({id:i,avatar:e[0],name:e[1],hp:e[2],damage:e[3],reward:e[4],token:e[5]}));

const tokenItems = [
  {id:"attack",icon:"⚔️",name:"Kampfkraft",desc:"+5 Angriff pro Kauf",cost:5,max:50},
  {id:"reward",icon:"💰",name:"Beute-Multiplikator",desc:"+5% Arena-Belohnung",cost:8,max:20},
  {id:"defense",icon:"🛡️",name:"Wächterpanzer",desc:"-2 eingehender Schaden",cost:10,max:20},
  {id:"heal",icon:"💚",name:"Regenerationskern",desc:"+10% Heilung",cost:15,max:10},
  {id:"crit",icon:"🎯",name:"Arena-Krit",desc:"+2% Chance auf Doppelschaden",cost:20,max:10}
];

const achievements = [
  ["first_click","Erster Klick","Klicke deine erste Münze.",()=>game.clicks>=1],
  ["hundred_clicks","Finger aus Stahl","100 Klicks.",()=>game.clicks>=100],
  ["thousand_clicks","Klickmaschine","1.000 Klicks.",()=>game.clicks>=1000],
  ["million","Münzillionär","1.000.000 Münzen insgesamt.",()=>game.totalCoins>=1e6],
  ["billion","Milliardär","1.000.000.000 Münzen insgesamt.",()=>game.totalCoins>=1e9],
  ["ten_upgrades","Turmbauer","10 Upgrade-Level kaufen.",()=>game.upgradesBought>=10],
  ["hundred_upgrades","Baumeister","100 Upgrade-Level kaufen.",()=>game.upgradesBought>=100],
  ["prestige1","Neuanfang","Prestige 1 erreichen.",()=>game.prestige>=1],
  ["prestige10","Prestige-Meister","Prestige 10 erreichen.",()=>game.prestige>=10],
  ["mega1","Jenseits des Turms","Mega Prestige 1 erreichen.",()=>game.mega>=1],
  ["forge","Alchemist","Die Kristall-Schmiede freischalten.",()=>game.prestige>=20],
  ["battle1","Arena-Neuling","Den ersten Kampf gewinnen.",()=>game.wins>=1],
  ["battle25","Arena-Veteran","25 Kämpfe gewinnen.",()=>game.wins>=25],
  ["levels500","50 Etagen","500 Upgrade-Level insgesamt.",()=>game.levels.reduce((a,b)=>a+b,0)>=500]
];

function fmt(n){
  if(!Number.isFinite(n)) return "∞";
  const abs=Math.abs(n);
  if(abs<1000) return Math.floor(n).toLocaleString("de-DE");
  const units=["Tsd.","Mio.","Mrd.","Bio.","Brd.","Trio.","Quadr.","Quint.","Sext.","Sept.","Okt.","Non.","Dez.","Undez.","Duodez."];
  let i=-1,v=n;
  while(Math.abs(v)>=1000 && i<units.length-1){v/=1000;i++}
  return v.toLocaleString("de-DE",{maximumFractionDigits:2})+" "+units[i];
}
function raw(n){return Number(n).toLocaleString("de-DE",{maximumFractionDigits:0})}
function towerMultiplier(){return (1+game.prestige*.10)*(1+game.mega*.50)*(1+achievementBonus())}
function achievementBonus(){return game.achievements.length*0.005}
function upgradePrice(u,level=game.levels[u.id]){return u.base*Math.pow(1.17,level)}
function upgradeUnlocked(i){
  if(i===0) return true;
  const u=upgrades[i], prev=game.levels[i-1];
  return game.totalCoins>=u.base*0.55 || prev>=10 || i<5;
}
function recalc(){
  let click=1,cps=0;
  game.levels.forEach((lv,i)=>{click+=lv*upgrades[i].click;cps+=lv*upgrades[i].cps});
  game.click=click*towerMultiplier();
  game.cps=cps*towerMultiplier();
  game.battleMaxHp=100+game.prestige*20+game.mega*100+game.defenseBonus*15;
  if(game.battleHp>game.battleMaxHp) game.battleHp=game.battleMaxHp;
}
function prestigeRequirement(){return 1e6*Math.pow(12,game.prestige)}
function prestigeReward(){return Math.max(0,Math.floor(Math.sqrt(game.coins/prestigeRequirement())*25))}
function megaRequirement(){return 1000*Math.pow(5,game.mega)}
function megaReward(){return Math.max(0,Math.floor(Math.sqrt(game.crystals/megaRequirement())*2))}
function battleAttack(){return Math.max(10,Math.floor(10+game.attackBonus+game.click*.05+game.prestige*4+game.mega*15))}
function battleReward(){const e=enemies[game.enemyIndex];return Math.floor(e.reward*game.battleRewardBonus*(1+game.mega*.1))}
function battleCritChance(){return Math.min(50,game.crit+game.battleCritBonus*2)}
let battleCritBonus=0;

function spawnEnemy(){
  const e=enemies[game.enemyIndex];
  game.enemyMaxHp=e.hp*(1+game.prestige*.03+game.mega*.12);
  game.enemyHp=game.enemyMaxHp;
  game.battleOver=false;
  game.battleHp=game.battleMaxHp;
  if(window.renderBattle) renderBattle();
}
function nextEnemy(){
  game.enemyIndex=(game.enemyIndex+1)%enemies.length;
  spawnEnemy();
}
function battleEnemyTurn(){
  if(game.battleOver)return;
  const e=enemies[game.enemyIndex];
  const damage=Math.max(1,Math.floor(e.damage*(1+game.enemyIndex*.08)-game.defenseBonus*2));
  game.battleHp=Math.max(0,game.battleHp-damage);
  if(game.battleHp<=0){
    game.losses++;game.streak=0;game.battleOver=true;
    if(window.showToast) showToast("💀 Niederlage. Heile dich und versuche es erneut.");
  }
}
function battleAttackAction(heavy=false){
  if(game.battleOver)return;
  let damage=battleAttack();
  if(heavy) damage=Math.floor(damage*1.8);
  const crit=Math.random()*100<battleCritChance();
  if(crit) damage*=2;
  game.enemyHp=Math.max(0,game.enemyHp-damage);
  if(window.showBattleLog) showBattleLog((crit?"💥 Kritischer ":"")+"Treffer für "+fmt(damage)+" Schaden.");
  if(game.enemyHp<=0){
    const e=enemies[game.enemyIndex];
    game.wins++;game.streak++;
    const reward=battleReward();
    game.coins+=reward;game.totalCoins+=reward;game.tokens+=e.token;
    game.battleOver=true;
    if(window.showToast) showToast(`🏆 ${e.name} besiegt! +${fmt(reward)} 🪙 +${e.token} 🏅`);
  }else battleEnemyTurn();
}
function healBattle(){
  if(game.battleOver && game.battleHp<=0) game.battleHp=game.battleMaxHp;
  const amount=Math.floor(game.battleMaxHp*(.22+getTokenLevel("heal")*.02));
  game.battleHp=Math.min(game.battleMaxHp,game.battleHp+amount);
  if(window.showBattleLog) showBattleLog(`💚 +${fmt(amount)} HP`);
  if(!game.battleOver) battleEnemyTurn();
}
function getTokenLevel(id){return game["token_"+id]||0}
function buyToken(id){
  const item=tokenItems.find(x=>x.id===id), key="token_"+id, level=getTokenLevel(id);
  if(!item || level>=item.max || game.tokens<item.cost)return false;
  game.tokens-=item.cost;game[key]=level+1;
  if(id==="attack")game.attackBonus+=5;
  if(id==="reward")game.battleRewardBonus+=.05;
  if(id==="defense")game.defenseBonus+=1;
  if(id==="crit")battleCritBonus+=1;
  if(window.showToast)showToast(`🏅 ${item.name} verbessert!`);
  return true;
}
