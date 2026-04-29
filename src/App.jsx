import React, { useEffect, useMemo, useState } from 'react';

export default function TripApp(){
const [tab,setTab]=useState('people');
const [members,setMembers]=useState([{name:'Amit',phone:'404-555-1111'},{name:'John',phone:'678-555-2222'}]);
const [name,setName]=useState('');
const [phone,setPhone]=useState('');
const [editingMember,setEditingMember]=useState(null);
const [photos,setPhotos]=useState([]);
const [expenses,setExpenses]=useState([{title:'Cabin',amount:300},{title:'Fuel',amount:120}]);
const [expenseTitle,setExpenseTitle]=useState('');
const [expenseAmount,setExpenseAmount]=useState('');
const [cars,setCars]=useState([{driver:'Amit',seats:4,passengers:'John'}]);
const [carDriver,setCarDriver]=useState('');
const [carSeats,setCarSeats]=useState('');
const [carPassengers,setCarPassengers]=useState('');
const [stay,setStay]=useState([{place:'Cabin',date:'Jun 14',time:'3:00 PM'}]);
const [stayPlace,setStayPlace]=useState('');
const [stayDate,setStayDate]=useState('');
const [stayTime,setStayTime]=useState('');
const [timeline,setTimeline]=useState([{time:'Fri 8:00 AM',task:'Leave Atlanta'},{time:'Fri 1:00 PM',task:'Check-in Cabin'}]);
const [comments,setComments]=useState([{name:'Admin',text:'Welcome to the trip planner!'}]);
const [commentName,setCommentName]=useState('');
const [commentText,setCommentText]=useState('');
const [publicPosts,setPublicPosts]=useState([{name:'Amit',text:'Ready for the trip! 🎉',likes:2},{name:'John',text:'Who wants to hike Sky Bridge?',likes:1}]);
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
const totalBudget = useMemo(()=>expenses.reduce((a,b)=>a+Number(b.amount||0),0),[expenses]);
const split = members.length ? (totalBudget/members.length).toFixed(2) : 0;
useEffect(()=>{
fetch('https://wttr.in/Slade,KY?format=j1').then(r=>r.json()).then(data=>{
const c=data.current_condition?.[0];
if(c){setWeather({temp:c.temp_F+'°F',desc:c.weatherDesc?.[0]?.value||'Live',humidity:c.humidity+'%',wind:c.windspeedMiles+' mph'});}
}).catch(()=>setWeather({temp:'72°F',desc:'Unavailable',humidity:'--',wind:'--'}));
navigator.geolocation && navigator.geolocation.getCurrentPosition((pos)=>{setLocation({lat:pos.coords.latitude,lng:pos.coords.longitude,status:'GPS Live'});setAiTip('You are live. Best next stop: Sky Bridge for views. Fuel up before entering gorge roads.');},()=>{setLocation({lat:null,lng:null,status:'GPS blocked'});setAiTip('Enable GPS for personalized AI route tips.');});
},[]);

const categoryTotals = useMemo(()=>expenses.reduce((acc,e)=>{acc[e.title]=(acc[e.title]||0)+Number(e.amount||0);return acc;},{}),[expenses]);

const addMember=()=>{if(name.trim()){if(editingMember!==null){const updated=[...members];updated[editingMember]={name:name.trim(),phone};setMembers(updated);setEditingMember(null);}else{setMembers([...members,{name:name.trim(),phone}]);}setName('');setPhone('');}};
const removeMember=(i)=>setMembers(members.filter((_,x)=>x!==i));
const editMember=(i)=>{setName(members[i].name);setPhone(members[i].phone||'');setEditingMember(i);};
const addExpense=()=>{if(expenseTitle&&expenseAmount){setExpenses([...expenses,{title:expenseTitle,amount:Number(expenseAmount)}]);setExpenseTitle('');setExpenseAmount('')}};
const removeExpense=(i)=>setExpenses(expenses.filter((_,x)=>x!==i));
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
const startVoice=()=>{
 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 if(!SpeechRecognition){setAiTip('Voice commands not supported on this device.');return;}
 const rec = new SpeechRecognition();
 rec.lang='en-US'; rec.start(); setListening(true);
 rec.onresult=(e)=>{const text=e.results[0][0].transcript.toLowerCase(); setListening(false);
 if(text.includes('weather')) setAiTip(`Current weather: ${weather.temp} ${weather.desc}`);
 else if(text.includes('gas')) setAiTip('Nearest gas: Search opened in Guide tab links.');
 else if(text.includes('photo')) setAiTip('Best photo spot now: Sky Bridge at sunset.');
 else if(text.includes('budget')) setAiTip(`Each person owes $${split}`);
 else if(text.includes('take me')) window.open('https://maps.google.com/?q=Red+River+Gorge+Kentucky','_blank');
 else setAiTip('Command heard: '+text);
 };
 rec.onerror=()=>{setListening(false); setAiTip('Voice command failed. Try again.');};
};

const btn={padding:'12px 18px',border:'0',borderRadius:999,background:'linear-gradient(135deg,#2563eb,#7c3aed)',color:'#fff',cursor:'pointer',fontWeight:700,boxShadow:'0 10px 24px rgba(37,99,235,0.28)'};
const card={background:'rgba(255,255,255,0.88)',backdropFilter:'blur(14px)',border:'1px solid rgba(255,255,255,0.5)',borderRadius:28,padding:24,marginTop:18,boxShadow:'0 20px 50px rgba(15,23,42,0.12)'};
const input={padding:14,border:'1px solid #dbeafe',borderRadius:14,minWidth:180,background:'#fff',fontSize:16};

return <div style={{padding:18,fontFamily:'-apple-system,BlinkMacSystemFont,Arial,sans-serif',background:'linear-gradient(180deg,#0f172a,#1e3a8a,#7c3aed,#f8fafc)',minHeight:'100vh',paddingBottom:110}}>
<h1 style={{fontSize:48,marginBottom:6,fontWeight:900,letterSpacing:-1,color:'#fff'}}>🏕️ Red River Gorge Trip 2026</h1>
<p style={{color:'#e2e8f0',marginTop:0,fontSize:18}}>Luxury mobile dashboard • concierge planner • live travel intelligence</p>
<div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:8,margin:'18px 0'}}>{['people','budget','photos','stay','cars','timeline','comments','guide','assistant','emergency','public'].map(t=><button key={t} style={{...btn,whiteSpace:'nowrap',opacity:tab===t?1:0.75,transform:tab===t?'scale(1.02)':'scale(1)'}} onClick={()=>setTab(t)}>{t}</button>)}</div>

