import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import * as modules from "./modules/exports";
import bodyParser from "body-parser";
import cors from "cors";
import * as routes from "./endpoints/exports";

dotenv.config();
const app: Application = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Back end server for enquiry form");
});

app.use("/api/service-group/", routes.serviceGroupRouter);
app.use("/api/login", routes.loginRouter);
app.use("/api/service", routes.serviceRouter);
app.use("/api/party", routes.partyRouter);
app.use("/api/company", routes.companyRouter);
app.use("/api/dealer", routes.dealerRouter);
app.use("/api/renewals", routes.renewalRouter);
app.use("/api/admin", routes.adminRouter);
app.use("/api/database/export", routes.databaseExportRouter);
app.use("/api/database/import", routes.databaseImportRouter);

app.listen(3001, () => {
  console.log(`Server running at http://localhost:3001`);
});
