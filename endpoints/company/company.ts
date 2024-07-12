import express, { Request, Response } from "express";
import * as modules from "../../modules/exports";

const router = express.Router();

router.post("/get", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM tbl_account;", function (err, result, fields) {
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
router.post("/add", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "INSERT INTO tbl_account (vAccount) SELECT * FROM (SELECT ?) as tmp WHERE NOT EXISTS (SELECT * FROM tbl_account WHERE vAccount = ? && isDeleted = 'No') LIMIT 1;",
      [req.body.companyName, req.body.companyName],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            message: "Company added successfully",
            affectedRows: result.affectedRows,
          });
        } else {
          res.json({ result: false, message: err });
        }
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});

router.post("/delete", (req, res) => {
  console.log(req.body);
  const con = new modules.SqlConnection().getConnection();

  con.connect(function (err) {
    console.log(req.body);
    if (err) throw err;
    con.query(
      "UPDATE tbl_account SET isDeleted = 'Yes' WHERE iAccountID = ?;",
      [req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          console.log(result);
          res.json({
            result: true,
            message: "Company removed successfully",
            list: result,
          });
        } else {
          res.json({ result: false, message: err });
        }
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});

router.post("/get-specific", (req, res) => {
  console.log(req.body.id);
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM tbl_account WHERE iAccountID = ?;",
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
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});

router.post("/edit", (req, res) => {
  console.log(req.body.id);
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "UPDATE tbl_account SET vAccount = ? WHERE iAccountID = ?;",
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
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});

export { router as companyRouter };
