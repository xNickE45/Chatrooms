<?php
$file = 'rooms.json'; // File to store room data

$rooms = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'];

    if ($action === 'createRoom') {
        $roomCode = htmlspecialchars($data['roomCode']);
        if (!isset($rooms[$roomCode])) {
            $rooms[$roomCode] = ['users' => [], 'messages' => []];
            file_put_contents($file, json_encode($rooms));
        }
        echo json_encode(['roomCode' => $roomCode]);
        exit;
    }

    
    if ($action === 'joinRoom') {
        $roomCode = htmlspecialchars($data['roomCode']);
        $username = htmlspecialchars($data['username']);
        if (!isset($rooms[$roomCode])) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid room code']);
            exit;
        }
        $rooms[$roomCode]['users'][] = $username;
        $rooms[$roomCode]['users'] = array_unique($rooms[$roomCode]['users']);
        file_put_contents($file, json_encode($rooms));
        echo json_encode(['status' => 'success']);
        exit;
    }

    if ($action === 'leaveRoom') {
        $roomCode = htmlspecialchars($data['roomCode']);
        $username = htmlspecialchars($data['username']);
        $rooms[$roomCode]['users'] = array_filter(
            $rooms[$roomCode]['users'],
            fn($user) => $user !== $username
        );
        if (empty($rooms[$roomCode]['users'])) {
            unset($rooms[$roomCode]);
        }
        file_put_contents($file, json_encode($rooms));
        echo json_encode(['status' => 'success']);
        exit;
    }

    if ($action === 'sendMessage') {
        $roomCode = htmlspecialchars($data['roomCode']);
        $username = htmlspecialchars($data['username']);
        $message = htmlspecialchars($data['message']);
        $rooms[$roomCode]['messages'][] = ['username' => $username, 'message' => $message];
        file_put_contents($file, json_encode($rooms));
        echo json_encode(['status' => 'success']);
        exit;
    }
}

// Handle GET requests
if (isset($_GET['action']) && $_GET['action'] === 'getUsers') {
    $roomCode = htmlspecialchars($_GET['roomCode']);
    echo json_encode($rooms[$roomCode]['users'] ?? []);
    exit;
}

if (isset($_GET['roomCode'])) {
    $roomCode = htmlspecialchars($_GET['roomCode']);
    echo json_encode($rooms[$roomCode]['messages'] ?? []);
    exit;
}
