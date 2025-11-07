<?php 
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: *");
    $string = file_get_contents('php://input');
    $request = json_decode($string);
    if ('POST' == $_SERVER['REQUEST_METHOD']) {
        $address = mt_rand();
        $address = substr($address, -3);
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
        // removeDir($folderFilename);
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