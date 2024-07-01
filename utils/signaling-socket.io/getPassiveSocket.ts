import type { Socket } from "socket.io-client";
import type { TSignalingRegistry } from "./TSignalingRegistry";

export function getPassiveSocket(socket: Socket, address: string): Socket {
    const msg: TSignalingRegistry = {
        'role': 'passive',
        address: address,
    };
    socket.emit(ESignalingSocketIo.ON_REGISTER_MESSAGE, msg);
    return socket;
}