const express = require("express");
const app = express();
const database = require("./config/database");
const User = require("./models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

// middleware to pass JSON data to javascript data.
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res, next) => {
  try {
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

app.get("/profile", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    if(!user) {
      throw new Error("User is not exits, please login again")
    }
   
    res.status(200).json({
      success: true,
      user,
    });
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
