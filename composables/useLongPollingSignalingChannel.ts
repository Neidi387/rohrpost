
const apiUrl = useRuntimeConfig().public.signaling;

const _messageListeners: ((message: object) => void)[] = []

const state = reactive({
    iMessage: {
        sent: 0,
        received: 0,
    },
    isConnected: false,
});

// private
const peerInfo = reactive<IPeerInfo>({
    address: '',
    role: 'active',
});

const role = computed({
    get(): TRole {
        return peerInfo.role
    },
    set(val: TRole) {
        if (state.isConnected) {
            return
        } else {
            peerInfo.role = val;
        }
    }
})


const address = computed({
    get(): string {
        return peerInfo.address
    },
    set(val: string) {
        if (state.isConnected) {
            return
        } else {
            peerInfo.address = val;
        }
    }
})

const isConnected = computed({
    get(): boolean {
        return state.isConnected
    },
    set(val: boolean) {
        state.isConnected = val;
        if (true === val) {
            state.iMessage.received = 0;
            state.iMessage.sent = 0;
        }
    }
});

export function useLongPollingSignalingChannel(): ILongPollingSignalingChannel {
    return {
        openRoom,
        sendMessage,
        addMessageListener,
        connect,
        role,
        address,
        isConnected,
    }
}

interface ILongPollingSignalingChannel {
    openRoom: () => void;
    sendMessage: (message: object) => void;
    addMessageListener: (listener: (message: object) => void) => void;
    connect: () => void;
    role: Ref<TRole>;
    address: Ref<string>;
    isConnected: Ref<boolean>;
}

async function openRoom() {
    if (state.isConnected) {
        throw Error('Please disconnect first');
    }
    const {address: newAddress} = await fetch(apiUrl + 'room.php', {
        method: 'POST'
    }).then(res => res.json());
    peerInfo.address = newAddress;
}

async function sendMessage(message: object) {
    if (false === state.isConnected) {
        throw Error('Please connect first');
    }
    await fetch(apiUrl + 'message.php', {
        method: 'POST',
        body: JSON.stringify({
            i_message: state.iMessage.sent++,
            message: message,
            address: peerInfo.address,
            role: peerInfo.role,
        })
    })
}

async function addMessageListener(fun: (message: object) => void) {
    _messageListeners.push(fun);
}

async function connect() {
    if (true === state.isConnected) {
        throw Error('Already connected');
    }
    state.isConnected = true;
    setTimeout(async () => {
        while( state.isConnected ) {
            // @ts-ignore
            if( false === state.isConnected ) {
                break;
            }
            const params = new URLSearchParams({
                address: peerInfo.address,
                role: peerInfo.role,
                i_message: String(state.iMessage.received),
                seconds_to_wait: '2',
            });
            const response = await fetch(apiUrl + 'message.php' + '?' + params.toString());
            const {message, status} = await response.json();
            if ( 404 === response.status && 'message not found' === status ) {
                console.log('message not there yet, retry');
                continue;
            } else if (false === response.ok) {
                console.error('Invalid Response', response, message, status);
                break;
            }
            _messageListeners.forEach(fun => fun(message));
            state.iMessage.received++;
        }
    })
    return
}

watch(state, async (newState, oldState) => {
    if (false === newState.isConnected && true === oldState.isConnected) {
        const response = await fetch( apiUrl + 'room.php', {
            method: 'DELETE',
            body: JSON.stringify({
                address: peerInfo.address,
            })
        } ).then(res => res.json());
    }
})

watch(peerInfo, (newPeerInfo, oldPeerInfo) => {
    if (newPeerInfo.role !== oldPeerInfo.role) {
        peerInfo.address = '';
    }
})

type TRole = 'active' | 'passive'

interface IPeerInfo {
    role: TRole;
    address: string;
}