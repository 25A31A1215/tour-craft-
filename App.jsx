import React, {useMemo, useState} from "react";
import {
  Search, MapPin, Sparkles, Home, Compass, CalendarDays, UserRound,
  ChevronRight, ChevronDown, ChevronLeft, Plus, Minus, Car, Bus,
  TrainFront, Plane, Bike, Footprints, Heart, Utensils, Hotel,
  Ticket, Phone, Share2, Navigation, Clock3, Star, SlidersHorizontal,
  ShieldAlert, WalletCards, Globe2, ShoppingBag, X, Check, Send,
  ArrowRight, RotateCcw
} from "lucide-react";
import {places, rishikeshPlaces, itinerary, states} from "./data";

const img = p => p.img;

function deriveName(email){
  const local=(email||"traveller").split("@")[0].replace(/[._-]+/g," ");
  return local.split(" ").filter(Boolean).map(x=>x[0].toUpperCase()+x.slice(1).toLowerCase()).join(" ") || "Traveller";
}

export default function App(){
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem("tourcraft-user")||"null"));
  const [page,setPage]=useState(user?"home":"login");
  const [trip,setTrip]=useState({region:"India",month:"September",budget:10000,days:5,travellers:1,transport:"Car",interests:["Adventure","Mountains"],destination:"Rishikesh"});
  const [selectedTrip,setSelectedTrip]=useState("rishikesh");
  const [toast,setToast]=useState("");
  const [profileModal,setProfileModal]=useState(null);

  const notify=(m)=>{setToast(m);setTimeout(()=>setToast(""),2200)};
  const login=(email,password)=>{
    if(!email||!password){notify("Enter email and password");return}
    const u={name:deriveName(email),email};
    localStorage.setItem("tourcraft-user",JSON.stringify(u)); setUser(u); setPage("home");
  };
  const logout=()=>{localStorage.removeItem("tourcraft-user");setUser(null);setPage("login")};

  if(!user) return <Login onLogin={login}/>;

  const nav=(p)=>{setPage(p); window.scrollTo({top:0,behavior:"smooth"})};

  return <div className="app">
    <main className="screen">
      {page==="home" && <HomePage user={user} trip={trip} setTrip={setTrip} nav={nav} notify={notify}/>}
      {page==="inspire" && <InspirePage trip={trip} setTrip={setTrip} nav={nav}/>}
      {page==="plan" && <PlanPage trip={trip} setTrip={setTrip} nav={nav} notify={notify}/>}
      {page==="results" && <ResultsPage trip={trip} setTrip={setTrip} nav={nav} notify={notify}/>}
      {page==="tripdetail" && <TripDetail trip={trip} nav={nav} notify={notify}/>}      {page.startsWith("day") && <DayPage day={Number(page.replace("day",""))} nav={nav} notify={notify}/>}
      {page==="explore" && <ExplorePage nav={nav}/>}
      {page==="bookings" && <BookingsPage nav={nav}/>}
      {page==="trips" && <TripsPage nav={nav} setSelectedTrip={setSelectedTrip}/>}
      {page==="profile" && <ProfilePage user={user} nav={nav} setProfileModal={setProfileModal} logout={logout}/>}
      {page==="emergency" && <EmergencyPage nav={nav}/>}
    </main>
    {page!=="login" && <BottomNav page={page} nav={nav}/>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    {profileModal && <Modal title={profileModal} onClose={()=>setProfileModal(null)}>
      {profileModal==="Default currency" && <div className="option-list">{["INR","USD","EUR","GBP","AED","JPY"].map(x=><button key={x} onClick={()=>{setProfileModal(null);notify("Currency set to "+x)}}>{x}{x==="INR"&&<Check size={16}/>}</button>)}</div>}
      {profileModal!=="Default currency" && <p className="muted">This setting is ready for the next preference you choose.</p>}
    </Modal>}
  </div>
}

function Login({onLogin}){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  return <div className="login-page">
    <div className="login-card">
      <div className="brand big">TOURCRAFT</div>
      <h1>Plan your perfect trip</h1>
      <p className="muted">Smart travel planning, places, stays and a day-by-day itinerary.</p>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="ram@gmail.com"/></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></label>
      <button className="primary wide" onClick={()=>onLogin(email,password)}><Sparkles size={17}/> Continue</button>
      <div className="demo-note">Tip: use any email and password. Your name is created from the email automatically.</div>
    </div>
  </div>
}

