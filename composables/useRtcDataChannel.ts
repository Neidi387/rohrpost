import { ERtcSignaing } from "~/composables/useRTCDataChannel/ERtcSignaling";
import { getPDataChannel } from "~/composables/useRTCDataChannel/getPDataChannel";
import { rtcDoActiveSignaling } from "~/composables/useRTCDataChannel/rtcDoActiveSignaling";
import { rtcDoPassiveSignaling } from "~/composables/useRTCDataChannel/rtcDoPassiveSignaling";

const peerConnection = ref<RTCPeerConnection | null>(null);
const dataChannel = ref<RTCDataChannel | null>(null);

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
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel(ERtcSignaing.DATACHANNEL_LABEL);
    await rtcDoActiveSignaling(pc, channel.value);
    peerConnection.value = pc;
    dataChannel.value = dc;
}

async function connectPassive() {
    const { channel } = useLongPollingSignalingChannel();
    if ( null === channel.value ) {
        throw Error('Signaling channel is not established.');
    }
    const pc = new RTCPeerConnection();
    const pDc = getPDataChannel(pc);
    await rtcDoPassiveSignaling(pc, channel.value);
    const dc = await pDc;
    peerConnection.value = pc;
    dataChannel.value = dc;
}