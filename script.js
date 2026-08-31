// Default Mock Data
const defaultTrip = {
  destination: "Jaipur",
  totalDays: 3,
  budgetTier: "Moderate",
  vibe: "Culture & Heritage",
  itinerary: {
    1: [
      { id: 101, placeName: "Amber Fort", timeSlot: "10:00 AM - 01:00 PM", rating: "⭐ 4.7 / 5", cost: 500, desc: "Historic hilltop fort with majestic palace architecture." },
      { id: 102, placeName: "Hawa Mahal & Local Bazaar", timeSlot: "02:00 PM - 03:30 PM", rating: "⭐ 4.6 / 5", cost: 1200, desc: "Honeycomb facade and shopping at Johari Bazaar." },
      { id: 103, placeName: "Traditional Rajasthani Dinner", timeSlot: "07:00 PM - 09:00 PM", rating: "⭐ 4.8 / 5", cost: 800, desc: "Authentic local dining featuring Dal Baati Churma." }
    ],
    2: [
      { id: 201, placeName: "City Palace", timeSlot: "10:00 AM - 12:30 PM", rating: "⭐ 4.5 / 5", cost: 700, desc: "Royal residence and museum complex in the old city." },
      { id: 202, placeName: "Jantar Mantar", timeSlot: "01:30 PM - 03:00 PM", rating: "⭐ 4.6 / 5", cost: 300, desc: "UNESCO World Heritage astronomical observatory." }
    ],
    3: [
      { id: 301, placeName: "Nahargarh Fort Sunset", timeSlot: "04:30 PM - 07:00 PM", rating: "⭐ 4.8 / 5", cost: 400, desc: "Panoramic sunset view overlooking the entire Pink City." }
    ]
  }
};

// 1. Questionnaire Form Submission
const plannerForm = document.getElementById("plannerForm");
if (plannerForm) {
  plannerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const destination = document.getElementById("destination").value;
    const totalDays = parseInt(document.getElementById("totalDays").value);
    const budgetTier = document.getElementById("budgetTier").value;
    const vibe = document.getElementById("vibe").value;

    const tripData = {
      ...defaultTrip,
      destination,
      totalDays,
      budgetTier,
      vibe
    };

    localStorage.setItem("currentTrip", JSON.stringify(tripData));
    window.location.href = "dashboard.html";
  });
}

// 2. Dashboard Logic
const tabsContainer = document.getElementById("tabsContainer");
const activitiesContainer = document.getElementById("activitiesContainer");

if (tabsContainer && activitiesContainer) {
  let activeDay = 1;
  const storedTrip = JSON.parse(localStorage.getItem("currentTrip")) || defaultTrip;

  // Render Header Details
  document.getElementById("tripTitle").innerText = `${storedTrip.totalDays}-Day Trip to ${storedTrip.destination}`;
  document.getElementById("tripBudget").innerText = storedTrip.budgetTier;
  document.getElementById("tripVibe").innerText = storedTrip.vibe;

  // Calculate & Update Total Budget
  function updateBudget() {
    let total = 0;
    Object.values(storedTrip.itinerary).forEach((dayList) => {
      dayList.forEach((item) => (total += Number(item.cost)));
    });
    document.getElementById("totalCostDisplay").innerText = `₹${total.toLocaleString()}`;
  }

  // Render Activities for Selected Day
  function renderActivities() {
    const list = storedTrip.itinerary[activeDay] || [];
    activitiesContainer.innerHTML = "";

    if (list.length === 0) {
      activitiesContainer.innerHTML = `<p style="text-align:center; color:#64748b; margin: 2rem 0;">No activities added for Day ${activeDay}.</p>`;
      return;
    }

    list.forEach((item) => {
      const card = document.createElement("div");
      card.className = "activity-card";
      card.innerHTML = `
        <div class="activity-header">
          <span class="time-slot">${item.timeSlot}</span>
          <span class="rating">${item.rating}</span>
        </div>
        <h3>${item.placeName}</h3>
        <p class="activity-desc">${item.desc}</p>
        <div class="activity-footer">
          <span class="cost">Cost: ₹${item.cost}</span>
          <div class="actions">
            <button class="btn-delete" onclick="deleteActivity(${item.id})">Delete</button>
          </div>
        </div>
      `;
      activitiesContainer.appendChild(card);
    });
  }

  // Render Day Tabs
  function renderTabs() {
    tabsContainer.innerHTML = "";
    for (let i = 1; i <= storedTrip.totalDays; i++) {
      const btn = document.createElement("button");
      btn.className = `tab-btn ${activeDay === i ? "active" : ""}`;
      btn.innerText = `Day ${i}`;
      btn.onclick = () => {
        activeDay = i;
        renderTabs();
        renderActivities();
      };
      tabsContainer.appendChild(btn);
    }
  }

  // Delete Activity Handler
  window.deleteActivity = function (id) {
    storedTrip.itinerary[activeDay] = storedTrip.itinerary[activeDay].filter((item) => item.id !== id);
    localStorage.setItem("currentTrip", JSON.stringify(storedTrip));
    renderActivities();
    updateBudget();
  };

  // Initial Load
  renderTabs();
  renderActivities();
  updateBudget();
}