const mongoose = require("mongoose");

const StaffMembersSchema = mongoose.Schema({
  child_id: { type: String, required: true },
  staff_id: { type: String, required: true },
  status: { type: Boolean, default: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  settings: { type: Object, default: {} },
  permissions: { type: Object, default: {} }
});

module.exports = mongoose.model("e2ps-staff-members", StaffMembersSchema);
