import { ERtcSignaing } from "~/composables/useRTCDataChannel/ERtcSignaling";
import { getPDataChannel } from "~/composables/useRTCDataChannel/getPDataChannel";
import { rtcDoActiveSignaling } from "~/composables/useRTCDataChannel/rtcDoActiveSignaling";
import { rtcDoPassiveSignaling } from "~/composables/useRTCDataChannel/rtcDoPassiveSignaling";
import { getPIceServers } from "./useRTCDataChannel/getPIceServers";

const peerConnection = ref<RTCPeerConnection | null>(null);
const dataChannel = ref<RTCDataChannel | null>(null);
const apiPath = location.origin.replace(':3000','') + useRuntimeConfig().public.signaling + '/';

export function useRtcDataChannel() {
    return {
        connectPassive,
        connectActive,
        peerConnection,
        dataChannel,
    }
}

async function connectActive() {
    let isTimedOut = false;
    setTimeout(() => {
        isTimedOut = true;
    }, 3000);
    const { channel } = useLongPollingSignalingChannel();
    if ( null === channel.value ) {
        throw Error('Signaling channel is not established.');
    }
    const iceServersResponse = await fetch(apiPath + 'turn.php?room=' + channel.value.address );
    const { iceServers } = await iceServersResponse.json();
    channel.value.sendMessage({ type: 'iceServers', iceServers });
    const pc = new RTCPeerConnection({ iceServers});
    const dc = pc.createDataChannel(ERtcSignaing.DATACHANNEL_LABEL);
    await rtcDoActiveSignaling(pc, channel.value);
    dc.addEventListener('open', () => {
        if ( isTimedOut ) {
            return;
        }
        peerConnection.value = pc;
        dataChannel.value = dc;
        // startPingPong(dc);
    }); 
    pc.addEventListener('connectionstatechange', (evt) => {
        console.log('Conn state change:', pc.connectionState);
        if (['disconnected','failed','closed'].includes(pc.connectionState)) {
            peerConnection.value = null;
            dataChannel.value = null;
        }
        // I could try to reconnect here
    });
    dc.addEventListener('close', () => {
        peerConnection.value = null;
        dataChannel.value = null;
    });
}

async function connectPassive() {
    let isTimedOut = false;
    setTimeout(() => {
        isTimedOut = true;
    }, 3000);
    const { channel } = useLongPollingSignalingChannel();
    if ( null === channel.value ) {
        throw Error('Signaling channel is not established.');
    }
    const iceServers = await getPIceServers(channel.value);
    const pc = new RTCPeerConnection({ iceServers });
    const pDc = getPDataChannel(pc);
    await rtcDoPassiveSignaling(pc, channel.value);
    const dc = await pDc;
    dc.addEventListener('open', () => {
        if ( isTimedOut ) {
            return;
        }
        peerConnection.value = pc;
        dataChannel.value = dc;
    });
    pc.addEventListener('connectionstatechange', (evt) => {
        console.log('Conn state change:', pc.connectionState);
        if (['disconnected','failed','closed'].includes(pc.connectionState)) {
            peerConnection.value = null;
            dataChannel.value = null;
        }
        // I could try to reconnect here
    });
    dc.addEventListener('close', () => {
        peerConnection.value = null;
        dataChannel.value = null;
    });
}

// async function startPingPong(dc: RTCDataChannel, msWait = 1000, msIntervall = 1000) {
//     // Responde to remote ping
//     dc.addEventListener('message', (event) => {
//         if ( !event.data.startsWith('Ping') ) {
//             return;
//         }
//         dc.send('Pong');
//     } );
//     while ( true ) {
//         // Send ping message every msIntervall and close if no pong received in msWait
//         await new Promise( res => setTimeout(res, msIntervall) );
//         let pongReceived = false;
//         const onMessage = (event: MessageEvent) => {
//             if ( event.data.startsWith('Pong') ) {
//                 pongReceived = true;
//             }
//         }
//         dc.addEventListener('message', onMessage);
//         dc.send('Ping');
//         await new Promise( res => setTimeout(res, msWait) );
//         dc.removeEventListener('message', onMessage);
//         if ( !pongReceived ) {
//             dc.close();
//             console.log('No Pong received, closing Data Channel');
//             break;
//         }
//     }
// }