function Header({back,title,nav,right}){
  return <header className="header">{back?<button className="icon-btn" onClick={()=>nav(back)}><ChevronLeft/></button>:<div className="brand">TOURCRAFT</div>}
    <div className="header-title">{title}</div>{right||<div className="avatar-mini">T</div>}</header>
}

function HomePage({user,trip,setTrip,nav,notify}){
  const [q,setQ]=useState("");
  const popular=places.slice(1,4), recommended=places.slice(4,7);
  return <><section className="hero-head"><div><div className="brand">TOURCRAFT</div><h1>Good day, {user.name} 👋</h1><p>Let's craft your perfect tour.</p></div><button className="avatar-mini" onClick={()=>nav("profile")}>{user.name[0]}</button></section>
    <div className="searchbar"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search destinations, cities, attractions..."/><button onClick={()=>notify(q?`Searching for ${q}`:"Try a destination")}><ArrowRight size={17}/></button></div>
    <PromoCards nav={nav}/>
    <section><h2>Where do you want to go?</h2><div className="choice-grid">
      <button className="choice orange" onClick={()=>nav("inspire")}><Sparkles/> <b>Inspire me</b><span>I'm not sure where to go yet</span></button>
      <button className="choice green" onClick={()=>nav("plan")}><Compass/><b>I know where</b><span>Plan around places I choose</span></button>
    </div></section>
    <PlaceRail title="Best places this Year-Round" items={popular} nav={nav}/>
    <PlaceRail title="Recommended for you" items={recommended} nav={nav}/>
    <PlaceRail title="Popular destinations" items={places.slice(6,9)} nav={nav}/>
  </>
}

function PromoCards({nav}){
  return <div className="promo-row"><div className="promo" style={{backgroundImage:`url(${places[0].img})`}}><span>Real places. Real plans.</span><b>Discover hidden places</b><button onClick={()=>nav("inspire")}>Start planning</button></div><div className="promo" style={{backgroundImage:`url(${places[1].img})`}}><span>Spend smarter</span><b>Plan your perfect trip</b><button onClick={()=>nav("plan")}>Start planning</button></div></div>
}

function PlaceRail({title,items,nav}){
  return <section><h2>{title}</h2><div className="rail">{items.map(p=><button className="place-card" key={p.id} onClick={()=>nav("plan")}><img src={img(p)}/><b>{p.name}</b><small>{p.state}</small></button>)}</div></section>
}

function InspirePage({trip,setTrip,nav}){
  return <><Header back="home" title="Inspire me" nav={nav}/><p className="sub">Shape your trip and let TourCraft find the place.</p>
    <FormTrip trip={trip} setTrip={setTrip} simple/>
    <button className="primary wide" onClick={()=>nav("inspire-list")} style={{display:"none"}}>Inspire me</button>
    <GreatFor month={trip.month} nav={nav}/>
  </>
}

function FormTrip({trip,setTrip,simple=false}){
  const toggle=(key,val)=>setTrip(t=>({...t,[key]:t[key]===val?t[key]:val}));
  const toggleArr=(val)=>setTrip(t=>({...t,interests:t.interests.includes(val)?t.interests.filter(x=>x!==val):[...t.interests,val]}));
  const interests=["Nature","Beaches","Mountains","Adventure","History","Culture","Food","Wildlife","Relaxation"];
  return <div className="form-card">
    <Field label="Region"><select value={trip.region} onChange={e=>setTrip(t=>({...t,region:e.target.value}))}><option>India</option><option>International</option></select></Field>
    <Field label="Travel month"><select value={trip.month} onChange={e=>setTrip(t=>({...t,month:e.target.value}))}>{["January","February","March","April","May","June","July","August","September","October","November","December"].map(m=><option key={m}>{m}</option>)}</select></Field>
    <Field label="Approximate budget"><input type="number" value={trip.budget} onChange={e=>setTrip(t=>({...t,budget:+e.target.value}))}/></Field>
    <div className="two-fields"><Counter label="Days" value={trip.days} setValue={v=>setTrip(t=>({...t,days:v}))}/><Counter label="Travellers" value={trip.travellers} setValue={v=>setTrip(t=>({...t,travellers:v}))}/></div>
    <div className="field"><span className="label">Transport</span><div className="chips">{[["Flight",Plane],["Car",Car],["Train",TrainFront],["Bus",Bus],["Cab",Car],["Walking",Footprints]].map(([x,I])=><button className={trip.transport===x?"chip active":"chip"} key={x} onClick={()=>toggle("transport",x)}><I size={14}/>{x}</button>)}</div></div>
    <div className="field"><span className="label">Interests</span><div className="chips">{interests.map(x=><button className={trip.interests.includes(x)?"chip active":"chip"} key={x} onClick={()=>toggleArr(x)}>{x}</button>)}</div></div>
    {!simple && <button className="outline wide"><Search size={15}/> Find places</button>}
    {simple && <button className="primary wide" onClick={()=>{}}><Sparkles size={15}/> Inspire me</button>}
  </div>
}

