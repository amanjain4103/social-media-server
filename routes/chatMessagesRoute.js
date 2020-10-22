const router = require("express").Router();
const Message = require("../model/Message");

router.get("/previous-chats",(req,res) => {

    Message.findOne({roomId:req.query.roomId},(errorWhileFetchingChats,doc) => {
        if(errorWhileFetchingChats) {
            res.json({
                "message":"OOps!! some error occured while fetching previous chats"
            })
        }else {
            if(doc!==null) {
                if(doc!=="") {
                    res.json({
                        "message":"gotPreviousChatSuccessFully",
                        "previousChatMessages":doc.chatMessages
                    })
                }else {
                    res.json({
                        "message":"noPreviousChats"
                    })
                }
            }else {
                res.json({
                    "message":"noPreviousChats"
                })
            }
        }
    })

    
})

router.put("/save-chats", (req,res) => {

    Message.findOne({roomId:req.body.roomId},(errorWhileFetchingChats,doc) => {
        if(errorWhileFetchingChats) {
            res.json({
                "message":"OOps!! some error occured while fetching previous chats"
            })
        }else {
            if(doc!==null) {
                if(doc!=="") {

                    let inittialChats = doc.chatMessages;
                    let newChats = req.body.newChats;
                    let totalchats = [...inittialChats, ...newChats];

                    Message.findOneAndUpdate({"roomId":req.body.roomId},{"chatMessages":totalchats},(errorWhileSavingNewChats,doc)=> {
                        if(errorWhileSavingNewChats) {
                            res.json({
                                "message":"OOps!! some error occured while saving chats"
                            })
                        }else {
                            if(doc!==null) {
                                if(doc!=="") {
                                    res.json({
                                        "message":"savedChats",
                                        "totalChatMessages":totalchats
                                    })
                                }else {
                                    res.json({
                                        "message":"not able to find the chat Conversations."
                                    })
                                }
                            }else {
                                res.json({
                                    "message":"not able to find the chat Conversations."
                                })
                            }
                        }
                    })

                    
                }else {
                    res.json({
                        "message":"no id exists doc!==\"\" "
                    })
                }
            }else {

                // creating new chat because it doesn't already exists
                const newChat = new Message({
                    "roomId":req.body.roomId,
                    "chatMessages":req.body.newChats
                })

                newChat.save();

                res.json({
                    "message":"no id doc!== null"
                })
            }
        }
    })

    // res.json({
    //     "message":"hello world"
    // })
})

module.exports = router;