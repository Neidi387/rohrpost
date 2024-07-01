import type { Socket } from "socket.io-client";
import { ERtcSignaing } from "./ERtcSignaling";
import { ESignalingSocketIo } from "../signaling-socket.io/ESignalingSocketIo";
import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";
import type { SignalingChannelClass } from "./SignalingChannelClass";

export async function rtcDoPassiveSignaling(pc: RTCPeerConnection, signalingChannel: SignalingChannelClass) {
    pc.addEventListener('icecandidate', evt => sendIceCandidate(signalingChannel, evt));
    signalingChannel.addNewRemoteMessageListener(msg => addIceCandidateEL(pc, msg));
    const offer = await new Promise<RTCSessionDescriptionInit>(res => signalingChannel.addNewRemoteMessageListener((msg: TSignalingMessage) => {
        if ('sdp' in msg && 'offer' === msg.type) {
            res(msg);
        }
    }));
    pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    signalingChannel.sendToRemote(answer);
    pc.setLocalDescription(answer);
}