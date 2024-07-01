import { Socket } from "socket.io";
import { getPRegistryMessage } from "./getPRegistryMessage";
import { IEntry } from "./connectionMap";

export async function onConnectionRegisterPassive( socket: Socket ) {
    const registry = await getPRegistryMessage(socket);
    if ('passive' !== registry.role)  {
        return;
    }
    const entry: IEntry = {
        address: registry.address,
        passive: socket,
        active: null,
    };
    connectionMap.set(registry.address, entry);
    socket.on(ESignalingSocketIo.ON_LOCAL_MESSAGE, msg => {
        entry.active?.emit(ESignalingSocketIo.ON_REMOTE_MESSAGE, msg);
    });
}