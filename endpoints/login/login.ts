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
        console.log(result);
        console.log(req.body.password);
        if (result.length > 0) {
          if (result[0].vPassword == req.body.password) {
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
        } else {
          res.json({ result: false });
        }
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});
router.post("/decode", (req: Request, res: Response) => {
  const decoded = new modules.JWT().decode(req.body.token);
  res.json({ decodedToken: decoded });
});
router.post("/verify", (req: Request, res: Response) => {
  const decoded = new modules.JWT().verifyToken(req.body.token);
  console.log(decoded);
  res.json(decoded);
});

export { router as loginRouter };
