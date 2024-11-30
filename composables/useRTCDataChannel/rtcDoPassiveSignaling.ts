import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";
import { useLongPollingSignalingChannel } from "../useLongPollingSignalingChannel";

export async function rtcDoPassiveSignaling(pc: RTCPeerConnection) {
    const {sendMessage, addMessageListener} = useLongPollingSignalingChannel();
    pc.addEventListener('icecandidate', sendIceCandidate);
    addMessageListener(msg => addIceCandidateEL(pc, msg));
    const offer = await new Promise<RTCSessionDescriptionInit>(res => addMessageListener((msg: TSignalingMessage) => {
        if ('sdp' in msg && 'offer' === msg.type) {
            res(msg);
        }
    }));
    pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    sendMessage(answer);
    pc.setLocalDescription(answer);
}