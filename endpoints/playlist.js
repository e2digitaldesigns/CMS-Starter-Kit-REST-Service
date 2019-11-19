const express = require("express");
const app = express();
const router = express.Router();

//////////////////////////////////////////////////GGPDP//
//PLAYLIST///////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.get("/api/playlist", (req, res) => {
  const apikey = req.headers["x-gtk-api-key"];

  pool.getConnection(function(err, connection) {
    connection.query(
      `SELECT * FROM video_show_playlist WHERE api_key = "${
        req.headers["x-gtk-api-key"]
      }" `,
      function(error, result) {
        if (error) {
          res
            .status(400)
            .send({ errorCode: error.errno, errorDesc: error.code });
        } else {
          res.send(result);
        }
      }
    );
    connection.release();
  });
});

app.get("/api/playlist/:id", (req, res) => {
  pool.getConnection(function(err, connection) {
    connection.query(
      `SELECT * FROM video_show_playlist WHERE api_key = "${
        req.headers["x-gtk-api-key"]
      }" AND video_playlist_id = "${req.params.id}" LIMIT 1`,
      function(error, result) {
        if (error) {
          res
            .status(400)
            .send({ errorCode: error.errno, errorDesc: error.code });
        } else {
          if (result.length === 0) {
            res.status(404).send({
              errorCode: "0072",
              errorDesc: "No playlist with given ID was found"
            });
          } else {
            res.send(result);
          }
        }
      }
    );
    connection.release();
  });
});

app.put("/api/playlist/:id", (req, res) => {
  const key = Object.keys(req.body)[0];
  console.log(key);

  pool.getConnection(function(err, connection) {
    connection.query(
      `UPDATE video_show_playlist SET ${key}="${
        req.body[key]
      }" WHERE api_key = "${
        req.headers["x-gtk-api-key"]
      }" AND video_playlist_id = "${req.params.id}" LIMIT 1`,
      function(error, result) {
        if (error) {
          res
            .status(400)
            .send({ errorCode: error.errno, errorDesc: error.code });
        } else {
          if (result.length === 0) {
            res.status(404).send({
              errorCode: "0101",
              errorDesc: "No playlist with given ID was found"
            });
          } else {
            res.send(result);
          }
        }
      }
    );
    connection.release();
  });
});

app.delete("/api/playlist/:id", (req, res) => {
  pool.getConnection(function(err, connection) {
    connection.query(
      `DELETE FROM video_show_playlist WHERE api_key = "${
        req.headers["x-gtk-api-key"]
      }" AND video_playlist_id = "${req.params.id}" LIMIT 1`,
      function(error, result) {
        if (error) {
          res
            .status(400)
            .send({ errorCode: error.errno, errorDesc: error.code });
        } else {
          if (result.length === 0) {
            res.status(404).send({
              errorCode: "0128",
              errorDesc: "No playlist with given ID was found"
            });
          } else {
            res.send(result);
          }
        }
      }
    );
    connection.release();
  });
});

app.post("/api/playlist/", (req, res) => {
  const playlistName = req.body.playlistName;
  const apiKey = req.headers["x-gtk-api-key"];

  const playlistId = crypto
    .createHash("md5")
    .update(apiKey + Date.now())
    .digest("hex");

  pool.getConnection(function(err, connection) {
    connection.query(
      `INSERT INTO video_show_playlist (api_key,video_playlist_name,video_playlist_id) VALUES ("${apiKey}","${playlistName}","${playlistId}")`,
      function(error, result) {
        if (error) {
          res
            .status(400)
            .send({ errorCode: error.errno, errorDesc: error.code });
        } else {
          if (result.length === 0) {
            res.status(404).send({
              errorCode: "0160",
              errorDesc: "There was an error, please try later"
            });
          } else {
            const theReturn = {
              table_id: result.insertId,
              video_playlist_id: playlistId,
              video_playlist_name: playlistName
            };
            res.send(theReturn);
          }
        }
      }
    );
    connection.release();
  });
});
/////////////////////////////////////////////////////////
//PLAYLIST///////////////////////////////////////////////
/////////////////////////////////////////////////////////

module.exports = router;
