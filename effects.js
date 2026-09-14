function showFloat(text, x, y, crit=false){
  if(!game.floating)return;
  const el=document.createElement("div");
  el.className="float"+(crit?" crit":"");
  el.textContent=text;
  el.style.left=(x||window.innerWidth/2)+"px";
  el.style.top=(y||window.innerHeight/2)+"px";
  document.getElementById("effects").appendChild(el);
  setTimeout(()=>el.remove(),900);
}
function showToast(text){
  const t=document.getElementById("toast");
  t.textContent=text;t.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>t.classList.remove("show"),1800);
}
function pulseCoin(crit=false){
  const c=document.getElementById("coinButton");
  c.animate([
    {transform:"scale(1) rotate(0deg)"},
    {transform:`scale(${crit?1.10:1.04}) rotate(${crit?(-2+Math.random()*4):0}deg)`},
    {transform:"scale(1) rotate(0deg)"}
  ],{duration:180,easing:"ease-out"});
}
function showModal(title,text){
  document.getElementById("modalTitle").textContent=title;
  document.getElementById("modalText").textContent=text;
  document.getElementById("modal").classList.add("show");
}
