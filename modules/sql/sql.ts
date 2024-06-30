import mysql, { MysqlError } from "mysql";

export class SqlConnection {
  public getConnection(): mysql.Connection {
    const con: mysql.Connection = mysql.createConnection({
      host: "localhost",
      user: "enquiryform",
      password: "enquiryform",
      database: "enquiryform",
    });
    return con;
  }
}
