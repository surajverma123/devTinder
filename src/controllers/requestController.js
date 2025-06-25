const { sendRequest, reviewRequest } = require('../services/requestService');

const send = async (req, res) => {
  try{
    const fromUserId =  req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

   const { data } = await sendRequest({ fromUserId, toUserId, status });

    res.status(200).json({
      message: req.user.firstName + ' is ' + status + ' in ' + isToUserExits.firstName,
      data,
    });
  } catch(error) {
    const errorStatus = error.statusCode || 400;
    const errorMessage = error.message || 'Something went wrong';

    res.status(errorStatus).send(errorMessage);
  }
};

const review = async(req, res) => {
  try {
    const loggedInUser = req.user;
    const status = req.params.status;
    const requestId = req.params.requestId;
    
    const { data } = await reviewRequest({ status, loggedInUser, requestId });
    
    res.status(200).json({
      message: `Connection request ${status}`,
      data,
    });

  } catch(error) {
    res.status(400).send('Error: ' + error.message);
  }
};

module.exports = {
  send,
  review,
};