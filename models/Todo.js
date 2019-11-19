const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  child_id: { type: String, required: true },
  staff_id: { type: String, required: true },
  item: { type: String, required: true },
  checked: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("e2ps-service-to-do-items", PostSchema);
