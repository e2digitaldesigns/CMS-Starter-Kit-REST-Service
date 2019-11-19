const md5 = require("js-md5");
const notificationModel = require("./models/Notifications");

const e2psSocket = require("socket.io-client")(
  process.env[process.env.MODE + "PUSH"],
  {
    secure: true,
    reconnect: true,
    rejectUnauthorized: false
  }
);

module.exports = {
  verifyToken: function(req, res, next) {
    const bearerHeader = req.headers.authorization;

    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  },

  cacheKeyNamer: function(a, b, sub = "cache_key") {
    return this.cacheKeyNameLoop(a.match(/\d+/g)) >
      this.cacheKeyNameLoop(b.match(/\d+/g))
      ? `${a}_${b}_${sub}`
      : `${b}_${a}_${sub}`;
  },

  cacheKeyNameLoop: function(array) {
    let total = 0;
    for (let i = 0; i < array.length; i++) {
      total = total + parseInt(array[i]);
    }
    return total;
  },

  makeMd5: function(string = null) {
    return md5(new Date() + string + Math.random());
  },

  sendPushNotification: async function(type, data) {
    let title, description;

    switch (type) {
      case "staff-login":
        title = "Staff Login";
        description = `${data.name} has logged in.`;
        break;
    }

    const setNotification = new notificationModel({
      child_id: data.child_id,
      type,
      title,
      description
    });

    try {
      const result = await setNotification.save();
      e2psSocket.emit("notificationServices", result);
    } catch {}
  }
};
