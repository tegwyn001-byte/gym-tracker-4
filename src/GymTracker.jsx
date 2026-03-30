import { useState, useEffect, useCallback } from "react";

// ============================================================
// DATA
// ============================================================
const GOALS = ["Movement is a privilege.","Show up for your future self.","You don't have to do this, you GET to do this.","Push yourself. Make it count.","Progress over perfection.","Discipline is self-love.","You're building something powerful.","Be proud of showing up.","This is your hour. Own it."];
const REST_QUOTES = ["Instagram will still be there after your set!","Enough doom scrolling now.","Make yourself earn the online shopping.","Your glutes won't grow from scrolling.","TikTok can wait. Your muscles can't.","Put the phone down and pick the weight up.","No one ever regretted a good set.","You didn't come here to watch reels.","That group chat will survive without you.","Less screen time, more lean time.","Your Pinterest board isn't going anywhere.","The sale will still be on after this set."];
const WARMUP_STEPS = [
  { id:"w1",name:"2 min light cardio",desc:"Bike, cross-trainer, or brisk walk" },
  { id:"w2",name:"Arm circles",desc:"10 forward, 10 backward" },
  { id:"w3",name:"Leg swings",desc:"10 each leg, forward and sideways" },
  { id:"w4",name:"Bodyweight squats",desc:"10 reps, nice and controlled" },
  { id:"w5",name:"Band pull-aparts",desc:"15 reps if you have a band" },
  { id:"w6",name:"Cat-cow stretches",desc:"8 reps. Mobilise your spine" },
];
const OTHER_MOVEMENTS = [
  { id:"conquer",label:"Conquer (Box Fit)",emoji:"🥊" },
  { id:"yoga",label:"Yoga",emoji:"🧘‍♀️" },
  { id:"reformer",label:"Reformer Pilates",emoji:"✨" },
  { id:"walk",label:"Walk",emoji:"🚶‍♀️" },
  { id:"10min",label:"10 Minute Goal",emoji:"⏱️" },
];
const JOURNAL_PROMPTS = ["What are you grateful for today?","What made you smile this week?","What's one thing you're proud of?","How did moving your body make you feel?","What's something kind you did for yourself?","What are you looking forward to?"];

const EXERCISES = {
  upper: [
    { id:"chest-press",name:"Chest Press Machine",targets:"Chest, shoulders, triceps",sets:3,reps:"8-12",tips:["Adjust seat so handles align with mid-chest","Retract shoulder blades before pressing","Slow and controlled, don't lock elbows","Breathe out as you push","Squeeze your chest, not just push"],priority:"high" },
    { id:"lat-pulldown",name:"Lat Pulldown",targets:"Back (lats), biceps",sets:3,reps:"8-12",tips:["Pull to upper chest, never behind neck","Depress shoulder blades first","Hands as hooks, drive elbows down","Slight lean back only","Control the return"],priority:"high" },
    { id:"seated-row",name:"Seated Row Machine",targets:"Mid-back, rhomboids",sets:3,reps:"10-12",tips:["Keep chest up and proud","Squeeze shoulder blades together","Don't round your back","Pull to torso, not chin","Slow return for time under tension"],priority:"high" },
    { id:"shoulder-press",name:"Shoulder Press Machine",targets:"Shoulders, triceps",sets:3,reps:"8-10",tips:["Handles start at shoulder height","Brace core, prevent back arching","Don't lock out at top","Control lowering 2-3 seconds","Head neutral"],priority:"medium" },
    { id:"pec-deck",name:"Pec Deck (Chest Fly)",targets:"Chest (inner)",sets:3,reps:"10-12",tips:["Slight bend in elbows","Slow on the return","Squeeze chest at the front","Don't let weight slam","Adjust for stretch, not pain"],priority:"medium" },
    { id:"bench-press",name:"Bench Press",targets:"Chest, shoulders, triceps",sets:3,reps:"8-12",tips:["Plant feet, slight upper back arch","Grip wider than shoulders","Lower to mid-chest with control","Drive through feet pressing up","Wrists straight over elbows"],priority:"medium" },
    { id:"incline-bench",name:"Incline Bench Press",targets:"Upper chest, shoulders",sets:3,reps:"8-12",tips:["30-45 degree incline","Lower to upper chest","Shoulder blades pinched","Start lighter than flat","Follow natural angle path"],priority:"medium" },
    { id:"tricep-pushdown",name:"Tricep Pushdown",targets:"Triceps",sets:3,reps:"10-12",tips:["Elbows pinned to sides","Full extension","Control return","Lean slightly forward","Squeeze hard at bottom"],priority:"low" },
    { id:"bicep-curl",name:"Bicep Curl Machine",targets:"Biceps",sets:3,reps:"10-12",tips:["Full stretch bottom, squeeze top","No swinging","Elbows on pad comfortably","Slow eccentric","Don't lift elbows off pad"],priority:"low" },
    { id:"face-pulls",name:"Face Pulls",targets:"Rear delts, upper back",sets:3,reps:"12-15",tips:["Cable at face height","Pull towards face, separate rope","Squeeze shoulder blades","Elbows high","Light weight, feel it"],priority:"low" },
    { id:"lateral-raises",name:"Lateral Raises",targets:"Side delts",sets:3,reps:"12-15",tips:["Slight elbow bend, shoulder height","Lead with elbows","Control lowering","Don't shrug up","Light weight, perfect form"],priority:"low" },
  ],
  lower: [
    { id:"goblet-squat",name:"Goblet Squats",targets:"Quads, glutes",sets:3,reps:"8-12",tips:["Dumbbell at chest","Sit between hips","Chest up, elbows inside knees","Push through whole foot","Deep as mobility allows"],priority:"high" },
    { id:"romanian-deadlift",name:"Romanian Deadlifts (DB)",targets:"Glutes, hamstrings",sets:3,reps:"8-12",tips:["Push hips back like shutting a door","Dumbbells close to legs","Slight knee bend, shins vertical","Feel hamstring stretch","Squeeze glutes at top"],priority:"high" },
    { id:"hip-thrust",name:"Hip Thrusts",targets:"Glutes",sets:3,reps:"8-12",tips:["Upper back on bench","Drive through heels","Pause 1-2 sec at top","Don't hyperextend","Chin tucked"],priority:"high" },
    { id:"leg-press",name:"Leg Press",targets:"Quads, glutes",sets:4,reps:"8-12",tips:["Feet higher = more glutes","Feet lower = more quads","Don't round lower back","Heels for glute emphasis","Control descent"],priority:"high" },
    { id:"leg-curl",name:"Seated/Lying Leg Curl",targets:"Hamstrings",sets:3,reps:"10-12",tips:["Slow on the way down","Squeeze at contraction","Don't lift hips","Pad above ankles","Pause at bottom"],priority:"medium" },
    { id:"leg-extension",name:"Leg Extension",targets:"Quads",sets:3,reps:"10-12",tips:["Control, don't swing","Squeeze quads at top","Slow eccentric","Knees align with pivot","No violent lockout"],priority:"medium" },
    { id:"hip-thrust-machine",name:"Hip Thrust Machine",targets:"Glutes",sets:3,reps:"8-12",tips:["Pause at top, full squeeze","Drive through heels","Core braced","Control both phases","Chin tucked"],priority:"medium" },
    { id:"calf-raises",name:"Calf Raises",targets:"Calves",sets:3,reps:"12-15",tips:["Full stretch at bottom","Squeeze at top","Slow both directions","Knees straight not locked","Try different foot angles"],priority:"low" },
    { id:"abductor",name:"Abductor Machine",targets:"Outer glutes",sets:3,reps:"12-15",tips:["Lean forward for glutes","Control, don't slam","Hold open position","Slow return","Back against pad"],priority:"low" },
    { id:"adductor",name:"Adductor Machine",targets:"Inner thighs",sets:3,reps:"12-15",tips:["Slow and controlled","Squeeze together at close","No momentum","Sit upright","Comfortable starting width"],priority:"low" },
  ],
  core: [
    { id:"hanging-knee-raises",name:"Hanging Knee Raises",targets:"Lower abs",sets:3,reps:"8-12",tips:["Control the swing","Slow descent","Bend knees if needed","Engage core first","Exhale knees up"],priority:"high" },
    { id:"russian-twists",name:"Russian Twists",targets:"Obliques",sets:3,reps:"16-20 total",tips:["Rotate torso, not just arms","Lean back slightly","Touch floor each side","Feet off ground for challenge","Controlled"],priority:"medium" },
    { id:"ab-crunch-machine",name:"Ab Crunch Machine",targets:"Upper abs",sets:3,reps:"10-12",tips:["Slow, full contraction","Abs pull, not arms","Exhale as you crunch","Pause at bottom","Moderate weight"],priority:"medium" },
    { id:"dead-bugs",name:"Dead Bugs",targets:"Deep core",sets:3,reps:"8-10 each side",tips:["Lower back pressed to floor","Opposite arm and leg","Slow and controlled","Breathe out extending","Reduce range if back arches"],priority:"high" },
    { id:"medicine-ball",name:"Medicine Ball Slams",targets:"Full core, power",sets:3,reps:"10-12",tips:["Full overhead extension","Slam with whole body","Engage core throwing down","Squat to catch","Great finisher"],priority:"medium" },
  ],
  fullbody: [
    { id:"goblet-squat",name:"Goblet Squats",targets:"Quads, glutes",sets:3,reps:"8-12",tips:["Dumbbell at chest","Sit between hips","Chest up","Push through whole foot","Go deep"],priority:"high" },
    { id:"chest-press",name:"Chest Press Machine",targets:"Chest, shoulders, triceps",sets:3,reps:"8-12",tips:["Handles at mid-chest","Retract shoulder blades","Slow and controlled","Breathe out pushing","Squeeze chest"],priority:"high" },
    { id:"romanian-deadlift",name:"Romanian Deadlifts (DB)",targets:"Glutes, hamstrings",sets:3,reps:"8-12",tips:["Push hips back","Dumbbells close to legs","Slight knee bend","Feel hamstring stretch","Squeeze glutes at top"],priority:"high" },
    { id:"lat-pulldown",name:"Lat Pulldown",targets:"Back (lats), biceps",sets:3,reps:"8-12",tips:["Pull to upper chest","Depress shoulder blades","Drive elbows down","Slight lean back","Control return"],priority:"high" },
    { id:"hip-thrust",name:"Hip Thrusts",targets:"Glutes",sets:3,reps:"8-12",tips:["Back on bench","Drive through heels","Pause at top","Don't hyperextend","Chin tucked"],priority:"medium" },
    { id:"shoulder-press",name:"Shoulder Press Machine",targets:"Shoulders, triceps",sets:3,reps:"8-10",tips:["Handles at shoulder height","Brace core","Don't lock out","Control lowering","Head neutral"],priority:"medium" },
    { id:"leg-curl",name:"Seated/Lying Leg Curl",targets:"Hamstrings",sets:3,reps:"10-12",tips:["Slow descent","Squeeze at contraction","Pad above ankles","Don't rush","Pause at bottom"],priority:"medium" },
    { id:"hanging-knee-raises",name:"Hanging Knee Raises",targets:"Lower abs",sets:3,reps:"8-12",tips:["Control swing","Slow descent","Bend knees if needed","Engage core","Exhale up"],priority:"medium" },
    { id:"face-pulls",name:"Face Pulls",targets:"Rear delts",sets:3,reps:"12-15",tips:["Cable at face height","Separate rope","Squeeze shoulder blades","Elbows high","Light weight"],priority:"low" },
    { id:"dead-bugs",name:"Dead Bugs",targets:"Deep core",sets:3,reps:"8-10 each side",tips:["Back on floor","Opposite arm/leg","Slow","Breathe out","Reduce range if needed"],priority:"low" },
  ],
};

