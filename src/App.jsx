import React, { useEffect, useMemo, useState } from 'react';
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault(); window.navigator.deferredPrompt=e;});
  const ensureMeta = (attr, key, value) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr,key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  };
  document.title = 'Red River Gorge Trip';
  ensureMeta('name','theme-color','#0f172a');
  ensureMeta('name','apple-mobile-web-app-capable','yes');
  ensureMeta('name','apple-mobile-web-app-status-bar-style','black-translucent');
  ensureMeta('name','apple-mobile-web-app-title','RRG Trip');
  let link = document.querySelector("link[rel='manifest']");
  if(!link){ link = document.createElement('link'); link.rel='manifest'; document.head.appendChild(link); }
  const manifest = {name:'Red River Gorge Trip',short_name:'RRG Trip',display:'standalone',start_url:'/',background_color:'#0f172a',theme_color:'#0f172a',icons:[{src:'https://cdn-icons-png.flaticon.com/512/684/684908.png',sizes:'192x192',type:'image/png'}]};
  link.href = URL.createObjectURL(new Blob([JSON.stringify(manifest)],{type:'application/json'}));
}
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://veqacfdomtsizvrbbwck.supabase.co','sb_publishable_VTBNwUiejWUNQQvPTsDTbA_XOBZ4JOQ');
const TABLES={members:'trip_members',expenses:'trip_expenses',comments:'trip_comments',posts:'trip_posts'};
function LudoGame(){const [fx,setFx]=useState(''); const ROOM_ID=1;const ludoBtn={padding:'14px 18px',border:'0',borderRadius:18,background:'linear-gradient(135deg,#2563eb,#7c3aed)',color:'#fff',cursor:'pointer',fontWeight:800};const allPlayers=['Hareesh','Que','Prathyusha','Puneeth','Saranya','Sowmya','Varshitha','Vasanth','Vikesh'];const [players,setPlayers]=useState([]);const [myPlayer,setMyPlayer]=useState(''); const safeZones=[5,12,18,25,31,38,44];const colors=['#ef4444','#3b82f6','#10b981','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1'];const [turn,setTurn]=useState(0);const [dice,setDice]=useState([1,1]);const [pos,setPos]=useState(Array(allPlayers.length).fill(0));const [status,setStatus]=useState('Connecting live room...');const [connected,setConnected]=useState(false);const [heartbeat,setHeartbeat]=useState(Date.now());useEffect(()=>{const load=async()=>{const {data,error}=await supabase.from('trip_ludo').select('*').eq('id',ROOM_ID).maybeSingle();if(data){setTurn(data.turn||0);setDice(data.dice||[1,1]);setPos(data.positions||Array(9).fill(0));setPlayers(data.players||[]);setMyPlayer(localStorage.getItem('ludo_me')||'');}else{await supabase.from('trip_ludo').upsert({id:ROOM_ID,turn:0,dice:[1,1],positions:Array(9).fill(0),players:[]});}setStatus('🟢 Live room synced');};load();const ch=supabase.channel('ludo-live-room1').on('postgres_changes',{event:'*',schema:'public',table:'trip_ludo',filter:'id=eq.1'},payload=>{const d=payload.new||payload.record||payload.old;if(d){setTurn(Number(d.turn||0));setDice(Array.isArray(d.dice) && d.dice.length===2 && !isNaN(Number(d.dice[0])) && !isNaN(Number(d.dice[1])) ? [Number(d.dice[0]),Number(d.dice[1])] : [1,1]);setPos(Array.isArray(d.positions)?d.positions:Array(9).fill(0));setPlayers(Array.isArray(d.players)?d.players:[]);setHeartbeat(Date.now());setStatus('🟢 Live move synced');}}).subscribe((s)=>{if(s==='SUBSCRIBED'){setConnected(true);setHeartbeat(Date.now());setStatus('🟢 Live connected');}else{setConnected(false);setStatus('🟡 Connecting live...'); if(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='CLOSED'){setConnected(false);} }});const reconnect=setInterval(async()=>{if(!connected || Date.now()-heartbeat>7000){setStatus('🔄 Reconnecting...'); try{const {data}=await supabase.from('trip_ludo').select('*').eq('id',ROOM_ID).maybeSingle(); if(data){setTurn(Number(data.turn||0));setDice(Array.isArray(data.dice)?data.dice:[1,1]);setPos(Array.isArray(data.positions)?data.positions:Array(9).fill(0));setPlayers(Array.isArray(data.players)?data.players:[]);setConnected(true);setHeartbeat(Date.now());setStatus('🟢 Live synced');} }catch(e){} }},3000);return()=>{clearInterval(reconnect);supabase.removeChannel(ch);}},[]);const roll=async()=>{if(players.length===0)return; if(!connected){setStatus('🔄 Reconnecting...'); return;}  if(turn>=players.length){setTurn(0);return;} setStatus('🎲 Rolling live...');try{const a=new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');a.play();}catch(e){}const d1=Math.ceil(Math.random()*6);const d2=Math.ceil(Math.random()*6);const move=d1+d2;let next=[...pos];next[turn]=Math.min(50,next[turn]+move);for(let i=0;i<next.length;i++){if(i!==turn&&next[i]===next[turn]&&next[turn]!==50&&!safeZones.includes(next[turn])){next[i]=0;const roasts=['📦 got packed and shipped home!','😭 eliminated in first round style!','🍼 sent back to kindergarten!','🚧 took wrong exit back to Start!','🤡 clown move! back you go!'];const roast=roasts[Math.floor(Math.random()*roasts.length)];setFx('🤣💀 '+players[i]+' '+roast+' 🐔');setTimeout(()=>setFx(''),3600);}}const active=Math.max(players.length,1); const nt=(turn+1)%active;setDice([d1,d2]);setPos(next);setTurn(nt);const {error}=await supabase.from('trip_ludo').update({turn:nt,dice:[d1,d2],positions:next,players,updated_at:new Date().toISOString()}).eq('id',ROOM_ID); if(error){setConnected(false);setStatus('❌ Sync failed');}else{setStatus('🟢 Everyone sees move live');}};const winner=pos.findIndex(v=>v>=50);return <div><div style={{marginBottom:12,padding:12,background:connected?'#dcfce7':'#fee2e2',borderRadius:16,fontWeight:800}}>{status} {connected?'📡':'📴'}</div><div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:12}}><select style={{padding:10,borderRadius:12}} value={myPlayer} onChange={async(e)=>{const v=e.target.value;setMyPlayer(v);localStorage.setItem('ludo_me',v); if(v && !players.includes(v)){ const np=[...players,v]; setPlayers(np); await supabase.from('trip_ludo').update({turn:0,dice:dice,positions:pos,players:np}).eq('id',ROOM_ID); setStatus('🟢 Player joined live'); }}}><option value=''>Choose your name</option>{allPlayers.filter(p=>!players.includes(p)).map((p,i)=><option key={i} value={p}>{p}</option>)}</select><button style={ludoBtn} onClick={async()=>{const reset=Array(allPlayers.length).fill(0);setPlayers([]);setPos(reset);setTurn(0);setMyPlayer('');localStorage.removeItem('ludo_me');await supabase.from('trip_ludo').update({turn:0,dice:[1,1],positions:reset,players:[]}).eq('id',ROOM_ID);setStatus('🧹 Lobby cleared live');}}>Clear Players</button><button style={{...ludoBtn,background:'linear-gradient(135deg,#dc2626,#7c2d12)'}} onClick={async()=>{if(!myPlayer)return;const idx=players.indexOf(myPlayer);const np=players.filter(p=>p!==myPlayer);const next=[...pos];if(idx>-1)next[idx]=0;setPlayers(np);setMyPlayer('');localStorage.removeItem('ludo_me');await supabase.from('trip_ludo').update({turn:0,dice:[1,1],positions:next,players:np,updated_at:new Date().toISOString()}).eq('id',ROOM_ID);setStatus('🚪 You left the game');}}>Leave Game</button></div><div style={{marginBottom:10,fontWeight:700}}>Playing: {players.length?players.join(', '):'Select players to start'}</div><div style={{display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:6,maxWidth:700}}>{Array.from({length:50}).map((_,i)=><div key={i} style={{minHeight:42,background:'#fff',border:'1px solid #dbeafe',borderRadius:10,fontSize:11,padding:2,position:'relative'}}><div>{i+1}{safeZones.includes(i+1)?' 🛡️':''}</div>{players.map((p,pi)=>pos[pi]===i+1?<span key={pi} style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:colors[pi],marginRight:2}}></span>:null)}</div>)}</div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,marginTop:12}}>{players.map((n,i)=><div key={i} style={{padding:10,background:'#fff',borderRadius:14}}><b style={{color:colors[i]}}>⬤ {n}</b><div>Tile {pos[i]}/50</div>{winner===i?<div>🏆 Winner</div>:null}</div>)}</div><div style={{marginTop:16,fontSize:20,fontWeight:800}}>Turn: {players.length?players[turn]:'Select Players'} {myPlayer && players[turn]!==myPlayer ? '• Waiting for '+players[turn] : myPlayer===players[turn] ? '• Your turn!' : ''} • Dice: {Number(dice[0]||1)} + {Number(dice[1]||1)} = {Number(dice[0]||1)+Number(dice[1]||1)}</div>{fx?<div style={{marginTop:10,padding:14,background:'linear-gradient(135deg,#fee2e2,#fecaca)',borderRadius:18,fontWeight:900,fontSize:24,textAlign:'center',animation:'pulse 0.6s infinite alternate'}}>{fx}<div style={{fontSize:42,marginTop:6}}>😂👉 🚶</div></div>:null}{winner!==-1?<div style={{marginTop:12,padding:16,background:'linear-gradient(135deg,#fde68a,#f59e0b)',borderRadius:18,fontWeight:900,fontSize:22,textAlign:'center'}}>🎆💸👑 FIREWORKS! PRESIDENT TRUMP CONGRATULATES {players[winner].toUpperCase()} 🎉</div>:null}<div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}}><button style={ludoBtn} onClick={roll} disabled={winner!==-1 || players.length===0 || myPlayer!==players[turn] || !connected}>🎲 Roll Dice Live</button><button style={{...ludoBtn,background:'linear-gradient(135deg,#dc2626,#f59e0b)'}} onClick={async()=>{const reset=Array(9).fill(0);setPos(reset);setTurn(0);setDice([1,1]);setFx('🔄 New Game Started!');setTimeout(()=>setFx(''),1800);await supabase.from('trip_ludo').update({turn:0,dice:[1,1],positions:reset,players}).eq('id',ROOM_ID);}}>🔄 Start Over</button></div><div style={{marginTop:12,padding:12,background:'#ecfeff',borderRadius:14}}><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button style={ludoBtn} onClick={()=>setFx('🎤 Live voice chat coming through WhatsApp / device mic!')}>💬 Live Voice Chat</button><button style={ludoBtn} onClick={()=>setFx('😎 You are finished!')}>😎</button><button style={ludoBtn} onClick={()=>setFx('😂 Lucky roll only!')}>😂</button><button style={ludoBtn} onClick={()=>setFx('👑 I own this board!')}>👑</button><button style={ludoBtn} onClick={()=>setFx('😈 Revenge coming...')}>😈</button></div></div><p style={{marginTop:10}}>🛡️ Safe zones cannot be killed. Landing on another player sends them back home (0).</p></div>}

export default function TripApp(){
const [tab,setTab]=useState('people');
const [members,setMembers]=useState([]);
const [name,setName]=useState('');
const [phone,setPhone]=useState('');
const [editingMember,setEditingMember]=useState(null);
const [photos,setPhotos]=useState([]);
const [expenses,setExpenses]=useState([]);
const [expenseTitle,setExpenseTitle]=useState('');
const [expenseAmount,setExpenseAmount]=useState('');
const [cars,setCars]=useState([]);
const [carDriver,setCarDriver]=useState('');
const [carSeats,setCarSeats]=useState('');
const [carPassengers,setCarPassengers]=useState('');
const [stay,setStay]=useState([]);
const [stayPlace,setStayPlace]=useState('');
const [stayDate,setStayDate]=useState('');
const [stayTime,setStayTime]=useState('');
const [timeline,setTimeline]=useState([]);
const [comments,setComments]=useState([]);
const [commentName,setCommentName]=useState('');
const [commentText,setCommentText]=useState('');
const [publicPosts,setPublicPosts]=useState([]);
const [postName,setPostName]=useState('');
const [postText,setPostText]=useState('');
const [weather,setWeather]=useState({temp:'Loading...',desc:'Fetching live weather...',humidity:'--',wind:'--'});
const [location,setLocation]=useState({lat:null,lng:null,status:'Enable GPS for live maps'});
const [aiTip,setAiTip]=useState('Loading AI travel advice...');
const [listening,setListening]=useState(false);
const [emergencyContacts,setEmergencyContacts]=useState([{name:'911 Emergency',phone:'911',type:'Emergency'},{name:'Powell County Hospital',phone:'606-663-3547',type:'Hospital'}]);
const [emName,setEmName]=useState('');
const [emPhone,setEmPhone]=useState('');
const [emType,setEmType]=useState('Friend');
const [paidby,setPaidBy]=useState('');
const [participants,setParticipants]=useState([]);
const [arrivalStatus,setArrivalStatus]=useState([]);
const [arrName,setArrName]=useState('');
const [arrState,setArrState]=useState('On the way');
const [arrEta,setArrEta]=useState('');
const [liveTrackers,setLiveTrackers]=useState([]);
const [trackName,setTrackName]=useState('');
const [expenseSubType,setExpenseSubType]=useState('');
const [syncing,setSyncing]=useState(true);
const [lastUpdated,setLastUpdated]=useState('Connecting...');
const [pageReady,setPageReady]=useState(false);
const [hydrated,setHydrated]=useState(false);
const [loadError,setLoadError]=useState('');
const [memberSaving,setMemberSaving]=useState(false);
const totalBudget = useMemo(()=>expenses.reduce((a,b)=>a+Number(b.amount||0),0),[expenses]);
const split = members.length ? (totalBudget/members.length).toFixed(2) : 0;
useEffect(()=>{
setTimeout(()=>setPageReady(true),2000);
const loadRealtime = async()=>{
 const [{data:m},{data:e},{data:c},{data:p}] = await Promise.all([
  supabase.from(TABLES.members).select('*').order('id'),
  supabase.from(TABLES.expenses).select('*').order('id'),
  supabase.from(TABLES.comments).select('*').order('id'),
  supabase.from(TABLES.posts).select('*').order('id')
 ]);
 setMembers(m||[]); setExpenses(e||[]); setComments(c||[]); setPublicPosts(p||[]);
 setHydrated(true); setPageReady(true); setLastUpdated('Synced just now'); setSyncing(false);
};
loadRealtime().then(()=>setHydrated(true)).catch(()=>{setLoadError('Offline mode');setPageReady(true);setSyncing(false);setLastUpdated('Offline');});
const channel=supabase.channel('trip-sync')
.on('postgres_changes',{event:'*',schema:'public',table:TABLES.members},()=>loadRealtime())
.on('postgres_changes',{event:'*',schema:'public',table:TABLES.expenses},()=>loadRealtime())
.on('postgres_changes',{event:'*',schema:'public',table:TABLES.comments},()=>loadRealtime())
.on('postgres_changes',{event:'*',schema:'public',table:TABLES.posts},()=>loadRealtime())
.subscribe();

fetch('https://wttr.in/Slade,KY?format=j1').then(r=>r.json()).then(data=>{
const c=data.current_condition?.[0];
if(c){setWeather({temp:c.temp_F+'°F',desc:c.weatherDesc?.[0]?.value||'Live',humidity:c.humidity+'%',wind:c.windspeedMiles+' mph'});}
}).catch(()=>setWeather({temp:'72°F',desc:'Unavailable',humidity:'--',wind:'--'}));
navigator.geolocation && navigator.geolocation.getCurrentPosition((pos)=>{setLocation({lat:pos.coords.latitude,lng:pos.coords.longitude,status:'GPS Live'});setAiTip('You are live. Best next stop: Sky Bridge for views. Fuel up before entering gorge roads.');},()=>{setLocation({lat:null,lng:null,status:'GPS blocked'});setAiTip('Enable GPS for personalized AI route tips.');});
return ()=>{supabase.removeChannel(channel)};
},[]);

useEffect(()=>{},[hydrated]);

const categoryTotals = useMemo(()=>expenses.reduce((acc,e)=>{acc[e.title]=(acc[e.title]||0)+Number(e.amount||0);return acc;},{}),[expenses]);
const stayExpenses = useMemo(()=>expenses.filter(e=>String(e.title).toLowerCase()==='stay'),[expenses]);
const activityExpenses = useMemo(()=>expenses.filter(e=>String(e.title).toLowerCase()==='activities'),[expenses]);
const otherExpenses = useMemo(()=>expenses.filter(e=>!['stay','activities'].includes(String(e.title).toLowerCase())),[expenses]);
const balances = useMemo(()=>{const map={}; members.forEach(m=>map[m.name]=0); expenses.forEach(e=>{const ppl=e.people&&e.people.length?e.people:members.map(m=>m.name); const share=Number(e.amount||0)/ppl.length; ppl.forEach(n=>{map[n]=(map[n]||0)-share;}); map[e.paidby]=(map[e.paidby]||0)+Number(e.amount||0);}); return map;},[expenses,members]);
const settlements = useMemo(()=>{const creditors=[]; const debtors=[]; Object.entries(balances).forEach(([name,val])=>{if(val>0.01)creditors.push({name,amt:val}); else if(val<-0.01)debtors.push({name,amt:-val});}); const tx=[]; let i=0,j=0; while(i<debtors.length && j<creditors.length){const pay=Math.min(debtors[i].amt,creditors[j].amt); tx.push({from:debtors[i].name,to:creditors[j].name,amount:pay}); debtors[i].amt-=pay; creditors[j].amt-=pay; if(debtors[i].amt<0.01)i++; if(creditors[j].amt<0.01)j++; } return tx;},[balances]);
const categoryLedgers = useMemo(()=>expenses.map((e,idx)=>{const ppl=e.people&&e.people.length?e.people:members.map(m=>m.name); const share=ppl.length?Number(e.amount||0)/ppl.length:0; const owes=ppl.filter(n=>n!==e.paidby).map(n=>({name:n,amount:share})); return {id:idx,title:e.title,subtype:e.subtype||'',paidby:e.paidby,amount:Number(e.amount||0),share,participants:ppl,owes};}),[expenses,members]);

const addMember=async()=>{
if(!name.trim() || memberSaving) return;
setMemberSaving(true);
setLoadError('');
try{
 if(editingMember!==null){
   const target=members[editingMember];
   const {error}=await supabase.from(TABLES.members).update({name:name.trim(),phone}).eq('id',target.id);
   if(error) throw error;
   setMembers(prev=>prev.map((m,i)=>i===editingMember?{...m,name:name.trim(),phone}:m));
   setEditingMember(null);
 }else{
   const temp={id:Date.now(),name:name.trim(),phone};
   setMembers(prev=>[...prev,temp]);
   const {data,error}=await supabase.from(TABLES.members).insert({name:name.trim(),phone}).select().single();
   if(error) throw error;
   setMembers(prev=>prev.filter(m=>m.id!==temp.id).concat(data));
 }
 setName('');setPhone('');setLastUpdated('Synced just now');
 const {data:fresh}=await supabase.from(TABLES.members).select('*').order('id');
 if(fresh) setMembers(fresh);
}catch(err){
 setLoadError(err.message || 'Could not save traveler');
 const {data:fresh}=await supabase.from(TABLES.members).select('*').order('id');
 if(fresh) setMembers(fresh);
}finally{setMemberSaving(false);}
};
const removeMember=async(i)=>{await supabase.from(TABLES.members).delete().eq('id',members[i].id);} ;
const editMember=(i)=>{setName(members[i].name);setPhone(members[i].phone||'');setEditingMember(i);};
const addExpense = async () => {
if (!expenseTitle || !expenseAmount || !paidby) {
 setLoadError('Fill category, amount and paid by');
 return;
}
try {
 setSyncing(true);
 setLoadError('');
 const people = participants.length ? participants : members.map(m => m.name);
 const { error } = await supabase.from(TABLES.expenses).insert({
  title: expenseTitle,
  subtype: expenseSubType || '',
  amount: Number(expenseAmount),
  paidby,
  people
 });
 if (error) throw error;
 const { data } = await supabase.from(TABLES.expenses).select('*').order('id');
 setExpenses(data || []);
 setExpenseTitle('');
 setExpenseSubType('');
 setExpenseAmount('');
 setPaidBy('');
 setParticipants([]);
 setLastUpdated('Expense added just now');
} catch (err) {
 setLoadError(err.message || 'Could not add expense');
} finally {
 setSyncing(false);
}
};
const removeExpense=async(i)=>{await supabase.from(TABLES.expenses).delete().eq('id',expenses[i].id);} ;
const upload=(e)=>{const files=[...e.target.files].map(f=>URL.createObjectURL(f));setPhotos([...photos,...files]);};
const removePhoto=(i)=>setPhotos(photos.filter((_,x)=>x!==i));
const addCar=()=>{if(carDriver&&carSeats){setCars([...cars,{driver:carDriver,seats:carSeats,passengers:carPassengers}]);setCarDriver('');setCarSeats('');setCarPassengers('')}};
const removeCar=(i)=>setCars(cars.filter((_,x)=>x!==i));
const addStay=()=>{if(stayPlace){setStay([...stay,{place:stayPlace,date:stayDate,time:stayTime}]);setStayPlace('');setStayDate('');setStayTime('')}};
const removeStay=(i)=>setStay(stay.filter((_,x)=>x!==i));
const addTimeline=()=>{setTimeline([...timeline,{time:'New Time',task:'New Activity'}]);};
const removeTimeline=(i)=>setTimeline(timeline.filter((_,x)=>x!==i));
const addComment=()=>{if(commentText.trim()){setComments([...comments,{name:commentName||'Guest',text:commentText}]);setCommentName('');setCommentText('')}};
const removeComment=(i)=>setComments(comments.filter((_,x)=>x!==i));
const addPost=()=>{if(postText.trim()){setPublicPosts([{name:postName||'Guest',text:postText,likes:0},...publicPosts]);setPostName('');setPostText('');}};
const likePost=(i)=>{const arr=[...publicPosts];arr[i].likes+=1;setPublicPosts(arr);};
const removePost=(i)=>setPublicPosts(publicPosts.filter((_,x)=>x!==i));
const addEmergency=()=>{if(emName&&emPhone){setEmergencyContacts([...emergencyContacts,{name:emName,phone:emPhone,type:emType}]);setEmName('');setEmPhone('');setEmType('Friend');}};
const removeEmergency=(i)=>setEmergencyContacts(emergencyContacts.filter((_,x)=>x!==i));
const addArrival=()=>{if(arrName){setArrivalStatus([{name:arrName,status:arrState,eta:arrEta},...arrivalStatus]);setArrName('');setArrEta('');setArrState('On the way');}};
const removeArrival=(i)=>setArrivalStatus(arrivalStatus.filter((_,x)=>x!==i));
const addLiveTracker=()=>{if(trackName && location.lat){setLiveTrackers([{name:trackName,lat:Number(location.lat).toFixed(4),lng:Number(location.lng).toFixed(4),status:'Live now'},...liveTrackers]);setTrackName('');}};
const removeLiveTracker=(i)=>setLiveTrackers(liveTrackers.filter((_,x)=>x!==i));
const startVoice=()=>{
 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 if(!SpeechRecognition){setAiTip('Voice commands not supported on this device.');return;}
 const rec = new SpeechRecognition();
 rec.lang='en-US'; rec.continuous=false; rec.interimResults=true; rec.maxAlternatives=1;
 const openMaps=(q)=>window.open('https://www.google.com/maps/search/'+encodeURIComponent(q),'_blank');
 const currentPlace = location.lat ? `${Number(location.lat).toFixed(2)}, ${Number(location.lng).toFixed(2)}` : 'your current location';
 const smartReply=(q)=>{
   const text=q.toLowerCase();
   let place=currentPlace;
   const known=['cincinnati','washington','california','new york','chicago','miami','las vegas','red river gorge','kentucky','ohio'];
   known.forEach(k=>{if(text.includes(k)) place=k;});
   if(text.includes('near me')) place=currentPlace;
   if(text.includes('best place')||text.includes('beautiful')||text.includes('things to do')||text.includes('tourist')) return `🌍 Top places in ${place}: scenic landmarks, downtown attractions, parks, sunset spots, and must-see local gems.`;
   if(text.includes('pizza')||text.includes('food')||text.includes('restaurant')||text.includes('eat')) return `🍕 Best food in ${place}: top pizza, trending restaurants, hidden local favorites, and late-night spots.`;
   if(text.includes('gas')||text.includes('fuel')) return `⛽ Nearest gas stations in ${place}: cheapest fuel, highly rated stops, and open stations now.`;
   if(text.includes('hotel')||text.includes('stay')||text.includes('motel')) return `🏨 Best stays in ${place}: budget hotels, luxury stays, cabins, and family-friendly options.`;
   if(text.includes('weather')) return `🌦 Current weather for ${place}: ${weather.temp} and ${weather.desc}.`;
   if(text.includes('drive')||text.includes('route')||text.includes('take me')||text.includes('navigate')) return `🗺 Best route to ${place}. Opening navigation now.`;
   if(text.includes('history')) return `📚 ${place} has rich local history, famous landmarks, cultural neighborhoods, and iconic stories worth exploring.`;
   if(text.includes('shopping')) return `🛍 Best shopping in ${place}: malls, outlets, unique boutiques, and trending local stores.`;
   return `🤖 Smart travel answer for ${place}: Ask me places, food, gas, hotels, weather, routes, shopping, or anything travel related.`;
 };
 rec.onstart=()=>{setListening(true);setAiTip('🎤 Listening... Ask me anything.');};
 rec.onresult=(e)=>{
   const r=e.results[e.results.length-1]; const text=r[0].transcript.trim(); if(!text) return;
   if(!r.isFinal){setAiTip('🎤 Hearing: '+text);return;}
   const reply=smartReply(text);
   setAiTip(reply);
   if(reply.includes('Opening navigation')) openMaps(text.replace(/take me to|navigate to|route to/gi,''));
   else if(text.toLowerCase().includes('near me')||text.toLowerCase().includes('pizza')||text.toLowerCase().includes('gas')) openMaps(text);
 };
 rec.onspeechend=()=>{try{rec.stop();}catch(e){}};
 rec.onend=()=>setListening(false);
 rec.onerror=()=>{setListening(false);setAiTip('Mic blocked or speech not detected.');};
 try{rec.start();}catch(e){setAiTip('Voice already running.');}
};

const btn={padding:'14px 18px',border:'0',borderRadius:20,background:'linear-gradient(135deg,#2563eb,#7c3aed)',color:'#fff',cursor:'pointer',fontWeight:800,boxShadow:'0 14px 28px rgba(37,99,235,0.30)',transition:'all .2s ease',WebkitTapHighlightColor:'transparent',minHeight:48};
const card={background:'rgba(255,255,255,0.78)',backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',border:'1px solid rgba(255,255,255,0.6)',borderRadius:34,padding:24,marginTop:18,boxShadow:'0 30px 80px rgba(15,23,42,0.18)',transition:'transform .25s ease, box-shadow .25s ease'};
const input={padding:16,border:'1px solid #dbeafe',borderRadius:18,minWidth:180,background:'rgba(255,255,255,0.95)',fontSize:16,outline:'none'};

if(!pageReady){
return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(180deg,#020617,#0f172a,#1d4ed8,#7c3aed)',color:'#fff',fontFamily:'-apple-system,BlinkMacSystemFont,Arial,sans-serif'}}><div style={{textAlign:'center'}}><div style={{fontSize:52,marginBottom:12}}>🏕️</div><div style={{fontSize:28,fontWeight:900}}>Red River Gorge Trip</div><div style={{marginTop:10,opacity:.9}}>Loading mobile dashboard...</div><div style={{marginTop:16,fontSize:22}}>✨</div></div></div>;
}
return <div style={{padding:18,fontFamily:'-apple-system,BlinkMacSystemFont,Arial,sans-serif',background:'linear-gradient(180deg,#020617,#0f172a,#111827,#1d4ed8,#7c3aed,#f8fafc)',minHeight:'100vh',paddingBottom:110,letterSpacing:'-0.01em',animation:'fadeIn .35s ease',WebkitFontSmoothing:'antialiased'}}>
<h1 style={{fontSize:46,marginBottom:6,fontWeight:900,letterSpacing:-1.6,color:'#fff',lineHeight:1.02,textShadow:'0 10px 30px rgba(0,0,0,.28)'}}>🏕️ Red River Gorge Trip 2026</h1>
<p style={{color:'#e2e8f0',marginTop:0,fontSize:18}}>Mobile dashboard • concierge planner • live travel intelligence</p><div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:10}}><button style={btn} onClick={async()=>{const anyNav=navigator; if(anyNav.deferredPrompt){ anyNav.deferredPrompt.prompt(); const choice=await anyNav.deferredPrompt.userChoice; if(choice){setAiTip('📲 App install prompt opened.');} anyNav.deferredPrompt=null; return;} if(/iPhone|iPad|iPod/i.test(navigator.userAgent)){setAiTip('📱 iPhone: Tap Share in Safari, then Add to Home Screen.');return;} if(navigator.share){try{await navigator.share({title:'Red River Gorge Trip',text:'Install our trip app',url:window.location.href});}catch(e){}} else {setAiTip('📲 Android: open browser menu and tap Install App / Add to Home screen.');}}}>📲 Install App</button><div style={{color:'#fff',fontSize:13,opacity:.9,display:'flex',alignItems:'center'}}>iPhone: Share → Add to Home Screen</div></div>{/Android/i.test(navigator.userAgent) ? <div style={{marginBottom:12,padding:12,background:'rgba(34,197,94,0.18)',border:'1px solid rgba(34,197,94,0.35)',borderRadius:16,color:'#fff',fontWeight:800,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}><span>🤖 Install this app on Android</span><button style={btn} onClick={()=>{setAiTip('Android: open browser menu ⋮ and tap Install App or Add to Home screen.');}}>Install Now</button></div> : null}<div style={{display:'inline-flex',gap:10,alignItems:'center',padding:'10px 14px',background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:999,color:'#fff',fontWeight:700,marginBottom:8}}><span>{syncing?'🔄 Syncing Live':'🟢 Live Synced'}</span><span style={{opacity:.8}}>•</span><span>🕒 {lastUpdated}</span>{loadError?<span style={{marginLeft:8,color:'#fca5a5'}}>• {loadError}</span>:null}</div>
<div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:8,margin:'18px 0'}}>{['people','budget','settlement','ludo','photos','stay','cars','timeline','arrival','tracker','comments','guide','assistant','emergency','public'].map(t=><button key={t} style={{...btn,whiteSpace:'nowrap',opacity:tab===t?1:0.72,transform:tab===t?'scale(1.04) translateY(-2px)':'scale(1)',transition:'all .22s ease'}} onClick={()=>setTab(t)}>{t}</button>)}</div>

{tab==='people' && <div style={card}><h2>👥 Travelers</h2><div style={{marginBottom:14,display:'flex',gap:10,flexWrap:'wrap'}}><a href='https://chat.whatsapp.com/I9s6EZK81X05llarQSPyDs' target='_blank' style={{...btn,textDecoration:'none',display:'inline-block'}}>💬 Open WhatsApp Group</a><button style={btn} onClick={()=>window.open('https://faq.whatsapp.com/5913398998672934','_blank')}>📍 Share Live Location Help</button></div><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Name' value={name} onChange={e=>setName(e.target.value)}/><input style={input} placeholder='Phone Number' value={phone} onChange={e=>setPhone(e.target.value)}/><button style={btn} onClick={addMember}>{memberSaving?'Saving...':(editingMember!==null?'Update':'Add')}</button></div><ul>{members.map((m,i)=><li key={i} style={{margin:'10px 0'}}><b>{m.name}</b> • 📞 <a href={`tel:${m.phone}`} style={{textDecoration:'none',fontSize:20,marginRight:8}}>📲</a> <a href={`https://wa.me/${String(m.phone).replace(/\D/g,'')}`} target='_blank' style={{textDecoration:'none',fontSize:20,marginRight:8}}>💬</a> {m.phone||'N/A'} <button onClick={()=>editMember(i)}>Edit</button> <button onClick={()=>removeMember(i)}>Delete</button></li>)}</ul></div>}

{tab==='budget' && <div style={card}><h2 style={{fontSize:32,margin:'0 0 8px 0'}}>💰 Total Budget: ${totalBudget}</h2><h3 style={{color:'#2563eb',marginTop:0}}>Crystal Clear Split View</h3><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12,marginBottom:14}}><div style={{padding:14,background:'#ecfeff',borderRadius:16}}><b>🏡 Stay Total</b><div>${stayExpenses.reduce((a,b)=>a+Number(b.amount||0),0).toFixed(2)}</div></div><div style={{padding:14,background:'#f0fdf4',borderRadius:16}}><b>🎯 Activities Total</b><div>${activityExpenses.reduce((a,b)=>a+Number(b.amount||0),0).toFixed(2)}</div></div><div style={{padding:14,background:'#fefce8',borderRadius:16}}><b>🧾 Other Total</b><div>${otherExpenses.reduce((a,b)=>a+Number(b.amount||0),0).toFixed(2)}</div></div></div><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><select style={input} value={expenseTitle} onChange={e=>setExpenseTitle(e.target.value)}><option value=''>Category</option><option>Stay</option><option>Food</option><option>Activities</option><option>Fuel</option><option>Other</option></select>{expenseTitle==='Activities' && <select style={input} value={expenseSubType} onChange={e=>setExpenseSubType(e.target.value)}><option value=''>Activity Name</option><option>Boating</option><option>Zip Line</option><option>Kayaking</option><option>Horse Riding</option><option>Hiking Gear</option><option>Other Activity</option></select>}{expenseTitle==='Food' && <select style={input} value={expenseSubType} onChange={e=>setExpenseSubType(e.target.value)}><option value=''>Food Type</option><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snacks</option><option>Drinks</option><option>Groceries</option><option>BBQ</option></select>}<input style={input} placeholder='Amount' value={expenseAmount} onChange={e=>setExpenseAmount(e.target.value)}/><select style={input} value={paidby} onChange={e=>setPaidBy(e.target.value)}><option value=''>Paid by</option>{members.map((m,i)=><option key={i} value={m.name}>{m.name}</option>)}</select><div style={{width:'100%',padding:12,border:'1px solid #dbeafe',borderRadius:14,background:'#fff'}}><b>Select Participants</b><div style={{display:'flex',gap:14,flexWrap:'wrap',marginTop:8}}><label style={{fontSize:14,fontWeight:700}}><input type='checkbox' checked={participants.length===members.length && members.length>0} onChange={(e)=>setParticipants(e.target.checked?members.map(m=>m.name):[])}/> All Participants</label>{members.map((m,i)=><label key={i} style={{fontSize:14}}><input type='checkbox' checked={participants.includes(m.name)} onChange={(e)=>setParticipants(e.target.checked?[...participants,m.name]:participants.filter(n=>n!==m.name))}/> {m.name}</label>)}</div></div><button style={btn} onClick={addExpense}>Add</button></div><div style={{marginTop:16,padding:16,background:'#eff6ff',borderRadius:16}}><b>Category Wise Clear Ledger</b>{categoryLedgers.map((g,i)=><div key={i} style={{marginTop:14,padding:14,background:'#fff',borderRadius:14,border:'1px solid #dbeafe'}}><div style={{fontWeight:800,fontSize:18}}>{g.title}{g.subtype?` (${g.subtype})`:''}</div><div style={{marginTop:6}}>Paid by <b style={{color:'#15803d'}}>{g.paidby}</b> • Total ${g.amount.toFixed(2)} • Each Share ${g.share.toFixed(2)}</div><div style={{marginTop:8,fontSize:14,color:'#334155'}}>Participants: {g.participants.join(', ')}</div><table style={{width:'100%',marginTop:10,borderCollapse:'collapse'}}><thead><tr><th style={{textAlign:'left',padding:8}}>Who Owes</th><th style={{textAlign:'left',padding:8}}>Pay To</th><th style={{textAlign:'left',padding:8}}>Amount</th></tr></thead><tbody>{g.owes.map((o,k)=><tr key={k} style={{borderTop:'1px solid #e5e7eb'}}><td style={{padding:8}}>{o.name}</td><td style={{padding:8,color:'#15803d'}}>{g.paidby}</td><td style={{padding:8,fontWeight:700}}>${o.amount.toFixed(2)}</td></tr>)}</tbody></table></div>)}<div style={{padding:12,background:'#ecfeff',borderRadius:14,margin:'14px 0'}}><b>Crystal Separate Transactions</b><div>Each category above is kept separate. No combining between payers.</div></div><div style={{padding:12,background:'#ecfeff',borderRadius:14,marginBottom:10}}><b>Quick Summary</b><div>Each category above already shows exactly who owes whom separately.</div><div>Use Stay / Activities / Food ledgers for direct payments.</div></div><b>Settlement moved to separate tab</b><div style={{marginTop:8}}>Use the Settlement tab beside Budget for payment tracking.</div></div><div style={{marginTop:14,fontWeight:800}}>Expense History</div><ul>{expenses.map((e,i)=><li key={i} style={{margin:'10px 0'}}>{e.title}{e.subtype?` (${e.subtype})`:''} - ${e.amount} • Paid by {e.paidby} • Split among {(e.people||[]).join(', ')} <button onClick={()=>removeExpense(i)}>Delete</button></li>)}</ul></div>}

{tab==='settlement' && <div style={card}><h2>💸 Settlement Tracker</h2><p>Mark payments complete after Zelle/Cash/Venmo.</p><div style={{display:'grid',gap:12}}>{members.map((m,i)=>{const due=Math.max(0,-(balances[m.name]||0));const get=Math.max(0,(balances[m.name]||0));const settled=due<0.01 && get<0.01; const creditor=get>=0.01; const color=settled?'#15803d':creditor?'#1d4ed8':'#b91c1c'; const label=settled?'Settled ✅':creditor?`Gets Back $${get.toFixed(2)}`:`Owes $${due.toFixed(2)}`; const icon=settled?'🟢':creditor?'💙':'🔴'; return <div key={i} style={{padding:14,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><b>{m.name}</b><div style={{fontSize:14,color}}>{label}</div></div><div style={{fontSize:22}}>{icon}</div></div>})}</div></div>}

{tab==='ludo' && <div style={card}><h2>🎲 Road Trip Ludo</h2><p>Play while riding. First to finish wins.</p><div style={{padding:16,background:'#eff6ff',borderRadius:18,marginBottom:14,lineHeight:1.6}}><b>📘 How to Play</b><div>1️⃣ Add only players who want to play from the dropdown.</div><div>2️⃣ Tap 🎲 Roll Dice Live on your turn.</div><div>3️⃣ Two dice are rolled and your token moves forward by total.</div><div>4️⃣ If you land on another player, they go back to Start (0).</div><div>5️⃣ Blue shield signs 🛡️ on board are Safe Zones — players there cannot be killed.</div><div>6️⃣ First player to reach Tile 50 wins 🏆</div><div>7️⃣ Use 🔄 Start Over for a fresh game.</div></div><LudoGame /></div>}

{tab==='photos' && <div style={card}><input type='file' multiple accept='image/*' onChange={upload}/><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginTop:16}}>{photos.map((p,i)=><div key={i}><img src={p} style={{width:'100%',height:140,objectFit:'cover',borderRadius:12}}/><button onClick={()=>removePhoto(i)}>Delete</button></div>)}</div></div>}

{tab==='stay' && <div style={card}><h2>🏡 Stay</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Place' value={stayPlace} onChange={e=>setStayPlace(e.target.value)}/><input style={input} placeholder='Day/Month' value={stayDate} onChange={e=>setStayDate(e.target.value)}/><input style={input} placeholder='Time' value={stayTime} onChange={e=>setStayTime(e.target.value)}/><button style={btn} onClick={addStay}>Add</button></div>{stay.map((s,i)=><p key={i}>{s.place} • {s.date} • {s.time} <button onClick={()=>removeStay(i)}>Delete</button></p>)}</div>}

{tab==='cars' && <div style={card}><h2>🚗 Car Plan</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Driver' value={carDriver} onChange={e=>setCarDriver(e.target.value)}/><input style={input} placeholder='Seats' value={carSeats} onChange={e=>setCarSeats(e.target.value)}/><input style={input} placeholder='Passengers' value={carPassengers} onChange={e=>setCarPassengers(e.target.value)}/><button style={btn} onClick={addCar}>Add</button></div>{cars.map((c,i)=><p key={i}>{c.driver} • Seats {c.seats} • Passengers: {c.passengers} <button onClick={()=>removeCar(i)}>Delete</button></p>)}</div>}

{tab==='timeline' && <div style={card}><h2>🕒 Trip Timeline</h2><button style={btn} onClick={addTimeline}>Add Row</button>{timeline.map((t,i)=><p key={i}><b>{t.time}</b> - {t.task} <button onClick={()=>removeTimeline(i)}>Delete</button></p>)}</div>}

{tab==='arrival' && <div style={card}><h2>📍 Check-In Arrival Tracker</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><select style={input} value={arrName} onChange={e=>setArrName(e.target.value)}><option value=''>Traveler</option>{members.map((m,i)=><option key={i} value={m.name}>{m.name}</option>)}</select><select style={input} value={arrState} onChange={e=>setArrState(e.target.value)}><option>On the way</option><option>Reached</option><option>Delayed</option><option>Need Help</option></select><input style={input} placeholder='ETA e.g. 2:15 PM' value={arrEta} onChange={e=>setArrEta(e.target.value)}/><button style={btn} onClick={addArrival}>Update</button></div><div style={{display:'grid',gap:12,marginTop:16}}>{arrivalStatus.map((a,i)=><div key={i} style={{padding:16,background:'#fff',borderRadius:18,border:'1px solid #e5e7eb'}}><b>{a.name}</b><p style={{margin:'6px 0'}}>Status: {a.status}</p><p>ETA: {a.eta}</p><button onClick={()=>removeArrival(i)}>Delete</button></div>)}</div></div>}

{tab==='tracker' && <div style={card}><h2>🛰️ Live Map Tracker</h2><p>{location.status}</p><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><select style={input} value={trackName} onChange={e=>setTrackName(e.target.value)}><option value=''>Traveler</option>{members.map((m,i)=><option key={i} value={m.name}>{m.name}</option>)}</select><button style={btn} onClick={addLiveTracker}>Use My Current Location</button></div><div style={{marginTop:16,padding:16,background:'#eff6ff',borderRadius:16}}><a href='https://www.google.com/maps/search/Red+River+Gorge+Kentucky' target='_blank'>🗺️ Open Full Map</a></div><div style={{display:'grid',gap:12,marginTop:16}}>{liveTrackers.map((t,i)=><div key={i} style={{padding:16,background:'#fff',borderRadius:18,border:'1px solid #e5e7eb'}}><b>{t.name}</b><p style={{margin:'6px 0'}}>📍 {t.status}</p><p>Lat {t.lat} • Lng {t.lng}</p><div style={{display:'flex',gap:10}}><a href={`https://www.google.com/maps?q=${t.lat},${t.lng}`} target='_blank'>Open Pin</a><button onClick={()=>removeLiveTracker(i)}>Delete</button></div></div>)}</div></div>}

{tab==='comments' && <div style={card}><h2>💬 Comments</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Name' value={commentName} onChange={e=>setCommentName(e.target.value)}/><input style={input} placeholder='Write comment' value={commentText} onChange={e=>setCommentText(e.target.value)}/><button style={btn} onClick={addComment}>Add</button></div>{comments.map((c,i)=><p key={i}><b>{c.name}:</b> {c.text} <button onClick={()=>removeComment(i)}>Delete</button></p>)}</div>}

{tab==='guide' && <div style={card}><h2>🗺️ Travel Dashboard</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}><div style={{padding:16,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}><h3>📍 Beautiful Spots</h3><p>Sky Bridge 🌄</p><p>Natural Bridge 🪨</p><p>Chimney Top Rock 📸</p><p>Princess Arch 🥾</p></div><div style={{padding:16,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}><h3>🧭 Live GPS Maps</h3><p>{location.status}</p><p><a href={location.lat ? `https://www.google.com/maps/dir/${location.lat},${location.lng}/Red+River+Gorge+Kentucky` : 'https://maps.google.com/?q=Red+River+Gorge+Kentucky'} target='_blank'>🚗 Navigate to Red River Gorge</a></p><p><a href='https://maps.google.com/?q=Sky+Bridge+Kentucky' target='_blank'>🌄 Drive to Sky Bridge</a></p><p><a href='https://maps.google.com/?q=Natural+Bridge+Kentucky' target='_blank'>🪨 Drive to Natural Bridge</a></p><p><a href='https://maps.google.com/?q=gas+station+near+Red+River+Gorge' target='_blank'>⛽ Nearby Gas</a></p></div><div style={{padding:16,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}><h3>🌦️ Live Weather</h3><p>Location: Slade, KY</p><p>{weather.temp} • {weather.desc}</p><p>Humidity {weather.humidity} • Wind {weather.wind}</p></div><div style={{padding:16,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}><h3>📸 Luxury Experiences</h3><p>Sunrise photography session</p><p>Cabin hot tub night</p><p>Scenic helicopter inquiry</p></div></div></div>}

{tab==='assistant' && <div style={card}><h2>🤖 AI Travel Assistant</h2><button style={btn} onClick={startVoice}>{listening ? '🎤 Listening...' : '🎤 Start Voice Command'}</button><p style={{marginTop:14}}>{aiTip}</p><div style={{marginTop:12,padding:16,background:'#eff6ff',borderRadius:16}}><p>📍 Best Photo Spot Now: Sky Bridge at sunset</p><p>🍔 Food Stop: Miguel's Pizza nearby</p><p>🌧 Rain Alert: Check weather before hiking</p><p>⛽ Gas Tip: Fill up in Slade before trails</p><p>🎙 Try saying: weather / budget / photo spot / take me there</p></div></div>}

{tab==='emergency' && <div style={card}><h2>🚨 Emergency Contacts</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Name' value={emName} onChange={e=>setEmName(e.target.value)}/><input style={input} placeholder='Phone' value={emPhone} onChange={e=>setEmPhone(e.target.value)}/><select style={input} value={emType} onChange={e=>setEmType(e.target.value)}><option>Friend</option><option>Family</option><option>Hospital</option><option>Police</option><option>Roadside</option></select><button style={btn} onClick={addEmergency}>Add</button></div>{emergencyContacts.map((c,i)=><p key={i}><b>{c.name}</b> • {c.type} • 📞 <a href={`tel:${c.phone}`}>{c.phone}</a> <button onClick={()=>removeEmergency(i)}>Delete</button></p>)}<div style={{marginTop:14,padding:14,background:'#fee2e2',borderRadius:16}}><p>📍 In emergency use Guide tab for GPS route.</p><p>🏥 Nearest hospital listed above.</p></div></div>}

{tab==='public' && <div style={card}><h2>🌍 Social Travel Lounge</h2><div style={{marginBottom:14}}><a href='https://chat.whatsapp.com/I9s6EZK81X05llarQSPyDs' target='_blank' style={{...btn,textDecoration:'none',display:'inline-block'}}>💬 Join Trip WhatsApp Group</a><button style={btn} onClick={()=>window.open('https://faq.whatsapp.com/5913398998672934','_blank')}>📍 Share Live Location</button></div><p>Members: {members.length} • Budget ${totalBudget} • Split ${split}</p><div style={{display:'flex',gap:10,flexWrap:'wrap',margin:'14px 0'}}><input style={input} placeholder='Your name' value={postName} onChange={e=>setPostName(e.target.value)}/><input style={input} placeholder='Share update...' value={postText} onChange={e=>setPostText(e.target.value)}/><button style={btn} onClick={addPost}>Post</button></div><div style={{display:'grid',gap:12}}>{publicPosts.map((p,i)=><div key={i} style={{padding:16,background:'#fff',borderRadius:18,border:'1px solid #e5e7eb'}}><b>{p.name}</b><p style={{margin:'8px 0'}}>{p.text}</p><div style={{display:'flex',gap:10}}><button onClick={()=>likePost(i)}>❤️ {p.likes}</button><button onClick={()=>removePost(i)}>Delete</button></div></div>)}</div><div style={{marginTop:16,padding:16,background:'#eff6ff',borderRadius:16}}>Live social feed for trip members. Share plans, ETA, cabin updates, hiking ideas, photos, and meetups. Use 📍 Share Live Location in WhatsApp during travel day.</div></div>}

<div style={{position:'fixed',bottom:10,left:10,right:10,backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',background:'rgba(15,23,42,0.68)',border:'1px solid rgba(255,255,255,0.14)',display:'flex',justifyContent:'space-around',padding:'14px 10px',zIndex:50,borderRadius:28,boxShadow:'0 24px 50px rgba(0,0,0,.28)'}}>{[['people','👥'],['budget','💰'],['guide','🗺️'],['assistant','🤖'],['public','🌍']].map(([k,icon])=><button key={k} onClick={()=>setTab(k)} style={{background:'transparent',border:0,color:'#fff',fontSize:24,opacity:tab===k?1:0.6,transform:tab===k?'scale(1.15)':'scale(1)',transition:'all .2s ease'}}>{icon}</button>)}</div><div style={{marginTop:40,padding:'10px 0',textAlign:'center',color:'#e2e8f0',fontSize:13,fontWeight:700}}>Built by Vikesh • @vikesh-2026</div>
</div>
}
