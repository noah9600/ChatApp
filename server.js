const express = require('express');
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("userjoined", username); // Notify other clients that a new user joined
    });

    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " left the chatroom"); // Notify other clients that a user left
    });

    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message); // Broadcast the received message to all clients except the sender
    });
});

server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
