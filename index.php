<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Temporary Chat Rooms</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Room Selection -->
    <div id="room-container">
        <h2>Create or Join a Chat Room</h2>
        <button id="create-room">Create New Room</button>
        <form id="join-form">
            <input type="text" id="room-code" placeholder="Enter room code" required>
            <input type="text" id="username" placeholder="Enter your username" required>
            <button type="submit">Join Room</button>
            <div id="error-message" style="color: red;"></div> <!-- Error message element -->
        </form>
    </div>

    <!-- Chat Room -->
    
    <div id="chat-container" style="display:none;">
        <h2>Chat Room: <span id="room-name"></span></h2>
        <div id="participants">
            <h3>Participants (<span id="user-count">0</span>):</h3>
            <ul id="user-list"></ul>
        </div>
        <div id="messages"></div>
        <form id="message-form">
            <input type="text" id="message-input" placeholder="Type a message..." required>
            <button type="submit">Send</button>
        </form>
        <button id="leave-room">Leave Room</button>
    </div>


    <script src="js/interreactions.js"></script>
</body>
</html>
