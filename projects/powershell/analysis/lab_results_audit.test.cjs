"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const a=require("./lab_results_audit.cjs");
test("sorting speedup from historical 300k-row times",()=>{
 assert.ok(Math.abs(a.speedup(10.04,7.19)-1.396383866)<.0001);
});
test("concurrency speedup from 102-request times",()=>{
 assert.ok(Math.abs(a.speedup(8.69,1.68)-5.172619)<.0001);
});
test("duration reduction follows the reported two runs",()=>{
 assert.ok(Math.abs(a.reductionPercent(8.69,1.68)-80.6674)<.01);
});
test("one CPU took longer in separately reported taskset run",()=>{
 assert.ok(Math.abs(a.speedup(4.39,2.89)-1.519)<.002);
});
test("unsafe and synchronized counters remain source-reported",()=>{
 assert.equal(a.historical.lab3.originalUnsynchronizedCounter,2);
 assert.equal(a.historical.lab3.synchronizedCounter,100);
 assert.equal(a.historical.lab3.expectedCounter,100);
});
test("three services and throttle limit ten",()=>{
 assert.equal(a.historical.lab3.services,3);
 assert.equal(a.historical.lab3.requests,102);
 assert.equal(a.historical.lab3.throttleLimit,10);
});
test("reject nonpositive and invalid duration inputs",()=>{
 assert.throws(()=>a.speedup(0,1));
 assert.throws(()=>a.speedup(1,-1));
 assert.throws(()=>a.speedup(Infinity,1));
});
test("reference multi-key sort retains complete CSV-like records",()=>{
 const first={Department:"Engineering",Name:"Alex",Id:"01",City:"Reno"};
 const second={Department:"Accounting",Name:"Zoe",Id:"02",City:"Carson"};
 const third={Department:"Engineering",Name:"Alex",Id:"03",City:"Sparks"};
 const sorted=a.safeTwoKeySort([first,second,third],"Department","Name");
 assert.deepEqual(sorted,[second,first,third]);
 assert.equal(sorted[1],first); // identity and all fields unchanged
});
test("reference sort does not mutate source records",()=>{
 const input=[{Department:"Beta",Name:"One"},{Department:"Alpha",Name:"Two"}];
 const before=JSON.stringify(input);
 a.safeTwoKeySort(input,"Department","Name");
 assert.equal(JSON.stringify(input),before);
});
test("historical records explicitly prohibit invented memory logs",()=>{
 assert.equal(a.historical.lab4.recordedMeasurementsNotAvailable,true);
 assert.equal(a.summarize().provenance.includes("not independently rerun"),true);
});
