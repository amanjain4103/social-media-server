const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true,
        min: 1,
        max: 255
    },
    lastName: {
        type:String,
        required: true,
        min: 1,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    avatarSrc: {
        type: String,
        min:2,
        max:2048
    },
    numberOfPosts: {
        type: Number
    },
    numberOfLikes: {
        type: Number
    },
    posts: {
        type: Array
    }
});

module.exports = mongoose.model("users", userSchema);   