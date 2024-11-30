import { useLongPollingSignalingChannel } from "../useLongPollingSignalingChannel";

const {sendMessage} = useLongPollingSignalingChannel();

export async function sendIceCandidate(evt: RTCPeerConnectionIceEvent) {
    if (null === evt.candidate) {
        return
    }
    sendMessage(evt.candidate);
}