import type { LongPollingSignalingChannel } from "../useLongPollingSignaling/LongPollingSignalingChannel";

export function getPIceServers(channel: LongPollingSignalingChannel): Promise<RTCIceServer[]> {
    return new Promise(res => {
        channel.addMessageListener( msg => {
            if (msg && 'type' in msg && 'iceServers' === msg.type && 'iceServers' in msg ) {
                res( (msg as any).iceServers as RTCIceServer[] );
            }
        } );
    });
}