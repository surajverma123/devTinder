const { getProfile, updateProfile} = require('../controllers/profileController');
const User = require('../models/user');

jest.mock('../models/user');

describe('User profile controller', () => {
  beforeEach(() => {
    req = {
     userId: '123'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = {};
  });

  it('Get user profile successfully', async() => {
    const mockUser = {
      firstName: 'suraj',
      lastName: 'verma',
      age: 32,
      _id: '123'
    };

    User.findById.mockResolvedValue(mockUser);
    await getProfile(req, res);
    expect(User.findById).toHaveBeenCalledWith(req.userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: mockUser,
    });
  });

  it('Get 403 if user not found', () => {

  });
});