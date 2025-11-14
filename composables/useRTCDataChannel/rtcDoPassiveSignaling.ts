import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";
import type { LongPollingSignalingChannel } from "../useLongPollingSignaling/LongPollingSignalingChannel";

const { track } = useLogging();
export async function rtcDoPassiveSignaling(pc: RTCPeerConnection, channel: LongPollingSignalingChannel) {
    pc.addEventListener('icecandidate', (evt) => sendIceCandidate(evt, channel));
    channel.addMessageListener(msg => addIceCandidateEL(pc, msg));
    const offer = await new Promise<RTCSessionDescriptionInit>(res => channel.addMessageListener((msg: TSignalingMessage) => {
        if (msg && 'sdp' in msg && 'offer' === msg.type) {
            track('sdp-offer-received');
            res(msg);
        }
    }));
    pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    channel.sendMessage(answer);
    track('sdp-answer-created-and-sent');
    pc.setLocalDescription(answer);
    track('sdp-answer-set-as-local-description');
}