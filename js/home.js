// ===== Nest: landing page, matches section =====
// Profile cards, filters, pagination, profile modal and saved roommates.
// Other sections (hero match meter, navbar) can add their code below.

// ----- Fictional roommate profiles -----
const PROFILES = [
  { id: 1, name: "Maya Chen", major: "Computer Science", year: "Junior", budget: 1100, moveIn: "Sep 1", match: 92, color: "#5B6CFF",
    room: "images/room-1.jpg", roomCaption: "Maya's desk after dark, city lights and one lamp for late-night coding.",
    tags: ["night", "quiet"], bio: "Codes late, sleeps in on weekends, and will absolutely label the fridge shelves.",
    habits: [["🌙", "Night owl", "Usually asleep after 1 AM"], ["🧹", "Spotless", "Cleans the kitchen the same night"], ["🎧", "Quiet", "Headphones on, door closed"]] },
  { id: 2, name: "Priya Nair", major: "Data Science", year: "Grad", budget: 1250, moveIn: "Aug 15", match: 88, color: "#2BB59A",
    room: "images/room-2.jpg", roomCaption: "Priya's bedroom, bright and calm, with her favorite bird of paradise plant.",
    tags: ["early", "quiet"], bio: "Morning runner and serious plant parent. Looking for a calm place to come home to.",
    habits: [["☀️", "Early bird", "Up by 6:30 AM"], ["🪴", "Plant parent", "Brings 14 plants, waters them herself"], ["🎧", "Quiet", "Prefers low noise after 10 PM"]] },
  { id: 3, name: "Jordan Reyes", major: "Business", year: "Senior", budget: 1000, moveIn: "Sep 1", match: 85, color: "#F36F8F",
    room: "images/room-3.jpg", roomCaption: "The kitchen Jordan cooks Sunday dinners in, with room for everyone at the island.",
    tags: ["early", "social"], bio: "Cooks big Sunday dinners and always makes extra. Friends over most weekends.",
    habits: [["☀️", "Early bird", "Up by 7 AM for the gym"], ["🍳", "Cooks a lot", "Happy to share groceries"], ["🎉", "Social", "Guests most weekends"]] },
  { id: 4, name: "Zara Ahmed", major: "Biology", year: "Sophomore", budget: 950, moveIn: "Sep 1", match: 83, color: "#E8A317",
    room: "images/room-4.jpg", roomCaption: "Biscuit, Zara's very relaxed cat, taking over the bed.",
    tags: ["early", "quiet"], bio: "Pre-med with a very relaxed cat named Biscuit. Studies at home most evenings.",
    habits: [["☀️", "Early bird", "Asleep by 11 PM"], ["🐱", "Has a cat", "One indoor cat, very chill"], ["🎧", "Quiet", "Library voice at home"]] },
  { id: 5, name: "Aisha Bello", major: "Nursing", year: "Sophomore", budget: 900, moveIn: "Aug 20", match: 81, color: "#7A5CC7",
    room: "images/room-5.jpg", roomCaption: "Aisha's bedroom, simple and tidy with a warm reading lamp.",
    tags: ["early", "quiet"], bio: "Clinical shifts start early, so quiet nights matter. Neat, organized, and friendly.",
    habits: [["☀️", "Early bird", "Leaves at 6 AM for shifts"], ["🧹", "Spotless", "Weekly cleaning schedule"], ["🎧", "Quiet", "No loud music at night"]] },
  { id: 6, name: "Elena Rossi", major: "Design", year: "Junior", budget: 1150, moveIn: "Sep 1", match: 77, color: "#D9534F",
    room: "images/room-6.jpg", roomCaption: "Elena's studio corner, full of paints, brushes and half-finished sketches.",
    tags: ["night", "social"], bio: "Paints late into the night and hosts the occasional pasta night for the studio crew.",
    habits: [["🌙", "Night owl", "Most creative after midnight"], ["🍝", "Cooks a lot", "Pasta from scratch, often"], ["🎉", "Social", "Small dinners a few times a month"]] },
  { id: 7, name: "Leo Park", major: "Music", year: "Senior", budget: 1050, moveIn: "Aug 25", match: 74, color: "#3A86FF",
    room: "images/room-7.jpg", roomCaption: "Leo's practice corner, with his guitar, records and a stool for jamming.",
    tags: ["night", "social"], bio: "Jazz guitarist. Practices with a silent pickup at home, plays loud only at gigs.",
    habits: [["🌙", "Night owl", "Gigs end around 1 AM"], ["🎸", "Musician", "Practices with headphones"], ["🎉", "Social", "Bandmates over sometimes"]] },
  { id: 8, name: "Noah Kim", major: "Economics", year: "Junior", budget: 1200, moveIn: "Sep 1", match: 72, color: "#2E9E6A",
    room: "images/room-8.jpg", roomCaption: "The home gym where Noah starts every morning at 6 AM.",
    tags: ["early"], bio: "Gym at 6, class at 9, asleep by 11. Very predictable, very tidy.",
    habits: [["☀️", "Early bird", "Gym at 6 AM"], ["🧹", "Spotless", "Makes his bed every day"], ["🏋️", "Fitness", "Meal preps on Sundays"]] },
  { id: 9, name: "Sam Okafor", major: "Mechanical Engineering", year: "Grad", budget: 1000, moveIn: "Aug 15", match: 69, color: "#FF8C42",
    room: "images/room-9.jpg", roomCaption: "Sam's gaming setup, neon lights and good headphones included.",
    tags: ["night", "quiet"], bio: "Late-night gamer with good headphones. Respects closed doors and shared shelves.",
    habits: [["🌙", "Night owl", "Up until 2 AM most nights"], ["🎮", "Gamer", "Headphones always"], ["🎧", "Quiet", "Rarely has guests"]] }
];

