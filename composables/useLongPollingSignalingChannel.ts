import { LongPollingSignalingChannel } from "./useLongPollingSignaling/LongPollingSignalingChannel";

const apiUrl = useRuntimeConfig().public.signaling;

const channel: Ref<null | LongPollingSignalingChannel> = ref(null);

export function useLongPollingSignalingChannel(): ILongPollingSignalingChannel {
    return {
        openRoom,
        joinRoom,
        channel,
        close,
    }
}

interface ILongPollingSignalingChannel {
    openRoom: (role: 'passive' | 'active') => Promise<void>;
    joinRoom: (address: string, role: 'passive' | 'active') => Promise<void>;
    channel: Ref<null | LongPollingSignalingChannel>;
    close: () => Promise<void>;
}

async function openRoom( role: 'passive' | 'active' )  {
    if (channel.value) {
        throw Error('Signaling Channel already exists. Cloese before.');
    }
    const newChannel = await LongPollingSignalingChannel.openRoom(role);
    channel.value = newChannel;
}

async function joinRoom(address: string, role: 'passive' | 'active') {
    if (channel.value) {
        throw Error('Signaling Channel already exists. Cloese before.');
    }
    const newChannel = await LongPollingSignalingChannel.joinRoom(address, role);
    channel.value = newChannel;
}

async function close() {
    if (null === channel.value) {
        throw Error('Room does not exist.');
    }
    console.log('Closing room. Destroy channel object and tell channel to delete room folder');
    const channelTmp = channel.value;
    channel.value = null;
    channelTmp.closeRoom();
}

