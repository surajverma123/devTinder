const express = require("express");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/sendConnectRequest", userAuth, async (req, res, next) => {
    res.send("Connect request send")
  });

module.exports = router;