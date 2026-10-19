import React, { useState } from 'react';

const AddActivityModal = ({ isOpen, activeDay, onClose, onAddActivity }) => {
  const [placeName, setPlaceName] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [rating, setRating] = useState('5');
  const [cost, setCost] = useState('');
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newActivity = {
      id: Date.now(),
      placeName,
      timeSlot,
      rating: `${rating} / 5`,
      cost: Number(cost) || 0,
      desc
    };

    onAddActivity(newActivity);
    setPlaceName('');
    setTimeSlot('');
    setRating('5');
    setCost('');
    setDesc('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Activity to Day {activeDay}</h3>
          <button className="btn-close" type="button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="placeName">Place / Attraction Name</label>
            <input
              id="placeName"
              type="text"
              placeholder="e.g. City Palace"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeSlot">Time Slot</label>
            <input
              id="timeSlot"
              type="text"
              placeholder="e.g. 02:00 PM - 04:00 PM"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating (1 to 5)</label>
            <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} required>
              <option value="1">1 / 5</option>
              <option value="2">2 / 5</option>
              <option value="3">3 / 5</option>
              <option value="4">4 / 5</option>
              <option value="5">5 / 5</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cost">Estimated Cost (₹)</label>
            <input
              id="cost"
              type="number"
              placeholder="e.g. 500"
              min="0"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="desc">Short Description</label>
            <input
              id="desc"
              type="text"
              placeholder="e.g. Scenic architectural monument."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit">
            Save Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
