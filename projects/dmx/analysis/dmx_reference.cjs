"use strict";
/**
 * Offline DMX RGBW model reconstructed from public Arduino firmware.
 * NOT the original firmware, a DMX transmitter, or hardware test.
 * This intentionally has no network, serial, USB, or fixture dependencies.
 */
const VALID_SCENES=Object.freeze(["red","green","blue","white","gradient","off","demo"]);
const BASE_SCENES=Object.freeze({
  red:[255,0,0,0],green:[0,255,0,0],blue:[0,0,255,0],
  white:[0,0,0,255],off:[0,0,0,0]
});
const GRADIENT_COLORS=Object.freeze([
  [255,0,0,0],[255,255,0,0],[0,255,0,0],
  [0,255,255,0],[0,0,255,0],[255,0,255,0]
]);
const FRAME_SLOTS=513;  // slot 0 = start code; 1..512 = DMX channels
const CHANNELS=Object.freeze({red:1,green:2,blue:3,white:4});
const FADE_MS=3000;
const DEMO_STEP_MS=2500;
const DEMO_GRADIENT_MS=10000;
const DMX_BAUD=250000;
const BITS_PER_SLOT=11; // 8 data + start + 2 stops
const BREAK_US=120;
const MAB_US=16;
const LOOP_DELAY_MS=25;

function brightnessCommand(percent) {
  if (!Number.isInteger(percent)||percent<0||percent>100)
    throw new RangeError("Brightness must be integer percentage 0..100");
  return "brightness "+percent+"\n";
}
function sceneCommand(scene) {
  if (!VALID_SCENES.includes(scene))throw new RangeError("Unsupported scene");
  return scene+"\n";
}
function scale(value,percent=100) {
  if (!Number.isInteger(value)||value<0||value>255)
    throw new RangeError("DMX channel must be integer 0..255");
  if (!Number.isInteger(percent)||percent<0||percent>100)
    throw new RangeError("Brightness must be integer 0..100");
  return Math.floor(value*percent/100);
}
function frame(rgbw,percent=100){
  if (!Array.isArray(rgbw)||rgbw.length!==4)
    throw new TypeError("Expected [R,G,B,W]");
  const slots=Array(FRAME_SLOTS).fill(0);
  rgbw.forEach((value,i)=>{slots[i+1]=scale(value,percent)});
  return slots;
}
function blend(a,b,progress){
  if(!Number.isFinite(progress))throw new TypeError("Invalid interpolation fraction");
  const t=Math.max(0,Math.min(1,progress));
  // Original C++ assigns interpolated float to int (truncates positive values).
  return a.map((v,i)=>Math.trunc(v+(b[i]-v)*t));
}
function gradientAt(elapsedMs){
  if(!Number.isFinite(elapsedMs)||elapsedMs<0)throw new RangeError("Nonnegative elapsed time required");
  const segment=Math.floor(elapsedMs/FADE_MS)%GRADIENT_COLORS.length;
  const next=(segment+1)%GRADIENT_COLORS.length;
  return blend(GRADIENT_COLORS[segment],GRADIENT_COLORS[next],
    (elapsedMs%FADE_MS)/FADE_MS);
}
function demoAt(elapsedMs){
  if(!Number.isFinite(elapsedMs)||elapsedMs<0)throw new RangeError("Nonnegative elapsed time required");
  if(elapsedMs<DEMO_STEP_MS) return {scene:"red",rgbw:BASE_SCENES.red};
  if(elapsedMs<2*DEMO_STEP_MS) return {scene:"green",rgbw:BASE_SCENES.green};
  if(elapsedMs<3*DEMO_STEP_MS) return {scene:"blue",rgbw:BASE_SCENES.blue};
  if(elapsedMs<4*DEMO_STEP_MS) return {scene:"white",rgbw:BASE_SCENES.white};
  if(elapsedMs<4*DEMO_STEP_MS+DEMO_GRADIENT_MS)
    return {scene:"gradient",rgbw:gradientAt(elapsedMs-4*DEMO_STEP_MS)};
  return {scene:"off",rgbw:BASE_SCENES.off};
}
function minimumFrameMs(){
  return ((FRAME_SLOTS*BITS_PER_SLOT)/DMX_BAUD)*1000 + (BREAK_US+MAB_US)/1000;
}
function roughLoopRefreshHz(){
  return 1000/(minimumFrameMs()+LOOP_DELAY_MS);
}
module.exports={VALID_SCENES,BASE_SCENES,CHANNELS,GRADIENT_COLORS,
  FRAME_SLOTS,FADE_MS,DEMO_STEP_MS,DEMO_GRADIENT_MS,DMX_BAUD,
  BREAK_US,MAB_US,LOOP_DELAY_MS,brightnessCommand,sceneCommand,
  scale,frame,blend,gradientAt,demoAt,minimumFrameMs,roughLoopRefreshHz};
