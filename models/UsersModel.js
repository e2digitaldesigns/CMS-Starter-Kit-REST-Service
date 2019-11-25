const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  child_id: { type: String, required: true },
  status: { type: Boolean, default: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("e2ps-users", UserSchema);
