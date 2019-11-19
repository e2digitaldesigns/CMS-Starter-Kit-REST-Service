const express = require("express");
const router = express.Router();
const jwtDecode = require("jwt-decode");
const Model = require("../../models/Todo");
const globalFunctions = require("../../globalFunctions");

//CREATE - POST
router.post("/", globalFunctions.verifyToken, async (req, res) => {
  const item = new Model({
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
    const data = await Model.find({
      child_id: jwtDecode(req.token).result.child_id,
      staff_id: jwtDecode(req.token).result.staff_id
    });
    res.json(data);
  } catch (err) {
    res.json({ message: err });
  }
});

//UPDATE - PATCH
router.put("/:id", globalFunctions.verifyToken, async (req, res) => {
  try {
    const updatedItems = await Model.updateOne(
      {
        _id: req.params.id,
        child_id: jwtDecode(req.token).result.child_id,
        staff_id: jwtDecode(req.token).result.staff_id
      },
      { $set: { checked: req.body.checked } }
    );

    res.json(updatedItems);
  } catch (err) {
    res.json({ message: err });
  }
});

//DELETE
router.delete("/:id", globalFunctions.verifyToken, async (req, res) => {
  try {
    const removedItem = await Model.deleteOne({
      _id: req.params.id,
      child_id: jwtDecode(req.token).result.child_id,
      staff_id: jwtDecode(req.token).result.staff_id
    });
    res.json(removedItem);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
