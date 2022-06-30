let readyUser = 0;

function listen(io) {
	io.on("connection", (socket) => {
		console.log(`User ${socket.id} has been connected`);

		socket.on("ready", () => {
			const room = "room" + Math.floor(readyUser / 2);
			console.log(`User ${socket.id} is ready`);
			socket.join(room);

			readyUser++;

			if (readyUser % 2 === 0) {
				// broadcasting join event
				console.log(room);
				io.in(room).emit("join", room);
				io.in(room).emit("message", {
					message: "Welcome to real time chat room",
					user: "Server",
					room: room,
					isAudio: false,
				});
			}
		});

		socket.on("send", (data) => {
			socket.to(data.room).emit("message", data);
		});

		socket.on("disconnecting", (reason) => {
			const [id, room] = socket.rooms;
			io.in(room).emit("message", {
				message: `${id} disconnected from server`,
				user: "Server",
				room: room,
			});
		});
	});
}

module.exports = {
	listen,
};
