const express = require("express");
const router = express.Router();
const jwtDecode = require("jwt-decode");
const StaffMembersModel = require("../models/StaffMembers");
const globalFunctions = require("../globalFunctions");

//READ
router.get("/", async (req, res) => {
  try {
    const data = await StaffMembersModel.find();
    res.send(data);
  } catch (err) {
    res.json({ message: err });
  }
});
module.exports = router;