function getWorkout(split,mode) {
  const ex = EXERCISES[split];
  if (mode==="short") { const h=ex.filter(e=>e.priority==="high"),m=ex.filter(e=>e.priority==="medium"),s=[...h]; if(s.length<4)s.push(...m.slice(0,4-s.length)); return s.slice(0,4); }
  else { const h=ex.filter(e=>e.priority==="high"),m=ex.filter(e=>e.priority==="medium"),l=ex.filter(e=>e.priority==="low"),s=[...h,...m]; if(s.length<6)s.push(...l.slice(0,6-s.length)); return s.slice(0,split==="fullbody"?8:6); }
}
function rng(arr){return arr[Math.floor(Math.random()*arr.length)];}
function localDate(d){const dt=d||new Date();return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;}

// ============================================================
// STORAGE
// ============================================================
const useStorage = () => {
  const [data,setData] = useState({log:[],pbs:{},movements:[],runs:[],hikes:[],hikeWishlist:[],journal:[],runGoal:""});
  const [loaded,setLoaded] = useState(false);
  useEffect(()=>{(async()=>{try{const r=await window.storage.get("gym-v3");if(r?.value)setData(p=>({...p,...JSON.parse(r.value)}));}catch{try{const r=localStorage.getItem("gym-v3");if(r)setData(p=>({...p,...JSON.parse(r)}));}catch{}}setLoaded(true);})();},[]);
  const update = useCallback((key,value)=>{setData(p=>{const n={...p,[key]:value};(async()=>{try{await window.storage.set("gym-v3",JSON.stringify(n));}catch{try{localStorage.setItem("gym-v3",JSON.stringify(n));}catch{}}})();return n;});},[]);
  return {data,update,loaded};
};

// ============================================================
// ICONS (inline SVG)
// ============================================================
const Chk=()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const SmChk=()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const Back=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const FlameI=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>;
const ZapI=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const InfoI=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const TrophyI=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15c3.31 0 6-2.69 6-6V3H6v6c0 3.31 2.69 6 6 6zm-8-9h2V3H2v3a4 4 0 004 4h.07A7.96 7.96 0 014 6zm16-3h-2v3a7.96 7.96 0 01-2.07 4H18a4 4 0 004-4V3zM9 19v2H7v2h10v-2h-2v-2a8.96 8.96 0 01-6 0z"/></svg>;
const PlusI=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrendI=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const TrashI=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;
// Tab icons
const TabWorkout=({active})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#C4727F":"#A49A95"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7v10M18 7v10M4 8v8M20 8v8M2 10v4M22 10v4M6 12h12"/></svg>;
const TabHike=({active})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#C4727F":"#A49A95"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20L9 8l4 6 4-10 4 16"/></svg>;
const TabRun=({active})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#C4727F":"#A49A95"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M7 21l3-7 2.5 3L16 11l2 10"/></svg>;
const TabJournal=({active})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?"#C4727F":"#A49A95"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
// Heart icon for app header
const HeartIcon=()=><svg width="28" height="28" viewBox="0 0 24 24" fill="#C4727F" stroke="#C4727F" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;

const F=`'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif`;
const c={bg:"#FBF7F4",card:"#FFFFFF",accent:"#C4727F",accentLight:"#F2DDE0",accentSoft:"#E8BDC3",warm:"#D4956A",warmLight:"#F5E6D8",warmDark:"#B87A4A",sage:"#8BA892",sageLight:"#DBE8DF",sunset1:"#F4C8A0",sunset2:"#E8A8B0",sunset3:"#D4956A",text:"#2D2926",textMuted:"#7A706B",textLight:"#A49A95",border:"#EDE7E3",success:"#8BA892"};
const Grain=()=>(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,opacity:.35,mixBlendMode:"multiply"}}><svg width="100%" height="100%"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gr)" opacity=".1"/></svg></div>);

