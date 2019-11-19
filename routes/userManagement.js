const express = require("express");
const router = express.Router();
const jwtDecode = require("jwt-decode");
const UsersModel = require("../models/UsersModel");
const globalFunctions = require("../globalFunctions");

//CREATE - POST

//READ
router.get("/", globalFunctions.verifyToken, async (req, res) => {
  try {
    const data = await UsersModel.find({
      child_id: jwtDecode(req.token).result.child_id
    });
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", globalFunctions.verifyToken, async (req, res) => {
  try {
    const data = await UsersModel.findOne({
      child_id: jwtDecode(req.token).result.child_id,
      user_id: req.params.id
    });
    res.send(data);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
