'use strict';

// Small static-site interactions, no frameworks or accounts required.
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();

// Illustrative planar FK. The joints represent the shoulder, elbow and wrist
// in a simplified side-view model. NOT a motion planner or hardware interface.
const rad = deg => deg * Math.PI / 180;
const poses = {
  home:    {angles:[-48, 96, 0],   label:'✳ In home position'},
  hello:   {angles:[-18,111,-43], label:'✳ Robot says hello!'},
  reach:   {angles:[ 43,-80, 10], label:'✳ Reaching down'},
  inspect: {angles:[-56,120,-42], label:'✳ Inspecting the workspace'}
};
const arm = {
  bone1: document.getElementById('bone-1'), bone2:document.getElementById('bone-2'), bone3:document.getElementById('bone-3'),
  joint1:document.getElementById('joint-1'),joint2:document.getElementById('joint-2'),
  gripperLeft:document.getElementById('grip-left'),gripperRight:document.getElementById('grip-right'),
  tipGlow:document.getElementById('tip-glow'),tipDot:document.getElementById('tip-dot'),
  shoulder:document.getElementById('shoulder-readout'),elbow:document.getElementById('elbow-readout'),
  status:document.getElementById('pose-status')
};
let angles = poses.home.angles.slice();
let animationFrame = null;
let sequenceTimers = [];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const poseButtons = [...document.querySelectorAll('.pose-button')];
const sequenceButton = document.getElementById('animate-button');
function setXY(el, fields, x, y){ if(!el)return;el.setAttribute(fields[0],x.toFixed(2));el.setAttribute(fields[1],y.toFixed(2)); }
function putBone(el,p1,p2){setXY(el,['x1','y1'],p1.x,p1.y);setXY(el,['x2','y2'],p2.x,p2.y);}
function renderArm(a){
  const lengths=[144,144,55],origin={x:250,y:102},points=[origin];
  let x=origin.x,y=origin.y,theta=0;
  a.forEach((joint,i)=>{theta+=joint;x+=lengths[i]*Math.sin(rad(theta));y+=lengths[i]*Math.cos(rad(theta));points.push({x,y});});
  putBone(arm.bone1,points[0],points[1]);putBone(arm.bone2,points[1],points[2]);putBone(arm.bone3,points[2],points[3]);
  setXY(arm.joint1,['cx','cy'],points[1].x,points[1].y);setXY(arm.joint2,['cx','cy'],points[2].x,points[2].y);
  setXY(arm.tipGlow,['cx','cy'],points[3].x,points[3].y);setXY(arm.tipDot,['cx','cy'],points[3].x,points[3].y);
  const tipTheta=rad(a.reduce((s,v)=>s+v,0));
  const dx=Math.cos(tipTheta),dy=-Math.sin(tipTheta),tip=points[3];
  putBone(arm.gripperLeft,tip,{x:tip.x-13*dx+11*dy,y:tip.y-13*dy-11*dx});
  putBone(arm.gripperRight,tip,{x:tip.x+13*dx+11*dy,y:tip.y+13*dy-11*dx});
  if(arm.shoulder)arm.shoulder.textContent=`${Math.round(a[0])}°`;
  if(arm.elbow)arm.elbow.textContent=`${Math.round(a[1])}°`;
}
function cancelSequence(){sequenceTimers.forEach(clearTimeout);sequenceTimers=[];if(sequenceButton){sequenceButton.disabled=false;sequenceButton.textContent='✧ Run a mini motion sequence';}}
function choosePose(name, fromSequence=false){
  if(!poses[name])return;
  if(!fromSequence)cancelSequence();
  poseButtons.forEach(b=>{const active=b.dataset.pose===name;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  if(arm.status)arm.status.textContent=poses[name].label;
  if(animationFrame!==null)cancelAnimationFrame(animationFrame);
  const start=angles.slice(),end=poses[name].angles.slice();
  if(reduceMotion.matches){angles=end;renderArm(angles);return;}
  const startTime=performance.now(),duration=740;
  const animate=now=>{
    const t=Math.min(1,(now-startTime)/duration),ease=t*t*(3-2*t);
    angles=start.map((v,i)=>v+(end[i]-v)*ease);renderArm(angles);
    if(t<1)animationFrame=requestAnimationFrame(animate);else animationFrame=null;
  };
  animationFrame=requestAnimationFrame(animate);
}
poseButtons.forEach(button=>button.addEventListener('click',()=>choosePose(button.dataset.pose)));
if(sequenceButton)sequenceButton.addEventListener('click',()=>{
  cancelSequence();sequenceButton.disabled=true;sequenceButton.textContent='✧ A little dance in progress...';
  const names=['hello','inspect','reach','home'];
  names.forEach((name,i)=>sequenceTimers.push(setTimeout(()=>choosePose(name,true),i*1200)));
  sequenceTimers.push(setTimeout(()=>cancelSequence(),names.length*1200));
});
renderArm(angles);
