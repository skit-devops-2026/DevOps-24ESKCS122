import React, { useState } from "react";

export default function AddActivityModal({ onClose, onAdd }) {
  const [placeName, setPlaceName] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 01:00 PM");
  const [rating, setRating] = useState("4.5");
  const [cost, setCost] = useState(500);
  const [desc, setDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      placeName,
      timeSlot,
      rating: Number(rating),
      cost: Number(cost),
      desc
    });
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px", width: "400px", maxWidth: "90%" }}>
        <h3>Add New Activity</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.8rem" }}>
            <label style={{ display: "block" }}>Place Name</label>
            <input
              type="text"
              style={{ width: "100%", padding: "0.4rem" }}
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "0.8rem" }}>
            <label style={{ display: "block" }}>Time Slot</label>
            <input
              type="text"
              style={{ width: "100%", padding: "0.4rem" }}
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "0.8rem" }}>
            <label htmlFor="rating" style={{ display: "block" }}>Rating</label>
            <select id="rating" style={{ width: "100%", padding: "0.4rem" }} value={rating} onChange={(e) => setRating(e.target.value)} required>
              <option value="5">⭐⭐⭐⭐⭐ (5.0)</option>
              <option value="4.5">⭐⭐⭐⭐½ (4.5)</option>
              <option value="4">⭐⭐⭐⭐ (4.0)</option>
              <option value="3.5">⭐⭐⭐½ (3.5)</option>
              <option value="3">⭐⭐⭐ (3.0)</option>
            </select>
          </div>
          <div style={{ marginBottom: "0.8rem" }}>
            <label style={{ display: "block" }}>Cost (₹)</label>
            <input
              type="number"
              style={{ width: "100%", padding: "0.4rem" }}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "0.8rem" }}>
            <label style={{ display: "block" }}>Description</label>
            <input
              type="text"
              style={{ width: "100%", padding: "0.4rem" }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              type="submit"
              style={{ flex: 1, padding: "0.6rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: "0.6rem", background: "#e2e8f0", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}