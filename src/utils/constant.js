
const USER_SAFE_DATA = 'fullName firstName lastName photoUrl age gender about skills status lastSeen';
const USER_PROFILE_DATA = 'fullName caste dob emailId age gender photoUrl about skills status lastSeen';
const SEND_REQUEST_ALLOWED_STATUS =  ['ignored', 'interested'];
const REVIEW_REQUEST_ALLOWED_STATUS = ['accepted', 'rejected'];

module.exports = {
  USER_PROFILE_DATA,
  USER_SAFE_DATA,
  SEND_REQUEST_ALLOWED_STATUS,
  REVIEW_REQUEST_ALLOWED_STATUS
};