(() => {
  'use strict';
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // This is an artistic 2D kinematic demonstration, not a model of actual joint limits.
  const svg = document.getElementById('arm-svg');
  if (!svg) return;
  const links = document.getElementById('arm-links');
  const points = document.getElementById('arm-points');
  const coords = document.getElementById('tip-coord');
  const targetMarker = document.getElementById('target-marker');
  const stateLabel = document.getElementById('sim-state');
  const buttons = Array.from(document.querySelectorAll('[data-profile]'));
  const RAD = Math.PI / 180;
  const length1 = 133, length2 = 132, tool = 60;
  const profiles = {
    home: {angles:[20,-28,10], label:'Home position'},
    reach:{angles:[-28,45,-25],label:'Extended reach'},
    sweep:{angles:[-12,60,-36],label:'Sweep motion'},
    inspect:{angles:[43,-70,44],label:'Inspection pose'}
  };
  const start = [0,0,0];
  let current = start.slice();
  let animationFrame = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
  const line = (x1,y1,x2,y2,width,color) => `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" />`;
  const circle = (x,y,r) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="#102a3b" stroke="#b5f9ee" stroke-width="3"/>`;
  function draw(angles){
    let x=260,y=66,orient=0;
    const nodes=[[x,y]];
    [[length1,angles[0]],[length2,angles[1]],[tool,angles[2]]].forEach(([l,a])=>{
      orient += a*RAD;
      x += Math.sin(orient)*l;
      y += Math.cos(orient)*l;
      nodes.push([x,y]);
    });
    const [a,b,c,d]=nodes;
    links.innerHTML=line(260,45,260,66,12,'#91b5c9')+line(...a,...b,13,'#6ce5d6')+line(...b,...c,12,'#5bbfcd')+line(...c,...d,9,'#7cb5ff')+line(...a,...b,2,'#c8fff5')+line(...b,...c,2,'#c8fff5');
    points.innerHTML=nodes.slice(0,3).map(([px,py],i)=>circle(px,py,i?10:13)).join('')+`<circle cx="${d[0].toFixed(2)}" cy="${d[1].toFixed(2)}" r="5" fill="#f0fcff"/>`;
    coords.textContent=`TIP: X ${Math.round(d[0]-260)} / Z ${Math.round(d[1]-45)} (DIAGRAM UNITS)`;
    targetMarker.setAttribute('cx',String(clamp(d[0],71,449)));
    targetMarker.setAttribute('cy',String(clamp(d[1],52,386)));
  }
  function selectProfile(name){
    const profile = profiles[name];
    if (!profile) return;
    buttons.forEach(b=>{let selected=b.dataset.profile===name;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
    stateLabel.textContent=profile.label;
    cancelAnimationFrame(animationFrame);
    if (reducedMotion){current=profile.angles.slice();draw(current);return;}
    const initial=current.slice(),target=profile.angles;
    const started=performance.now(),duration=850;
    const step=(now)=>{
      const t=clamp((now-started)/duration,0,1);
      const eased=t*t*(3-2*t);
      current=initial.map((a,i)=>a+(target[i]-a)*eased);
      draw(current);
      if(t<1)animationFrame=requestAnimationFrame(step);
    };
    animationFrame=requestAnimationFrame(step);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>selectProfile(b.dataset.profile)));
  current=profiles.home.angles.slice();draw(current);
})();
