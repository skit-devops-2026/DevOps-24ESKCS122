const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  placeName: { type: String, required: true },
  timeSlot: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  cost: { type: Number, required: true, default: 0 },
  desc: { type: String, required: true }
});

const DaySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  activities: [ActivitySchema]
});

const TripSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    duration: { type: Number, required: true, default: 3 },
    budgetTier: { type: String, enum: ["Budget", "Moderate", "Luxury"], default: "Moderate" },
    vibe: { type: String, default: "Culture & Sightseeing" },
    totalEstimatedCost: { type: Number, default: 0 },
    days: [DaySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);