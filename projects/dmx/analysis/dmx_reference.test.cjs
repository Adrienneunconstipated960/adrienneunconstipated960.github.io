"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const d=require("./dmx_reference.cjs");

test("original scene names are allowlisted",()=>{
  assert.deepEqual(d.VALID_SCENES,["red","green","blue","white","gradient","off","demo"]);
});
test("scene commands are newline-terminated and validated",()=>{
  assert.equal(d.sceneCommand("red"),"red\n");
  assert.throws(()=>d.sceneCommand("red\n"));
});
test("brightness commands accept bounds only",()=>{
  assert.equal(d.brightnessCommand(0),"brightness 0\n");
  assert.equal(d.brightnessCommand(100),"brightness 100\n");
  assert.throws(()=>d.brightnessCommand(101));
  assert.throws(()=>d.brightnessCommand(-1));
});
test("DMX start code is zero and RGBW occupy slots 1 through 4",()=>{
  const f=d.frame([255,70,41,203]);
  assert.equal(f.length,513);
  assert.deepEqual(f.slice(0,6),[0,255,70,41,203,0]);
  assert.equal(f[512],0);
});
test("full-scale 1, 10, 50 and 100 percent integer truncation",()=>{
  assert.equal(d.scale(255,1),2);
  assert.equal(d.scale(255,10),25);
  assert.equal(d.scale(255,50),127);
  assert.equal(d.scale(255,100),255);
});
test("scene colors remain four-channel RGBW arrays",()=>{
  assert.deepEqual(d.BASE_SCENES.red,[255,0,0,0]);
  assert.deepEqual(d.BASE_SCENES.white,[0,0,0,255]);
  assert.deepEqual(d.BASE_SCENES.off,[0,0,0,0]);
});
test("gradient starts red and transitions to yellow after three seconds",()=>{
  assert.deepEqual(d.gradientAt(0),[255,0,0,0]);
  assert.deepEqual(d.gradientAt(1500),[255,127,0,0]);
  assert.deepEqual(d.gradientAt(3000),[255,255,0,0]);
});
test("gradient six steps form an 18-second idealized cycle",()=>{
  assert.deepEqual(d.gradientAt(18000),[255,0,0,0]);
  assert.deepEqual(d.gradientAt(6000),[0,255,0,0]);
});
test("demo begins with red, green, blue and white steps",()=>{
  assert.equal(d.demoAt(0).scene,"red");
  assert.equal(d.demoAt(2500).scene,"green");
  assert.equal(d.demoAt(5000).scene,"blue");
  assert.equal(d.demoAt(7500).scene,"white");
});
test("demo gradient lasts 10 seconds then returns Off",()=>{
  assert.equal(d.demoAt(10000).scene,"gradient");
  assert.equal(d.demoAt(19999).scene,"gradient");
  assert.equal(d.demoAt(20000).scene,"off");
});
test("DMX 8N2 513-slot minimum serialization time",()=>{
  assert.equal(d.DMX_BAUD,250000);
  assert.ok(Math.abs(d.minimumFrameMs()-22.708)<1e-9);
});
test("source loop-delay-based refresh is approximate and below 30 Hz",()=>{
  assert.ok(d.roughLoopRefreshHz()>20&&d.roughLoopRefreshHz()<22);
});
test("invalid reference inputs are rejected",()=>{
  assert.throws(()=>d.frame([1,2,3]));
  assert.throws(()=>d.scale(256,50));
  assert.throws(()=>d.gradientAt(-1));
  assert.throws(()=>d.demoAt(Number.NaN));
});
