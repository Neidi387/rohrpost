import type { Socket } from "socket.io-client";
import { ESignalingSocketIo } from "../signaling-socket.io/ESignalingSocketIo";

export async function sendIceCandidate(socket: Socket, evt: RTCPeerConnectionIceEvent) {
    if (null === evt.candidate) {
        return
    }
    socket.emit(ESignalingSocketIo.ON_LOCAL_MESSAGE, evt.candidate);
}