const chat = require("./chat");

module.exports = {
  socketInit(io, socket) {
    // socket.on("send", (data) => {
    //   console.log("客户端发送的内容：", data);
    //   socket.emit("getMsg", "我是返回的消息... ...");
    // });
    chat(io, socket);
  },
};
