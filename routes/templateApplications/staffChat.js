const express = require("express");
const router = express.Router();
const _ = require("underscore");
const jwtDecode = require("jwt-decode");

const push = "http://192.168.1.72:8002";
//const push = "https://e2ps-push.herokuapp.com";

const e2psSocket = require("socket.io-client")(push, {
  secure: true,
  reconnect: true,
  rejectUnauthorized: false
});

const StaffChatModel = require("../../models/StaffChat");
const StaffMembersModel = require("../../models/StaffMembers");
const globalFunctions = require("../../globalFunctions");

router.get("/", globalFunctions.verifyToken, async (req, res) => {
  const staffMemberId = jwtDecode(req.token).result.staff_id;

  try {
    let staffMembers = await StaffMembersModel.find({
      child_id: jwtDecode(req.token).result.child_id,
      staff_id: { $ne: staffMemberId }
    });

    const chatMessages = await StaffChatModel.find({
      $or: [{ sender_id: staffMemberId }, { receiver_id: staffMemberId }]
    });

    const messages = chatFilter(staffMemberId, staffMembers, chatMessages);

    res.send(messages);
  } catch (err) {
    res.send(err);
  }
});

router.get(
  "/:staffId/:guestId",
  globalFunctions.verifyToken,
  async (req, res) => {
    const staffId = req.params.staffId;
    const guestId = req.params.guestId;

    try {
      await StaffChatModel.updateMany(
        { sender_id: guestId, receiver_id: staffId },
        { $set: { seen: true } }
      );

      const chatMessages = await StaffChatModel.find({
        $or: [
          { sender_id: staffId, receiver_id: guestId },
          { sender_id: guestId, receiver_id: staffId }
        ]
      });

      res.send(chatMessages);
    } catch (err) {
      res.error(err);
    }
  }
);

router.post("/", globalFunctions.verifyToken, async (req, res) => {
  const child_id = jwtDecode(req.token).result.child_id,
    sender_id = req.body.sender_id,
    receiver_id = req.body.receiver_id,
    message = req.body.message;

  const chatMessage = new StaffChatModel({
    child_id,
    sender_id,
    receiver_id,
    message
  });

  try {
    const savedChatMessage = await chatMessage.save();
    res.json(savedChatMessage);

    e2psSocket.emit("chatServices", {
      data_type: "chat-message",
      _id: savedChatMessage._id,
      child_id,
      sender_id,
      receiver_id,
      message,
      time_stamp: savedChatMessage.time_stamp
    });
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/seen/:id", globalFunctions.verifyToken, async (req, res) => {
  try {
    const updatedChatMessage = await StaffChatModel.updateMany(
      {
        sender_id: req.params.id,
        receiver_id: jwtDecode(req.token).result.staff_id
      },
      { $set: { seen: true } }
    );
    res.json(updatedChatMessage);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

const chatFilter = (staffId, contacts, messages) => {
  const filteredMessages = _.sortBy(messages, "time_stamp").reverse(),
    filteredContacts = contacts;
  let finalList = [];

  for (let i = 0; i < filteredMessages.length; i++) {
    if (filteredMessages[i].sender_id === staffId) {
      filteredMessages[i].referenceId = filteredMessages[i].receiver_id;
    } else if (filteredMessages[i].receiver_id === staffId) {
      filteredMessages[i].referenceId = filteredMessages[i].sender_id;
    }
  }

  const uniqueMessages = _.uniq(filteredMessages, function(f) {
    return f.referenceId;
  });

  for (let i = 0; i < filteredContacts.length; i++) {
    let contactStaffId = filteredContacts[i].staff_id;

    let messaging = uniqueMessages.find(
      ({ referenceId }) => referenceId === contactStaffId
    );

    finalList.push({
      check: "",
      last_msg: messaging ? messaging.message : null,
      last_message_date: messaging
        ? messaging.time_stamp
        : new Date("25 Dec 2010"),
      new_message_count: filteredMessages.filter(
        ({ referenceId, seen, sender_id }) =>
          referenceId === contactStaffId &&
          seen === false &&
          sender_id !== staffId
      ).length,
      online: 0,
      sender_id: messaging ? messaging.sender_id : null,
      staff_id: contactStaffId,
      staff_name: filteredContacts[i].name
    });
  }

  finalList = _.sortBy(finalList, "last_message_date", "staff_name").reverse();
  return finalList;
};
