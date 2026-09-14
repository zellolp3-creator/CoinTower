function buyUpgrade(id,amount=buyMode){
  const u=upgrades[id];
  if(!u || !upgradeUnlocked(id))return 0;
  let bought=0,limit=amount==="MAX"?1000:Number(amount);
  while(bought<limit){
    const price=upgradePrice(u);
    if(game.coins<price)break;
    game.coins-=price;game.spent+=price;game.levels[id]++;game.upgradesBought++;bought++;
  }
  if(bought)recalc();
  return bought;
}
function buyPickaxe(){return buyUpgrade(0)}
function buyWorker(){return buyUpgrade(1)}
function maxBuy(id){return buyUpgrade(id,"MAX")}
function renderShop(){
  const list=document.getElementById("shopList"), groups={};
  upgrades.forEach(u=>(groups[u.category]??=[]).push(u));
  let html="";
  for(const [cat,items] of Object.entries(groups)){
    html+=`<div class="category">${cat}</div>`;
    items.forEach(u=>{
      const lv=game.levels[u.id], unlocked=upgradeUnlocked(u.id), price=upgradePrice(u), can=game.coins>=price;
      const next=u.id<upgrades.length-1?upgrades[u.id+1]:null;
      const effect=u.click?`+${fmt(u.click)} Klickkraft`:"";
      const cps=u.cps?`+${fmt(u.cps)} CPS`:"";
      const progress=Math.min(100,(game.totalCoins/(u.base*10))*100);
      html+=`<div class="upgrade ${unlocked?"":"locked"}">
        <div class="uicon">${u.icon}</div>
        <div class="uname"><b>${u.name} <span style="color:#9aa8b6">Lv.${lv}</span></b>
          <small>${u.rarity} · ${effect}${effect&&cps?" · ":""}${cps}</small>
          <div class="effect">${unlocked?"Freigeschaltet":"🔒 Noch nicht freigeschaltet"}</div>
        </div>
        <div class="ubuy"><div class="price">${fmt(price)} 🪙</div><button class="buy ${unlocked&&can?"ok":""}" data-buy="${u.id}" ${unlocked&&can?"":"disabled"}>${unlocked?"KAUFEN":"🔒"}</button></div>
        ${lv>0?`<div class="progress"><span style="width:${Math.min(100,lv*5)}%"></span></div>`:""}
      </div>`;
    });
  }
  list.innerHTML=html;
  document.getElementById("shopOwned").textContent=`${game.levels.reduce((a,b)=>a+b,0)}/${upgrades.length*10}`;
  list.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{
    const id=Number(b.dataset.buy),n=buyUpgrade(id,buyMode);
    if(n)showToast(`🛒 ${n}× ${upgrades[id].name} gekauft`);
    else showToast("💰 Nicht genug Münzen");
    updateUI();
  });
}
