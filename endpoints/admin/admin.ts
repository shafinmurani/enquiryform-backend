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

export { router as adminRouter };
