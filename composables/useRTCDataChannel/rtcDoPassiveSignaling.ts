import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";
import type { LongPollingSignalingChannel } from "../useLongPollingSignaling/LongPollingSignalingChannel";

export async function rtcDoPassiveSignaling(pc: RTCPeerConnection, channel: LongPollingSignalingChannel) {
    pc.addEventListener('icecandidate', (evt) => sendIceCandidate(evt, channel));
    channel.addMessageListener(msg => addIceCandidateEL(pc, msg));
    const offer = await new Promise<RTCSessionDescriptionInit>(res => channel.addMessageListener((msg: TSignalingMessage) => {
        if ('sdp' in msg && 'offer' === msg.type) {
            res(msg);
        }
    }));
    pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    channel.sendMessage(answer);
    pc.setLocalDescription(answer);
}