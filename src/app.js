const express = require("express");
const app = express();
const database = require("./config/database");
const User = require("./models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// middleware to pass JSON data to javascript data.
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body);
    // Validate the data
    validateSignupData(req);

    // Encrypt the password
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // save to the database
    const userObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      age: req.body.age,
      gender: req.body.gender,
      password: passwordHash,
    };
    console.log("========== REQ.BODY1 ======", req.body);
    const user = new User(userObj);
    await user.save();
    res.status(201).json({
      message: "User added successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

app.get("/profile", async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedValue = await jwt.verify(token, "DEV@Tinder123#");
    const { _id } = decodedValue;
    const user = await User.findById(_id);

    if(!user) {
      throw new Error("User is not exits, please login again")
    }
   
    res.status(200).json({
      success: true,
      user,
    });
   
    console.log("=========>>>>>> Cookie ====>>>", decodedValue);
    // res.status(200).send("Reading coockies");
  } catch (error) {
    res.status(403).json({
      message: error.message || "Something went wrong",
      error
    })
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // make a validator

    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }
    const user = await User.findOne({ emailId: email });
    if (!user) {
      throw new Error("Email and password are not match");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create JWTtoken
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.emailId,
        },
        "DEV@Tinder123#"
      );
      console.log("======== TOKEN ========", token);
      // set Cookie
      res.cookie("token", token);
      res.status(200).send("User login successfull");
    } else {
      throw new Error("password is not valid");
    }
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  }
});

//  GET:- User
app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const users = await User.find({ emailId: email });
    if (users.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ users });
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Feed API - GET /feed - get all the user from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "User successfully deleted!!!",
    user,
  });
});

// Update a user
app.patch("/user", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userId = req.body.userId;

  const data = req.body;
  try {
    const ALLOWED_UPDATE = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllow = Object.keys(data).every((key) =>
      ALLOWED_UPDATE.includes(key)
    );

    if (!isUpdateAllow) {
      throw new Error("Updates not allow");
    }

    if (data?.skills.length > 5) {
      throw new Error("Not allow more than 5");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName: firstName, lastName: lastName },
      { runValidators: true, returnDocument: "after" }
    );
    res.status(201).json({ mesasge: "User is updated successfully", user });
  } catch (error) {
    res.status(500).json({
      message: `Update Failed: ${error.message}`,
    });
  }
});

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
