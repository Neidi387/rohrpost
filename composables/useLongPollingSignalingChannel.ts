import { stringifyQuery } from "vue-router";
import { useConnectionStore } from "~/stores/connection";

const apiUrl = useRuntimeConfig().public.longPollingUrl;

const messageListeners: ((message: object) => void)[] = []
const iMessage = ref({
    sent: 0,
    received: 0,
});
const connectionStore = useConnectionStore();

export function useLongPollingSignalingChannel(): ILongPollingSignalingChannel {
    return {
        openRoom,
        sendMessage,
        addMessageListener,
        connect,
        disconnect,
    }
}

interface ILongPollingSignalingChannel {
    openRoom: () => void;
    sendMessage: (message: object) => void;
    addMessageListener: (listener: (message: object) => void) => void;
    connect: () => void;
    disconnect: () => void;
}

async function openRoom() {
    const {address} = await fetch(useRuntimeConfig().public.longPollingUrl + 'room', {
        method: 'POST'
    }).then(res => res.json());
    connectionStore.signaling.address = address
}

async function sendMessage() {
    await fetch(apiUrl + 'message', {
        method: 'POST',
        body: JSON.stringify({
            i_message: iMessage.value.sent++
        })
    })
}

async function addMessageListener(fun: (message: object) => void) {
    
    messageListeners.push(fun);
}

async function connect() {
    if (true === connectionStore.signaling.isConnected) {
        throw Error('Already connected');
    }
    while( connectionStore.signaling.isConnected ) {
        if( false === connectionStore.signaling.isConnected ) {
            break;
        }
        const params = new URLSearchParams({
            role: connectionStore.signaling.role,
            i_message: String(iMessage.value.received),
            seconds_to_wait: '2',
        });
        const response = await fetch(apiUrl + 'message' + params.toString());
        const {message, staus} = await response.json();
        if ( 404 === response.status && 'message not found' === status ) {
            continue;
        }
        if (false === response.ok) {
            console.error('Invalid Response', response, message, status);
            break;
        }
        messageListeners.forEach(fun => fun(message));
        iMessage.value.received++;
    }
    
}

async function disconnect() {
    // ??? Komplett Resetten? Was wenn noch eine Nachricht unterwegs ist. Wann brauche ich ein Disconnecteten Signaling Service? Ja, anstatt jetzt on off zu implementieren, einfach das gesamte Signaling neu starten
    connectionStore.signaling.isConnected = false;
    const response = await fetch( apiUrl + 'room', {
        method: 'DELETE',
        body: JSON.stringify({
            address: connectionStore.signaling.address,
        })
    } ).then(res => res.json());
    iMessage.value.received = 
    iMessage.value.sent = 0;
}

