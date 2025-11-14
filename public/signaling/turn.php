<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");

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

echo $response;