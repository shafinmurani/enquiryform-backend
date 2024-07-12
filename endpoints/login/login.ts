import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import * as modules from "../../modules/exports";
import bodyParser from "body-parser";
import cors from "cors";
import mysql, { MysqlError } from "mysql";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM tbl_admin WHERE vEmail = ? AND vPassword = ? AND eStatus = 'Active'",
      [req.body.email, req.body.password],
      function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
          const token = new modules.JWT().generateAccessToken(
            req.body.email,
            result,
          );
          res.status(200).json({
            token,
            result: true,
          });
        } else {
          res.json({ result: false });
        }
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});
router.post("/decode", (req: Request, res: Response) => {
  console.log("TEST");
  const decoded = new modules.JWT().decode(req.body.token);
  res.json({ decodedToken: decoded });
});
export { router as loginRouter };
