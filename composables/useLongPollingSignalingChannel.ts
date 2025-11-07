import { LongPollingSignalingChannel } from "./useLongPollingSignaling/LongPollingSignalingChannel";

const apiUrl = useRuntimeConfig().public.signaling;

const channel: Ref<null | LongPollingSignalingChannel> = ref(null);

export function useLongPollingSignalingChannel(): ILongPollingSignalingChannel {
    return {
        openRoom,
        joinRoom,
        channel,
        close,
        isRoomNotFoundException
    }
}

interface ILongPollingSignalingChannel {
    openRoom: (role: 'passive' | 'active', onRoomOpened: (address: string) => Promise<void>) => Promise<void>;
    joinRoom: (address: string, role: 'passive' | 'active') => Promise<void>;
    channel: Ref<null | LongPollingSignalingChannel>;
    close: () => Promise<void>;
    isRoomNotFoundException: (e: any) => boolean;
}

async function openRoom( role: 'passive' | 'active', onAddressOffer: (addressOffer: string) => Promise<void> ) {
    if (channel.value) {
        throw Error('Signaling Channel already exists. Close before.');
    }
    const newChannel = await LongPollingSignalingChannel.openRoom(role, onAddressOffer);
    // await onAddressOffer(newChannel.address);
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
    const channelTmp = channel.value;
    channel.value = null;
    channelTmp.closeRoom();
}

const isRoomNotFoundException = LongPollingSignalingChannel.isRoomNotFoundException;