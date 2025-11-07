import { ERtcSignaing } from "~/composables/useRTCDataChannel/ERtcSignaling";
import { getPDataChannel } from "~/composables/useRTCDataChannel/getPDataChannel";
import { rtcDoActiveSignaling } from "~/composables/useRTCDataChannel/rtcDoActiveSignaling";
import { rtcDoPassiveSignaling } from "~/composables/useRTCDataChannel/rtcDoPassiveSignaling";

const peerConnection = ref<RTCPeerConnection | null>(null);
const dataChannel = ref<RTCDataChannel | null>(null);
const iceServers = [
    { 
        urls: useRuntimeConfig().public.stun.url,
        username: useRuntimeConfig().public.stun.username,
        credential: useRuntimeConfig().public.stun.password,
    },
];

export function useRtcDataChannel() {
    return {
        connectPassive,
        connectActive,
        peerConnection,
        dataChannel,
    }
}

async function connectActive() {
    const { channel } = useLongPollingSignalingChannel();
    if ( null === channel.value ) {
        throw Error('Signaling channel is not established.');
    }
    const pc = new RTCPeerConnection({ iceServers});
    const dc = pc.createDataChannel(ERtcSignaing.DATACHANNEL_LABEL);
    await rtcDoActiveSignaling(pc, channel.value);
    dc.addEventListener('open', () => {
        peerConnection.value = pc;
        dataChannel.value = dc;
    });
}

async function connectPassive() {
    const { channel } = useLongPollingSignalingChannel();
    if ( null === channel.value ) {
        throw Error('Signaling channel is not established.');
    }
    const pc = new RTCPeerConnection({ iceServers });
    const pDc = getPDataChannel(pc);
    await rtcDoPassiveSignaling(pc, channel.value);
    const dc = await pDc;
    dc.addEventListener('open', () => {
        peerConnection.value = pc;
        dataChannel.value = dc;
    });
}