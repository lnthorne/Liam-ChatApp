const logout = document.getElementById("exit");
const sendBtn = document.getElementById("submitmsg");
const message = document.getElementById("usermsg");
const chatBox = document.getElementById("chatbox");

// IO host
const socket = io("http://localhost:3000");
let room;

// Storeage for the messages
let messages = [];

function displayMessage() {
	let html = "";

	for (const chat of messages) {
		if (chat.user === socket.id) {
			html += `<p align = \'right\'> <b>${chat.user}: </b>${chat.message}</p> <br />`;
			console.log(html);
		} else if (chat.user === "Server") {
			html += `<p align = \'center\'> <b>${chat.user}: </b>${chat.message}</p> <br />`;
		} else {
			html += `<p align = \'left\'> <b>${chat.user}: </b>${chat.message}</p> <br />`;
		}
		console.log(html);
	}

	chatBox.innerHTML = html;
}

sendBtn.onclick = () => {
	if (message.value === "") {
		alert("Please enter some text!");
	} else {
		console.log(`clicked ${socket.id}`);
		const data = {
			message: message.value,
			user: socket.id,
			room: room,
		};
		messages.push(data);
		socket.emit("send", data);

		message.value = "";

		displayMessage();
	}
};

logout.onclick = () => {
	console.log("logout");
	socket.disconnect();

	messages = [];
	displayMessage();
	socket.connect();
	socket.emit("ready");
};

message.addEventListener("keypress", (event) => {
	event.preventDefault();
	let key = event.keyCode;

	if (key === 13) {
		sendBtn.onclick();
	}
});

socket.on("connect", () => {
	console.log(`connected as ${socket.id}`);
});

socket.on("join", (roomNum) => {
	room = roomNum;
});

socket.on("message", (data) => {
	messages.push(data);
	displayMessage();
});

socket.emit("ready");
