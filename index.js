import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import { Client } from "./models/index.js";

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI);

app.get("/", async (req, res) => {
  const result = await Client.find();
  console.log(result);
  res.render("login");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
  console.log(port);
}

app.listen(port, () => {
  console.log(`Server is running. All a GO!!`);
});
