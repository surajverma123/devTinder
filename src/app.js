const express = require("express");
const app = express();
const cors = require("cors");
const database = require("./config/database");

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// middleware to pass JSON data to javascript data.
app.use(express.json());
app.use(cookieParser());

app.use(cors())
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.get("/", (req, res, next) => {
  res.send("API working fine");
})

database()
  .then(() => {
    console.log("Database connection has established successfully");
    app.listen(7777, () => {
      console.log("=========== Server started at 7777 ======");
    });
  })
  .catch((error) => {
    console.log("Error: Not able to connect with database", error);
  });
