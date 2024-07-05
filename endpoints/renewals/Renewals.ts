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
    con.query(
      "INSERT INTO tbl_renewal(iAdminID, iCategoryID, iProductID, dtRegister, dtExpiry, iPartyID, iQty, dRate, dAmount, dTax, eTaxType, dTotalAmount, iAccountID, iDealerID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
      [
        req.body.adminId,
        req.body.productGroupID,
        req.body.productID,
        req.body.registrationDate,
        req.body.expiryDate,
        req.body.partyID,
        req.body.quantity,
        req.body.rate,
        req.body.amount,
        req.body.tax,
        req.body.taxType,
        req.body.totalAmt,
        req.body.companyID,
        req.body.dealerID,
      ],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            affectedRows: result.affectedRows,
          });
        } else {
          res.json({ result: false, message: err });
        }
      },
    );
  });
});
export { router as renewalRouter };
