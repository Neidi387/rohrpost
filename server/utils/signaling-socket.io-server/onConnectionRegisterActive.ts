import { Socket } from "socket.io";
import { getPRegistryMessage } from "./getPRegistryMessage";

export async function onConnectionRegisterActive( socket: Socket ) {
    const registry = await getPRegistryMessage(socket);
    if ('active' !== registry.role)  {
        return;
    }
    const entry = connectionMap.get(registry.address);
    entry!.active = socket;
    socket.on(ESignalingSocketIo.ON_LOCAL_MESSAGE, msg => {
        entry?.passive?.emit(ESignalingSocketIo.ON_REMOTE_MESSAGE, msg);
    });
}