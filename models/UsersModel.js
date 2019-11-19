const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  child_id: { type: String, required: true },
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("e2ps-users", UserSchema);
