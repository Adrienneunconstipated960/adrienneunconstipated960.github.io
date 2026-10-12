"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const p=require("./gesture_policy.cjs");

test("eight exact original gesture names map to eight keys",()=>{
  assert.equal(Object.keys(p.MAPPING).length,8);
  assert.deepEqual(Object.fromEntries(Object.entries(p.MAPPING).map(([g,v])=>[g,v.key])),
    {"Heart":"r","Crying":"b","Jazz hands":"y","Open palm":"w",
     "Thumbs Up":"g","Peace Sign":"p","Shaka":"x","Fist":"o"});
});
test("RGBW preview data match source gesture mapping",()=>{
  assert.deepEqual(p.MAPPING["Jazz hands"].rgbw,[100,100,0,0]);
  assert.deepEqual(p.MAPPING["Open palm"].rgbw,[0,0,0,100]);
  assert.equal(p.MAPPING.Shaka.rgbw,null);
});
test("two matching Heart frames stabilize the gesture",()=>{
  let x=p.initialState();x=p.stabilize(x,"Heart",0);
  assert.equal(x.stable,"Unknown");x=p.stabilize(x,"Heart",16);
  assert.equal(x.stable,"Heart");
});
test("generic gesture requires four consecutive frames",()=>{
  let x=p.initialState();for(let i=0;i<3;i++)x=p.stabilize(x,"Open palm",i*16);
  assert.equal(x.stable,"Unknown");x=p.stabilize(x,"Open palm",48);
  assert.equal(x.stable,"Open palm");
});
test("fist transition from Crying uses five frames",()=>{
  let x=p.stabilize(p.initialState(),"Crying",0);
  for(let i=0;i<4;i++)x=p.stabilize(x,"Fist",16*(i+1));
  assert.equal(x.stable,"Crying");
  x=p.stabilize(x,"Fist",80);assert.equal(x.stable,"Fist");
});
test("preview mode does not dispatch lighting scene",()=>{
  let x=p.stabilize(p.stabilize(p.initialState(),"Heart",0),"Heart",16);
  assert.equal(p.dispatchDecision(x,false,2500).send,false);
});
test("Off must be stable for 750 milliseconds",()=>{
  let x=p.initialState();for(let i=0;i<3;i++)x=p.stabilize(x,"Fist",10*i);
  assert.equal(p.dispatchDecision(x,true,769).reason,"off-hold");
  assert.equal(p.dispatchDecision(x,true,770).send,true);
});
test("same-scene trigger is blocked for 2.5 seconds",()=>{
  let x=p.stabilize(p.stabilize(p.initialState(),"Heart",0),"Heart",16);
  x=p.markDispatched(x,100);assert.equal(p.dispatchDecision(x,true,200).reason,"repeat-cooldown");
  assert.equal(p.dispatchDecision(x,true,2600).send,true);
});
test("recent green scene temporarily blocks Off",()=>{
  let x={...p.initialState(),stable:"Fist",stableSinceMs:0,lastSent:"Thumbs Up",lastSentMs:500};
  assert.equal(p.dispatchDecision(x,true,1300).reason,"off-after-green-block");
  assert.equal(p.dispatchDecision(x,true,1700).send,true);
});
test("recent blue scene temporarily blocks Off",()=>{
  let x={...p.initialState(),stable:"Fist",stableSinceMs:0,lastSent:"Crying",lastSentMs:500};
  assert.equal(p.dispatchDecision(x,true,1300).reason,"off-after-blue-block");
  assert.equal(p.dispatchDecision(x,true,1400).send,true);
});
test("unknown gestures cannot issue a scene key",()=>{
  let x=p.initialState();assert.equal(p.keyForGesture("wave"),null);
  assert.equal(p.dispatchDecision(x,true,2000).send,false);
});
