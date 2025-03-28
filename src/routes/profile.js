const express = require("express");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/profile", userAuth, async (req, res, next) => {
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

module.exports = router;