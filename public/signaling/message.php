<?php
    const GET_MESSAGE_INTERVALL_MS = 200;

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: *");
    
    if ( 'GET' == $_SERVER['REQUEST_METHOD'] ) {
        $request = [];
        parse_str($_SERVER['QUERY_STRING'], $request);
        $request = (object)$request;
        checkAddressAndDie($request->address);
        $fullMessageFilename = "rooms/$request->address/message_from_" . getOppositeRole($request->role) . "_$request->i_message.txt";
        $waitForMs = ($request->seconds_to_wait ?? 1) * 1000;
        for ($msElapsed = 0; $msElapsed < $waitForMs; $msElapsed += GET_MESSAGE_INTERVALL_MS) {
            if (file_exists($fullMessageFilename)) {
                $message = file_get_contents($fullMessageFilename);
                $response = [
                    'status' => 'ok',
                    'message' => json_decode($message),
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
        file_put_contents("rooms/$request->address/message_from_{$request->role}_$request->i_message.txt", json_encode($request->message));
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
    

    function getOppositeRole(string $peer): string {
        return match ($peer) {
            'active' => 'passive',
            'passive' => 'active',
        };
    }

    