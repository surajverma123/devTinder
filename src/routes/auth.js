const express = require("express");
const { userLogin, userSignup, userForgotPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/login", userLogin );

router.post("/signup", userSignup);

router.post("/forgot-password", userForgotPassword )

router.post("/logout", async(req, res, next) => {
  // set the cookies expire
  res.cookie('token', null, { expires: new Date(Date.now())});
  res.status(200).json({ message: "Logout is successfully"});
})

module.exports = router;
