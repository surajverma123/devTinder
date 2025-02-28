 const express = require("express");
 const app = express();
 const database = require("./config/database");
 const User = require("./models/user"); 

 app.post("/signup", async (req, res, next) => {
   const userObj = {
      firstName: "Suraj",
      lastName: "verma",
      emailId: "suraj@yopmail.com",
      age: 31,
      gender: "Male"
   };
   const user = new User(userObj);
   await user.save();
   res.status(201).json({
      message: "User added successfully",
      user,
   })
 })

 database()
 .then(() => {
   console.log("Database connection has established successfully");
   app.listen(3000, () => {
      console.log("=========== Server started at 3000 ======")
   })
 })
 .catch(error => {
   console.log("Error: Not able to connect with database");
   console(error);
 })