function GreatFor({month,nav}){
  return <section><h2>Great for {month}</h2>{places.slice(0,5).map(p=><div className="recommend-card" key={p.id}><img src={p.img}/><div><b>{p.name}</b><small>{p.state}</small><p>{p.desc}</p><button className="small-primary" onClick={()=>nav("plan")}>Plan this trip</button></div></div>)}</section>
}

function PlanPage({trip,setTrip,nav,notify}){
  return <><Header back="home" title="Plan your trip" nav={nav}/><div className="budget-strip"><WalletCards size={15}/> {trip.budget}</div>
    <div className="form-card compact"><div className="notice"><Clock3 size={15}/> What time will you arrive or start?</div>
      <Field label="Travel dates"><input type="date" defaultValue="2026-09-20"/><input type="date" defaultValue="2026-09-24"/></Field>
      <div className="field"><span className="label">Transport</span><div className="chips">{["Car","Bus","Train","Flight","Bike"].map(x=><button className={trip.transport===x?"chip active":"chip"} key={x} onClick={()=>setTrip(t=>({...t,transport:x}))}>{x}</button>)}</div></div>
      <div className="field"><span className="label">Quick trips</span><div className="chips"><button className="chip">Weekend escape</button><button className="chip">Culture break</button><button className="chip">Budget adventure</button></div></div>
      <div className="field"><span className="label">Interests</span><div className="chips">{["Nature","Food","Beaches","Culture","Adventure","History","Shopping","Relaxation"].map(x=><button className={trip.interests.includes(x)?"chip active":"chip"} key={x} onClick={()=>setTrip(t=>({...t,interests:t.interests.includes(x)?t.interests.filter(a=>a!==x):[...t.interests,x]}))}>{x}</button>)}</div></div>
      <button className="outline wide" onClick={()=>notify("Places found for your preferences")}><Search size={15}/> Find places</button>
      <button className="primary wide" onClick={()=>nav("results")}><Sparkles size={15}/> Generate my trip</button>
    </div>
  </>
}

function ResultsPage({trip,nav,notify}){
  return <><Header back="plan" title="Plan your trip" nav={nav}/><div className="budget-strip"><WalletCards size={15}/> {trip.budget}</div>
    <section><h3>Search for a place</h3><div className="searchbar"><Search size={15}/><input placeholder="Search for attractions, landmarks, experiences..."/></div></section>
    <section><h3>Places TourCraft recommends</h3>{rishikeshPlaces.slice(0,6).map((x,i)=><div className="result-card" key={x[0]}><img src={places[i%places.length].img}/><div><small>RECOMMENDED</small><b>{x[0]}</b><span>Rishikesh, Uttarakhand, India</span><span>◷ 2.0 hrs</span></div><input type="checkbox"/></div>)}</section>
    <button className="primary wide" onClick={()=>nav("tripdetail")}>Generate trip</button>
  </>
}

