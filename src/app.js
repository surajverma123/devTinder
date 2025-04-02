const express = require("express");
const app = express();
const cors = require("cors");
const database = require("./config/database");

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
require('dotenv').config();

// middleware to pass JSON data to javascript data.
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.get("/", (req, res, next) => {
  res.send("API working fine");
})

//server connectivity
const port = process.env.PORT;

const listener = app.listen(port, () => {
  console.log(`Server started on port ${listener.address().port}`);
});

//database connectivity
database()    
  .then(() => {  
    console.log("Database connection established successfully");
  })
  .catch((error) => {
    console.log("Error: Unable to connect to the database", error);
  });


// database()
//   .then(() => {
//     console.log("Database connection has established successfully");  
//     app.listen(process.env.PORT, () => {
//       console.log(`=========== Server started at ${process.env.PORT} ======`);
//     });
//   })
//   .catch((error) => {
//     console.log("Error: Not able to connect with database", error);
//   });
