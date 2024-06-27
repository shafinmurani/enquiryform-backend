const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { parseFlagList } = require("mysql/lib/ConnectionConfig");
const cors = require("cors");
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Back end server for enquiry form");
});

app.post("/api/login", (req, res) => {
  console.log(req.body);
  const con = mysql.createConnection({
    host: "localhost",
    user: "enquiryform",
    password: "enquiryform",
    database: "enquiryform",
  });
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM tbl_admin WHERE vEmail = ? AND vPassword = ?",
      [req.body.email, req.body.password],
      function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
          res.send(true);
        } else {
          res.send(false);
        }
      }
    );
  });
});
app.listen(3001, () => console.log("Server listening at port 3001"));
