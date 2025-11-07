import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";
import type { LongPollingSignalingChannel } from "../useLongPollingSignaling/LongPollingSignalingChannel";

export async function rtcDoActiveSignaling(pc: RTCPeerConnection, channel: LongPollingSignalingChannel) {
    pc.addEventListener('icecandidate', (evt) => sendIceCandidate(evt, channel));
    channel.addMessageListener(msg => addIceCandidateEL(pc, msg));
    const pAnswer = new Promise<RTCSessionDescriptionInit>(res => channel.addMessageListener((msg: TSignalingMessage) => {
        if (msg && 'sdp' in msg && 'answer' === msg.type) {
            res(msg);
        }
    }));
    const offer = await pc.createOffer();
    channel.sendMessage(offer);
    pc.setLocalDescription(offer);
    pc.setRemoteDescription(await pAnswer);
}