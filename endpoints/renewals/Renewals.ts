import express, { Request, Response } from "express";
import * as modules from "../../modules/exports";

const router = express.Router();

router.post("/get", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM tbl_renewal;", function (err, result, fields) {
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
    con.query("SELECT * FROM tbl_renewal;", function (err, result, fields) {
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
export { router as renewalRouter };
