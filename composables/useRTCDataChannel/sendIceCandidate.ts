import type { Socket } from "socket.io-client";
import { ESignalingSocketIo } from "../../utils/ESignalingSocketIo";
import type { SignalingChannelClass } from "../useSocketIOSignalingChannel/SignalingChannelClass";

export async function sendIceCandidate(signalingChannel: SignalingChannelClass, evt: RTCPeerConnectionIceEvent) {
    if (null === evt.candidate) {
        return
    }
    signalingChannel.sendToRemote(evt.candidate);
}