const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const appCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const jwtDecode = require("jwt-decode");
const StaffMembersModel = require("../models/StaffMembers");
const globalFunctions = require("../globalFunctions");

router.get("/", globalFunctions.verifyToken, async (req, res) => {
  try {
    const results = await StaffMembersModel.findOne({
      child_id: jwtDecode(req.token).result.child_id,
      staff_id: jwtDecode(req.token).result.staff_id
    });

    res.json(results.settings);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/", globalFunctions.verifyToken, async (req, res) => {
  try {
    const updatedSettings = await StaffMembersModel.updateOne(
      {
        child_id: jwtDecode(req.token).result.child_id,
        staff_id: jwtDecode(req.token).result.staff_id
      },
      { $set: { settings: req.body.options } }
    );

    res.send(updatedSettings);
  } catch (err) {}
});

module.exports = router;
