const express = require("express");
const router = express.Router();

const { getProfile, updateProfile} = require("../controllers/profileController");

const { userAuth } = require("../middlewares/auth");

router.get("/view", userAuth, getProfile);

router.patch("/edit", userAuth,updateProfile)


module.exports = router;