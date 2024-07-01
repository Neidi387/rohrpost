import { Socket } from "socket.io";
import { TSignalingRegistry } from "./TSignalingRegistry";

export function getPRegistryMessage( socket: Socket ): Promise<TSignalingRegistry> {
    return new Promise(res => {
        socket.on(ESignalingSocketIo.ON_REGISTER_MESSAGE, res)
    })
}