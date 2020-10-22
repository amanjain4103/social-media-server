const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    avatarSrc: {
        type: String,
        required: true,
        min: 10
    },
    postSrc: {
        type: String,
        required: true,
        min:10      
    },
    likes: {
        type: Array,
        required:false,
        min:0,
        max:1000
    },
    caption: {
        type: String,
        required: true,
        min: 10,
        max: 2048
    },
    comments: {
        type: Array,
        required:false,
        max: 255
    },
    isLiked: {
        type: Boolean,
        required: false,   
    }

})

module.exports = mongoose.model("feeds",feedSchema);