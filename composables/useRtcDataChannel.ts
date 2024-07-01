import type { TSignalingMessage } from "#build/types/nitro-imports";
import type { Socket, SocketOptions } from "socket.io-client";
import { ERtcSignaing } from "~/utils/rtcSignaling/ERtcSignaling";
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

async function rtcConnectActive(socket: Socket) {
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel(ERtcSignaing.DATACHANNEL_LABEL);
    await rtcDoActiveSignaling(pc, socket);
    rtcPeerConnection.value = pc;
    rtcDataChannel.value = dc;
}


async function rtcConnectPassive(socket: Socket) {
    const pc = new RTCPeerConnection();
    const pDc = getPDataChannel(pc);
    await rtcDoPassiveSignaling(pc, socket);
    const dc = await pDc;
    rtcPeerConnection.value = pc;
    rtcDataChannel.value = dc;
}