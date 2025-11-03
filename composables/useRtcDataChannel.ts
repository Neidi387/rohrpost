import { ERtcSignaing } from "~/composables/useRTCDataChannel/ERtcSignaling";
import { getPDataChannel } from "~/composables/useRTCDataChannel/getPDataChannel";
import { rtcDoActiveSignaling } from "~/composables/useRTCDataChannel/rtcDoActiveSignaling";
import { rtcDoPassiveSignaling } from "~/composables/useRTCDataChannel/rtcDoPassiveSignaling";
import { useLongPollingSignalingChannel } from "./OLDuseLongPollingSignalingChannel";

const peerConnection = ref<RTCPeerConnection | null>(null);
const dataChannel = ref<RTCDataChannel | null>(null);

export function useRtcDataChannel() {
    return {
        connect,
        peerConnection,
        dataChannel,
    }
}

async function connect() {
    const {isConnected: isSignalingConnected, role} = useLongPollingSignalingChannel();
    if (false === isSignalingConnected.value) {
        throw Error('Signaling is not connected');
    }
    // If isConnected changes, abort
    if ('active' === role.value) {
        await connectActive();
    }
    if ('passive' === role.value) {
        await connectPassive();
    }
}

async function connectActive() {
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel(ERtcSignaing.DATACHANNEL_LABEL);
    await rtcDoActiveSignaling(pc);
    peerConnection.value = pc;
    dataChannel.value = dc;
}

async function connectPassive() {
    const pc = new RTCPeerConnection();
    const pDc = getPDataChannel(pc);
    await rtcDoPassiveSignaling(pc);
    const dc = await pDc;
    peerConnection.value = pc;
    dataChannel.value = dc;
}