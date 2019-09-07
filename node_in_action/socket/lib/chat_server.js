const socketio = require("socket.io");
let io;
let guestNumber = 1;
let nikeNames = {};
let namesUsed = [];
let currentRoom = {};

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set("log level", 1);

    // 定义每个用户连接时的逻辑
    io.sockets.on("connection", function(socket) {
        // 用户登录进来，给每个用户赋予一个名字
        guestNumber = assignGuestName(
            socket,
            guestNumber,
            nikeNames,
            namesUsed
        );

        // 将用户添加到Lobby聊天室
        joinRoom(socket, "Lobby");

        //处理用户的消息，更名，以及聊天室的创建和变更
        handleMessageBroadcasting(socket, nikeNames);
        handleNameChangeAttempts(socket, nikeNames, namesUsed);
        handleRoomJoining(socket);

        // 当用户发起请求是，向用户提供已经被占用的聊天室的信息
        socket.on("rooms", function() {
            socket.emit("rooms", io.of("/").adapter.rooms);
        });

        // 定义用户断开聊天室的逻辑
        handleClientDisconnection(socket, nikeNames, namesUsed);
    });
};

function assignGuestName(socket, guestNumber, nikeNames, namesUsed) {
    const name = "Guest" + guestNumber;
    nikeNames[socket.id] = name;
    socket.emit("nameResult", {
        success: true,
        name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit("joinResult", {
        room
    });
    socket.broadcast.to(room).emit("message", {
        text: nikeNames[socket.id] + " has joined " + room + "."
    });
    const usersInRoom = io.of("/").in(room).clients;
    if (usersInRoom.length > 1) {
        let usersInRoomSummary = "Users currently in " + room + ": ";
        for (let index in usersInRoom) {
            const userSocketId = usersInRoom[index].id;
            if (userSocketId !== socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ", ";
                }
                usersInRoomSummary += nikeNames[userSocketId];
            }
        }
        usersInRoomSummary += ".";
        socket.emit("message", { text: usersInRoomSummary });
    }
}

function handleNameChangeAttempts(socket, nikeNames, namesUsed) {
    socket.on("nameAttempt", function(name) {
        // 昵称不能以Guest开头
        if (name.indexOf("Guest") === 0) {
            socket.emit("nameResult", {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            if (namesUsed.indexOf(name) === -1) {
                const previousName = nikeNames[socket.id];
                const previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nikeNames[socket.id] = name;
                // namesUsed.splice(previousNameIndex, 1);
                delete namesUsed[previousNameIndex];
                socket.emit("nameResult", {
                    success: true,
                    name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit("message", {
                    text: previousName + " is now known as " + name + "."
                });
            } else {
                socket.emit("nameResult", {
                    success: false,
                    message: "That name is already in use."
                });
            }
        }
    });
}

function handleMessageBroadcasting(socket) {
    socket.on("message", function(message) {
        socket.broadcast.to(message.newRoom.room).emit("message", {
            text: nikeNames[socket.id] + ": " + message.newRoom.text
        });
    });
}

function handleRoomJoining(socket) {
    socket.on("join", function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

function handleClientDisconnection(socket) {
    socket.on("disconnect", function() {
        const nameIndex = namesUsed.indexOf(nikeNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nikeNames[socket.id];
    });
}
