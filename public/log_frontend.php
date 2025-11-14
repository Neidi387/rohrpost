<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include './log_backend.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


// Read the JSON data from the request body
$json = file_get_contents('php://input');
$logData = json_decode($json, true);

// Validate the data
if (!$logData || !isset($logData['id']) || !isset($logData['time']) || !isset($logData['event'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid log data']);
    exit;
}

// Create logs directory if it doesn't exist
$logDir = './logs/frontend/';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

// Sanitize filename components
$id = preg_replace('/[^a-zA-Z0-9_-]/', '_', $logData['id']);
$time = preg_replace('/[^a-zA-Z0-9_-]/', '_', $logData['time']);

// Create filename with ID and timestamp
$filename = $logDir . $id . '_' . $time . '.json';

// Write the log data to file
if (file_put_contents($filename, $json) !== false) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write log file']);
}