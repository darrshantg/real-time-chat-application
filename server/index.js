const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express();
const socket = require('socket.io');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const msgRoutes = require('./routes/messagesRoute');

app.use("/api/auth",userRoutes)
app.use("/api/messages",msgRoutes);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error" + err);
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-msg",(data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    })
})