const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  child_id: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  "e2ps-service-notifications",
  NotificationSchema
);
