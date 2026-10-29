const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/travel_planner";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err.message));

// Schemas & Models
const ActivitySchema = new mongoose.Schema({
  placeName: { type: String, required: true },
  timeSlot: { type: String, default: "10:00 AM - 01:00 PM" },
  rating: { type: Number, default: 4.5 },
  cost: { type: Number, default: 0 },
  desc: { type: String, default: "" }
}, { _id: true });

const DaySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  activities: [ActivitySchema]
});

const TripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  duration: { type: Number, required: true },
  budgetTier: { type: String, default: "Moderate" },
  vibe: { type: String, default: "Leisure" },
  totalEstimatedCost: { type: Number, default: 0 },
  days: [DaySchema]
}, { timestamps: true });

const Trip = mongoose.models.Trip || mongoose.model("Trip", TripSchema);

// Helper to recalculate total budget
const recalculateTotal = (days) => {
  return days.reduce((sum, day) => {
    return sum + day.activities.reduce((dSum, act) => dSum + (Number(act.cost) || 0), 0);
  }, 0);
};

// 1. CREATE TRIP (POST /api/trips)
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

    const totalEstimatedCost = recalculateTotal(initialDays);
    const newTrip = new Trip({
      destination,
      duration: numDays,
      budgetTier,
      vibe,
      totalEstimatedCost,
      days: initialDays
    });

    const saved = await newTrip.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. READ ALL TRIPS (GET /api/trips)
app.get("/api/trips", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. READ ONE TRIP (GET /api/trips/:id)
app.get("/api/trips/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE TRIP DAYS / ACTIVITIES (PUT /api/trips/:id)
app.put("/api/trips/:id", async (req, res) => {
  try {
    const { days } = req.body;
    
    // Clean activities so string temporary IDs don't trigger CastError
    const cleanedDays = days.map((day) => ({
      dayNumber: day.dayNumber,
      activities: day.activities.map((act) => {
        const item = {
          placeName: act.placeName,
          timeSlot: act.timeSlot,
          rating: Number(act.rating) || 4.5,
          cost: Number(act.cost) || 0,
          desc: act.desc || ""
        };
        // Only retain _id if it's already a valid 24-character Mongo ObjectID
        if (act._id && mongoose.Types.ObjectId.isValid(act._id)) {
          item._id = act._id;
        }
        return item;
      })
    }));

    const totalEstimatedCost = recalculateTotal(cleanedDays);

    const updated = await Trip.findByIdAndUpdate(
      req.params.id,
      { days: cleanedDays, totalEstimatedCost },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE TRIP (DELETE /api/trips/:id)
app.delete("/api/trips/:id", async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));