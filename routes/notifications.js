const express = require("express");
const router = express.Router();
const jwtDecode = require("jwt-decode");
const NotificationModel = require("../models/Notifications");
const globalFunctions = require("../globalFunctions");

//CREATE - POST
router.post("/", globalFunctions.verifyToken, async (req, res) => {
  const item = new NotificationModel({
    child_id: jwtDecode(req.token).result.child_id,
    staff_id: jwtDecode(req.token).result.staff_id,
    item: req.body.item
  });

  try {
    const savedItem = await item.save();
    res.json(savedItem);
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

//READ
router.get("/", globalFunctions.verifyToken, async (req, res) => {
  try {
    const data = await NotificationModel.find({
      child_id: jwtDecode(req.token).result.child_id
    }).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
