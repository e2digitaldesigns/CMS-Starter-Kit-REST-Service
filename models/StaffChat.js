const mongoose = require("mongoose");

const StaffChatSchema = mongoose.Schema({
  child_id: { type: String, required: true },
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  time_stamp: { type: Date, default: Date.now },
  referenceId: { type: String }
});

module.exports = mongoose.model("e2ps-service-chat-messages", StaffChatSchema);
