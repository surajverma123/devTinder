const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const database = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const initializeSocket = require("./utils/socket");
const app = express();
const http = require('http');

require("./utils/cronjob");
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
app.use("/chat", chatRouter);

app.get("/", (req, res, next) => {
  res.send("API working fine");
})

const server = http.createServer(app);

initializeSocket(server);
//server connectivity
const port = process.env.PORT;

//database connectivity
database()    
  .then(() => {  
    console.log("Database connection established successfully");
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error: Unable to connect to the database", error);
  });