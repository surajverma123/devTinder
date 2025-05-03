const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// save to the database
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 30,
    },
    caste: {
      type: String,
      required: true,
      enum: {
        values: ["dhobi", "pandit", "other"],
        message: `{VALUE} is not a valid caste type`,
      },
    },
    dob: {
      type: Date,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
      // maxLength: 30,
    },
    confirmPassword: {
      type: String,
      required: true,
      minLength: 4,
      // maxLength: 30,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      default: "dummy url",
    },
    about: {
      type: String,
      default: "This is a default description for user",
    },
    skills: {
      type: [String],
    },
    status: {
      type: String,
      default: 'offline',
      enum: {
        values: ['online', 'offline'],
        message: `{VALUE} is not valid for status`,
      }
    },
    lastSeen: {
      type: mongoose.Schema.Types.Date,
      default: null,
    }
  },
  { timestamps: true }
);
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.emailId,
    },
    "DEV@Tinder123#",
    {
      expiresIn: "1d",
    }
  );

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    this.password
  );
  return isPasswordValid;
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
