const express = require("express");
const app = express();
const otpAuthRoutes = require("./routes/otpAuth");
const usersRoute = require("./routes/usersRoute");
const securedRoute = require("./routes/securedRoute");
const chatMessagesRoute = require("./routes/chatMessagesRoute");
const dotenv = require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");

// mongodb and mongoose
const mongoose = require("mongoose");
const Message = require("./model/Message");
mongoose.connect(process.env.DB_CONNECTION_STRING, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    },
    () => {
        console.log("connected to db!")
    }
)

// socket.io 
const io = require("socket.io")(8001);
const msgdb = [{"email":"you","message":"connected"}];
io.on("connection", socket => {

    const id= socket.handshake.query.id;
    socket.join(id);

    socket.emit("connection-establish",{"roomId":id,"message":"connected successfully"});
    socket.on("send-chat-message", messageObj => {
        // msgdb.push({...messageObj})
        
        // save messages to db
        Message.findOneAndUpdate({"roomId":id},{$push: {"chatMessages":messageObj} },(errorWhileSavingNewChats,doc)=> {
            if(errorWhileSavingNewChats) {
                // res.json({
                //     "message":"OOps!! some error occured while saving chats"
                // })
            }else {
                if(doc!==null) {
                    if(doc!=="") {
                        console.log(messageObj)
                    }else {
                        // some problem with fetching doc otherwise it exists
                    }
                }else {
                    const newChat = new Message({
                        "roomId":id,
                        "chatMessages":[].push(messageObj)
                    })
                    newChat.save();
                }
                // if(doc!==null) {
                //     if(doc!=="") {
                //         res.json({
                //             "message":"savedChats",
                //             "totalChatMessages":totalchats
                //         })
                //     }else {
                //         res.json({
                //             "message":"not able to find the chat Conversations."
                //         })
                //     }
                // }else {
                //     res.json({
                //         "message":"not able to find the chat Conversations."
                //     })
                // }
            }
        })
        //message saved

        socket.broadcast.emit("chat-message", messageObj);
    })
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());
app.use(express.json());

// routes
app.use("/otp",otpAuthRoutes);
app.use("/users",usersRoute);
app.use("/secured",securedRoute);
app.use("/messages",chatMessagesRoute);

app.get("/",(req,res) => {
    res.status(200).send("hello world");
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server up and running");
})

// routes 
// post => /otp/send => require body with phonenumber and channel
// post => /otp/verify => requires body with phonenumber and code

