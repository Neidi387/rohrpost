import { Socket } from "socket.io";
import { TSignalingRegistry } from "./TSignalingRegistry";

export function getPRegistryMessage( socket: Socket ): Promise<TSignalingRegistry> {
    return new Promise(res => {
        socket.on(ESignaling.ON_REGISTER_MESSAGE, res)
    })
}