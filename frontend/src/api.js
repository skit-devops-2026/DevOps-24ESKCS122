import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// 1. CREATE PIPELINE
export const createTrip = (tripData) => api.post("/trips", tripData);

// 2. READ PIPELINE
export const getAllTrips = () => api.get("/trips");
export const getTripById = (id) => api.get(`/trips/${id}`);

// 3. UPDATE PIPELINE
export const updateTrip = (id, updatedData) => api.put(`/trips/${id}`, updatedData);

// 4. DELETE PIPELINE
export const deleteTrip = (id) => api.delete(`/trips/${id}`);
export const deleteActivity = (tripId, dayNum, activityId) =>
  api.delete(`/trips/${tripId}/days/${dayNum}/activities/${activityId}`);

export default api;