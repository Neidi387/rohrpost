import type { SignalingChannelClass } from "../useSocketIOSignalingChannel/SignalingChannelClass";

export async function sendIceCandidate(signalingChannel: SignalingChannelClass, evt: RTCPeerConnectionIceEvent) {
    if (null === evt.candidate) {
        return
    }
    signalingChannel.sendToRemote(evt.candidate);
}