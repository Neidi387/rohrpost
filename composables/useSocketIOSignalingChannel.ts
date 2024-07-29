import type { TSignalingRegistry } from "#build/types/nitro-imports";
import { io, Socket, type SocketOptions } from "socket.io-client";
import { SignalingChannelClass } from "./useSocketIOSignalingChannel/SignalingChannelClass";
import { getPPaired } from "./useSocketIOSignalingChannel/getPPaired";
import { ESignalingSocketIo } from "./useSocketIOSignalingChannel/ESignalingSocketIo";

const signalingChannel: Ref<SignalingChannelClass | null> = ref(null);

let socket: Socket;

export function useSocketIOSignalingChannel(): ISocketIOSignalingChannel {
    return {
        signalingChannnelAproach,
        signalingChannel,
        abortSignalingChannnelAproach,
    }
}

interface ISocketIOSignalingChannel {
    signalingChannnelAproach: (role: 'active' | 'passive', address: string) => Promise<void>;
    signalingChannel: Ref<SignalingChannelClass | null>;
    abortSignalingChannnelAproach(): void;
}

async function signalingChannnelAproach(role: 'active' | 'passive', address: string): Promise<void> {
    signalingChannel.value = null;
    if(socket instanceof Socket) {
        socket.disconnect();
    }
    socket = io(`${useRuntimeConfig().public.url}:${useRuntimeConfig().public.socketPort}`, { autoConnect: false } );
    socket.connect();
    const pPaired = getPPaired(socket);
    const registry: TSignalingRegistry = { role, address };
    socket.emit(ESignalingSocketIo.ON_REGISTER_MESSAGE, registry);
    await pPaired;
    const sc = new SignalingChannelClass(msg => socket.emit(ESignalingSocketIo.ON_LOCAL_MESSAGE, msg));
    socket.on(ESignalingSocketIo.ON_REMOTE_MESSAGE, msg => sc.dispachNewRemoteMessageEvent(msg));
    signalingChannel.value = sc;
}

function abortSignalingChannnelAproach() {
    signalingChannel.value = null;
    socket.disconnect();
}