{tab==='people' && <div style={card}><h2>👥 Travelers</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Name' value={name} onChange={e=>setName(e.target.value)}/><input style={input} placeholder='Phone Number' value={phone} onChange={e=>setPhone(e.target.value)}/><button style={btn} onClick={addMember}>{editingMember!==null?'Update':'Add'}</button></div><ul>{members.map((m,i)=><li key={i} style={{margin:'10px 0'}}><b>{m.name}</b> • 📞 {m.phone||'N/A'} <button onClick={()=>editMember(i)}>Edit</button> <button onClick={()=>removeMember(i)}>Delete</button></li>)}</ul></div>}

{tab==='budget' && <div style={card}><h2 style={{fontSize:32,margin:'0 0 8px 0'}}>💰 Total Budget: ${totalBudget}</h2><h3 style={{color:'#2563eb',marginTop:0}}>Per Person Split: ${split}</h3><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><select style={input} value={expenseTitle} onChange={e=>setExpenseTitle(e.target.value)}><option value=''>Select Category</option><option>Stay</option><option>Food</option><option>Activities</option><option>Fuel</option><option>Other</option></select><input style={input} placeholder='Amount' value={expenseAmount} onChange={e=>setExpenseAmount(e.target.value)}/><button style={btn} onClick={addExpense}>Add</button></div><div style={{marginTop:16,padding:16,background:'#eff6ff',borderRadius:16}}><b>Automatic Split for {members.length} People</b><div style={{marginTop:8}}>{Object.entries(categoryTotals).map(([k,v])=><div key={k}>{k}: ${v} total → ${members.length ? (v/members.length).toFixed(2):0} each</div>)}</div></div><ul>{expenses.map((e,i)=><li key={i} style={{margin:'10px 0'}}>{e.title} - ${e.amount} <button onClick={()=>removeExpense(i)}>Delete</button></li>)}</ul></div>}

{tab==='photos' && <div style={card}><input type='file' multiple accept='image/*' onChange={upload}/><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginTop:16}}>{photos.map((p,i)=><div key={i}><img src={p} style={{width:'100%',height:140,objectFit:'cover',borderRadius:12}}/><button onClick={()=>removePhoto(i)}>Delete</button></div>)}</div></div>}

