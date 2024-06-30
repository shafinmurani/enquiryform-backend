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
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/api/service-group/", routes.serviceGroupRouter);
app.use("/api/login", routes.loginRouter);

app.listen(3001, () => {
  console.log(`Server is Fire at http://localhost:3001`);
});
