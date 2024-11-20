import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";
import { useLongPollingSignalingChannel } from "../useLongPollingSignalingChannel";

const {sendMessage, addMessageListener} = useLongPollingSignalingChannel();

export async function rtcDoActiveSignaling(pc: RTCPeerConnection) {
    pc.addEventListener('icecandidate', sendIceCandidate);
    addMessageListener(msg => addIceCandidateEL(pc, msg));
    const pAnswer = new Promise<RTCSessionDescriptionInit>(res => addMessageListener((msg: TSignalingMessage) => {
        if ('sdp' in msg && 'answer' === msg.type) {
            res(msg);
        }
    }));
    const offer = await pc.createOffer();
    sendMessage(offer);
    pc.setLocalDescription(offer);
    pc.setRemoteDescription(await pAnswer);
}