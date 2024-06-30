import express, { Request, Response } from "express";
import * as modules from "../../modules/exports";

const router = express.Router();

router.post("/get", (req, res) => {
  const con = new modules.SqlConnection().getConnection();

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
router.post("/add", (req, res) => {
  const con = new modules.SqlConnection().getConnection();

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
router.post("/delete", (req, res) => {
  const con = new modules.SqlConnection().getConnection();

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

export { router as serviceRouter };