const PER_PAGE = 6;
let currentFilter = "all";
let currentPage = 1;
const saved = new Set();

const grid = document.getElementById("profileGrid");
const pagination = document.getElementById("profilePagination");
const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("nestToast"), { delay: 3000 });

// ----- Helpers -----

function initials(name) {
  return name.split(" ").map((part) => part[0]).join("");
}

function showToast(message) {
  document.getElementById("nestToastBody").textContent = message;
  toast.show();
}

function filteredProfiles() {
  if (currentFilter === "all") return PROFILES;
  return PROFILES.filter((p) => p.tags.includes(currentFilter));
}

// ----- Profile cards -----

function cardHTML(p) {
  const isSaved = saved.has(p.id);
  const badges = p.habits.map(([icon, label, tip]) =>
    `<span class="badge habit-badge" data-bs-toggle="tooltip" data-bs-title="${tip}" tabindex="0">${icon} ${label}</span>`
  ).join("");

  return `
    <div class="col-md-6 col-lg-4">
      <article class="card profile-card h-100">
        <div class="card-body d-flex flex-column">
          <div class="d-flex align-items-center gap-3 mb-3">
            <span class="avatar" style="background:${p.color}" aria-hidden="true">${initials(p.name)}</span>
            <div>
              <h3 class="card-title h5 mb-0">${p.name}</h3>
              <p class="small text-body-secondary mb-0">${p.major}, ${p.year}</p>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-1 mb-3">${badges}</div>
          <div class="d-flex justify-content-between small mb-1">
            <span>Match</span><strong>${p.match}%</strong>
          </div>
          <div class="progress match-progress mb-3" role="progressbar" aria-label="${p.name} match" aria-valuenow="${p.match}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" style="width:${p.match}%"></div>
          </div>
          <p class="small mb-3">Budget up to <strong>$${p.budget.toLocaleString()}</strong> a month, moving in ${p.moveIn}</p>
          <div class="d-flex gap-2 mt-auto">
            <button type="button" class="btn btn-nest flex-grow-1" data-bs-toggle="modal" data-bs-target="#profileModal" data-profile="${p.id}">View profile</button>
            <button type="button" class="btn ${isSaved ? "btn-warning" : "btn-outline-nest"} save-btn" data-save="${p.id}" aria-pressed="${isSaved}">${isSaved ? "Saved" : "Save"}</button>
          </div>
        </div>
      </article>
    </div>`;
}

function renderProfiles() {
  // Clean up old tooltips before replacing the cards
  grid.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    const tip = bootstrap.Tooltip.getInstance(el);
    if (tip) tip.dispose();
  });

  const list = filteredProfiles();
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  if (currentPage > pages) currentPage = pages;

  const start = (currentPage - 1) * PER_PAGE;
  grid.innerHTML = list.slice(start, start + PER_PAGE).map(cardHTML).join("");

  grid.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
  renderPagination(pages);
}

function renderPagination(pages) {
  if (pages <= 1) { pagination.innerHTML = ""; return; }
  let html = `<li class="page-item ${currentPage === 1 ? "disabled" : ""}"><button class="page-link" data-page="${currentPage - 1}" aria-label="Previous page">Previous</button></li>`;
  for (let i = 1; i <= pages; i++) {
    html += `<li class="page-item ${i === currentPage ? "active" : ""}"><button class="page-link" data-page="${i}" ${i === currentPage ? 'aria-current="page"' : ""}>${i}</button></li>`;
  }
  html += `<li class="page-item ${currentPage === pages ? "disabled" : ""}"><button class="page-link" data-page="${currentPage + 1}" aria-label="Next page">Next</button></li>`;
  pagination.innerHTML = html;
}

pagination.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-page]");
  if (!btn || btn.parentElement.classList.contains("disabled")) return;
  currentPage = Number(btn.dataset.page);
  renderProfiles();
  document.getElementById("matches").scrollIntoView({ behavior: "smooth" });
});

// Filter pills
document.getElementById("filterPills").addEventListener("click", (event) => {
  const pill = event.target.closest("[data-filter]");
  if (!pill) return;
  document.querySelectorAll("#filterPills .nav-link").forEach((el) => el.classList.remove("active"));
  pill.classList.add("active");
  currentFilter = pill.dataset.filter;
  currentPage = 1;
  renderProfiles();
});

