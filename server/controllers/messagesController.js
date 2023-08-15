const Messages = require("../model/messageModel");

module.exports.addMessage = async(req, res, next) => {
    try {
        const {from,to,message} = req.body;
        const data = await Messages.create({
            message: {text: message},
            users: [from, to],
            sender: from
        })
        if(data)
            return res.json({msg: "Message stored successfully", status: true});
        else
            return res.json({msg: "Failed to store message", status: false});
    } catch(err) {
        next(err);
    }
}

module.exports.getAllMessage = async(req, res, next) => {
    try {
        const {from, to} = req.body;

        const messages = await Messages.find({
            users: {
               $all: [from, to]
            }
        }).sort({updatedAt: 1})

        const projectedMesssages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })

        res.json(projectedMesssages);
    } catch(err) {
        next(err);
    }
}

