import { ERtcSignaing } from "~/composables/useRTCDataChannel/ERtcSignaling";
import { getPDataChannel } from "~/composables/useRTCDataChannel/getPDataChannel";
import { rtcDoActiveSignaling } from "~/composables/useRTCDataChannel/rtcDoActiveSignaling";
import { rtcDoPassiveSignaling } from "~/composables/useRTCDataChannel/rtcDoPassiveSignaling";
import { getPIceServers } from "./useRTCDataChannel/getPIceServers";

const peerConnection = ref<RTCPeerConnection | null>(null);
const dataChannel = ref<RTCDataChannel | null>(null);
const apiPath = location.origin.replace(':3000','') + useRuntimeConfig().public.signaling + '/';
const { track } = useLogging();

export function useRtcDataChannel() {
    return {
        connectPassive,
        connectActive,
        peerConnection,
        dataChannel,
    }
}

async function connectActive() {
    track('composable:connect-active-started');
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
    track('turn-servers-received');
    channel.value.sendMessage({ type: 'iceServers', iceServers });
    const pc = new RTCPeerConnection({ iceServers });
    const dc = pc.createDataChannel(ERtcSignaing.DATACHANNEL_LABEL);
    await rtcDoActiveSignaling(pc, channel.value);
    dc.addEventListener('open', () => {
        isUsingTurn(pc). then( usingTurn => {
            track('datachannel-open', {props: { 
                isTimedOut: isTimedOut? 'Yes' : 'No',
                isTurn: usingTurn ? 'Yes' : 'No',
            }});
        });
        if ( isTimedOut ) {
            return;
        }
        peerConnection.value = pc;
        dataChannel.value = dc;
        // startPingPong(dc);
    }); 
    pc.addEventListener('connectionstatechange', (evt) => {
        track('peerconnection-statechange', { props: { connectionState: pc.connectionState}});
        if (['disconnected','failed','closed'].includes(pc.connectionState)) {
            peerConnection.value = null;
            dataChannel.value = null;
        }
        // I could try to reconnect here
    });
    dc.addEventListener('close', () => {
        track('datachannel-close');
        peerConnection.value = null;
        dataChannel.value = null;
    });
}

async function connectPassive() {
    track('composable:connect-passive-started');
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
    track('turn-servers-received');
    const pc = new RTCPeerConnection({ iceServers });
    const pDc = getPDataChannel(pc);
    await rtcDoPassiveSignaling(pc, channel.value);
    const dc = await pDc;
    track('datachannel-received');
    dc.addEventListener('open', () => {
        isUsingTurn(pc). then( usingTurn => {
            track('datachannel-open', {props: { 
                isTimedOut: isTimedOut? 'Yes' : 'No',
                isTurn: usingTurn ? 'Yes' : 'No',
            }});
        });        if ( isTimedOut ) {
            return;
        }
        peerConnection.value = pc;
        dataChannel.value = dc;
    });
    pc.addEventListener('connectionstatechange', (evt) => {
        track('peerconnection-statechange', { props: { connectionState: pc.connectionState}});
        if (['disconnected','failed','closed'].includes(pc.connectionState)) {
            peerConnection.value = null;
            dataChannel.value = null;
        }
        // I could try to reconnect here
    });
    dc.addEventListener('close', () => {
        track('datachannel-close');
        peerConnection.value = null;
        dataChannel.value = null;
    });
}

async function isUsingTurn(pc: RTCPeerConnection): Promise<boolean> {
    if (!peerConnection.value) {
        return false;
    }
    
    const stats = await peerConnection.value.getStats();
    for (const [, report] of stats) {
        if (report.type === 'candidate-pair' && report.state === 'succeeded') {
            const localCandidate = stats.get(report.localCandidateId);
            const remoteCandidate = stats.get(report.remoteCandidateId);
            
            if (localCandidate?.candidateType === 'relay' || remoteCandidate?.candidateType === 'relay') {
                return true;
            }
        }
    }
    return false;
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