function TripDetail({trip,nav,notify}){
  return <><Header back="results" title="Rishikesh" nav={nav}/><div className="trip-cover"><img src={places[0].img}/><b>5 days · from 20 Sep 2026 · 1 traveller</b><h2>Best explored in monsoon</h2><p>Experience the spiritual and adventurous soul of Rishikesh in September, where lush post-monsoon mountain greenery meets roaring rivers, ancient ghats, and tranquil ashrams.</p></div>
    <MapBox/>
    <section><h3>On the Way</h3>{rishikeshPlaces.slice(0,6).map((x,i)=><div className="way-row" key={x[0]}><MapPin size={15}/><div><b>{x[0]}</b><small>attractions · {i?i*0.6:"0.0"} km detour</small></div><button className="link-btn">{i%2?"Add":"Remove"}</button></div>)}</section>
    <section><h3>Must-visit places</h3>{rishikeshPlaces.slice(0,5).map((x,i)=><div className="mini-place" key={x[0]}><img src={places[(i+2)%places.length].img}/><div><b>{x[0]}</b><p>Thrilling and useful for your selected budget style.</p><button className="link-btn">Reviews</button></div></div>)}</section>
    <section><h2>Day-by-day itinerary</h2>{itinerary.map((d,i)=><button className="day-card" key={d.day} onClick={()=>nav("day"+d.day)}><div><b>DAY {d.day} · {d.title}</b><span>{d.date} · {d.stops} stops · {d.travel} travel</span><small>· {d.budget}</small></div><ChevronDown size={17}/></button>)}</section>
    <button className="primary wide" onClick={()=>notify("Trip saved ✓")}>✓ Save trip</button>
    <div className="button-stack"><button onClick={()=>notify("Edit mode ready")}>Edit my itinerary</button><button onClick={()=>notify("Offline copy prepared")}>Download offline</button><button onClick={()=>notify("AI assistant opened")}>Ask AI</button><button onClick={()=>notify("Trip optimized")}>Optimize</button></div>
    <Budget/>
  </>
}

function MapBox(){return <div className="map"><div className="map-fade"><span>Google Maps</span><b>Rishikesh</b><small>Smart route preview</small></div></div>}

