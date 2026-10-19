import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultSeedItinerary = {
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
};

const PlanTrip = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('Jaipur');
  const [totalDays, setTotalDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [vibe, setVibe] = useState('Culture & Heritage');

  const handleSubmit = (e) => {
    e.preventDefault();

    const daysCount = parseInt(totalDays, 10);
    const newItinerary = {};
    for (let i = 1; i <= daysCount; i++) {
      newItinerary[i] = defaultSeedItinerary[i] || [];
    }

    const tripData = {
      destination: destination || 'Jaipur',
      totalDays: daysCount,
      budgetTier,
      vibe,
      itinerary: newItinerary
    };

    localStorage.setItem('currentTrip', JSON.stringify(tripData));
    navigate('/dashboard');
  };

  return (
    <main className="container">
      <div className="card">
        <h2>Plan Your Journey</h2>
        <p className="subtitle">Tell us your preferences to create your customized itinerary.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              id="destination"
              type="text"
              placeholder="e.g. Jaipur, Goa, Manali"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalDays">Duration (Days)</label>
            <input
              id="totalDays"
              type="number"
              min="1"
              max="14"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="budgetTier">Budget Tier</label>
            <select
              id="budgetTier"
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
            >
              <option value="Budget">Budget (Low Cost)</option>
              <option value="Moderate">Moderate (Standard)</option>
              <option value="Luxury">Luxury (Premium)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vibe">Travel Vibe</label>
            <select
              id="vibe"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
            >
              <option value="Culture & Heritage">Culture & Heritage</option>
              <option value="Food & Nightlife">Food & Nightlife</option>
              <option value="Beach & Coastal">Beach & Coastal</option>
              <option value="Adventure & Trekking">Adventure & Trekking</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">
            Generate Itinerary
          </button>
        </form>
      </div>
    </main>
  );
};

export default PlanTrip;
