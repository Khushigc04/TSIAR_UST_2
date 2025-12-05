document.addEventListener("DOMContentLoaded", () => {
  console.log("MATCH.JS ACTIVE");

  const matches = JSON.parse(localStorage.getItem("matches") || "[]");
  const addMatchBtn = document.getElementById("addMatchBtn");
  const matchContainer = document.getElementById("matchContainer");

  /* ---------------- CALENDAR ---------------- */
  const calendarPopup = document.getElementById("calendarPopup");
  let calendarInput = null, calMonth, calYear;

  function openCalendar(input) {
    calendarInput = input;
    const rect = input.getBoundingClientRect();
    calendarPopup.style.left = `${rect.left + window.scrollX}px`;
    calendarPopup.style.top = `${rect.bottom + window.scrollY + 4}px`;
    calendarPopup.style.display = "block";
    const today = new Date();
    calMonth = today.getMonth();
    calYear = today.getFullYear();
    buildCalendar();
  }
  function buildCalendar() {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const first = new Date(calYear, calMonth, 1).getDay();
    const last = new Date(calYear, calMonth + 1, 0).getDate();
    let html = `
      <div class="calendar-header">
        <button id="prevCal">‹</button>${monthNames[calMonth]} ${calYear}<button id="nextCal">›</button>
      </div>
      <div class="calendar-grid">
        ${["S","M","T","W","T","F","S"].map(d=>`<div class="calendar-day">${d}</div>`).join("")}
    `;
    for (let i=0;i<first;i++) html += "<div></div>";
    for (let d=1;d<=last;d++) html += `<div class="calendar-date" data-d="${d}">${d}</div>`;
    html += "</div>";
    calendarPopup.innerHTML = html;
    document.getElementById("prevCal").onclick=()=>{ calMonth--; if(calMonth<0){calMonth=11; calYear--;} buildCalendar(); };
    document.getElementById("nextCal").onclick=()=>{ calMonth++; if(calMonth>11){calMonth=0; calYear++;} buildCalendar(); };
    calendarPopup.querySelectorAll(".calendar-date").forEach(e=>{
      e.onclick=()=>{
        const d=e.dataset.d;
        calendarInput.value=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        calendarPopup.style.display="none";
      };
    });
  }
  document.addEventListener("click", e=>{
    if(!calendarPopup.contains(e.target) && !e.target.classList.contains("date-input"))
      calendarPopup.style.display="none";
  });

  /* ---------------- TIME PICKER ---------------- */
  const timePopup=document.getElementById("timePickerPopup");
  const display=document.getElementById("timePickerDisplay");
  const analog=document.getElementById("analogClock");
  const hourHand=document.getElementById("hourHand");
  const minuteHand=document.getElementById("minuteHand");
  const numbers=document.getElementById("clockNumbers");
  const hourBtn=document.getElementById("modeHourBtn");
  const minBtn=document.getElementById("modeMinuteBtn");
  const amBtn=document.getElementById("amBtn");
  const pmBtn=document.getElementById("pmBtn");
  const setTimeBtn=document.getElementById("timePickerSetBtn");

  let timeInput=null, selectedHour=12, selectedMin=0, ampm="AM", mode="hour";
  const two=n=>String(n).padStart(2,"0");

  for(let n=1;n<=12;n++){
    const ang=(Math.PI/6)*(n-3), x=120+85*Math.cos(ang), y=120+85*Math.sin(ang);
    numbers.innerHTML += `<text x="${x}" y="${y}" fill="white" font-size="20" text-anchor="middle" alignment-baseline="middle">${n}</text>`;
  }
  function updateClock(){
    hourHand.setAttribute("transform",`rotate(${(selectedHour%12)*30+selectedMin*0.5} 120 120)`);
    minuteHand.setAttribute("transform",`rotate(${selectedMin*6} 120 120)`);
    display.textContent=`${two(selectedHour)}:${two(selectedMin)} ${ampm}`;
  }
  analog.onclick=e=>{
    const r=analog.getBoundingClientRect();
    const x=e.clientX-r.left-120, y=e.clientY-r.top-120;
    let ang=Math.atan2(y,x)*180/Math.PI; ang=(ang+360+90)%360;
    if(mode==="hour"){ let h=Math.round(ang/30); if(h===0)h=12; selectedHour=h; }
    else selectedMin=Math.round(ang/6)%60;
    updateClock();
  };
  hourBtn.onclick=()=>{ mode="hour"; hourBtn.classList.add("active"); minBtn.classList.remove("active"); };
  minBtn.onclick=()=>{ mode="minute"; minBtn.classList.add("active"); hourBtn.classList.remove("active"); };
  amBtn.onclick=()=>{ ampm="AM"; amBtn.classList.add("active"); pmBtn.classList.remove("active"); updateClock(); };
  pmBtn.onclick=()=>{ ampm="PM"; pmBtn.classList.add("active"); amBtn.classList.remove("active"); updateClock(); };
  setTimeBtn.onclick=()=>{ timeInput.value=display.textContent; timePopup.style.display="none"; };
  function openClock(input){
    timeInput=input;
    const r=input.getBoundingClientRect();
    timePopup.style.left=`${r.left+window.scrollX}px`;
    timePopup.style.top=`${r.bottom+window.scrollY+4}px`;
    timePopup.style.display="block";
  }
  document.addEventListener("click",e=>{
    if(!timePopup.contains(e.target) && !e.target.classList.contains("time-input") && e.target.textContent!=="🕒")
      timePopup.style.display="none";
  });

  /* ---------------- MATCH SYSTEM ---------------- */
  function save(){ localStorage.setItem("matches",JSON.stringify(matches)); }

  function render() {
    matchContainer.innerHTML = "";
    matches.forEach((m,i)=>{
      matchContainer.insertAdjacentHTML("beforeend",`
        <div class="match-card p-3 border border-warning rounded mb-4">

          <div class="d-flex justify-content-between mb-2">
            <h5 class="fw-bold text-warning">Match #${i+1}</h5>
            <button class="btn btn-danger btn-sm delMatch" data-i="${i}">Remove</button>
          </div>

          <div class="match-label">Sport</div>
          <input class="form-control sport mb-2" value="${m.sport||""}">

          <div class="row">
            <div class="col-md-6">
              <div class="match-label">Team 1 Name</div>
              <input class="form-control team1 mb-2" value="${m.team1||""}">
            </div>
            <div class="col-md-6">
              <div class="match-label">Team 2 Name</div>
              <input class="form-control team2 mb-2" value="${m.team2||""}">
            </div>
          </div>

          <div class="match-label">Venue</div>
          <input class="form-control venue mb-2" value="${m.venue||""}">

          <div class="row">
            <div class="col-md-6">
              <div class="match-label">Date</div>
              <input class="form-control date-input mb-2" value="${m.date||""}" placeholder="Select date" readonly>
            </div>
            <div class="col-md-6">
              <div class="match-label">Time</div>
              <div class="input-group mb-2">
                <input class="form-control time-input" placeholder="Select time" value="${m.time||""}" readonly>
                <span class="input-group-text" style="cursor:pointer;">🕒</span>
              </div>
            </div>
          </div>

          <div class="match-label">Status</div>
          <select class="form-select status mb-3">
            <option value="live" ${m.status==="live"?"selected":""}>Live</option>
            <option value="finished" ${m.status==="finished"?"selected":""}>Finished</option>
          </select>

          <div class="text-end">
            <button class="btn btn-success saveMatch" data-i="${i}">Save / Schedule</button>
          </div>
        </div>
      `);
    });

    document.querySelectorAll(".date-input").forEach(i=>i.onclick=()=>openCalendar(i));
    document.querySelectorAll(".time-input").forEach(i=>{
      const icon=i.closest(".input-group").querySelector(".input-group-text");
      icon.onclick=()=>openClock(i);
      i.onclick=()=>openClock(i);
    });

    document.querySelectorAll(".saveMatch").forEach(btn=>{
      btn.onclick=()=>{
        const i=btn.dataset.i;
        const c=btn.closest(".match-card");
        const d=c.querySelector(".date-input").value;
        const t=c.querySelector(".time-input").value;

        matches[i]={
          sport:c.querySelector(".sport").value,
          team1:c.querySelector(".team1").value,
          team2:c.querySelector(".team2").value,
          venue:c.querySelector(".venue").value,
          date:d, time:t,
          datetime:d+" "+t.replace(/AM|PM/,"").trim(),
          status:c.querySelector(".status").value
        };
        save(); render();
      };
    });

    document.querySelectorAll(".delMatch").forEach(btn=>{
      btn.onclick=()=>{ matches.splice(btn.dataset.i,1); save(); render(); };
    });
  }

  addMatchBtn.onclick = () => {
    matches.push({ sport:"", team1:"", team2:"", venue:"", date:"", time:"", datetime:"", status:"finished" });
    save(); render();
  };

  render();
});
