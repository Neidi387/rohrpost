<?php
    const GET_MESSAGE_INTERVALL_MS = 200;
    
    if ( 'GET' == $_SERVER['REQUEST_METHOD'] ) {
        $request = [];
        parse_str($_SERVER['QUERY_STRING'], $request);
        $request = (object)$request;
        checkAddressAndDie($request->address);
        $fullMessageFilename = "rooms/$request->address/message_for_{$request->role}_$request->i_message.txt";
        $waitForMs = ($request->seconds_to_wait ?? 1) * 1000;
        for ($msElapsed = 0; $msElapsed < $waitForMs; $msElapsed += GET_MESSAGE_INTERVALL_MS) {
            if (file_exists($fullMessageFilename)) {
                $message = file_get_contents($fullMessageFilename);
                $response = [
                    'status' => 'ok',
                    'message' => $message,
                ];
                die(json_encode($response));
            }
            usleep(GET_MESSAGE_INTERVALL_MS * 1000);
        }
        http_response_code(404);
        $response = [
            'status' => 'message not found',
            'info' => "waited for $msElapsed"
        ];
        die(json_encode($response));
    } else if ( 'POST' == $_SERVER['REQUEST_METHOD'] ) {
        $request = json_decode(file_get_contents('php://input'));
        checkAddressAndDie($request->address);
        $recipientRole = match ($request->role) {
            'active' => 'passive',
            'passive' => 'active',
        };
        file_put_contents("rooms/$request->address/message_for_{$recipientRole}_$request->i_message.txt", $request->message);
        die();
    }

    function checkAddressAndDie(string $address) : void {
        if ( false === file_exists("rooms/$address") ) {
            http_response_code(404);
            $response = [
                'status' => 'room not found'
            ];
            die(json_encode($response));
        }
    }