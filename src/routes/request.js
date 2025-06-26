const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { review, send } = require('../controllers/requestController');
const router = express.Router();

router.post('/send/:status/:toUserId', userAuth, send);

router.post('/review/:status/:requestId', userAuth, review);

module.exports = router;