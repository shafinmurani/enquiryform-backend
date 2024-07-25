import express, { Request, Response } from "express";
import * as modules from "../../modules/exports";

const router = express.Router();

router.post("/get", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM tbl_admin;", function (err, result, fields) {
      if (err) throw err;
      if (result) {
        res.json({
          result: true,
          list: result,
        });
      } else {
        res.json({ result: false, message: err });
      }
      new modules.SqlConnection().closeConnection(con);
    });
  });
});

router.post("/add", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "INSERT INTO tbl_admin (vFirstName, vLastName, vEmail, vPassword, eRole, iAddedBy) SELECT * FROM (SELECT ?,?,?,?,?,?) as tmp WHERE NOT EXISTS (SELECT * FROM tbl_admin WHERE vEmail = ? && isDelete = 'No') LIMIT 1;",
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        req.body.role,
        req.body.iAddedBy,
        req.body.email,
      ],
      function (err, result, fields) {
        console.log(result);
        if (err) throw err;
        if (result) {
          console.log(result);
          res.json({
            result: true,
            message: "User account added successfully",
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

router.post("/delete", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.query(
    "UPDATE tbl_admin SET isDelete = 'Yes' WHERE iAdminID = ?;",
    [req.body.id],
    function (err, result, fields) {
      if (err) throw err;
      if (result) {
        console.log(result);
        res.json({
          result: true,
          message: "User removed successfully",
          list: result,
        });
      } else {
        res.json({ result: false, message: err });
      }
      new modules.SqlConnection().closeConnection(con);
    },
  );
});

router.post("/get-specific", (req, res) => {
  console.log(req.body.id);
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM tbl_admin WHERE iAdminID = ?;",
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
      "UPDATE tbl_admin SET vFirstName=?, vLastName=?, vPassword=?, vEmail=?, eRole=?, eStatus=?, iAddedBy=? WHERE iAdminID = ?;",
      [
        req.body.firstName,
        req.body.lastName,
        req.body.password,
        req.body.email,
        req.body.role,
        req.body.status,
        req.body.iAddedBy,
        req.body.id,
      ],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            message: "User updated successfully",
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

export { router as adminRouter };
