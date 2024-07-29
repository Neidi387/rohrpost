import type { Socket } from "socket.io-client";
import { ESignalingSocketIo } from "./ESignalingSocketIo"

export async function getPPaired(socket: Socket): Promise<void> {
    return new Promise(res => {
        socket.on(ESignalingSocketIo.ON_PAIRED, res);
    })
}