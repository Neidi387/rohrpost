<?php 
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: *");
    $string = file_get_contents('php://input');
    $request = json_decode($string);
    if ('POST' == $_SERVER['REQUEST_METHOD']) {
        $i = 0;
        do {
            $address = getRandAddress(4);
            $folderFilename = "rooms/$address";
            if ($i > 20) {
                http_response_code(500);
                $response = [
                    'status' => 'room creation failed',
                    'address' => $address,
                ];
                die(json_encode($response));
            }
        } while (file_exists($folderFilename));
        mkdir("rooms/$address");
        $response = [
            'status' => 'room created',
            'address' => $address,
        ];
        die(json_encode($response));
    } else if ( 'DELETE' == $_SERVER['REQUEST_METHOD'] ) {
        // TODO: Sanitize address. E.G. ""
        if ('' === $request->address) {
            http_response_code(400);
            $response = [
                'status' => 'address is empty',
            ];
            die(json_encode($response));
        }
        $folderFilename = "rooms/$request->address";
        if (false === file_exists($folderFilename)) {
            http_response_code(404);
            $response = [
                'status' => 'room not found',
            ];
            die(json_encode($response));
        }
        removeDir($folderFilename);
        $response = [
            'status' => 'room deleted',
        ];
        die(json_encode($response));
    }

    function removeDir(string $dir): void {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach($files as $file) {
            unlink($file->getPathname());
        }
        rmdir($dir);
    }

    function getRandAddress(int $length = 4): string {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $result = '';
        for ($i = 0; $i < $length; $i++) {
            $result .= $characters[rand(0, 25)];
        }
        return $result;
    }