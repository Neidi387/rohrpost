import type { Socket } from "socket.io-client";
import { ERtcSignaing } from "./ERtcSignaling";
import { ESignalingSocketIo } from "../signaling-socket.io/ESignalingSocketIo";
import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";
import type { SignalingChannelClass } from "./SignalingChannelClass";

export async function rtcDoActiveSignaling(pc: RTCPeerConnection, signalingChannel: SignalingChannelClass) {
    pc.addEventListener('icecandidate', evt => sendIceCandidate(signalingChannel, evt));
    signalingChannel.addNewRemoteMessageListener(msg => addIceCandidateEL(pc, msg));
    const pAnswer = new Promise<RTCSessionDescriptionInit>(res => signalingChannel.addNewRemoteMessageListener((msg: TSignalingMessage) => {
        if ('sdp' in msg && 'answer' === msg.type) {
            res(msg);
        }
    }));
    const offer = await pc.createOffer();
    signalingChannel.sendToRemote(offer);
    pc.setLocalDescription(offer);
    pc.setRemoteDescription(await pAnswer);
}