function Budget(){
  return <section className="budget-card"><h2>Budget breakdown</h2><p className="muted">AI-planned, supplier prices are verified separately.</p>{[["Transportation","INR 2500"],["Accommodation","INR 4000"],["Food","INR 2200"],["Activities","INR 1150"],["Miscellaneous","INR 500"]].map(x=><div className="budget-line" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}<div className="budget-total"><span>Estimated trip total</span><b>INR 10350</b></div><button className="outline wide">View booking options</button><div className="warning">⚠ Budget is exceeding the available budget by INR 350.</div><h3>AI insights</h3><p>September brings post-monsoon greenery and powerful waterfalls, making it ideal for nature lovers.</p><p>Pack quick-drying clothing and sturdy footwear suitable for short waterfall trails.</p></section>
}

function DayPage({day,nav,notify}){
  const d=itinerary.find(x=>x.day===day)||itinerary[0];
  return <><Header back="tripdetail" title={`DAY ${d.day}`} nav={nav}/><div className="day-head"><span>{d.date}</span><h2>{d.title}</h2><small>{d.stops} stops · {d.travel} travel · {d.budget}</small></div>
    {d.items.map(([time,title,desc],i)=><div className="timeline" key={time+title}><div className="time">{time}</div><div className="dot"></div><div className="timeline-card"><small>{i%3===0?"RECOMMENDATION":"SCHEDULED"}</small><b>{title}</b><p>{desc}</p><button className="outline small" onClick={()=>notify(`Exploring ${title}`)}>Explore</button></div></div>)}
    <button className="primary wide" onClick={()=>notify("Day optimized")}>Optimize my day</button>
  </>
}

function ExplorePage({nav}){
  const [state,setState]=useState("");
  const filtered=state?places.filter(p=>p.state===state):places.slice(0,6);
  return <><Header title="Explore" nav={nav}/><p className="sub">Find places shaped by your season and interests.</p><div className="select-box"><label>STATE TRAVEL</label><select value={state} onChange={e=>setState(e.target.value)}><option value="">Select a state</option>{states.map(s=><option key={s}>{s}</option>)}</select></div><PlaceRail title="Recommended for you" items={filtered.slice(0,6)} nav={nav}/><PlaceRail title="Popular across India" items={places.slice(6,11)} nav={nav}/></>
}

function BookingsPage({nav}){
 const opts=[["Flights","Compare routes and plan your next departure."],["Hotels & Stays","Find a thoughtful place to stay."],["Trains","Explore rail journeys with confidence."],["Buses","Connect cities and regional escapes."],["Cabs","Arrange the last mile of your journey."],["Activities","Turn a destination into a day well spent."],["Holiday Packages","Shape an entire getaway."]];
 return <><Header title="Bookings" nav={nav}/><button className="destination-context" onClick={()=>nav("tripdetail")}><Plus size={15}/> Add a destination context <ChevronRight size={15}/></button><section><h2>Popular booking options</h2><div className="booking-grid">{opts.map(([a,b])=><button className="booking-card" key={a}><Ticket size={18}/><b>{a}</b><span>{b}</span><small>Search / book ↗</small></button>)}</div></section><div className="quick-actions"><b>Quick actions</b><p>Select a category to prepare a provider search.</p></div></>
}

function TripsPage({nav}){
 const t=[["Rishikesh","5 days",places[0].img],["Annavaram","2 days",places[13].img],["Hyderabad","3 days",places[6].img],["Kasol","7 days",places[9].img],["Hampi","4 days",places[4].img],["Pithapuram","1 day",places[13].img]];
 return <><Header title="Your trips" nav={nav}/><p className="sub">Every journey, kept close.</p>{t.map(x=><div className="trip-row" key={x[0]}><img src={x[2]}/><div><b>{x[0]}</b><span>{x[1]} · saved plan</span></div><button className="small-primary" onClick={()=>nav("tripdetail")}>Start Trip</button><span>↗</span></div>)}</>
}

function ProfilePage({user,nav,setProfileModal,logout}){
 const rows=[["User details",user.name],["Travel region","India"],["Travel interests","Adventure, Mountains"],["Default currency","INR"],["Budget style","Budget"],["Travel pace","Balanced"],["Preferred transport","Flexible"]];
 return <><Header title="Profile" nav={nav}/><p className="sub">Your travel preferences and account.</p><div className="profile-head"><div className="avatar-large">{user.name[0]}</div><h2>{user.name}</h2><p>{user.email}</p></div><div className="settings">{rows.map(([a,b],i)=><button key={a} onClick={()=>i===3?setProfileModal(a):null}><span><b>{a}</b><small>{b}</small></span><ChevronRight size={17}/></button>)}</div><button className="emergency-link" onClick={()=>nav("emergency")}><ShieldAlert size={17}/> SOS / Emergency Center<span>Call, share location, and find nearby help</span></button><button className="outline wide" onClick={logout}>Log out</button></>
}

function EmergencyPage({nav}){
 return <><Header back="profile" title="Emergency Center" nav={nav}/><div className="emergency-box"><b>NEED IMMEDIATE HELP?</b><span>Emergency actions require your explicit confirmation.</span><button className="danger"><Phone size={16}/> Call 112</button><button className="danger outline-danger"><Share2 size={16}/> Share location</button></div><section><h3>Verified national contacts</h3>{[["National Emergency","112"],["Police","100"],["Fire","101"],["Ambulance","108"]].map(x=><div className="contact" key={x[0]}><div><b>{x[0]}</b><small>VERIFIED NATIONAL</small></div><strong>{x[1]}</strong></div>)}</section><section className="emergency-form"><h3>Emergency contacts</h3><input placeholder="Phone numbers separated by commas"/><button className="outline wide">Save</button><h3>Emergency number</h3><select><option>India / EU: 112</option></select><h3>Nearby help</h3><div className="chips">{["Hospital","Police","Pharmacy","ATM","Fuel","Railway Station","Airport"].map(x=><button className="chip" key={x}>{x}</button>)}</div></section></>
}

function BottomNav({page,nav}){
 return <nav className="bottom-nav">{[["home","Home",Home],["explore","Explore",Compass],["bookings","Bookings",Ticket],["trips","Trips",CalendarDays],["profile","Profile",UserRound]].map(([p,l,I])=><button className={page===p?"active":""} key={p} onClick={()=>nav(p)}><I size={17}/><span>{l}</span></button>)}</nav>
}

function Field({label,children}){return <label className="field"><span className="label">{label}</span>{children}</label>}
function Counter({label,value,setValue}){return <div className="counter"><span className="label">{label}</span><div><button onClick={()=>setValue(Math.max(1,value-1))}><Minus size={14}/></button><b>{value}</b><button onClick={()=>setValue(value+1)}><Plus size={14}/></button></div></div>}
function Modal({title,onClose,children}){return <div className="modal-backdrop"><div className="modal"><button className="close" onClick={onClose}><X/></button><h2>{title}</h2>{children}</div></div>}

// Dynamic day routes are handled here without adding another router package.
