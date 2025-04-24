const validator = require('validator');
const bcrypt = require("bcrypt");

const { userLogin, userSignup } = require('../controllers/auth'); // Adjust the path
const User = require('../models/user'); // Adjust the path
const dataValidator = require('../utils/validation');

jest.mock('../models/user'); // Mock the User model
jest.mock('../utils/validation');
describe('userLogin controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        emailId: 'test@example.com',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      send: jest.fn(),
    };
    jest.spyOn(validator, 'isEmail'); // spy so we can control return values

    next = jest.fn();
  });

  it('should login user successfully and set cookie', async () => {
    validator.isEmail.mockReturnValue(true);

    const mockUser = {
      validatePassword: jest.fn().mockResolvedValue(true),
      getJWT: jest.fn().mockResolvedValue('mock-jwt-token'),
    };

    User.findOne.mockResolvedValue(mockUser);
    
    await userLogin(req, res, next);

    expect(validator.isEmail).toHaveBeenCalledWith('test@example.com');
    expect(User.findOne).toHaveBeenCalledWith({ emailId: 'test@example.com' });
    expect(mockUser.validatePassword).toHaveBeenCalledWith('password123');
    expect(mockUser.getJWT).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      'mock-jwt-token',
      expect.objectContaining({ expires: expect.any(Date) })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('User login successfull');
  });

  it('should return 403 if email is invalid', async () => {
    validator.isEmail.mockReturnValue(false);

    await userLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email is not valid' });
  });

  it('should return 403 if user not found', async () => {
    validator.isEmail.mockReturnValue(true);
    User.findOne.mockResolvedValue(null);

    await userLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are not match' });
  });

  it('should return 403 if password is incorrect', async () => {
    validator.isEmail.mockReturnValue(true);

    const mockUser = {
      validatePassword: jest.fn().mockResolvedValue(false),
    };

    User.findOne.mockResolvedValue(mockUser);

    await userLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'password is not valid' });
  });
});

describe("userSignup controller", () => {
  beforeEach(() =>{
    req = {
      body: {
        firstName: "suraj",
        lastName: "verma",
        emailId: "sv1009876@gmail.com",
        password: "Password@123",
        age: 32,
        gender: 'male',
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      send: jest.fn()
    }

    jest.spyOn(validator, 'isEmail');
    jest.spyOn(validator,'isStrongPassword');
    jest.spyOn(bcrypt, 'hash')

    next = jest.fn();
    jest.clearAllMocks();
  })

  it("Should signup successfully", async() => {
    const mockHashedPassword = "hashed-password";
    const mockSavedUser = {...req.body, password: mockHashedPassword};
    bcrypt.hash.mockResolvedValue(mockHashedPassword);
    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockSavedUser)
    }))

    validator.isEmail.mockResolvedValue(true);
    validator.isStrongPassword.mockResolvedValue(true);

    await userSignup(req, res, next);
    // expect(validateSignupData).toHaveBeenCalledWith(req);
    expect(bcrypt.hash).toHaveBeenCalledWith('Password@123', 10);
    expect(res.status).toHaveBeenCalledWith(201);
    console.log("======= JSON ========", res.json)
    expect(res.json).toHaveBeenCalledWith({
      message: "User added successfully",
      user: mockSavedUser
    })
  })

  it("should return 500 if save throws an error", async() =>{
    const error = new Error("DB Error");
    const hashedPassword = "Hashed Password";
    bcrypt.hash.mockResolvedValue(hashedPassword);
    User.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(error)
    }));

    await userSignup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error })
  })

  it("should return 500 if vatidation failed", async() =>{
    const error = new Error("Validation failed");

    dataValidator.validateSignupData.mockImplementation(() => {
      throw error;
    });

    await userSignup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error })
  })
})