{tab==='stay' && <div style={card}><h2>🏡 Stay</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Place' value={stayPlace} onChange={e=>setStayPlace(e.target.value)}/><input style={input} placeholder='Day/Month' value={stayDate} onChange={e=>setStayDate(e.target.value)}/><input style={input} placeholder='Time' value={stayTime} onChange={e=>setStayTime(e.target.value)}/><button style={btn} onClick={addStay}>Add</button></div>{stay.map((s,i)=><p key={i}>{s.place} • {s.date} • {s.time} <button onClick={()=>removeStay(i)}>Delete</button></p>)}</div>}

{tab==='cars' && <div style={card}><h2>🚗 Car Plan</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Driver' value={carDriver} onChange={e=>setCarDriver(e.target.value)}/><input style={input} placeholder='Seats' value={carSeats} onChange={e=>setCarSeats(e.target.value)}/><input style={input} placeholder='Passengers' value={carPassengers} onChange={e=>setCarPassengers(e.target.value)}/><button style={btn} onClick={addCar}>Add</button></div>{cars.map((c,i)=><p key={i}>{c.driver} • Seats {c.seats} • Passengers: {c.passengers} <button onClick={()=>removeCar(i)}>Delete</button></p>)}</div>}

{tab==='timeline' && <div style={card}><h2>🕒 Trip Timeline</h2><button style={btn} onClick={addTimeline}>Add Row</button>{timeline.map((t,i)=><p key={i}><b>{t.time}</b> - {t.task} <button onClick={()=>removeTimeline(i)}>Delete</button></p>)}</div>}

{tab==='comments' && <div style={card}><h2>💬 Comments</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Name' value={commentName} onChange={e=>setCommentName(e.target.value)}/><input style={input} placeholder='Write comment' value={commentText} onChange={e=>setCommentText(e.target.value)}/><button style={btn} onClick={addComment}>Add</button></div>{comments.map((c,i)=><p key={i}><b>{c.name}:</b> {c.text} <button onClick={()=>removeComment(i)}>Delete</button></p>)}</div>}

{tab==='guide' && <div style={card}><h2>🗺️ Travel Dashboard</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}><div style={{padding:16,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}><h3>📍 Beautiful Spots</h3><p>Sky Bridge 🌄</p><p>Natural Bridge 🪨</p><p>Chimney Top Rock 📸</p><p>Princess Arch 🥾</p></div><div style={{padding:16,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}><h3>🧭 Live GPS Maps</h3><p>{location.status}</p><p><a href={location.lat ? `https://www.google.com/maps/dir/${location.lat},${location.lng}/Red+River+Gorge+Kentucky` : 'https://maps.google.com/?q=Red+River+Gorge+Kentucky'} target='_blank'>🚗 Navigate to Red River Gorge</a></p><p><a href='https://maps.google.com/?q=Sky+Bridge+Kentucky' target='_blank'>🌄 Drive to Sky Bridge</a></p><p><a href='https://maps.google.com/?q=Natural+Bridge+Kentucky' target='_blank'>🪨 Drive to Natural Bridge</a></p><p><a href='https://maps.google.com/?q=gas+station+near+Red+River+Gorge' target='_blank'>⛽ Nearby Gas</a></p></div><div style={{padding:16,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}><h3>🌦️ Live Weather</h3><p>Location: Slade, KY</p><p>{weather.temp} • {weather.desc}</p><p>Humidity {weather.humidity} • Wind {weather.wind}</p></div><div style={{padding:16,background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}><h3>📸 Luxury Experiences</h3><p>Sunrise photography session</p><p>Cabin hot tub night</p><p>Scenic helicopter inquiry</p></div></div></div>}

{tab==='assistant' && <div style={card}><h2>🤖 AI Travel Assistant</h2><button style={btn} onClick={startVoice}>{listening ? '🎤 Listening...' : '🎤 Start Voice Command'}</button><p style={{marginTop:14}}>{aiTip}</p><div style={{marginTop:12,padding:16,background:'#eff6ff',borderRadius:16}}><p>📍 Best Photo Spot Now: Sky Bridge at sunset</p><p>🍔 Food Stop: Miguel's Pizza nearby</p><p>🌧 Rain Alert: Check weather before hiking</p><p>⛽ Gas Tip: Fill up in Slade before trails</p><p>🎙 Try saying: weather / budget / photo spot / take me there</p></div></div>}

{tab==='emergency' && <div style={card}><h2>🚨 Emergency Contacts</h2><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><input style={input} placeholder='Name' value={emName} onChange={e=>setEmName(e.target.value)}/><input style={input} placeholder='Phone' value={emPhone} onChange={e=>setEmPhone(e.target.value)}/><select style={input} value={emType} onChange={e=>setEmType(e.target.value)}><option>Friend</option><option>Family</option><option>Hospital</option><option>Police</option><option>Roadside</option></select><button style={btn} onClick={addEmergency}>Add</button></div>{emergencyContacts.map((c,i)=><p key={i}><b>{c.name}</b> • {c.type} • 📞 <a href={`tel:${c.phone}`}>{c.phone}</a> <button onClick={()=>removeEmergency(i)}>Delete</button></p>)}<div style={{marginTop:14,padding:14,background:'#fee2e2',borderRadius:16}}><p>📍 In emergency use Guide tab for GPS route.</p><p>🏥 Nearest hospital listed above.</p></div></div>}

{tab==='public' && <div style={card}><h2>🌍 Social Travel Lounge</h2><p>Members: {members.length} • Budget ${totalBudget} • Split ${split}</p><div style={{display:'flex',gap:10,flexWrap:'wrap',margin:'14px 0'}}><input style={input} placeholder='Your name' value={postName} onChange={e=>setPostName(e.target.value)}/><input style={input} placeholder='Share update...' value={postText} onChange={e=>setPostText(e.target.value)}/><button style={btn} onClick={addPost}>Post</button></div><div style={{display:'grid',gap:12}}>{publicPosts.map((p,i)=><div key={i} style={{padding:16,background:'#fff',borderRadius:18,border:'1px solid #e5e7eb'}}><b>{p.name}</b><p style={{margin:'8px 0'}}>{p.text}</p><div style={{display:'flex',gap:10}}><button onClick={()=>likePost(i)}>❤️ {p.likes}</button><button onClick={()=>removePost(i)}>Delete</button></div></div>)}</div><div style={{marginTop:16,padding:16,background:'#eff6ff',borderRadius:16}}>Live social feed for trip members. Share plans, ETA, cabin updates, hiking ideas, photos, and meetups.</div></div>}

<div style={{position:'fixed',bottom:0,left:0,right:0,backdropFilter:'blur(18px)',background:'rgba(15,23,42,0.78)',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',justifyContent:'space-around',padding:'12px 8px',zIndex:50}}>{[['people','👥'],['budget','💰'],['guide','🗺️'],['assistant','🤖'],['public','🌍']].map(([k,icon])=><button key={k} onClick={()=>setTab(k)} style={{background:'transparent',border:0,color:'#fff',fontSize:24,opacity:tab===k?1:0.6}}>{icon}</button>)}</div><div style={{marginTop:40,padding:'10px 0',textAlign:'center',color:'#e2e8f0',fontSize:13,fontWeight:700}}>Built by Vikesh • @vikesh-2026</div>
</div>
}
