function processUserInput(chatApp, socket) {
    const message = $("#send-message").val();
    let systemMessage;

    if (message.charAt(0) === "/") {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $("#messages").append(divEscapedContentElement(systemMessage));
        }
    } else {
        chatApp.sendMessage($("#room").text(), message);

        $("#messages").append(divEscapedContentElement(message));
        const temp = $("#messages").prop("scrollHeight");
        $("#messages").scrollTop(temp);
    }
    $("#send-message").val("");
}
const socket = io.connect();
$(document).ready(function() {
    const chatApp = new Chat(socket);
    socket.on("nameResult", function(result) {
        let message;
        if (result.success) {
            message = "You are new known as " + result.name + ".";
        } else {
            message = result.message;
        }
        $("#messages").append(divSystemContentElement(message));
    });

    socket.on("joinResult", function(result) {
        $("#room").text(result.room);
        $("#messages").append(divSystemContentElement("Room changed"));
    });

    socket.on("message", function(message) {
        // 先判断是否需要滚动，再添加一个新节点
        const isAutoScroll =
            Math.abs(
                $("#messages").height() +
                    $("#messages").scrollTop() -
                    $("#messages").prop("scrollHeight")
            ) <= 2;
        const newElement = $("<div></div>").text(message.text);
        $("#messages").append(newElement);
        if (isAutoScroll) {
            $("#messages").scrollTop($("#messages").prop("scrollHeight"));
        }
    });

    socket.on("rooms", function(rooms) {
        $("#room-list").empty();

        for (let room in rooms) {
            // room = room.substring(1, room.length);
            if (room !== "") {
                $("#room-list").append(divEscapedContentElement(room));
            }
        }

        $("#room-list div").click(function() {
            chatApp.processCommand("/join" + $(this).text());
            $("send-message").focus();
        });
    });

    setInterval(function() {
        socket.emit("rooms");
    }, 1000);

    $("#send-form").submit(function() {
        processUserInput(chatApp, socket);
        return false;
    });
});
