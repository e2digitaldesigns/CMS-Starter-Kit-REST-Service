const express = require("express");
const router = express.Router();
const jwtDecode = require("jwt-decode");
const StaffMembersModel = require("../models/StaffMembers");
const globalFunctions = require("../globalFunctions");

//CREATE - POST
router.post("/", globalFunctions.verifyToken, async (req, res) => {
  const item = new StaffMembersModel({
    child_id: jwtDecode(req.token).result.child_id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const checkCount = await StaffMembersModel.findOne({
      child_id: jwtDecode(req.token).result.child_id,
      email: req.body.email
    }).countDocuments();

    if (checkCount === 0) {
      const savedItem = await item.save();
      res.json(savedItem);
    } else {
      res.json({ errorCode: 26, error: "email exist" });
    }
  } catch {
    res.json({ errorCode: 30, error: "db error" });
  }
});

//READ
router.get("/", globalFunctions.verifyToken, async (req, res) => {
  try {
    const data = await StaffMembersModel.find();
    res.send(data);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", globalFunctions.verifyToken, async (req, res) => {
  console.log("st get");
  try {
    const data = await StaffMembersModel.findOne({
      child_id: jwtDecode(req.token).result.child_id,
      _id: req.params.id
    });
    console.log(data);
    res.send(data);
  } catch (err) {
    res.json({ message: err });
  }
});

//Update
router.put("/:id", globalFunctions.verifyToken, async (req, res) => {
  console.log(req.body);
  try {
    const updatedItems = await StaffMembersModel.updateOne(
      {
        _id: req.params.id,
        child_id: jwtDecode(req.token).result.child_id
      },
      {
        $set: {
          status: req.body.status,
          name: req.body.name,
          email: req.body.email
        }
      }
    );

    res.json(updatedItems);
  } catch (err) {
    res.json({ message: err });
  }
});

//Update Status
router.put("/status/:id", globalFunctions.verifyToken, async (req, res) => {
  try {
    const updatedItems = await StaffMembersModel.updateOne(
      {
        _id: req.params.id,
        child_id: jwtDecode(req.token).result.child_id
      },
      { $set: { status: req.body.status } }
    );

    res.json(updatedItems);
  } catch (err) {
    res.json({ message: err });
  }
});
module.exports = router;
