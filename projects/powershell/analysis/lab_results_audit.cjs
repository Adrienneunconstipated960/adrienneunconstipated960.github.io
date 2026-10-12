"use strict";
/**
 * CS646 PowerShell Systems & Concurrency | Source-reported results analysis.
 *
 * These numbers come from the user's original 2026 lab reports. They are NOT
 * freshly measured runs, synthetic benchmark samples, or recovered raw logs.
 * The independent calculations below are reproducible; the original system's
 * performance cannot be verified without the underlying experiment artifacts.
 */
const historical=Object.freeze({
  lab1:{visibleLogicalCpus:16,reportedMemoryGiB:15,
    cpuMax:"max 100000",source:"CS646_Lab1_Alarcon.pdf, p. 6"},
  lab2:{inputRows:6,benchmarkRows:300000,
    serialSeconds:10.04,parallelSeconds:7.19,
    source:"CS646_Lab2_Alarcon.pdf, pp. 4, 7-8"},
  lab3:{services:3,requests:102,throttleLimit:10,
    serialSeconds:8.69,parallelSeconds:1.68,
    unrestrictedCpuSeconds:2.89,oneCpuSeconds:4.39,
    originalUnsynchronizedCounter:2,expectedCounter:100,
    synchronizedCounter:100,flockWriters:20,
    source:"CS646_Lab3_Alarcon.pdf, pp. 2-6"},
  lab4:{source:"CS646_Lab4_Alarcon.pdf, pp. 2-6",
    collected:["PID","User","Process","RSS_MB","VSZ_MB","Status"],
    outputs:"periodic process rows + per-user totals + append-only CSV",
    recordedMeasurementsNotAvailable:true}
});
function speedup(serialSeconds,parallelSeconds){
  if(!Number.isFinite(serialSeconds)||!Number.isFinite(parallelSeconds)||
     serialSeconds<=0||parallelSeconds<=0)
    throw new RangeError("Durations must be positive finite numbers");
  return serialSeconds/parallelSeconds;
}
function reductionPercent(serialSeconds,parallelSeconds){
  return 100*(1-parallelSeconds/serialSeconds);
}
function safeTwoKeySort(records,primary,secondary){
  if(!Array.isArray(records)||!primary||!secondary)throw new TypeError("Invalid sort configuration");
  // Educational reference: sort whole records, preserving original tie order.
  // No file I/O and no substitution for the original PowerShell sort implementation.
  const indexed=records.map((item,i)=>({item,i}));
  function compare(a,b){
    const av=String(a??""),bv=String(b??"");
    return av.localeCompare(bv,"en",{sensitivity:"base",numeric:true});
  }
  indexed.sort((a,b)=>compare(a.item[primary],b.item[primary]) ||
    compare(a.item[secondary],b.item[secondary]) || a.i-b.i);
  return indexed.map(v=>v.item);
}
function summarize(){
  const l2=historical.lab2,l3=historical.lab3;
  return {
    provenance:"Previously recorded user-authored lab reports; not independently rerun",
    input:l2,
    sorting:{
      benchmarkRows:l2.benchmarkRows,
      speedup:Number(speedup(l2.serialSeconds,l2.parallelSeconds).toFixed(3)),
      durationReductionPercent:Number(reductionPercent(l2.serialSeconds,l2.parallelSeconds).toFixed(2))
    },
    concurrency:{
      requests:l3.requests,services:l3.services,throttleLimit:l3.throttleLimit,
      speedup:Number(speedup(l3.serialSeconds,l3.parallelSeconds).toFixed(3)),
      durationReductionPercent:Number(reductionPercent(l3.serialSeconds,l3.parallelSeconds).toFixed(2)),
      singleCpuSlowdownFactor:Number(speedup(l3.oneCpuSeconds,l3.unrestrictedCpuSeconds).toFixed(3)),
      unsafeCounterObserved:l3.originalUnsynchronizedCounter,
      synchronizedCounterObserved:l3.synchronizedCounter,
      counterTarget:l3.expectedCounter
    },
    caveats:[
      "The original reports' measured runtimes have not been remeasured.",
      "Concurrent request speedup may primarily reflect overlapped network waiting, not CPU parallelism.",
      "The Lab 3 conclusion contains a 10-request typo; its implementation and evidence consistently state 102.",
      "No real per-process memory CSV data are published or inferred from the Lab 4 report."
    ]
  };
}
if(require.main===module)console.log(JSON.stringify(summarize(),null,2));
module.exports={historical,speedup,reductionPercent,safeTwoKeySort,summarize};
