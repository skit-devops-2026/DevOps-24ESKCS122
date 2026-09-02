// Default Seed Itinerary Data
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

// 1. Questionnaire Form Handling (plan.html)
const plannerForm = document.getElementById("plannerForm");
if (plannerForm) {
  plannerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const destination = document.getElementById("destination").value.trim();
    const totalDays = parseInt(document.getElementById("totalDays").value, 10);
    const budgetTier = document.getElementById("budgetTier").value;
    const vibe = document.getElementById("vibe").value;

    const newItinerary = {};
    for (let i = 1; i <= totalDays; i++) {
      newItinerary[i] = defaultTrip.itinerary[i] || [];
    }

    const tripData = {
      destination: destination || "Jaipur",
      totalDays,
      budgetTier,
      vibe,
      itinerary: newItinerary
    };

    localStorage.setItem("currentTrip", JSON.stringify(tripData));
    window.location.href = "dashboard.html";
  });
}

// 2. Dashboard Dynamic Logic (dashboard.html)
const tabsContainer = document.getElementById("tabsContainer");
const activitiesContainer = document.getElementById("activitiesContainer");

if (tabsContainer && activitiesContainer) {
  let activeDay = 1;
  const storedTrip = JSON.parse(localStorage.getItem("currentTrip")) || defaultTrip;

  // Header Details
  document.getElementById("tripTitle").innerText = `${storedTrip.totalDays}-Day Trip to ${storedTrip.destination}`;
  document.getElementById("tripBudget").innerText = storedTrip.budgetTier;
  document.getElementById("tripVibe").innerText = storedTrip.vibe;

  // Budget Calculator
  function updateBudget() {
    let total = 0;
    Object.values(storedTrip.itinerary).forEach((dayList) => {
      dayList.forEach((item) => (total += Number(item.cost) || 0));
    });
    document.getElementById("totalCostDisplay").innerText = `₹${total.toLocaleString()}`;
  }

  // Activities Renderer
  function renderActivities() {
    const list = storedTrip.itinerary[activeDay] || [];
    activitiesContainer.innerHTML = "";

    if (list.length === 0) {
      activitiesContainer.innerHTML = `<p style="text-align:center; color:#64748b; margin: 2rem 0;">No activities added for Day ${activeDay}. Click <strong>+ Add Activity</strong> to insert one.</p>`;
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

  // Day Tabs Renderer
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

  // Delete Activity
  window.deleteActivity = function (id) {
    storedTrip.itinerary[activeDay] = storedTrip.itinerary[activeDay].filter((item) => item.id !== id);
    localStorage.setItem("currentTrip", JSON.stringify(storedTrip));
    renderActivities();
    updateBudget();
  };

  // Modal Controls
  const modal = document.getElementById("addModal");
  const openModalBtn = document.getElementById("openAddModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const addForm = document.getElementById("addActivityForm");

  if (openModalBtn && modal) {
    openModalBtn.addEventListener("click", () => {
      const title = document.getElementById("modalDayTitle");
      if (title) title.innerText = `Add Activity to Day ${activeDay}`;
      modal.classList.add("active");
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const costInput = document.getElementById("newCost");
      const costValue = costInput ? Number(costInput.value) || 0 : 0;
      const selectedRating = document.getElementById("newRating") ? document.getElementById("newRating").value : "5";

      const newActivity = {
        id: Date.now(),
        placeName: document.getElementById("newPlaceName").value,
        timeSlot: document.getElementById("newTimeSlot").value,
        rating: `${selectedRating} / 5`,
        cost: costValue,
        desc: document.getElementById("newDesc").value
      };

      if (!storedTrip.itinerary[activeDay]) {
        storedTrip.itinerary[activeDay] = [];
      }
      storedTrip.itinerary[activeDay].push(newActivity);

      localStorage.setItem("currentTrip", JSON.stringify(storedTrip));
      modal.classList.remove("active");
      addForm.reset();
      renderActivities();
      updateBudget();
    });
  }

  // Initial Execution
  renderTabs();
  renderActivities();
  updateBudget();
}