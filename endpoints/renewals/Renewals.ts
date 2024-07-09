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
      `INSERT INTO tbl_renewal(
      iAdminID,
      iCategoryID,
      iProductID,
      dtRegister,
      dtExpiry,
      iPartyID,
      iQty,
      dRate,
      dAmount,
      dTax,
      eTaxType,
      dTotalAmount,
      iAccountID,
      iDealerID,
      tRemarks,
      vType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
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
        req.body.taxPercent,
        req.body.taxType,
        req.body.totalAmt,
        req.body.companyID,
        req.body.dealerID,
        req.body.remarks,
        req.body.productType,
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
router.post("/delete", (req, res) => {
  const con = new modules.SqlConnection().getConnection();

  con.connect(function (err) {
    console.log(req.body);
    if (err) throw err;
    con.query(
      "UPDATE tbl_renewal SET isDeleted = 'Yes' WHERE iRenewalID = ?;",
      [req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          console.log(result);
          res.json({
            result: true,
            message: "Renewal removed successfully",
            list: result,
          });
        } else {
          res.json({ result: false, message: err });
        }
      },
    );
  });
});

router.post("/set-inactive", (req, res) => {
  const con = new modules.SqlConnection().getConnection();

  con.connect(function (err) {
    console.log(req.body);
    if (err) throw err;
    con.query(
      "UPDATE tbl_renewal SET eStatus = 'Deactive' WHERE iRenewalID = ?;",
      [req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          console.log(result);
          res.json({
            result: true,
            message: "Renewal status set to Inactive",
            list: result,
          });
        } else {
          res.json({ result: false, message: err });
        }
      },
    );
  });
});

router.post("/set-active", (req, res) => {
  const con = new modules.SqlConnection().getConnection();

  con.connect(function (err) {
    console.log(req.body);
    if (err) throw err;
    con.query(
      "UPDATE tbl_renewal SET eStatus = 'Active' WHERE iRenewalID = ?;",
      [req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          console.log(result);
          res.json({
            result: true,
            message: "Renewal status set to Active",
            list: result,
          });
        } else {
          res.json({ result: false, message: err });
        }
      },
    );
  });
});

router.post("/get-specific", (req: Request, res: Response) => {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM tbl_renewal WHERE iRenewalID = ?;",
      [req.body.id],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
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

router.post("/edit", (req, res) => {
  console.log(req.body.id);
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `UPDATE tbl_renewal SET iCategoryID=?, iProductID=?, dtRegister=?,dtExpiry=?,iPartyID=?,iQty=?,dRate=?,dAmount=?,dTax=?,eTaxType=?,dTotalAmount=?,iAccountID=?,iDealerID=?,vType=?,tRemarks=? WHERE iRenewalID = ?;`,
      [
        req.body.productGroupID,
        req.body.productID,
        req.body.registrationDate,
        req.body.expiryDate,
        req.body.partyID,
        req.body.quantity,
        req.body.rate,
        req.body.amount,
        req.body.taxPercent,
        req.body.taxType,
        req.body.totalAmt,
        req.body.companyID,
        req.body.dealerID,
        req.body.remarks,
        req.body.productType,
        req.body.id,
      ],
      function (err, result, fields) {
        if (err) throw err;
        if (result) {
          res.json({
            result: true,
            message: "Renewal updated successfully",
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
