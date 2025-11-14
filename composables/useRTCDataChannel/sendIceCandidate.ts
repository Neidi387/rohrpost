import type { LongPollingSignalingChannel } from "../useLongPollingSignaling/LongPollingSignalingChannel";

export async function sendIceCandidate(evt: RTCPeerConnectionIceEvent, channel: LongPollingSignalingChannel) {
    // if (null === evt.candidate) {
    //     return
    // }
    // debugger
    // return
    channel.sendMessage(evt.candidate);
}