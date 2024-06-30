const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const ServiceGroup = require("./modules/service-group/ServiceGroup");
dotenv.config();
app.use(cors());

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
      },
    );
  });
});
app.post("/api/service-group/add", (req, res) => {
  res.json(ServiceGroup.add(req.body.category));
});
app.post("/api/service-group/get", (req, res) => {
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
          list: result,
        });
      } else {
        res.json({ result: false, message: err });
      }
    });
  });
});

app.post("/api/service-group/delete", (req, res) => {
  console.log(req.body.id);
  const con = mysql.createConnection({
    host: "localhost",
    user: "enquiryform",
    password: "enquiryform",
    database: "enquiryform",
  });
  con.connect(async function (err) {
    if (err) throw err;
    var serviceCount = await getServiceCount(req.body.id);
    if (serviceCount > 0) {
      res.json({
        result: false,
        message: "There are services under this Group. Delete failed",
      });
    } else {
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
        },
      );
    }
  });
});

app.post("/api/service-group/get-specific", (req, res) => {
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
      "SELECT * FROM tbl_category WHERE iCategoryID = ?;",
      [req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          console.log(result);
          res.json({
            result: true,
            list: result,
          });
        } else {
          res.json({ result: false, message: err });
        }
      },
    );
  });
});

app.post("/api/service-group/edit", (req, res) => {
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
      "UPDATE tbl_category SET vCategory = ? WHERE iCategoryID = ?;",
      [req.body.category, req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            message: "Category updated successfully",
            list: result,
          });
        } else {
          res.json({ result: false, message: err });
        }
      },
    );
  });
});
app.post("/api/service/get", (req, res) => {
  const con = mysql.createConnection({
    host: "localhost",
    user: "enquiryform",
    password: "enquiryform",
    database: "enquiryform",
  });
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM tbl_product;", function (err, result, fields) {
      if (err) throw err;
      if (result) {
        res.json({
          result: true,
          list: result,
        });
      } else {
        res.json({ result: false, message: err });
      }
    });
  });
});
app.post("/api/service/add", (req, res) => {
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
      "INSERT INTO tbl_product (iCategoryID, vProduct) SELECT * FROM (SELECT ?,?) as tmp WHERE NOT EXISTS (SELECT * FROM tbl_product WHERE vProduct = ? && isDeleted = 'No') LIMIT 1;",
      [req.body.serviceGroup, req.body.service, req.body.service],
      function (err, result, fields) {
        console.log(result);
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            message: "Service added successfully",
            affectedRows: result.affectedRows,
          });
        } else {
          res.json({ result: false, message: err });
        }
      },
    );
  });
});
app.post("/api/service/delete", (req, res) => {
  console.log(req.body.id);
  const con = mysql.createConnection({
    host: "localhost",
    user: "enquiryform",
    password: "enquiryform",
    database: "enquiryform",
  });
  con.connect(function (err) {
    console.log(req.body);
    if (err) throw err;
    con.query(
      "UPDATE tbl_product SET isDeleted = 'Yes' WHERE iProductID = ?;",
      [req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          console.log(result);
          res.json({
            result: true,
            message: "Category removed successfully",
            list: result,
          });
        } else {
          res.json({ result: false, message: err });
        }
      },
    );
  });
});
app.listen(3001, () => console.log("Server listening at port 3001"));

function getServiceCount(id) {
  var count = 0;
  console.log(id);
  const con = mysql.createConnection({
    host: "localhost",
    user: "enquiryform",
    password: "enquiryform",
    database: "enquiryform",
  });
  con.connect(async function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM tbl_product WHERE iCategoryID=?",
      [id],
      function (err, result, fields) {
        count = result.length;
        console.log(count);
      },
    );
  });
  console.log(count);
  return count;
}
