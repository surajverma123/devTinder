const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            require: true,
            minLength: 4,
            maxLength: 30,
        },
        lastName: {
            type: String,
            minLength: 4,
            maxLength: 30,
        },
        emailId: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate(email) {
                if (!validator.isEmail(email)){
                    throw new Error("Invalid email address")
                }
            }
        },
        password: {
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
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender value is not valid")
                }
            }
        },
        photoUrl: {
            type: String,
            default: "dummy url"
        },
        about: {
            type: String,
            default: "This is a default description for user"
        },
        skills: {
            type: [String]
        }
    },
    { timestamps: true }
)

userSchema.methods.getJWT = async function() {
    const user = this;
     const token = jwt.sign(
            {
              _id: user._id,
              email: user.emailId,
            },
            "DEV@Tinder123#",
            {
              expiresIn: '1d'
            }
          );
          
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, this.password);
    return isPasswordValid;
}

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