// ============================================================
// REST TIMER
// ============================================================
function RestTimer({onClose}){
  const[s,setS]=useState(75),[run,setRun]=useState(true),[q,setQ]=useState(()=>rng(REST_QUOTES));
  useEffect(()=>{if(!run||s<=0)return;const t=setInterval(()=>setS(v=>v-1),1000);return()=>clearInterval(t);},[run,s]);
  useEffect(()=>{if(s<=0){setQ(rng(REST_QUOTES));setRun(false);}},[s]);
  const pct=Math.max(0,s/75),r=54,ci=2*Math.PI*r;
  return(<div style={{position:"fixed",inset:0,background:"rgba(45,41,38,.88)",backdropFilter:"blur(10px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F}}>
    <div style={{textAlign:"center",padding:32}}>
      <div style={{position:"relative",width:140,height:140,margin:"0 auto 24px"}}><svg width="140" height="140" style={{transform:"rotate(-90deg)"}}><circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="8"/><circle cx="70" cy="70" r={r} fill="none" stroke={s>0?c.sunset1:c.accent} strokeWidth="8" strokeDasharray={ci} strokeDashoffset={ci*(1-pct)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/></svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:36,fontWeight:700,color:"#fff"}}>{s>0?`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`:"GO!"}</span></div></div>
      <p style={{color:s>0?"rgba(255,255,255,.55)":c.sunset1,fontSize:15,fontWeight:600,maxWidth:260,margin:"0 auto 28px",lineHeight:1.5}}>{s>0?"Rest up. Next set incoming.":q}</p>
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        {s>0&&<button onClick={()=>{setS(0);setRun(false);}} style={{padding:"12px 28px",borderRadius:12,background:"rgba(255,255,255,.15)",color:"#fff",border:"none",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>Skip</button>}
        <button onClick={onClose} style={{padding:"12px 28px",borderRadius:12,background:s>0?"rgba(255,255,255,.08)":c.accent,color:"#fff",border:"none",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>{s>0?"Close":"Let's go! 💪"}</button>
      </div>
    </div>
  </div>);
}

// ============================================================
// MAIN APP
// ============================================================
export default function GymTracker(){
  const{data,update,loaded}=useStorage();
  const{log,pbs,movements,runs,hikes,hikeWishlist,journal,runGoal}=data;
  const[tab,setTab]=useState("workout");
  const[screen,setScreen]=useState("home");
  const[split,setSplit]=useState(null);
  const[mode,setMode]=useState(null);
  const[workout,setWorkout]=useState([]);
  const[tracking,setTracking]=useState({});
  const[completed,setCompleted]=useState({});
  const[expandedTip,setExpandedTip]=useState(null);
  const[sessionGoal,setSessionGoal]=useState(()=>rng(GOALS));
  const[showSummary,setShowSummary]=useState(false);
  const[newPBs,setNewPBs]=useState([]);
  const[showTimer,setShowTimer]=useState(false);
  const[warmupDone,setWarmupDone]=useState({});
  const[showWarmup,setShowWarmup]=useState(false);
  const[runKm,setRunKm]=useState("");
  const[runMin,setRunMin]=useState("");
  const[hikeForm,setHikeForm]=useState({name:"",km:"",highlight:"",improvement:""});
  const[wishForm,setWishForm]=useState("");
  const[journalText,setJournalText]=useState("");
  const[journalGratitude,setJournalGratitude]=useState("");
  const[deleteConfirm,setDeleteConfirm]=useState(null);
  const[showWeekView,setShowWeekView]=useState(false);
  const[calOffset,setCalOffset]=useState(0); // 0 = current month, -1 = last month, etc

  const getLastSession=(eid)=>{for(const s of log){const e=s.exercises?.find(x=>x.id===eid);if(e?.sets){const f=e.sets.filter(x=>x.weight||x.reps);if(f.length>0)return f;}}return null;};
  const getOverloadNudge=(eid,cur)=>{const last=getLastSession(eid);if(!last)return null;const lm=Math.max(...last.map(s=>parseFloat(s.weight)||0)),cm=Math.max(...cur.map(s=>parseFloat(s.weight)||0)),ar=last.reduce((a,s)=>a+(parseInt(s.reps)||0),0)/last.length;if(cm>0&&cm===lm&&ar>=10)return"You hit 10+ reps last time. Try adding 1-2.5kg!";const cnt=log.filter(s=>s.exercises?.some(e=>e.id===eid&&e.sets?.some(st=>parseFloat(st.weight)===lm))).length;if(cnt>=3&&cm<=lm)return`Same weight for ${cnt} sessions. Time to level up!`;return null;};

  const startWorkout=(s,m)=>{setSplit(s);setMode(m);const w=getWorkout(s,m);setWorkout(w);const t={},co={};w.forEach(e=>{t[e.id]=Array.from({length:e.sets},()=>({weight:"",reps:""}));co[e.id]=false;});setTracking(t);setCompleted(co);setExpandedTip(null);setSessionGoal(rng(GOALS));setNewPBs([]);setShowSummary(false);setWarmupDone({});setShowWarmup(true);setScreen("active");};
  const updateSet=(eid,si,field,val)=>{setTracking(p=>{const u={...p};u[eid]=[...p[eid]];u[eid][si]={...u[eid][si],[field]:val};return u;});};
  const toggleComplete=id=>setCompleted(p=>({...p,[id]:!p[id]}));
  const finishWorkout=()=>{const d=localDate(),sp=[],up={...pbs};workout.forEach(e=>{const sets=tracking[e.id];if(sets)sets.forEach(s=>{const w=parseFloat(s.weight);if(w>0){const cur=up[e.id]||0;if(w>cur){up[e.id]=w;sp.push({name:e.name,weight:w,previous:cur});}}});});update("log",[{date:d,split,mode,exercises:workout.map(e=>({id:e.id,name:e.name,sets:tracking[e.id],completed:completed[e.id]})),...log.length>0?{id:Date.now()}:{id:Date.now()}},...log]);update("pbs",up);setNewPBs(sp);setShowSummary(true);};
  const deleteSession=(idx)=>{const n=[...log];n.splice(idx,1);update("log",n);setDeleteConfirm(null);};
  const logRun=()=>{if(!runKm)return;const d=localDate(),pace=runKm&&runMin?(parseFloat(runMin)/parseFloat(runKm)).toFixed(2):null;update("runs",[{date:d,km:runKm,minutes:runMin,pace},...runs]);update("movements",[{id:"jog",label:`Run ${runKm}km`,emoji:"🏃‍♀️",date:d},...movements]);setRunKm("");setRunMin("");};
  const logHike=()=>{if(!hikeForm.name)return;const d=localDate();update("hikes",[{...hikeForm,date:d},...hikes]);update("movements",[{id:"hike",label:hikeForm.name,emoji:"⛰️",date:d},...movements]);setHikeForm({name:"",km:"",highlight:"",improvement:""});};
  const addWish=()=>{if(!wishForm.trim())return;update("hikeWishlist",[...hikeWishlist,{name:wishForm.trim(),done:false,id:Date.now()}]);setWishForm("");};
  const toggleWish=id=>update("hikeWishlist",hikeWishlist.map(w=>w.id===id?{...w,done:!w.done}:w));
  const saveJournal=()=>{if(!journalText&&!journalGratitude)return;const d=localDate();update("journal",[{date:d,text:journalText,gratitude:journalGratitude,prompt:rng(JOURNAL_PROMPTS)},...journal]);setJournalText("");setJournalGratitude("");};

  const completedCount=Object.values(completed).filter(Boolean).length;
  const totalCount=workout.length;
  const page={background:`linear-gradient(180deg,${c.bg} 0%,#F6EDE4 35%,#F2DDD0 55%,#EDD5C8 75%,${c.bg} 100%)`,minHeight:"100vh",fontFamily:F,position:"relative",paddingBottom:80};
  const wrap={maxWidth:480,margin:"0 auto",padding:"20px 20px 40px",position:"relative",zIndex:1};
  const inp={width:"100%",padding:"11px 13px",borderRadius:10,border:`1px solid ${c.border}`,background:c.bg,fontFamily:F,fontSize:14,color:c.text,outline:"none",boxSizing:"border-box"};
  const btn={width:"100%",padding:"14px",background:c.accent,color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,fontFamily:F,cursor:"pointer"};

  if(!loaded)return<div style={{...page,display:"flex",alignItems:"center",justifyContent:"center"}}><Grain/><p style={{color:c.textMuted,fontSize:15,zIndex:1}}>Loading...</p></div>;

  // TAB BAR
  const TabBar=()=>(<div style={{position:"fixed",bottom:0,left:0,right:0,background:`${c.card}f5`,backdropFilter:"blur(12px)",borderTop:`1px solid ${c.border}`,zIndex:50,paddingTop:8,paddingBottom:"max(20px, env(safe-area-inset-bottom, 20px))"}}>
    <div style={{maxWidth:480,margin:"0 auto",display:"flex",justifyContent:"space-around"}}>
      {[{key:"workout",label:"Workout",Icon:TabWorkout},{key:"hike",label:"Hikes",Icon:TabHike},{key:"run",label:"Running",Icon:TabRun},{key:"journal",label:"Journal",Icon:TabJournal}].map(t=>(
        <button key={t.key} onClick={()=>{setTab(t.key);setScreen("home");}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 12px",fontFamily:F}}>
          <t.Icon active={tab===t.key}/><span style={{fontSize:10,fontWeight:tab===t.key?700:500,color:tab===t.key?c.accent:c.textLight}}>{t.label}</span>
        </button>
      ))}
    </div>
  </div>);

  // APP HEADER
  const Header=()=>(<div style={{marginBottom:20}}>
    <p style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:c.accent,fontWeight:600,margin:"0 0 4px"}}>Your Wellness</p>
    <h1 style={{fontSize:22,fontWeight:700,color:c.text,margin:0,letterSpacing:"-.5px"}}>Make it count.</h1>
  </div>);

  // ==================== SUMMARY ====================
  if(showSummary){const sl={upper:"Upper Body",lower:"Lower Body",core:"Core",fullbody:"Full Body"};
    return(<div style={page}><Grain/><div style={wrap}>
      <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:40,marginBottom:6}}>✨</div><h1 style={{fontSize:22,fontWeight:700,color:c.text,margin:0}}>Session Complete</h1><p style={{color:c.textMuted,fontSize:13,marginTop:4}}>You showed up. That's what matters.</p></div>
      <div style={{background:c.card,borderRadius:14,padding:16,marginBottom:12,border:`1px solid ${c.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><p style={{fontSize:10,color:c.textLight,textTransform:"uppercase",letterSpacing:1,margin:0}}>Split</p><p style={{fontSize:14,fontWeight:600,color:c.text,margin:"2px 0 0"}}>{sl[split]}</p></div><div style={{textAlign:"right"}}><p style={{fontSize:10,color:c.textLight,textTransform:"uppercase",letterSpacing:1,margin:0}}>Mode</p><p style={{fontSize:14,fontWeight:600,color:c.text,margin:"2px 0 0"}}>{mode==="short"?"Short & Sweet":"Full Send"}</p></div></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><div><p style={{fontSize:10,color:c.textLight,textTransform:"uppercase",letterSpacing:1,margin:0}}>Done</p><p style={{fontSize:14,fontWeight:600,color:c.success,margin:"2px 0 0"}}>{completedCount}/{totalCount}</p></div><div style={{textAlign:"right"}}><p style={{fontSize:10,color:c.textLight,textTransform:"uppercase",letterSpacing:1,margin:0}}>Date</p><p style={{fontSize:14,fontWeight:600,color:c.text,margin:"2px 0 0"}}>{new Date().toLocaleDateString("en-NZ",{day:"numeric",month:"short"})}</p></div></div>
      </div>
      {newPBs.length>0&&<div style={{background:`linear-gradient(135deg,${c.warmLight},${c.accentLight})`,borderRadius:14,padding:"14px 16px",marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{color:c.warm}}><TrophyI/></span><p style={{fontSize:13,fontWeight:700,color:c.warm,margin:0}}>New Personal Bests!</p></div>
        {newPBs.map((pb,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:i>0?`1px solid rgba(212,149,106,.2)`:"none"}}><p style={{fontSize:12,color:c.text,margin:0,fontWeight:500}}>{pb.name}</p><div style={{display:"flex",alignItems:"center",gap:4}}>{pb.previous>0&&<span style={{fontSize:11,color:c.textLight,textDecoration:"line-through"}}>{pb.previous}kg</span>}<span style={{fontSize:13,fontWeight:700,color:c.warm}}>{pb.weight}kg</span></div></div>)}</div>}
      <button onClick={()=>{setShowSummary(false);setScreen("home");}} style={btn}>Back to Home</button>
    </div><TabBar/></div>);
  }

  // ==================== ACTIVE WORKOUT ====================
  if(screen==="active"){const sl={upper:"Upper Body",lower:"Lower Body",core:"Core",fullbody:"Full Body"};
    return(<div style={page}><Grain/>
      {showTimer&&<RestTimer onClose={()=>setShowTimer(false)}/>}
      {showWarmup&&<div style={{position:"fixed",inset:0,background:"rgba(45,41,38,.92)",backdropFilter:"blur(10px)",zIndex:90,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F}}>
        <div style={{maxWidth:340,width:"100%",padding:"24px 20px",maxHeight:"90vh",overflow:"auto"}}>
          <h2 style={{fontSize:18,fontWeight:700,color:"#fff",margin:"0 0 3px",textAlign:"center"}}>Quick Warm-Up</h2>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:11,textAlign:"center",margin:"0 0 18px"}}>2-3 minutes. Protect your body.</p>
          {WARMUP_STEPS.map(step=><div key={step.id} onClick={()=>setWarmupDone(p=>({...p,[step.id]:!p[step.id]}))} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.06)",cursor:"pointer"}}>
            <div style={{width:24,height:24,borderRadius:6,border:`2px solid ${warmupDone[step.id]?c.sage:"rgba(255,255,255,.2)"}`,background:warmupDone[step.id]?c.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{warmupDone[step.id]&&<SmChk/>}</div>
            <div style={{opacity:warmupDone[step.id]?.4:1}}><p style={{fontSize:13,fontWeight:600,color:"#fff",margin:0}}>{step.name}</p><p style={{fontSize:10,color:"rgba(255,255,255,.4)",margin:"1px 0 0"}}>{step.desc}</p></div>
          </div>)}
          <button onClick={()=>setShowWarmup(false)} style={{...btn,marginTop:16}}>{Object.keys(warmupDone).length>=3?"Let's go! 🔥":"Skip warm-up"}</button>
        </div>
      </div>}

      <div style={{background:`${c.card}ee`,borderBottom:`1px solid ${c.border}`,padding:"10px 16px",position:"sticky",top:0,zIndex:10,backdropFilter:"blur(10px)"}}>
        <div style={{maxWidth:480,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",color:c.textMuted,display:"flex",alignItems:"center",gap:3,fontFamily:F,fontSize:12}}><Back/> Back</button>
          <button onClick={()=>setShowTimer(true)} style={{padding:"6px 12px",borderRadius:9,background:c.accentLight,color:c.accent,border:"none",fontFamily:F,fontSize:11,fontWeight:600,cursor:"pointer"}}>⏱ Rest</button>
          <div style={{textAlign:"right"}}><p style={{fontSize:12,fontWeight:600,color:c.text,margin:0}}>{sl[split]}</p><p style={{fontSize:10,color:c.textMuted,margin:0}}>{mode==="short"?"Short & Sweet":"Full Send"}</p></div>
        </div>
      </div>

      <div style={{...wrap,padding:"16px 20px 100px"}}>
        <div style={{background:`linear-gradient(135deg,${c.sunset2}28,${c.sunset1}28)`,borderRadius:11,padding:"10px 14px",marginBottom:16,textAlign:"center"}}>
          <p style={{fontSize:8,textTransform:"uppercase",letterSpacing:1.5,color:c.accent,fontWeight:600,margin:"0 0 2px"}}>Today's reminder</p>
          <p style={{fontSize:13,fontWeight:600,color:c.text,margin:0,fontStyle:"italic"}}>"{sessionGoal}"</p>
        </div>
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><p style={{fontSize:10,color:c.textMuted,margin:0}}>{completedCount}/{totalCount} done</p><p style={{fontSize:10,fontWeight:600,color:c.accent,margin:0}}>{Math.round((completedCount/totalCount)*100)}%</p></div>
          <div style={{height:4,background:c.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(completedCount/totalCount)*100}%`,background:`linear-gradient(90deg,${c.sunset2},${c.sunset3})`,borderRadius:2,transition:"width .4s"}}/></div>
        </div>
        {workout.map((ex,idx)=>{const isDone=completed[ex.id],showTips=expandedTip===ex.id,pb=pbs[ex.id],last=getLastSession(ex.id),nudge=getOverloadNudge(ex.id,tracking[ex.id]||[]);
          return(<div key={ex.id+idx} style={{background:c.card,borderRadius:13,marginBottom:10,border:`1px solid ${isDone?c.success:c.border}`,overflow:"hidden",opacity:isDone?.6:1,transition:"all .3s"}}>
            <div style={{padding:"11px 14px 8px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:1}}><span style={{fontSize:10,fontWeight:700,color:c.textLight}}>{idx+1}</span><h3 style={{fontSize:13,fontWeight:700,color:c.text,margin:0}}>{ex.name}</h3></div>
                  <p style={{fontSize:10,color:c.textMuted,margin:"1px 0 0"}}>{ex.targets} · {ex.sets}×{ex.reps}</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
                    {pb>0&&<span style={{display:"inline-flex",alignItems:"center",gap:2,background:c.warmLight,padding:"1px 6px",borderRadius:8,fontSize:9,fontWeight:600,color:c.warm}}><TrophyI/> PB:{pb}kg</span>}
                    {last&&<span style={{display:"inline-flex",background:c.sageLight,padding:"1px 6px",borderRadius:8,fontSize:9,fontWeight:500,color:c.sage}}>Last: {last.map(s=>`${s.weight||"?"}×${s.reps||"?"}`).join(", ")}</span>}
                  </div>
                </div>
                <button onClick={()=>toggleComplete(ex.id)} style={{width:30,height:30,borderRadius:8,border:`2px solid ${isDone?c.success:c.border}`,background:isDone?c.success:"transparent",color:isDone?"#fff":c.border,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>{isDone&&<Chk/>}</button>
              </div>
              {nudge&&<div style={{marginTop:6,background:`${c.sunset1}20`,borderRadius:7,padding:"6px 9px",display:"flex",alignItems:"center",gap:4}}><span style={{color:c.warm}}><TrendI/></span><p style={{fontSize:10,color:c.warmDark,margin:0,fontWeight:500}}>{nudge}</p></div>}
              <button onClick={()=>setExpandedTip(showTips?null:ex.id)} style={{display:"flex",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",fontFamily:F,fontSize:9,color:c.accent,fontWeight:600,padding:"4px 0 0"}}><InfoI/> {showTips?"Hide":"Form tips"}</button>
              {showTips&&<div style={{marginTop:6,background:`${c.accentLight}50`,borderRadius:8,padding:"8px 10px"}}>{ex.tips.map((tip,i)=><div key={i} style={{display:"flex",gap:4,marginBottom:i<ex.tips.length-1?3:0}}><span style={{color:c.accent,fontSize:6,marginTop:4,flexShrink:0}}>●</span><p style={{fontSize:10,color:c.text,margin:0,lineHeight:1.4}}>{tip}</p></div>)}</div>}
            </div>
            <div style={{padding:"0 14px 10px"}}>
              <div style={{display:"grid",gridTemplateColumns:"30px 1fr 1fr",gap:"2px 6px",alignItems:"center",marginBottom:1}}><p style={{fontSize:8,color:c.textLight,textTransform:"uppercase",fontWeight:600,margin:0,textAlign:"center"}}>Set</p><p style={{fontSize:8,color:c.textLight,textTransform:"uppercase",fontWeight:600,margin:0}}>Kg</p><p style={{fontSize:8,color:c.textLight,textTransform:"uppercase",fontWeight:600,margin:0}}>Reps</p></div>
              {tracking[ex.id]?.map((s,si)=><div key={si} style={{display:"grid",gridTemplateColumns:"30px 1fr 1fr",gap:"2px 6px",alignItems:"center",marginBottom:3}}>
                <div style={{width:22,height:22,borderRadius:5,background:s.weight&&s.reps?c.sageLight:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:s.weight&&s.reps?c.sage:c.textLight,margin:"0 auto"}}>{si+1}</div>
                <input type="number" inputMode="decimal" placeholder={last?.[si]?.weight||"0"} value={s.weight} onChange={e=>updateSet(ex.id,si,"weight",e.target.value)} style={{...inp,padding:"7px 9px",fontSize:13}}/>
                <input type="number" inputMode="numeric" placeholder={last?.[si]?.reps||"0"} value={s.reps} onChange={e=>updateSet(ex.id,si,"reps",e.target.value)} style={{...inp,padding:"7px 9px",fontSize:13}}/>
              </div>)}
            </div>
          </div>);})}
        <button onClick={finishWorkout} style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${c.accent},${c.warm})`,color:"#fff",border:"none",borderRadius:13,fontSize:15,fontWeight:700,fontFamily:F,cursor:"pointer",marginTop:4,boxShadow:`0 4px 16px ${c.accent}28`}}>Finish Session ✨</button>
      </div>
    </div>);
  }

  // ==================== TAB: WORKOUT ====================
  if(tab==="workout"){
    const splitOptions=[{key:"upper",label:"Upper Body",emoji:"💪",desc:"Chest, back, shoulders, arms"},{key:"lower",label:"Lower Body",emoji:"🦵",desc:"Quads, glutes, hamstrings, calves"},{key:"core",label:"Core",emoji:"🔥",desc:"Abs, obliques, deep core"},{key:"fullbody",label:"Full Body",emoji:"⚡",desc:"One session, hit everything"}];
    const sl={upper:"Upper Body",lower:"Lower Body",core:"Core",fullbody:"Full Body"};
    const now=new Date(),mon=new Date(now);mon.setDate(now.getDate()-((now.getDay()+6)%7));mon.setHours(0,0,0,0);
    const weekDays=["M","T","W","T","F","S","S"];
    const activeDays=new Set();[...log,...movements].forEach(item=>{const d=new Date(item.date);if(d>=mon)activeDays.add(d.getDay()===0?6:d.getDay()-1);});

    return(<div style={page}><Grain/>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet"/>
      <div style={wrap}>
        <Header/>
        <div style={{background:`linear-gradient(135deg,${c.sunset2}20,${c.sunset1}20)`,borderRadius:14,padding:"14px 18px",marginBottom:20,border:`1px solid ${c.sunset1}28`}}>
          <p style={{fontSize:8,textTransform:"uppercase",letterSpacing:1.5,color:c.accent,fontWeight:600,margin:"0 0 4px"}}>Remember why you're here</p>
          <p style={{fontSize:14,fontWeight:500,color:c.text,margin:0,lineHeight:1.4,fontStyle:"italic"}}>"The day you plant the seed is not the day you eat the fruit." 🍓</p>
        </div>

        {/* Weekly streak - tappable */}
        <div onClick={()=>setShowWeekView(true)} style={{background:c.card,borderRadius:12,padding:"12px 16px",marginBottom:20,border:`1px solid ${c.border}`,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><p style={{fontSize:10,fontWeight:600,color:c.textMuted,textTransform:"uppercase",letterSpacing:1,margin:0}}>This week</p><div style={{display:"flex",alignItems:"center",gap:6}}><p style={{fontSize:11,fontWeight:700,color:c.accent,margin:0}}>{activeDays.size}/7</p><span style={{fontSize:10,color:c.textLight}}>View ›</span></div></div>
          <div style={{display:"flex",justifyContent:"space-between"}}>{weekDays.map((day,i)=>{const isA=activeDays.has(i),isT=((now.getDay()+6)%7)===i;
            return<div key={i} style={{textAlign:"center"}}><p style={{fontSize:8,color:isT?c.accent:c.textLight,fontWeight:isT?700:500,margin:"0 0 4px"}}>{day}</p><div style={{width:24,height:24,borderRadius:"50%",background:isA?`linear-gradient(135deg,${c.sunset2},${c.sunset3})`:isT?`${c.sunset1}28`:c.bg,border:isT&&!isA?`2px solid ${c.sunset1}`:"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{isA&&<SmChk/>}</div></div>;})}</div>
        </div>


        {/* Movement tracker overlay */}
        {showWeekView&&(()=>{
          const today=new Date();const todayStr=localDate(today);
          const allDates=new Set();
          log.forEach(w=>allDates.add(w.date));
          movements.forEach(m=>allDates.add(m.date));
          let streak=0;const checkDate=new Date(today);
          if(!allDates.has(todayStr)){checkDate.setDate(checkDate.getDate()-1);}
          while(true){const ds=localDate(checkDate);if(allDates.has(ds)){streak++;checkDate.setDate(checkDate.getDate()-1);}else break;}
          const viewDate=new Date(today.getFullYear(),today.getMonth()+calOffset,1);
          const year=viewDate.getFullYear(),month=viewDate.getMonth();
          const firstDay=new Date(year,month,1);const lastDay=new Date(year,month+1,0);
          const startPad=(firstDay.getDay()+6)%7;
          const totalDays=lastDay.getDate();
          const prevMonthLast=new Date(year,month,0);
          const calDays=[];
          for(let i=startPad-1;i>=0;i--){calDays.push({day:prevMonthLast.getDate()-i,current:false,date:null});}
          for(let i=1;i<=totalDays;i++){const ds=`${year}-${String(month+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;calDays.push({day:i,current:true,date:ds,active:allDates.has(ds),isToday:ds===todayStr,isPast:new Date(year,month,i)<=today});}
          const remaining=7-(calDays.length%7);if(remaining<7)for(let i=1;i<=remaining;i++)calDays.push({day:i,current:false,date:null});
          const monthActive=[...allDates].filter(d=>d.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).length;
          const monthName=viewDate.toLocaleDateString("en-NZ",{month:"long",year:"numeric"});
          const isCurrentMonth=calOffset===0;
          const toggleDateMovement=(ds)=>{
            if(!ds)return;
            const hasIt=allDates.has(ds);
            if(hasIt){update("movements",movements.filter(m=>m.date!==ds));}
            else{update("movements",[{id:"logged",label:"Movement",emoji:"✨",date:ds},...movements]);}
          };

          return<div style={{position:"fixed",inset:0,background:"rgba(45,41,38,.97)",backdropFilter:"blur(12px)",zIndex:80,overflow:"auto",fontFamily:F}}>
            <div style={{maxWidth:480,margin:"0 auto",padding:"20px 20px 80px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <h2 style={{fontSize:20,fontWeight:700,color:"#fff",margin:0}}>Movement Tracker</h2>
                <button onClick={()=>{setShowWeekView(false);setCalOffset(0);}} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",fontFamily:F,fontSize:12,fontWeight:600,cursor:"pointer"}}>Close</button>
              </div>
              <div style={{background:streak>0?`linear-gradient(135deg,${c.accent}30,${c.warm}20)`:"rgba(255,255,255,.04)",borderRadius:16,padding:"20px 22px",marginBottom:20,border:`1px solid ${streak>0?c.accent+"40":"rgba(255,255,255,.08)"}`,textAlign:"center"}}>
                <p style={{fontSize:48,fontWeight:800,color:streak>0?c.accent:"rgba(255,255,255,.3)",margin:"0 0 4px",lineHeight:1}}>{streak}</p>
                <p style={{fontSize:14,fontWeight:600,color:streak>0?"#fff":"rgba(255,255,255,.5)",margin:"0 0 8px"}}>day streak</p>
                <p style={{fontSize:12,color:streak>0?c.accentSoft:"rgba(255,255,255,.3)",margin:0}}>
                  {streak>=14?"Incredible dedication. You're proving something to yourself 💪":streak>=7?"You're on fire! Keep this momentum going 🔥":streak>=3?"Great consistency, keep showing up! ✨":streak>0?"You're building something. Stay with it 🌱":"Start a new streak today. One day at a time."}
                </p>
              </div>
              <div style={{display:"flex",gap:10,marginBottom:20}}>
                <div style={{flex:1,background:"rgba(255,255,255,.04)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,.06)",textAlign:"center"}}>
                  <p style={{fontSize:24,fontWeight:700,color:c.accent,margin:"0 0 2px"}}>{monthActive}</p>
                  <p style={{fontSize:10,color:"rgba(255,255,255,.4)",margin:0}}>This month</p>
                </div>
                <div style={{flex:1,background:"rgba(255,255,255,.04)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,.06)",textAlign:"center"}}>
                  <p style={{fontSize:24,fontWeight:700,color:c.sage,margin:"0 0 2px"}}>{allDates.size}</p>
                  <p style={{fontSize:10,color:"rgba(255,255,255,.4)",margin:0}}>All time</p>
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,.04)",borderRadius:16,padding:"16px",border:"1px solid rgba(255,255,255,.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <button onClick={()=>setCalOffset(calOffset-1)} style={{background:"rgba(255,255,255,.08)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:"pointer"}}>‹</button>
                  <p style={{fontSize:14,fontWeight:700,color:"#fff",margin:0}}>{monthName}</p>
                  <button onClick={()=>setCalOffset(Math.min(calOffset+1,0))} disabled={isCurrentMonth} style={{background:isCurrentMonth?"rgba(255,255,255,.03)":"rgba(255,255,255,.08)",border:"none",borderRadius:8,padding:"6px 12px",color:isCurrentMonth?"rgba(255,255,255,.15)":"#fff",fontFamily:F,fontSize:14,fontWeight:600,cursor:isCurrentMonth?"default":"pointer"}}>›</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8}}>
                  {["M","T","W","T","F","S","S"].map((d,i)=><p key={i} style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,.3)",margin:0,textAlign:"center"}}>{d}</p>)}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
                  {calDays.map((d,i)=>{
                    const canTap=d.current&&d.isPast;
                    const hasWorkoutOnly=d.date&&log.some(w=>w.date===d.date)&&!movements.some(m=>m.date===d.date);
                    return<div key={i} onClick={()=>{if(canTap&&!hasWorkoutOnly)toggleDateMovement(d.date);}} style={{aspectRatio:"1",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:d.isToday?700:500,cursor:canTap?"pointer":"default",color:!d.current?"rgba(255,255,255,.12)":d.active?"#fff":d.isToday?c.accent:"rgba(255,255,255,.4)",background:d.active?`linear-gradient(135deg,${c.accent},${c.warm})`:d.isToday?`${c.accent}20`:"transparent",border:d.isToday&&!d.active?`1.5px solid ${c.accent}60`:"1.5px solid transparent",transition:"all .2s"}}>
                      {d.day}
                    </div>;})}
                </div>
                <p style={{fontSize:10,color:"rgba(255,255,255,.25)",margin:"12px 0 0",textAlign:"center"}}>Tap a past date to log or unlog movement</p>
              </div>
            </div>
          </div>;
        })()}


        {/* Splits */}
        <p style={{fontSize:10,fontWeight:600,color:c.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Choose your split</p>
        {splitOptions.map(s=><div key={s.key} style={{background:c.card,borderRadius:12,border:`1px solid ${c.border}`,padding:"12px 14px",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:18}}>{s.emoji}</span><div><h3 style={{fontSize:14,fontWeight:700,color:c.text,margin:0}}>{s.label}</h3><p style={{fontSize:10,color:c.textMuted,margin:0}}>{s.desc}</p></div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <button onClick={()=>startWorkout(s.key,"short")} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3,padding:"9px 10px",borderRadius:9,border:`1.5px solid ${c.accentSoft}`,background:`${c.accentLight}40`,color:c.accent,fontFamily:F,fontSize:10,fontWeight:600,cursor:"pointer"}}><FlameI/> Short & Sweet</button>
            <button onClick={()=>startWorkout(s.key,"full")} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3,padding:"9px 10px",borderRadius:9,border:"none",background:c.accent,color:"#fff",fontFamily:F,fontSize:10,fontWeight:600,cursor:"pointer"}}><ZapI/> Full Send</button>
          </div>
        </div>)}

        {/* Other movement */}
        <p style={{fontSize:10,fontWeight:600,color:c.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"16px 0 8px"}}>Log other movement</p>
        <div style={{background:c.card,borderRadius:12,border:`1px solid ${c.border}`,padding:"12px 14px",marginBottom:20}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {OTHER_MOVEMENTS.map(m=>{const today=localDate(),done=movements.some(e=>e.id===m.id&&e.date===today);
              return<button key={m.id} onClick={()=>{const td=localDate();if(done)update("movements",movements.filter(e=>!(e.id===m.id&&e.date===td)));else update("movements",[{id:m.id,label:m.label,emoji:m.emoji,date:td},...movements]);}} style={{display:"flex",alignItems:"center",gap:3,padding:"5px 10px",borderRadius:14,border:done?`1.5px solid ${c.sage}`:`1.5px solid ${c.border}`,background:done?c.sageLight:"transparent",color:done?c.sage:c.textMuted,fontFamily:F,fontSize:10,fontWeight:600,cursor:"pointer"}}>{m.emoji} {m.label}{done&&" ✓"}</button>;})}
            {[{id:"hike",label:"Hike",emoji:"⛰️"},{id:"jog",label:"Run/Jog",emoji:"🏃‍♀️"}].map(m=>{const today=localDate(),done=movements.some(e=>e.id===m.id&&e.date===today);
              return<button key={m.id} onClick={()=>{const td=localDate();if(done)update("movements",movements.filter(e=>!(e.id===m.id&&e.date===td)));else update("movements",[{id:m.id,label:m.label,emoji:m.emoji,date:td},...movements]);}} style={{display:"flex",alignItems:"center",gap:3,padding:"5px 10px",borderRadius:14,border:done?`1.5px solid ${c.sage}`:`1.5px solid ${c.border}`,background:done?c.sageLight:"transparent",color:done?c.sage:c.textMuted,fontFamily:F,fontSize:10,fontWeight:600,cursor:"pointer"}}>{m.emoji} {m.label}{done&&" ✓"}</button>;})}
          </div>
        </div>

        {/* PBs */}
        {Object.keys(pbs).length>0&&<><p style={{fontSize:10,fontWeight:600,color:c.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Personal Bests</p>
          <div style={{background:c.card,borderRadius:12,border:`1px solid ${c.border}`,padding:"2px 0",marginBottom:20}}>{Object.entries(pbs).map(([id,weight],i)=>{const allEx=[...EXERCISES.upper,...EXERCISES.lower,...EXERCISES.core,...EXERCISES.fullbody];const ex=allEx.find(e=>e.id===id);if(!ex)return null;
            return<div key={id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 14px",borderBottom:i<Object.keys(pbs).length-1?`1px solid ${c.border}`:"none"}}><p style={{fontSize:11,color:c.text,margin:0,fontWeight:500}}>{ex.name}</p><div style={{display:"flex",alignItems:"center",gap:3,color:c.warm}}><TrophyI/><span style={{fontSize:12,fontWeight:700}}>{weight}kg</span></div></div>;})}</div></>}

        {/* Recent sessions with delete */}
        {log.length>0&&<><p style={{fontSize:10,fontWeight:600,color:c.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Recent Sessions</p>
          <div style={{background:c.card,borderRadius:12,border:`1px solid ${c.border}`,padding:"2px 0",marginBottom:20}}>{log.slice(0,6).map((s,i)=>{const ct=s.exercises?.filter(e=>e.completed).length||0;
            return<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:i<Math.min(log.length,6)-1?`1px solid ${c.border}`:"none"}}>
              <div><p style={{fontSize:12,fontWeight:600,color:c.text,margin:0}}>{sl[s.split]||s.split}</p><p style={{fontSize:10,color:c.textMuted,margin:"1px 0 0"}}>{new Date(s.date).toLocaleDateString("en-NZ",{day:"numeric",month:"short"})} · {s.mode==="short"?"Short & Sweet":"Full Send"} · {ct}/{s.exercises?.length||0}</p></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:c.success}}><Chk/></span>
                {deleteConfirm===i?<div style={{display:"flex",gap:4}}><button onClick={()=>deleteSession(i)} style={{padding:"4px 8px",borderRadius:6,background:"#e85d5d",color:"#fff",border:"none",fontFamily:F,fontSize:10,fontWeight:600,cursor:"pointer"}}>Yes</button><button onClick={()=>setDeleteConfirm(null)} style={{padding:"4px 8px",borderRadius:6,background:c.border,color:c.text,border:"none",fontFamily:F,fontSize:10,fontWeight:600,cursor:"pointer"}}>No</button></div>
                :<button onClick={()=>setDeleteConfirm(i)} style={{background:"none",border:"none",cursor:"pointer",color:c.textLight,padding:2}}><TrashI/></button>}
              </div>
            </div>;})}</div></>}
      </div><TabBar/></div>);
  }

  // ==================== TAB: HIKE ====================
  if(tab==="hike"){
    return(<div style={page}><Grain/><div style={wrap}>
      <Header/>
      <h2 style={{fontSize:20,fontWeight:700,color:c.text,margin:"0 0 16px"}}>⛰️ Hike Tracker</h2>
      <div style={{background:c.card,borderRadius:12,padding:16,border:`1px solid ${c.border}`,marginBottom:14}}>
        <p style={{fontSize:11,fontWeight:700,color:c.text,margin:"0 0 10px"}}>Log a Hike</p>
        <input placeholder="Hike name (e.g. Te Mata Peak)" value={hikeForm.name} onChange={e=>setHikeForm({...hikeForm,name:e.target.value})} style={{...inp,marginBottom:7}}/>
        <input type="number" inputMode="decimal" placeholder="Distance (km)" value={hikeForm.km} onChange={e=>setHikeForm({...hikeForm,km:e.target.value})} style={{...inp,marginBottom:7}}/>
        <textarea placeholder="Highlight or positive reflection..." value={hikeForm.highlight} onChange={e=>setHikeForm({...hikeForm,highlight:e.target.value})} rows={2} style={{...inp,marginBottom:7,resize:"vertical"}}/>
        <textarea placeholder="What would you improve next time?" value={hikeForm.improvement} onChange={e=>setHikeForm({...hikeForm,improvement:e.target.value})} rows={2} style={{...inp,marginBottom:10,resize:"vertical"}}/>
        <button onClick={logHike} style={btn}>Log Hike ⛰️</button>
      </div>
      <div style={{background:c.card,borderRadius:12,padding:16,border:`1px solid ${c.border}`,marginBottom:14}}>
        <p style={{fontSize:11,fontWeight:700,color:c.text,margin:"0 0 8px"}}>Hike Wishlist 🌿</p>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          <input placeholder="Add a hike..." value={wishForm} onChange={e=>setWishForm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addWish()} style={{...inp,flex:1}}/>
          <button onClick={addWish} style={{width:36,height:36,borderRadius:8,background:c.sageLight,color:c.sage,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><PlusI/></button>
        </div>
        {hikeWishlist.map(w=><div key={w.id} onClick={()=>toggleWish(w.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderTop:`1px solid ${c.border}`,cursor:"pointer"}}>
          <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${w.done?c.sage:c.border}`,background:w.done?c.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{w.done&&<SmChk/>}</div>
          <p style={{fontSize:12,color:c.text,margin:0,fontWeight:500,textDecoration:w.done?"line-through":"none",opacity:w.done?.5:1}}>{w.name}</p>
        </div>)}
        {hikeWishlist.length===0&&<p style={{fontSize:11,color:c.textLight,margin:0}}>Your adventure list starts here.</p>}
      </div>
      {hikes.length>0&&<><p style={{fontSize:10,fontWeight:600,color:c.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Past Hikes</p>
        {hikes.map((h,i)=><div key={i} style={{background:c.card,borderRadius:11,border:`1px solid ${c.border}`,padding:"12px 14px",marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><p style={{fontSize:13,fontWeight:700,color:c.text,margin:0}}>⛰️ {h.name}</p><div style={{textAlign:"right"}}><p style={{fontSize:10,color:c.textMuted,margin:0}}>{new Date(h.date).toLocaleDateString("en-NZ",{day:"numeric",month:"short"})}</p>{h.km&&<p style={{fontSize:10,fontWeight:600,color:c.sage,margin:0}}>{h.km}km</p>}</div></div>
          {h.highlight&&<p style={{fontSize:11,color:c.text,margin:"4px 0 0",lineHeight:1.3}}>✨ {h.highlight}</p>}
          {h.improvement&&<p style={{fontSize:11,color:c.textMuted,margin:"2px 0 0",lineHeight:1.3}}>💡 {h.improvement}</p>}
        </div>)}</>}
    </div><TabBar/></div>);
  }

  // ==================== TAB: RUNNING ====================
  if(tab==="run"){
    return(<div style={page}><Grain/><div style={wrap}>
      <Header/>
      <h2 style={{fontSize:20,fontWeight:700,color:c.text,margin:"0 0 4px"}}>🏃‍♀️ Running</h2>
      <p style={{fontSize:12,color:c.textMuted,margin:"0 0 16px"}}>Track distance, pace, and set goals.</p>

      {/* Running goal */}
      <div style={{background:`linear-gradient(135deg,${c.sunset2}20,${c.sunset1}20)`,borderRadius:12,padding:"14px 16px",marginBottom:14,border:`1px solid ${c.sunset1}28`}}>
        <p style={{fontSize:9,textTransform:"uppercase",letterSpacing:1,color:c.accent,fontWeight:600,margin:"0 0 6px"}}>Running Goal</p>
        <input placeholder="e.g. Run 5km in under 30 mins" value={runGoal||""} onChange={e=>update("runGoal",e.target.value)} style={{...inp,background:"transparent",border:"none",padding:0,fontSize:14,fontWeight:500,fontStyle:"italic"}}/>
      </div>

      <div style={{background:c.card,borderRadius:12,padding:16,border:`1px solid ${c.border}`,marginBottom:14}}>
        <p style={{fontSize:11,fontWeight:700,color:c.text,margin:"0 0 10px"}}>Log a Run</p>
        <label style={{fontSize:10,fontWeight:600,color:c.textLight,textTransform:"uppercase",letterSpacing:.5}}>Distance (km)</label>
        <input type="number" inputMode="decimal" value={runKm} onChange={e=>setRunKm(e.target.value)} placeholder="5.0" style={{...inp,marginTop:4,marginBottom:12}}/>
        <label style={{fontSize:10,fontWeight:600,color:c.textLight,textTransform:"uppercase",letterSpacing:.5}}>Time (minutes)</label>
        <input type="number" inputMode="numeric" value={runMin} onChange={e=>setRunMin(e.target.value)} placeholder="30" style={{...inp,marginTop:4,marginBottom:12}}/>
        {runKm&&runMin&&(()=>{const pace=parseFloat(runMin)/parseFloat(runKm);const paceStr=pace.toFixed(2);
          let label="",color=c.textMuted,tip="",emoji="";
          if(pace>8){label="Easy walk/jog";color=c.textMuted;emoji="🚶‍♀️";tip="Under 8:00 min/km is a comfortable jog pace.";}
          else if(pace>7){label="Light jog";color=c.warm;emoji="🐢";tip="Getting under 7:00 min/km would move you into a solid jog.";}
          else if(pace>6){label="Solid jog";color=c.warm;emoji="🏃‍♀️";tip="Nice work! Under 6:00 min/km is considered a good running pace.";}
          else if(pace>5.5){label="Good running pace";color=c.sage;emoji="⚡";tip="Strong! Under 5:30 would put you in competitive runner territory.";}
          else if(pace>5){label="Strong runner";color=c.sage;emoji="🔥";tip="Impressive pace. Sub-5:00 is getting into serious runner territory.";}
          else if(pace>4.5){label="Fast runner";color=c.accent;emoji="🏅";tip="Seriously quick! You're running faster than most recreational runners.";}
          else{label="Elite pace";color=c.accent;emoji="🚀";tip="You're flying. This is competitive race pace.";}
          return<div style={{marginBottom:12}}>
            <p style={{fontSize:14,fontWeight:700,color:c.sage,margin:"0 0 6px"}}>Pace: {paceStr} min/km</p>
            <div style={{background:`${color}15`,borderRadius:10,padding:"10px 14px",border:`1px solid ${color}25`}}>
              <p style={{fontSize:13,fontWeight:700,color,margin:"0 0 3px"}}>{emoji} {label}</p>
              <p style={{fontSize:11,color:c.textMuted,margin:0,lineHeight:1.4}}>{tip}</p>
            </div>
          </div>;})()}
        <button onClick={logRun} style={btn}>Log Run 🏃‍♀️</button>
      </div>
      {runs.length>0&&<><p style={{fontSize:10,fontWeight:600,color:c.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Run History</p>
        <div style={{background:c.card,borderRadius:11,border:`1px solid ${c.border}`,padding:"2px 0"}}>{runs.slice(0,10).map((r,i)=>
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 14px",borderBottom:i<Math.min(runs.length,10)-1?`1px solid ${c.border}`:"none"}}><div><p style={{fontSize:12,fontWeight:600,color:c.text,margin:0}}>{r.km}km</p><p style={{fontSize:10,color:c.textMuted,margin:"1px 0 0"}}>{new Date(r.date).toLocaleDateString("en-NZ",{day:"numeric",month:"short"})}</p></div><div style={{textAlign:"right"}}>{r.pace&&<p style={{fontSize:12,fontWeight:600,color:c.sage,margin:0}}>{r.pace} min/km</p>}{r.pace&&<p style={{fontSize:9,color:c.textLight,margin:"1px 0 0"}}>{parseFloat(r.pace)>8?"Walk/jog":parseFloat(r.pace)>7?"Light jog":parseFloat(r.pace)>6?"Solid jog":parseFloat(r.pace)>5.5?"Good pace":parseFloat(r.pace)>5?"Strong":"Fast!"}</p>}{r.minutes&&<p style={{fontSize:9,color:c.textMuted,margin:"1px 0 0"}}>{r.minutes} min</p>}</div></div>
        )}</div></>}
    </div><TabBar/></div>);
  }

  // ==================== TAB: JOURNAL ====================
  if(tab==="journal"){
    return(<div style={page}><Grain/><div style={wrap}>
      <Header/>
      <h2 style={{fontSize:20,fontWeight:700,color:c.text,margin:"0 0 4px"}}>📝 Journal</h2>
      <p style={{fontSize:12,color:c.textMuted,margin:"0 0 16px"}}>Reflect, be grateful, grow.</p>

      <div style={{background:c.card,borderRadius:12,padding:16,border:`1px solid ${c.border}`,marginBottom:14}}>
        <p style={{fontSize:11,fontWeight:700,color:c.text,margin:"0 0 4px"}}>New Entry</p>
        <p style={{fontSize:11,color:c.accent,fontStyle:"italic",margin:"0 0 10px"}}>{rng(JOURNAL_PROMPTS)}</p>
        <label style={{fontSize:10,fontWeight:600,color:c.textLight,textTransform:"uppercase",letterSpacing:.5}}>Gratitudes 🙏</label>
        <textarea placeholder="Three things you're grateful for..." value={journalGratitude} onChange={e=>setJournalGratitude(e.target.value)} rows={3} style={{...inp,marginTop:4,marginBottom:10,resize:"vertical"}}/>
        <label style={{fontSize:10,fontWeight:600,color:c.textLight,textTransform:"uppercase",letterSpacing:.5}}>Reflections</label>
        <textarea placeholder="How are you feeling? What's on your mind?" value={journalText} onChange={e=>setJournalText(e.target.value)} rows={4} style={{...inp,marginTop:4,marginBottom:10,resize:"vertical"}}/>
        <button onClick={saveJournal} style={btn}>Save Entry 📝</button>
      </div>

      {journal.length>0&&<><p style={{fontSize:10,fontWeight:600,color:c.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Past Entries</p>
        {journal.map((j,i)=><div key={i} style={{background:c.card,borderRadius:11,border:`1px solid ${c.border}`,padding:"12px 14px",marginBottom:7}}>
          <p style={{fontSize:10,color:c.textMuted,margin:"0 0 6px"}}>{new Date(j.date).toLocaleDateString("en-NZ",{weekday:"long",day:"numeric",month:"short"})}</p>
          {j.gratitude&&<div style={{marginBottom:6}}><p style={{fontSize:10,fontWeight:600,color:c.warm,margin:"0 0 2px"}}>🙏 Gratitudes</p><p style={{fontSize:12,color:c.text,margin:0,lineHeight:1.4}}>{j.gratitude}</p></div>}
          {j.text&&<div><p style={{fontSize:10,fontWeight:600,color:c.sage,margin:"0 0 2px"}}>💭 Reflections</p><p style={{fontSize:12,color:c.text,margin:0,lineHeight:1.4}}>{j.text}</p></div>}
        </div>)}</>}
    </div><TabBar/></div>);
  }

  return null;
}
