 const express = require("express");
 const app = express();
 const database = require("./config/database");
 const User = require("./models/user"); 


 // middleware to pass JSON data to javascript data.
 app.use(express.json());

 app.post("/signup", async (req, res, next) => {
   const userObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      age: req.body.age,
      gender: req.body.gender
   };
   console.log("========== REQ.BODY ======", req.body);
   const user = new User(userObj);
   await user.save();
   res.status(201).json({
      message: "User added successfully",
      user,
   })
 })

//  GET:- User
app.get("/user", async (req, res) => {
   const email = req.body.email;
   try {
      const users = await User.find({ emailId: email});
      if (users.length === 0) {
         res.status(404).json({ message: "User not found"})
      } else{
         res.status(200).json({ users })
      }
   } catch (err){
      res.status(400).send("Something went wrong")
   }

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