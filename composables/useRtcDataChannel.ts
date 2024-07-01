import type { Socket } from "socket.io-client";
import { ERtcSignaing } from "~/utils/rtcSignaling/ERtcSignaling";
import type { SignalingChannelClass } from "~/utils/rtcSignaling/SignalingChannelClass";
import { getPDataChannel } from "~/utils/rtcSignaling/getPDataChannel";
import { rtcDoActiveSignaling } from "~/utils/rtcSignaling/rtcDoActiveSignaling";
import { rtcDoPassiveSignaling } from "~/utils/rtcSignaling/rtcDoPassiveSignaling";

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