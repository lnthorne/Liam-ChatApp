import { recordAudio } from "./audio.js";
const logout = document.getElementById("exit");
const sendBtn = document.getElementById("submitmsg");
const message = document.getElementById("usermsg");
const chatBox = document.getElementById("chatbox");
const recordBtn = document.getElementById("recordAudio");
const playbackBtns = document.getElementsByTagName("button");

// IO host
const socket = io("http://localhost:3000");
let room;

// Storeage for the messages
let messages = [];

function displayMessage() {
	let html = "";

	for (const chat of messages) {
		if (chat.user === socket.id) {
			if (chat.isAudio) {
				html += `<p align = \'right\'> <b>${chat.user}: </b
				><button type="button" id="AudioRecording" value="${chat.id}">Audio</button> <br />`;
			} else {
				html += `<p align = \'right\'> <b>${chat.user}: </b>${chat.message}</p> <br />`;
			}
		} else if (chat.user === "Server") {
			html += `<p align = \'center\'> <b>${chat.user}: </b>${chat.message}</p> <br />`;
		} else {
			if (chat.isAudio) {
				html += `<p align = \'left\'> <b>${chat.user}: </b
				><button type="button" id="AudioRecording" value="${chat.id}">Audio</button> <br />`;
			} else {
				html += `<p align = \'left\'> <b>${chat.user}: </b>${chat.message}</p> <br />`;
			}
		}
	}

	chatBox.innerHTML = html;
}

function sendMessage(data) {
	messages.push(data);
	socket.emit("send", data);

	displayMessage();
	console.log(messages);
	// Function that will play the audio when user clicks audio button
	listenToAudio();
}

function listenToAudio() {
	for (const playbackBtn of playbackBtns) {
		playbackBtn.onclick = () => {
			const audioID = Number(playbackBtn.value);
			for (const audio of messages) {
				console.log(audio);
				if (audio.id === audioID) {
					console.log(audio.message);
					audio.message.play();
				}
			}
		};
	}
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
			isAudio: false,
		};
		sendMessage(data);
		message.value = "";
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

document.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		sendBtn.onclick();
	}
});

let toggled = true;
let record = await recordAudio();
recordBtn.onclick = async () => {
	if (toggled) {
		// Start recording
		record.start();
	} else {
		const audio = await record.stop();

		const data = {
			message: record,
			user: socket.id,
			room: room,
			isAudio: true,
			id: Date.now(),
		};
		sendMessage(data);
		audio.play();
		record = await recordAudio();
	}
	toggled = !toggled;
};

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

for (const i of test) {
	i.addEventListener("click", () => {
		console.log(i.value);
	});
}
