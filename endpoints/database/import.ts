import express, { Request, Response } from "express";
import * as modules from "../../modules/exports";
import csvtojson from "csvtojson";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/service-group",
  upload.single("file"),
  function (req: Request, res: Response) {
    const con = new modules.SqlConnection().getConnection();
    // CSV file name
    const fileName = req.file?.path;
    console.log(req.body);
    if (fileName) {
      csvtojson()
        .fromFile(fileName)
        .then((source) => {
          // Fetching the data from each row
          // and inserting to the table "sample"
          for (var i = 0; i < source.length; i++) {
            var id = source[i]["iCategoryID"],
              name = source[i]["vCategory"],
              deleted = source[i]["isDeleted"];

            console.log(source);
            var insertStatement =
              "INSERT INTO tbl_category (vCategory,isDeleted) SELECT * FROM (SELECT ?,?) as tmp WHERE NOT EXISTS (SELECT * FROM tbl_category WHERE vCategory = ? && isDeleted = 'No') LIMIT 1;";

            var items = [name, deleted, name];
            // Inserting data of current row
            // into database
            con.query(insertStatement, items, (err, results, fields) => {
              if (err) {
                console.log("Unable to insert item at row ", i + 1);
                res.json({ status: false, err: err });
              }
            });
          }
          console.log("All items stored into database successfully");
          res.json({ status: true });
        });
    }
  },
);

router.post(
  "/company",
  upload.single("file"),
  function (req: Request, res: Response) {
    const con = new modules.SqlConnection().getConnection();
    // CSV file name
    const fileName = req.file?.path;
    console.log(req.body);
    if (fileName) {
      csvtojson()
        .fromFile(fileName)
        .then((source) => {
          // Fetching the data from each row
          // and inserting to the table "sample"
          for (var i = 0; i < source.length; i++) {
            var id = source[i]["iAccountID"],
              name = source[i]["vAccount"],
              deleted = source[i]["isDeleted"];

            console.log(source);
            var insertStatement =
              "INSERT INTO tbl_account (vAccount,isDeleted) SELECT * FROM (SELECT ?,?) as tmp WHERE NOT EXISTS (SELECT * FROM tbl_account WHERE vAccount = ? && isDeleted = 'No') LIMIT 1;";

            var items = [name, deleted, name];
            // Inserting data of current row
            // into database
            con.query(insertStatement, items, (err, results, fields) => {
              if (err) {
                console.log("Unable to insert item at row ", i + 1);
                res.json({ status: false, err: err });
              }
            });
          }
          console.log("All items stored into database successfully");
          res.json({ status: true });
        });
    }
  },
);

export { router as databaseImportRouter };
