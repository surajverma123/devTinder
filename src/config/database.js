const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://surajverma:devtinder@cluster0.b4g8f.mongodb.net/devTinder", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });       
};

module.exports = connectDB;