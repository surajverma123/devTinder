const express = require('express');

const router = express.Router();

const { userAuth } = require('../middlewares/auth');
const {
  connections,
  feed,
  requestReceived,
  profile,
  addToFavorite,
  removeFromFavorite,
  getAllFavorites,
} = require('../controllers/userController');


router.get('/requests/received', userAuth, requestReceived);


router.get('/connections', userAuth, connections);

router.get('/feed', userAuth, feed);
router.get('/profile/:userId', userAuth, profile);

router.get('/favorite', userAuth, getAllFavorites);
router.post('/favorite', userAuth, addToFavorite);

router.delete('/favorite', userAuth, removeFromFavorite);

module.exports = router;