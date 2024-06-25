import { Socket } from "socket.io";
import { getPRegistryMessage } from "./getPRegistryMessage";

export async function onConnectionRegisterActive( socket: Socket ) {
    const registry = await getPRegistryMessage(socket);
    if ('active' !== registry.role)  {
        return;
    }
    const entry = connectionMap.get(registry.address);
    socket.on(ESignaling.ON_LOCAL_MESSAGE, msg => {
        entry?.passive?.emit(ESignaling.ON_REMOTE_MESSAGE, msg);
    });
}