const express = require("express");
const app = express();
const server = require("http").Server(app);
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

// video call functionality
const {ExpressPeerServer} = require("peer")
const peerServer = ExpressPeerServer(server, {
    debug:true
})
app.use("/peerjs",peerServer);

// socket.io 
const io = require("socket.io")(server);

io.on("connection", socket => {

    const id= socket.handshake.query.id;
    socket.join(id);
    console.log("connected")

    socket.on("join-room-on-video-call",(roomId,userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit("user-connected-on-video-call",userId);
        socket.broadcast.emit("user-connected-on-video-call",userId);
    })



    socket.emit("connection-establish",{"roomId":id,"message":"connected successfully"});

    socket.on("send-chat-message", messageObj => {

        // save messages to db
        try {

            Message.findOneAndUpdate({"roomId":id},{$push: {"chatMessages":messageObj} },(errorWhileSavingNewChats,doc)=> {
                
                
                
                if(errorWhileSavingNewChats) {
                    // res.json({
                    //     "message":"OOps!! some error occured while saving chats"
                    // })
                }else {
                    if(doc!==null) {
                        if(doc!=="") {
                            // message must be added to database
                            // console.log(messageObj)
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
                    
                }
            })
        }catch(error) {
            // some error must be encountered but I used try catch so that server won't crash on in apropriate conditions
        }
        //message saved

        socket.broadcast.emit("chat-message", messageObj);
    })

    // socket.on("join-video-call", (roomId, userId) => {
    //     console.log(roomId+ " "+ userId);   
    //     socket.join(roomId);
        
    // })


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
server.listen(port, () => {
    console.log("server up and running");
})

// routes 
// post => /otp/send => require body with phonenumber and channel
// post => /otp/verify => requires body with phonenumber and code

