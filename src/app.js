const express = require("express");
const app = express();
const database = require("./config/database");

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
// middleware to pass JSON data to javascript data.
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user", profileRouter);
app.use("/request", requestRouter);

database()
  .then(() => {
    console.log("Database connection has established successfully");
    app.listen(3000, () => {
      console.log("=========== Server started at 3000 ======");
    });
  })
  .catch((error) => {
    console.log("Error: Not able to connect with database", error);
  });
