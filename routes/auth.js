const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const StaffModel = require("../models/StaffMembers");
const globalFunctions = require("../globalFunctions");

router.post("/", async (req, res) => {
  let domain = req.headers.origin
    .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
    .split("/")[0]
    .split(":")[0];

  const child_id = "e17647cd5cd845a1ea9cdc4ae52f3973";

  try {
    let result = await StaffModel.findOne({
      child_id,
      email: req.body.email,
      password: req.body.password
    });

    const data = {
      errorCode: result !== null ? "" : 0025,
      errorDesc: result !== null ? "" : "Email and Password do not match...",
      token: result !== null ? jwt.sign({ result }, config.jwtSecretKey) : ""
    };

    res.send(data);
    await globalFunctions.sendPushNotification("staff-login", result);
  } catch (err) {
    res.json({ errorCode: 0031, errorDesc: err });
  }
});

module.exports = router;
