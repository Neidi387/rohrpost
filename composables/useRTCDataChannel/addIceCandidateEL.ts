import type { TSignalingMessage } from "./TSignalingMessage";

const { track } = useLogging();

export function addIceCandidateEL(pc: RTCPeerConnection, msg: TSignalingMessage) {
    if (msg && false === 'candidate' in msg) {
        return
    }
    track('icecandidate-received');
    // debugger
    pc.addIceCandidate(msg);
}