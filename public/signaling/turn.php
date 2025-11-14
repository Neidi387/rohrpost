<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");

$msCache = 1000 * 60 * 10; // 1 minute

$tStart = microtime(true) * 1000; // Convert to milliseconds

$roomId = isset($_GET['room']) ? $_GET['room'] : null;
if (!$roomId || !preg_match('/^[A-Z]{4}+$/', $roomId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid room ID']);
    exit;
}

$roomFile = 'rooms/' . $roomId;
if (!file_exists($roomFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Room not found']);
    exit;
}

header('Content-Type: application/json');

$cacheFile = './turn/currentTurn.json';
$cacheValid = false;

// Check if cache file exists and is still valid
if (file_exists($cacheFile)) {
    $fileTime = filemtime($cacheFile);
    $currentTime = microtime(true) * 1000; // Convert to milliseconds
    $fileTimeMs = $fileTime * 1000;
    
    if (($currentTime - $fileTimeMs) < $msCache) {
        $cacheValid = true;
    }
}

if ($cacheValid) {
    // Return cached response
    echo file_get_contents($cacheFile);
} else {
    // Make API request
    $ch = curl_init('https://rtc.live.cloudflare.com/v1/turn/keys/dd96c30173415fea87146d634da7eb36/credentials/generate-ice-servers');

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer 1d0b064e6a95d1e7ffeb7f2d1ea9457355509c92b1104983b382220ebf8ccf84',
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['ttl' => 86400]));

    $response = curl_exec($ch);
    curl_close($ch);

    // Save to cache file
    file_put_contents($cacheFile, $response);
    echo $response;
}