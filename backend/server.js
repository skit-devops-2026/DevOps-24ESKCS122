const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Trip = require("./models/Trip");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travel_planner";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err.message));

// Health Route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// -------------------------------------------------------------
// 4-PIPELINE CRUD ROUTES
// -------------------------------------------------------------

// 1. CREATE PIPELINE: Initialize new trip with starter itinerary
app.post("/api/trips", async (req, res) => {
  try {
    const { destination, duration, budgetTier, vibe } = req.body;
    const numDays = Number(duration) || 3;
    const initialDays = [];

    for (let i = 1; i <= numDays; i++) {
      initialDays.push({
        dayNumber: i,
        activities: [
          {
            placeName: `${destination} Landmark Sightseeing`,
            timeSlot: "10:00 AM - 01:00 PM",
            rating: 4.8,
            cost: 500,
            desc: `Top-rated attraction matching the ${vibe} travel vibe.`
          }
        ]
      });
    }

    const totalCost = initialDays.reduce(
      (acc, day) => acc + day.activities.reduce((sum, act) => sum + act.cost, 0),
      0
    );

    const newTrip = new Trip({
      destination,
      duration: numDays,
      budgetTier,
      vibe,
      totalEstimatedCost: totalCost,
      days: initialDays
    });

    const savedTrip = await newTrip.save();
    return res.status(201).json(savedTrip);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create trip: " + err.message });
  }
});

// 2. READ PIPELINE: Get all trips or single trip by ID
app.get("/api/trips", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    return res.json(trips);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch trips: " + err.message });
  }
});

app.get("/api/trips/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    return res.json(trip);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch trip: " + err.message });
  }
});

// 3. UPDATE PIPELINE: Update itinerary activities and recalculate budget
app.put("/api/trips/:id", async (req, res) => {
  try {
    const { days } = req.body;
    let totalEstimatedCost = 0;

    if (days && Array.isArray(days)) {
      totalEstimatedCost = days.reduce(
        (acc, d) => acc + d.activities.reduce((s, act) => s + (Number(act.cost) || 0), 0),
        0
      );
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalEstimatedCost },
      { new: true, runValidators: true }
    );

    if (!updatedTrip) return res.status(404).json({ error: "Trip not found" });
    return res.json(updatedTrip);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update trip: " + err.message });
  }
});

// 4. DELETE PIPELINE: Remove an entire trip or specific activity
app.delete("/api/trips/:id", async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) return res.status(404).json({ error: "Trip not found" });
    return res.json({ message: "Trip deleted successfully", id: req.params.id });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete trip: " + err.message });
  }
});

app.delete("/api/trips/:tripId/days/:dayNumber/activities/:activityId", async (req, res) => {
  try {
    const { tripId, dayNumber, activityId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const targetDay = trip.days.find((d) => d.dayNumber === Number(dayNumber));
    if (!targetDay) return res.status(404).json({ error: "Day not found" });

    targetDay.activities = targetDay.activities.filter(
      (act) => act._id.toString() !== activityId
    );

    trip.totalEstimatedCost = trip.days.reduce(
      (acc, d) => acc + d.activities.reduce((s, act) => s + (Number(act.cost) || 0), 0),
      0
    );

    await trip.save();
    return res.json(trip);
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete activity: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});