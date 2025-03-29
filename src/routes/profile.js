const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData }  = require("../utils/validation");

router.get("/view", userAuth, async (req, res, next) => {
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

router.patch("/edit", userAuth, async(req, res,next) => {
try {
  if (!validateProfileEditData(req)) {
    throw new Error("Invalid Edit request")
  }
  const { user: loggedInUser } = req;
  console.log("======= USER ======", user);

  // Updating value with new values that provided by user
  Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
  await loggedInUser.save();
  res.status(201).json({
    message: "User updated successfully",
    user: loggedInUser 
  })
} catch(error) {
  res.status(400).json({
    message: "Can't able to update profile",
    error,
  })
} 
})


module.exports = router;