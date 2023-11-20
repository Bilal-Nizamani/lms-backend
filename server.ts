import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config();
//
app.listen(process.env.PORT, () => {
  console.log("server is running port 5000");
  connectDB();
});
