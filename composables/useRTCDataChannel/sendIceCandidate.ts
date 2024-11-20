import { useLongPollingSignalingChannel } from "../useLongPollingSignalingChannel";
import type { SignalingChannelClass } from "../useSocketIOSignalingChannel/SignalingChannelClass";

const {sendMessage} = useLongPollingSignalingChannel();

export async function sendIceCandidate(evt: RTCPeerConnectionIceEvent) {
    if (null === evt.candidate) {
        return
    }
    sendMessage(evt.candidate);
}