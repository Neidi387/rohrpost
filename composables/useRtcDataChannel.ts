import { ERtcSignaing } from "~/composables/useRTCDataChannel/ERtcSignaling";
import type { SignalingChannelClass } from "~/composables/useSocketIOSignalingChannel/SignalingChannelClass";
import { getPDataChannel } from "~/composables/useRTCDataChannel/getPDataChannel";
import { rtcDoActiveSignaling } from "~/composables/useRTCDataChannel/rtcDoActiveSignaling";
import { rtcDoPassiveSignaling } from "~/composables/useRTCDataChannel/rtcDoPassiveSignaling";

const rtcPeerConnection = ref<RTCPeerConnection>();
const rtcDataChannel = ref<RTCDataChannel>();

export function useRtcDataChannel() {
    return {
        rtcPeerConnection,
        rtcDataChannel,
        rtcConnectActive,
        rtcConnectPassive,
    }
}

async function rtcConnectActive(signalingChannel: SignalingChannelClass) {
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel(ERtcSignaing.DATACHANNEL_LABEL);
    await rtcDoActiveSignaling(pc, signalingChannel);
    rtcPeerConnection.value = pc;
    rtcDataChannel.value = dc;
}

async function rtcConnectPassive(signalingChannel: SignalingChannelClass) {
    const pc = new RTCPeerConnection();
    const pDc = getPDataChannel(pc);
    await rtcDoPassiveSignaling(pc, signalingChannel);
    const dc = await pDc;
    rtcPeerConnection.value = pc;
    rtcDataChannel.value = dc;
}