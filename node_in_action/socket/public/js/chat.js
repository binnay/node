const Chat = function(socket) {
    this.socket = socket;
};

/**
 * 发送消息
 * @param room
 * @param text
 */
Chat.prototype.sendMessage = function(room, text) {
    const message = {
        room,
        text
    };
    this.socket.emit("message", {
        newRoom: message
    });
};

/**
 * 更改聊天房间
 * @param room
 */
Chat.prototype.changeRoom = function(room) {
    this.socket.emit("join", {
        newRoom: room
    });
};

/**
 * 处理聊天命令
 * @param command
 * @returns {boolean}
 */
Chat.prototype.processCommand = function(command) {
    const words = command.split(" ");
    const commandTemp = words[0].substring(1, words[0].length).toLowerCase();
    let message = false;

    switch (commandTemp) {
        case "join":
            words.shift();
            const room = words.join(" ");
            this.changeRoom(room);
            break;
        case "nick":
            words.shift();
            const name = words.join(" ");
            this.socket.emit("nameAttempt", name);
            break;
        default:
            message = "Unrecognized command";
            break;
    }

    return message;
};

function divEscapedContentElement(message) {
    return $("<div class='right'></div>").text(message);
}

function divSystemContentElement(message) {
    return $("<div></div>").html("<i>" + message + "</i>");
}
