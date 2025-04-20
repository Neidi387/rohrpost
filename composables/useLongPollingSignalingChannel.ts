
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
    async set(val: TRole) {
        if ( val !== peerInfo.role ) {
            await reset();
        }
        peerInfo.role = val;
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

const isConnected = computed(() => {
    return state.isConnected
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
    console.log('OpenRoom finished', newAddress);
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

async function reset() {
    // await new Promise(res => setTimeout(res, 1000));
    state.isConnected = false;
    const response = await fetch( apiUrl + 'room.php', {
        method: 'DELETE',
        body: JSON.stringify({
            address: peerInfo.address,
        })
    } ).then(res => res.json());
    peerInfo.address = '';
}

type TRole = 'active' | 'passive'

interface IPeerInfo {
    role: TRole;
    address: string;
}

// const canRoleBeChanged = computed( () => {
//     if ( 'active' === role.value  ) {
//         return !state.isConnected
//     } if ( 'passive' === role.value ) {
//         // Necessary for allowing toggle away from passive
//         if ( 0 === state.iMessage.received ) {
//             return true
//         } else {
//             return !state.isConnected
//         }
//     }
// } )