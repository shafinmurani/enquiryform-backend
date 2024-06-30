import { SqlConnection } from "../exports";

export class ServiceGroup {
  public getServiceCount(id: number): number {
    var count = 0;
    console.log(id);
    const con = new SqlConnection().getConnection();
    con.connect(async function (err) {
      if (err) throw err;
      con.query(
        "SELECT * FROM tbl_product WHERE iCategoryID=?",
        [id],
        function (err, result, fields) {
          count = result.length;
          console.log(count);
        },
      );
    });
    console.log(count);
    return count;
  }
}
