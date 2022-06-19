const http = require("http");
const io = require("socket.io");

const app = require("./app");
const sockets = require("./sockets");

const server = http.createServer(app);
const socketServer = io(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
const PORT = 3000;

server.listen(PORT, () => {
	console.log(`listening on port: ${PORT}`);

	sockets.listen(socketServer);
});
