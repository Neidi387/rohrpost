import type { Socket } from "socket.io-client";
import { ESignalingSocketIo } from "../signaling-socket.io/ESignalingSocketIo";
import type { SignalingChannelClass } from "./SignalingChannelClass";

export async function sendIceCandidate(signalingChannel: SignalingChannelClass, evt: RTCPeerConnectionIceEvent) {
    if (null === evt.candidate) {
        return
    }
    signalingChannel.sendToRemote(evt.candidate);
}