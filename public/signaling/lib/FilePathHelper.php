<?php 
    class FilePathHelper {
        const ROOM_DIRECTORY = '/signaling/rooms/';
        const ACTIVE_ROLE = 'active';
        const PASSIVE_ROLE = 'passive';
        const MESSAGE_FILENAME_BASE = 'message_for_'
        const NEXT_MESSAGE_STATE_COUNTER_FILENAME_BASE = "i_next_message_for_";

        static function getFullRoomFilename(string $address) : string {
            if ( '' === $address ) {
                $address = mt_rand();
            }
            $filename = Self::ROOM_DIRECTORY . $address . '/'
            return $filename;
        }

        static function getFullMessageFilename( string $fullRoomPath, string $recipentRole, int $iMessage ) : string {
            $filename =  Self::ROOM_DIRECTORY . $fullRoomPath . Self::MESSAGE_FILENAME_BASE . $recipent . $iMessage;
        }

        static function getFullNextMessageStateCounter( string $fullRoomPath, string $recipentRole ) : string {
            $filename =  Self::ROOM_DIRECTORY . $fullRoomPath . Self::NEXT_MESSAGE_STATE_COUNTER_FILgE_BASE . $recipent;
        }
    }