
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const { run } = require('../utils/sendEmail');
const { SEND_REQUEST_ALLOWED_STATUS, REVIEW_REQUEST_ALLOWED_STATUS } = require('../utils/constant');

const sendRequest = async ({ status, toUserId, fromUserId }) => {
  
  if (!SEND_REQUEST_ALLOWED_STATUS.includes(status)) {
    const error =  new Error(`Invalid status type ${status}`);
    error.statusCode= 400;
    throw error;
  }

  const isToUserExits = await User.findById(toUserId);
  if (!isToUserExits) {
    const error =  new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  // IF there is an existing connection request
  const exitstingConnectionRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ]
  });

  if (exitstingConnectionRequest) {
    const error = new Error('Connection request is exits');
    error.statusCode = 400;
    throw error;    
  }

  const connectReuest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status
  });
  const data = await connectReuest.save();
  const emailResponse = await run();
  return { data, emailResponse };
};

const reviewRequest = async ({ status, loggedInUser, requestId }) => {
  // validate the request
  if (!REVIEW_REQUEST_ALLOWED_STATUS.includes(status)) {
    throw new Error('Status is not allowed ');
  }
  // request Id should be valid
    
  // loggedInId === toUserId
  const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUser._id,
    status: 'interested',
  });

  if (!connectionRequest) {
    throw new Error('Connection request not found');
  }

  connectionRequest.status = status;
  const data = await connectionRequest.save();
  return { data };
};

module.exports = {
  sendRequest,
  reviewRequest,
};