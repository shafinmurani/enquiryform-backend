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

router.get("/service-group", function (req: Request, res: Response) {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT iCategoryID, vCategory, isDeleted FROM tbl_category`,
      // [req.query.dbName],
      function (error, data) {
        console.log(data);
        var mysql_data = JSON.parse(JSON.stringify(data));

        var file_header = ["iCategoryID", "vCategory", "isDeleted"];

        var json_data = new data_exporter({ file_header });
        var csv_data = json_data.parse(mysql_data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=ServiceGroupExport.csv",
        );
        res.status(200).end(csv_data);
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});
router.get("/company", function (req: Request, res: Response) {
  const con = new modules.SqlConnection().getConnection();
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT iAccountID, vAccount, isDeleted FROM tbl_account`,
      // [req.query.dbName],
      function (error, data) {
        console.log(data);
        var mysql_data = JSON.parse(JSON.stringify(data));

        var file_header = ["iAccountID", "vAccount", "isDeleted"];

        var json_data = new data_exporter({ file_header });
        var csv_data = json_data.parse(mysql_data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=CompanyExport.csv",
        );
        res.status(200).end(csv_data);
        new modules.SqlConnection().closeConnection(con);
      },
    );
  });
});

export { router as databaseExportRouter };
