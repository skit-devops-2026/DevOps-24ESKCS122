import React, { useState, useEffect } from 'react';
import AddActivityModal from '../components/AddActivityModal';

const initialFallbackTrip = {
  destination: "Jaipur",
  totalDays: 3,
  budgetTier: "Moderate",
  vibe: "Culture & Heritage",
  itinerary: {
    1: [
      { id: 101, placeName: "Amber Fort", timeSlot: "10:00 AM - 01:00 PM", rating: "4.7 / 5", cost: 500, desc: "Historic hilltop fort with majestic palace architecture." },
      { id: 102, placeName: "Hawa Mahal & Local Bazaar", timeSlot: "02:00 PM - 03:30 PM", rating: "4.6 / 5", cost: 1200, desc: "Honeycomb facade and shopping at Johari Bazaar." },
      { id: 103, placeName: "Traditional Rajasthani Dinner", timeSlot: "07:00 PM - 09:00 PM", rating: "4.8 / 5", cost: 800, desc: "Authentic local dining featuring Dal Baati Churma." }
    ],
    2: [
      { id: 201, placeName: "City Palace", timeSlot: "10:00 AM - 12:30 PM", rating: "4.5 / 5", cost: 700, desc: "Royal residence and museum complex in the old city." },
      { id: 202, placeName: "Jantar Mantar", timeSlot: "01:30 PM - 03:00 PM", rating: "4.6 / 5", cost: 300, desc: "UNESCO World Heritage astronomical observatory." }
    ],
    3: [
      { id: 301, placeName: "Nahargarh Fort Sunset", timeSlot: "04:30 PM - 07:00 PM", rating: "4.8 / 5", cost: 400, desc: "Panoramic sunset view overlooking the entire Pink City." }
    ]
  }
};

const Dashboard = () => {
  const [tripData, setTripData] = useState(() => {
    const saved = localStorage.getItem('currentTrip');
    return saved ? JSON.parse(saved) : initialFallbackTrip;
  });

  const [activeDay, setActiveDay] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('currentTrip', JSON.stringify(tripData));
  }, [tripData]);

  // Live budget calculation across all days
  const totalCost = Object.values(tripData.itinerary || {}).reduce((acc, dayList) => {
    return acc + dayList.reduce((daySum, item) => daySum + (Number(item.cost) || 0), 0);
  }, 0);

  // Delete activity
  const handleDeleteActivity = (id) => {
    setTripData((prev) => ({
      ...prev,
      itinerary: {
        ...prev.itinerary,
        [activeDay]: (prev.itinerary[activeDay] || []).filter((item) => item.id !== id)
      }
    }));
  };

  // Add new activity
  const handleAddActivity = (newActivity) => {
    setTripData((prev) => ({
      ...prev,
      itinerary: {
        ...prev.itinerary,
        [activeDay]: [...(prev.itinerary[activeDay] || []), newActivity]
      }
    }));
  };

  const currentDayActivities = tripData.itinerary[activeDay] || [];

  return (
    <main className="container-wide">
      <div className="header-card">
        <div>
          <h2>
            {tripData.totalDays}-Day Trip to {tripData.destination}
          </h2>
          <p className="subtitle">
            Budget: <strong>{tripData.budgetTier}</strong> | Vibe: <strong>{tripData.vibe}</strong>
          </p>
        </div>
        <div className="budget-badge">
          <span>Estimated Total</span>
          <h3>₹{totalCost.toLocaleString()}</h3>
        </div>
      </div>

      <div className="tabs-header-row">
        <div className="tabs-container">
          {Array.from({ length: tripData.totalDays }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              type="button"
              className={`tab-btn ${activeDay === day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              Day {day}
            </button>
          ))}
        </div>
        <button
          className="btn-primary-action"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Activity
        </button>
      </div>

      <div className="activities-grid">
        {currentDayActivities.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', margin: '2rem 0' }}>
            No activities added for Day {activeDay}. Click <strong>+ Add Activity</strong> to insert one.
          </p>
        ) : (
          currentDayActivities.map((item) => (
            <div className="activity-card" key={item.id}>
              <div className="activity-header">
                <span className="time-slot">{item.timeSlot}</span>
                <span className="rating">{item.rating}</span>
              </div>
              <h3>{item.placeName}</h3>
              <p className="activity-desc">{item.desc}</p>
              <div className="activity-footer">
                <span className="cost">Cost: ₹{item.cost}</span>
                <div className="actions">
                  <button
                    className="btn-delete"
                    type="button"
                    onClick={() => handleDeleteActivity(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddActivityModal
        isOpen={isModalOpen}
        activeDay={activeDay}
        onClose={() => setIsModalOpen(false)}
        onAddActivity={handleAddActivity}
      />
    </main>
  );
};

export default Dashboard;
