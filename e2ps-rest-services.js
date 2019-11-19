require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

//MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());
//app.use(morgan("short"));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,authorization"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

require("./startup/routes")(app);

app.get("/", (req, res) => {
  let statement = "E2PS REST " + process.env.DB_CONNECTION;
  res.send(statement);
});

//CONNECT TO MONGO DB
mongoose.connect(
  // process.env.DB_CONNECTION,
  "mongodb+srv://e2ps:332310cb@e2ps-gnpyw.mongodb.net/e2-print-software?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

const serverPort = process.env.PORT || process.env[process.env.MODE + "PORT"];
app.listen(serverPort, () => console.log("E2PS REST API at ", serverPort));
