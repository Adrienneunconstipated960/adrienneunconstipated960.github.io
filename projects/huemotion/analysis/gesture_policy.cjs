"use strict";
/**
 * HueMotion R1: offline gesture-policy reconstruction.
 * Extracts gesture-to-scene mapping and browser-side timing rules observed in
 * HueMotion/server.casambi.js for deterministic unit testing. Does NOT include
 * MediaPipe, a camera, networking, Casambi credentials, or remote lighting control.
 * Not imported by the original app and not its original source module.
 */
const MAPPING = Object.freeze({
  "Heart":       {key:"r", scene:"Red",      rgbw:[100, 0,   0,   0]},
  "Crying":      {key:"b", scene:"Blue",     rgbw:[0,   0,   100, 0]},
  "Jazz hands":  {key:"y", scene:"Yellow",   rgbw:[100, 100, 0,   0]},
  "Open palm":   {key:"w", scene:"White",    rgbw:[0,   0,   0,   100]},
  "Thumbs Up":   {key:"g", scene:"Green",    rgbw:[0,   100, 0,   0]},
  "Peace Sign":  {key:"p", scene:"Purple",   rgbw:[100, 0,   100, 0]},
  "Shaka":       {key:"x", scene:"Gradient", rgbw:null},
  "Fist":        {key:"o", scene:"Off",      rgbw:[0,   0,   0,   0]}
});
const TRIGGER_COOLDOWN_MS = 2500;
const OFF_HOLD_MS = 750;
const OFF_AFTER_GREEN_BLOCK_MS = 1200;
const OFF_AFTER_CRYING_BLOCK_MS = 900;

function keyForGesture(gesture) {
  return Object.prototype.hasOwnProperty.call(MAPPING, gesture) ? MAPPING[gesture].key : null;
}
function requiredFrames(raw, previousStable) {
  const base = {"Unknown":8, "Heart":2, "Crying":1, "Thumbs Up":2, "Shaka":3, "Fist":3};
  if (raw === "Fist" && previousStable === "Thumbs Up") return 4;
  if (raw === "Fist" && previousStable === "Crying") return 5;
  return base[raw] || 4;
}
function initialState() {
  return {lastRaw:"Unknown", frames:0, stable:"Unknown", stableSinceMs:0, lastSent:null, lastSentMs:-Infinity};
}
function stabilize(previous, raw, nowMs) {
  if (!Number.isFinite(nowMs)) throw new Error("nowMs must be finite");
  const next={...previous};
  next.frames = raw===next.lastRaw ? next.frames+1 : 1;
  next.lastRaw = raw;
  if (next.frames >= requiredFrames(raw, next.stable) && raw!==next.stable) {
    next.stable=raw;
    next.stableSinceMs=nowMs;
  }
  return next;
}
function dispatchDecision(state, enabled, nowMs) {
  if (!Number.isFinite(nowMs)) throw new Error("nowMs must be finite");
  if (!enabled) return {send:false, reason:"preview-only"};
  const gesture=state.stable;
  const key=keyForGesture(gesture);
  if (!key) return {send:false, reason:"unmapped/unknown"};
  if (gesture==="Fist") {
    if (nowMs-state.stableSinceMs < OFF_HOLD_MS) return {send:false, reason:"off-hold"};
    if (state.lastSent==="Thumbs Up" && nowMs-state.lastSentMs < OFF_AFTER_GREEN_BLOCK_MS)
      return {send:false, reason:"off-after-green-block"};
    if (state.lastSent==="Crying" && nowMs-state.lastSentMs < OFF_AFTER_CRYING_BLOCK_MS)
      return {send:false, reason:"off-after-blue-block"};
  }
  if (state.lastSent===gesture && nowMs-state.lastSentMs < TRIGGER_COOLDOWN_MS)
    return {send:false, reason:"repeat-cooldown"};
  return {send:true, reason:"eligible", key, scene:MAPPING[gesture].scene};
}
function markDispatched(state, nowMs) {
  return {...state, lastSent:state.stable, lastSentMs:nowMs};
}
module.exports={MAPPING,TRIGGER_COOLDOWN_MS,OFF_HOLD_MS,OFF_AFTER_GREEN_BLOCK_MS,
  OFF_AFTER_CRYING_BLOCK_MS,keyForGesture,requiredFrames,initialState,stabilize,
  dispatchDecision,markDispatched};
