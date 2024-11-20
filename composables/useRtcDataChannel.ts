import { ERtcSignaing } from "~/composables/useRTCDataChannel/ERtcSignaling";
import { getPDataChannel } from "~/composables/useRTCDataChannel/getPDataChannel";
import { rtcDoActiveSignaling } from "~/composables/useRTCDataChannel/rtcDoActiveSignaling";
import { rtcDoPassiveSignaling } from "~/composables/useRTCDataChannel/rtcDoPassiveSignaling";
import { useConnectionStore } from "~/stores/connection";
import { useLongPollingSignalingChannel } from "./useLongPollingSignalingChannel";

const connectionStore = useConnectionStore();
const {disconnect} = useLongPollingSignalingChannel()M

export function useRtcDataChannel() {
    return {
        connect,
    }
}

async function connect() {
    if (false === connectionStore.signaling.isConnected) {
        throw Error('Signaling is not connected');
    }
    if ('active' === connectionStore.signaling.role) {
        await connectActive();
    }
    if ('passive' === connectionStore.signaling.role) {
        await connectPassive();
    }
    // disconnect();
}

async function connectActive() {
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel(ERtcSignaing.DATACHANNEL_LABEL);
    await rtcDoActiveSignaling(pc);
    connectionStore.rtcConnection.peerConnection = pc;
    connectionStore.rtcConnection.dataChannel = dc;
}

async function connectPassive() {
    const pc = new RTCPeerConnection();
    const pDc = getPDataChannel(pc);
    await rtcDoPassiveSignaling(pc);
    const dc = await pDc;
    connectionStore.rtcConnection.peerConnection = pc;
    connectionStore.rtcConnection.dataChannel = dc;
}