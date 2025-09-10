const mongoose = require('mongoose');

const connectDB = async () => {
    // nidhisurajverma@gmail.com/kanipura@@@477116#mongodb
    await mongoose.connect('mongodb+srv://devTinder:devTinder@cluster0.b4g8f.mongodb.net/devTinder', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });       
};

module.exports = connectDB;