// ----- Saving (toast + offcanvas list group) -----

function renderSaved() {
  const list = document.getElementById("savedList");
  const people = PROFILES.filter((p) => saved.has(p.id));
  // The saved count badge lives in the navbar, so it may not be on the page yet
  const count = document.getElementById("savedCount");
  if (count) count.textContent = people.length;
  document.getElementById("savedEmpty").classList.toggle("d-none", people.length > 0);
  list.innerHTML = people.map((p) => `
    <li class="list-group-item d-flex align-items-center gap-3">
      <span class="avatar avatar-sm" style="background:${p.color}" aria-hidden="true">${initials(p.name)}</span>
      <div class="flex-grow-1">
        <div class="fw-semibold">${p.name}</div>
        <div class="small text-body-secondary">${p.match}% match</div>
      </div>
      <button type="button" class="btn btn-sm btn-outline-secondary" data-unsave="${p.id}">Remove</button>
    </li>`).join("");
}

function toggleSave(id) {
  const person = PROFILES.find((p) => p.id === id);
  if (saved.has(id)) {
    saved.delete(id);
    showToast(`Removed ${person.name.split(" ")[0]} from saved.`);
  } else {
    saved.add(id);
    showToast(`Saved ${person.name.split(" ")[0]}. Find them under Saved.`);
  }
  renderSaved();
  renderProfiles();
}

grid.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-save]");
  if (btn) toggleSave(Number(btn.dataset.save));
});

document.getElementById("savedList").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-unsave]");
  if (btn) toggleSave(Number(btn.dataset.unsave));
});

// ----- Profile modal -----

let modalPerson = null;

document.getElementById("profileModal").addEventListener("show.bs.modal", (event) => {
  const id = Number(event.relatedTarget.dataset.profile);
  const p = PROFILES.find((person) => person.id === id);
  modalPerson = p;

  const avatar = document.getElementById("modalAvatar");
  avatar.textContent = initials(p.name);
  avatar.style.background = p.color;
  document.getElementById("profileModalTitle").textContent = p.name;
  document.getElementById("modalMeta").textContent = `${p.major}, ${p.year}`;
  const roomImg = document.getElementById("modalRoomImg");
  roomImg.src = p.room;
  roomImg.alt = `${p.name}'s room`;
  document.getElementById("modalRoomCaption").textContent = p.roomCaption;
  document.getElementById("modalBio").textContent = p.bio;
  document.getElementById("modalFacts").innerHTML =
    p.habits.map(([icon, label, tip]) => `<li class="list-group-item"><span aria-hidden="true">${icon}</span> <strong>${label}</strong>: ${tip}</li>`).join("") +
    `<li class="list-group-item"><span aria-hidden="true">💵</span> <strong>Budget</strong>: up to $${p.budget.toLocaleString()} a month</li>
     <li class="list-group-item"><span aria-hidden="true">📦</span> <strong>Move-in</strong>: ${p.moveIn}</li>`;

  const bar = document.getElementById("modalMatchBar");
  bar.style.width = `${p.match}%`;
  bar.textContent = `${p.match}%`;
  document.getElementById("modalMatch").setAttribute("aria-valuenow", p.match);
});

document.getElementById("sayHelloBtn").addEventListener("click", () => {
  bootstrap.Modal.getInstance(document.getElementById("profileModal")).hide();
  showToast(`Hello sent to ${modalPerson.name.split(" ")[0]}. You'll get a reply in your Nest inbox.`);
});

// ----- Start -----

renderProfiles();
renderSaved();


// === Navbar: greeting and sign out (Neelaveni) ===

function setGreeting() {
  let name = null;
  try { name = sessionStorage.getItem("nestUser"); } catch (e) { /* storage unavailable */ }
  document.getElementById("userGreeting").textContent = name ? `Hi, ${name}` : "Hi there";
}

document.getElementById("logoutLink").addEventListener("click", (event) => {
  event.preventDefault();
  try { sessionStorage.removeItem("nestUser"); } catch (e) { /* storage unavailable */ }
  window.location.href = "index.html";
});

setGreeting();


const MAYA = { bedtime: "night", tidy: "neat", guests: "rare" };

function updateMeter() {
  let score = 10;
  ["bedtime", "tidy", "guests"].forEach((question) => {
    const picked = document.querySelector(`input[name="${question}"]:checked`);
    if (picked && picked.value === MAYA[question]) score += 30;
  });

  // Light up windows in proportion to the score (6 windows)
  const windows = document.querySelectorAll("#houseWindows .window");
  const litCount = Math.round((score / 100) * windows.length);
  windows.forEach((w, i) => w.classList.toggle("lit", i < litCount));

  document.getElementById("matchScore").textContent = score;

  let text = "match with Maya";
  if (score === 100) text = "match. Maya would love living with you.";
  else if (score >= 70) text = "match. One small thing to talk about.";
  document.getElementById("matchText").textContent = text;
}

document.querySelectorAll(".meter-card .btn-check").forEach((input) => {
  input.addEventListener("change", updateMeter);
});

updateMeter();