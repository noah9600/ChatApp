(function(){

    const app = document.querySelector(".app");
    const socket = io();

    let username;

    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        username = app.querySelector(".join-screen #username").value;
        if(username.length === 0){
            return;
        }
        socket.emit("newuser", username);
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length === 0){
            return;
        }
        renderMessage("my", {
            username: username,
            text: message
        });
        socket.emit("chat", {
            username: username,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser", username);
        window.location.href = window.location.href;
    });

    socket.on("update", function(update){
        renderMessage("update", update);
    });

    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    socket.on("userjoined", function(user){
        renderMessage("update", `${user} joined the chatroom`);
    });

    function renderMessage(type, content){
        let messageContainer = app.querySelector(".chat-screen .messages");
        let el = document.createElement("div");

        if(type === "my" || type === "other") {
            el.classList.add("message");
            if(type === "my") {
                el.classList.add("my-message");
            } else {
                el.classList.add("other-message");
            }
            el.innerHTML = `
                <div class="name">${content.username}</div>
                <div class="text">${content.text}</div>
            `;
        } else if(type === "update") {
            el.classList.add("update");
            el.innerText = content;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
})();
