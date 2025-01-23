const joinForm = document.getElementById('join-form');
const createRoomBtn = document.getElementById('create-room');
const leaveRoomBtn = document.getElementById('leave-room');
const roomContainer = document.getElementById('room-container');
const chatContainer = document.getElementById('chat-container');
const roomNameSpan = document.getElementById('room-name');
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const userCountSpan = document.getElementById('user-count');
const userList = document.getElementById('user-list');

let roomCode = '';
let username = '';
let fetchInterval = null;

// Generate a truly unique room code
function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    return code;
}

// Create a new room
createRoomBtn.addEventListener('click', async () => {
    const response = await fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createRoom', roomCode: generateRoomCode() })
    });

    const data = await response.json();
    roomCode = data.roomCode; // Unique room code from server
    username = prompt('Enter your username:'); // Ask for username

    if (username) {
        joinRoom(roomCode, username);
    }
});

// Join an existing room
joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    roomCode = document.getElementById('room-code').value;
    username = document.getElementById('username').value;

    joinRoom(roomCode, username);
});

// Leave a room
async function leaveRoom() {
    await fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leaveRoom', roomCode, username })
    });

    clearInterval(fetchInterval);
    chatContainer.style.display = 'none';
    roomContainer.style.display = 'block';
    roomCode = '';
    username = '';
}

leaveRoomBtn.addEventListener('click', leaveRoom);

// Handle page unload
window.addEventListener('beforeunload', (event) => {
    if (roomCode && username) {
        navigator.sendBeacon('server.php', JSON.stringify({ action: 'leaveRoom', roomCode, username }));
    }
});

// Join room function
async function joinRoom(code, user) {
    roomCode = code;
    username = user;

    // Notify server
    const response = await fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'joinRoom', roomCode, username })
    });

    const data = await response.json();
    if (data.status === 'error') {
        document.getElementById('error-message').textContent = data.message; // Display error message
        return;
    }

    // Clear error message
    document.getElementById('error-message').textContent = '';

    // Switch UI to chat
    roomContainer.style.display = 'none';
    chatContainer.style.display = 'block';
    roomNameSpan.textContent = roomCode;

    // Fetch messages and user list every second
    fetchInterval = setInterval(() => {
        fetchMessages();
        fetchUsers();
    }, 1000);
}

// Fetch messages from server
async function fetchMessages() {
    const response = await fetch(`server.php?roomCode=${roomCode}`);
    const messages = await response.json();
    messagesDiv.innerHTML = messages.map(msg => {
        const messageClass = msg.username === username ? 'self' : 'other';
        return `<div class="message ${messageClass}"><b>${msg.username}:</b> ${msg.message}</div>`;
    }).join('');
}

// Fetch users in the room
async function fetchUsers() {
    const response = await fetch(`server.php?action=getUsers&roomCode=${roomCode}`);
    const users = await response.json();
    userCountSpan.textContent = users.length;
    userList.innerHTML = users.map(user => `<li>${user}</li>`).join('');
}

// Handle sending messages
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value;
    messageInput.value = '';

    await fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendMessage', roomCode, username, message })
    });
});