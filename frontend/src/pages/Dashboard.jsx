import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllTrips, getTripById, updateTrip, deleteTrip } from "../api";
import AddActivityModal from "../components/AddActivityModal";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tripIdParam = searchParams.get("tripId");

  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Trip
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (tripIdParam) {
          const res = await getTripById(tripIdParam);
          setTrip(res.data);
          return;
        }
        const res = await getAllTrips();
        if (res.data && res.data.length > 0) {
          setTrip(res.data[0]);
          return;
        }
      } catch (err) {
        console.warn("Backend not responding, falling back to localStorage:", err.message);
      }

      // Fallback to localStorage
      const local = localStorage.getItem("currentTrip");
      if (local) {
        try {
          setTrip(JSON.parse(local));
        } catch (e) {}
      }
      setLoading(false);
    }

    loadData().finally(() => setLoading(false));
  }, [tripIdParam]);

  // Recalculate helper
  const calcTotal = (daysArr) => {
    return daysArr.reduce(
      (acc, d) => acc + d.activities.reduce((s, a) => s + (Number(a.cost) || 0), 0),
      0
    );
  };

  // Add Activity Handler
  const handleAddActivity = async (newAct) => {
    if (!trip) return;
    const actWithId = { ...newAct, _id: "act_" + Date.now() };
    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber === activeDay) {
        return { ...d, activities: [...d.activities, actWithId] };
      }
      return d;
    });

    const newTotal = calcTotal(updatedDays);
    const updatedTrip = { ...trip, days: updatedDays, totalEstimatedCost: newTotal };

    setTrip(updatedTrip);
    setIsModalOpen(false);
    localStorage.setItem("currentTrip", JSON.stringify(updatedTrip));

    if (!trip._id.startsWith("local_")) {
      try {
        await updateTrip(trip._id, { days: updatedDays });
      } catch (e) {
        console.warn("Could not sync with backend database:", e.message);
      }
    }
  };

  // Delete Activity Handler
  const handleDeleteActivity = async (activityId) => {
    if (!trip) return;
    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber === activeDay) {
        return {
          ...d,
          activities: d.activities.filter((a) => (a._id || a.id) !== activityId)
        };
      }
      return d;
    });

    const newTotal = calcTotal(updatedDays);
    const updatedTrip = { ...trip, days: updatedDays, totalEstimatedCost: newTotal };

    setTrip(updatedTrip);
    localStorage.setItem("currentTrip", JSON.stringify(updatedTrip));

    if (!trip._id.startsWith("local_")) {
      try {
        await updateTrip(trip._id, { days: updatedDays });
      } catch (e) {
        console.warn("Could not sync delete with backend:", e.message);
      }
    }
  };

  // Delete Entire Trip Handler
  const handleDeleteTrip = async () => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    if (trip && !trip._id.startsWith("local_")) {
      try {
        await deleteTrip(trip._id);
      } catch (e) {}
    }
    localStorage.removeItem("currentTrip");
    navigate("/plan");
  };

  if (loading) return <div style={{ padding: "3rem", textAlign: "center" }}>Loading trip...</div>;
  if (!trip) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h3>No trip found.</h3>
      <button onClick={() => navigate("/plan")} style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        Go to Plan Trip
      </button>
    </div>
  );

  const currentDayData = trip.days?.find((d) => d.dayNumber === activeDay) || { activities: [] };

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>{trip.destination} Itinerary</h2>
          <p style={{ color: "#64748b" }}>{trip.duration} Days • {trip.budgetTier} • {trip.vibe}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ background: "#e2e8f0", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: "bold" }}>
            Total Budget: ₹{trip.totalEstimatedCost}
          </span>
          <button
            onClick={handleDeleteTrip}
            style={{ background: "#ef4444", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}
          >
            Delete Trip
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", margin: "1.5rem 0" }}>
        {trip.days?.map((d) => (
          <button
            key={d.dayNumber}
            type="button"
            onClick={() => setActiveDay(d.dayNumber)}
            style={{
              padding: "0.5rem 1.2rem",
              background: activeDay === d.dayNumber ? "#2563eb" : "#f1f5f9",
              color: activeDay === d.dayNumber ? "#fff" : "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: activeDay === d.dayNumber ? "bold" : "normal"
            }}
          >
            Day {d.dayNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{ padding: "0.5rem 1.2rem", background: "#10b981", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          + Add Activity
        </button>
      </div>

      {/* Activity Cards */}
      <div>
        {currentDayData.activities.length === 0 ? (
          <p>No activities scheduled for Day {activeDay}. Click "+ Add Activity" to create one.</p>
        ) : (
          currentDayData.activities.map((act) => (
            <div key={act._id || act.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4 style={{ margin: 0 }}>{act.placeName}</h4>
                <span style={{ color: "#f59e0b" }}>⭐ {act.rating} / 5</span>
              </div>
              <p style={{ color: "#64748b", margin: "0.25rem 0" }}>🕒 {act.timeSlot}</p>
              <p>{act.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <strong>Cost: ₹{act.cost}</strong>
                <button
                  type="button"
                  onClick={() => handleDeleteActivity(act._id || act.id)}
                  style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "0.3rem 0.8rem", borderRadius: "4px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <AddActivityModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddActivity}
        />
      )}
    </div>
  );
}