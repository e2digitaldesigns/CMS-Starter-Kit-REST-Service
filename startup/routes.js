const express = require("express");

const auth = require("../routes/auth");

//TEMPLATE APPLICATIONS
const notifications = require("../routes/notifications");
const staffSettings = require("../routes/staffSettings");
const staffChat = require("../routes/templateApplications/staffChat");
const adminToDoList = require("../routes/templateApplications/toDoList");

const staffManagement = require("../routes/staffManagement");

const users = require("../routes/userManagement");

module.exports = function(app) {
  const prefix = "/api/v1/";
  app.use(express.json());
  app.use(`${prefix}auth`, auth);

  //TEMPLATE APPLICATIONS
  app.use(`${prefix}notifications`, notifications);
  app.use(`${prefix}staffSettings`, staffSettings);
  app.use(`${prefix}staffChat`, staffChat);
  app.use(`${prefix}adminToDoList`, adminToDoList);

  //STAFF MANAGEMENT
  app.use(`${prefix}staffManagement`, staffManagement);

  //USER MANAGEMENT
  app.use(`${prefix}users`, users);
};
