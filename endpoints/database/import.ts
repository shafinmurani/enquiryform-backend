import express, { Request, Response } from "express";
import * as modules from "../../modules/exports";
import csvtojson from "csvtojson";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/party", function (req: Request, res: Response) {
  const con = new modules.SqlConnection().getConnection();
  // CSV file name
  const fileName = "sample.csv";
  csvtojson()
    .fromFile(fileName)
    .then((source) => {
      // Fetching the data from each row
      // and inserting to the table "sample"
      for (var i = 0; i < source.length; i++) {
        // var Name = source[i]["Name"],
        //   Email = source[i]["Email"],
        //   Age = source[i]["Age"],
        //   City = source[i]["City"];

        console.log(source);
        // var insertStatement = `INSERT INTO sample values(?, ?, ?, ?)`;
        // var items = [Name, Email, Age, City];
        // Inserting data of current row
        // into database
        // con.query(insertStatement, items, (err, results, fields) => {
        //   if (err) {
        //     console.log("Unable to insert item at row ", i + 1);
        //     return console.log(err);
        //   }
        // });
      }
      console.log("All items stored into database successfully");
    });
});

export { router as databaseExportRouter };
