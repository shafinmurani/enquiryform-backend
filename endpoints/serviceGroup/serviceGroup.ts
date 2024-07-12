import express, { Request, Response } from "express";
import * as modules from "../../modules/exports";

const router = express.Router();

router.post("/get", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
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
      new modules.SqlConnection().closeConnection(con);
    });
  });
});

router.post("/add", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "INSERT INTO tbl_category (vCategory) SELECT * FROM (SELECT ?) as tmp WHERE NOT EXISTS (SELECT * FROM tbl_category WHERE vCategory = ? && isDeleted = 'No') LIMIT 1;",
      [req.body.category, req.body.category],
      function (err, result, fields) {
        console.log(result.affectedRows);
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            message: "Category added successfully",
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
  con.connect(async function (err) {
    const con2 = new modules.SqlConnection().getConnection();
    if (err) throw err;
    con2.connect(function (err) {
      con.query(
        "SELECT * FROM tbl_product WHERE iCategoryID=? AND isDeleted='No' ",
        [req.body.id],
        function (err, result) {
          console.log(result.length);
          if (result.length > 0) {
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
                  console.log(result);
                  res.json({
                    result: true,
                    message: "Category removed successfully",
                    list: result,
                  });
                } else {
                  res.json({ result: false, message: err });
                }
                new modules.SqlConnection().closeConnection(con);
                new modules.SqlConnection().closeConnection(con2);
              },
            );
          }
        },
      );
    });
  });
});

router.post("/get-specific", (req, res) => {
  console.log(req.body.id);
  const con = new modules.SqlConnection().getConnection();
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
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});

export { router as serviceGroupRouter };
