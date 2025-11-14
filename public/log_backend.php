<?php 

function log_backend($event, $data = null) {
    // Create logs directory if it doesn't exist
    $logDir = __DIR__ . '/logs/backend';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    // Generate user ID based on user agent and IP
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $id = md5($userAgent . $ipAddress);
    
    // Get current timestamp
    $time = date('Y-m-d H:i:s') . ' ' . substr((string)microtime(), 2, 4);
    
    // Create log entry
    $logEntry = [
        'id' => $id,
        'time' => $time,
        'event' => $event,
        'data' => $data
    ];
    
    // Create filename
    $filename = $id . '_' . $time . '.json';
    $filepath = $logDir . '/' . $filename;
    
    // Write to file
    file_put_contents($filepath, json_encode($logEntry, JSON_PRETTY_PRINT));
    
    return $filename;
}