const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    
    roomId: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    chatMessages: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model("messages", messageSchema);   