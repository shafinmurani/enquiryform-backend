const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
app.use(cors());

function generateAccessToken(email, result) {
  /**
   * Generates an access token for the given username.
   *
   * @param {string} username - The username for which the token is being generated.
   * @return {string} The generated access token.
   */

  return jwt.sign(
    {
      email: email,
      signInTime: Date.now(),
      name: result[0].vFirstName + " " + result[0].vLastName,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "86400s",
    }
  );
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Back end server for enquiry form");
});

app.post("/api/login", (req, res) => {
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
          const token = generateAccessToken(req.body.email, result);
          res.status(200).json({
            token,
            result: true,
          });
        } else {
          res.json({ result: false });
        }
      }
    );
  });
});
app.post("/api/product-group/add", (req, res) => {
  const con = mysql.createConnection({
    host: "localhost",
    user: "enquiryform",
    password: "enquiryform",
    database: "enquiryform",
  });
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "INSERT INTO tbl_category (vCategory) VALUES (?);",
      [req.body.category],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            message: "Category added successfully",
          });
        } else {
          res.json({ result: false, message: err });
        }
      }
    );
  });
});
app.post("/api/product-group/get", (req, res) => {
  const con = mysql.createConnection({
    host: "localhost",
    user: "enquiryform",
    password: "enquiryform",
    database: "enquiryform",
  });
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM tbl_category;", function (err, result, fields) {
      if (err) throw err;
      if (result) {
        res.json({
          result: true,
          message: "Category added successfully",
          list: result,
        });
      } else {
        res.json({ result: false, message: err });
      }
    });
  });
});

app.post("/api/product-group/delete", (req, res) => {
  console.log(req.body.id);
  const con = mysql.createConnection({
    host: "localhost",
    user: "enquiryform",
    password: "enquiryform",
    database: "enquiryform",
  });
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "UPDATE tbl_category SET isDeleted = 'Yes' WHERE iCategoryID = ?;",
      [req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            message: "Category removed successfully",
            list: result,
          });
        } else {
          res.json({ result: false, message: err });
        }
      }
    );
  });
});

app.listen(3001, () => console.log("Server listening at port 3001"));
