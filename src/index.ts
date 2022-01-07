import "reflect-metadata";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "./controllers";
import { AppRouter } from "./AppRouter";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ["dfsa"] }));
app.use(AppRouter.getInstance());

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
