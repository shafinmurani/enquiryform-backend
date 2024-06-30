const mysql = require("mysql");
class ServiceGroup {
  add(category) {
    const con = mysql.createConnection({
      host: "localhost",
      user: "enquiryform",
      password: "enquiryform",
      database: "enquiryform",
    });
    con.connect(function (err) {
      if (err) throw err;
      con.query(
        "INSERT INTO tbl_category (vCategory) SELECT * FROM (SELECT ?) as tmp WHERE NOT EXISTS (SELECT * FROM tbl_category WHERE vCategory = ? && isDeleted = 'No') LIMIT 1;",
        [category, category],
        function (err, result, fields) {
          console.log(result.affectedRows);
          if (err) throw err;
          if (result) {
            return {
              result: true,
              message: "Category added successfully",
              affectedRows: result.affectedRows,
            };
          } else {
            return { result: false, message: err };
          }
        }
      );
    });
  }
}
