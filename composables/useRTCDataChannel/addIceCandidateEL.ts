import type { TSignalingMessage } from "./TSignalingMessage";

export function addIceCandidateEL(pc: RTCPeerConnection, msg: TSignalingMessage) {
    if (false === 'candidate' in msg) {
        return
    }
    pc.addIceCandidate(msg);
}