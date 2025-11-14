import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";
import type { LongPollingSignalingChannel } from "../useLongPollingSignaling/LongPollingSignalingChannel";
const { track } = useLogging();

export async function rtcDoActiveSignaling(pc: RTCPeerConnection, channel: LongPollingSignalingChannel) {
    pc.addEventListener('icecandidate', (evt) => sendIceCandidate(evt, channel));
    channel.addMessageListener(msg => addIceCandidateEL(pc, msg));
    const pAnswer = new Promise<RTCSessionDescriptionInit>(res => channel.addMessageListener((msg: TSignalingMessage) => {
        if (msg && 'sdp' in msg && 'answer' === msg.type) {
            track('sdp-answer-received');
            res(msg);
        }
    }));
    const offer = await pc.createOffer();
    channel.sendMessage(offer);
    track('sdp-offer-created-and-sent');
    pc.setLocalDescription(offer);
    pc.setRemoteDescription(await pAnswer);
    track('sdp-anwer-set-as-remote-description');
}