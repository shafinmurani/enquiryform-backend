import express, { Request, Response } from "express";
import * as modules from "../../modules/exports";
var data_exporter = require("json2csv").Parser;

const router = express.Router();

router.get("/renewals", function (req: Request, res: Response) {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT iRenewalID ,
            iCategoryID,
            iProductID,
            dtRegister,
            dtExpiry,
            iPartyID,
            iQty,
            dRate,
            eTaxType,
            dTotalAmount,
            iAccountID,
            iDealerID,
            tRemarks,
            vType,
            isDeleted,
            eStatus FROM tbl_renewal`,
      // [req.query.dbName],
      function (error, data) {
        console.log(data);
        var mysql_data = JSON.parse(JSON.stringify(data));

        var file_header = [
          "iRenewalID ",
          "iCategoryID",
          "iProductID",
          "dtRegister",
          "dtExpiry",
          "iPartyID",
          "iQty",
          "dRate",
          "eTaxType",
          "dTotalAmount",
          "iAccountID",
          "iDealerID",
          "tRemarks",
          "vType",
          "isDeleted",
          "eStatus",
        ];

        var json_data = new data_exporter({ file_header });
        var csv_data = json_data.parse(mysql_data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=RenewalsExport.csv",
        );
        res.status(200).end(csv_data);
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});

export { router as databaseExportRouter };
