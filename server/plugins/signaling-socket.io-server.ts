import { Server } from "socket.io";
import { TSignalingRegistry } from "../utils/signaling-socket.io-server/TSignalingRegistry";
import { connectionMap } from "../utils/signaling-socket.io-server/connectionMap";
import { TSignalingMessage } from "../utils/signaling-socket.io-server/TSignalingMessage";

export default defineNitroPlugin(async nitroApp => {
    const socketServer = new Server( 
        useRuntimeConfig().public.socketPort, {
        serveClient: false,
        cors: {
            origin: '*',
        },
    } ).
        on('connection', async socket => {
            debugger
            const registry = await new Promise<TSignalingRegistry>(res => socket.on( ESignaling.ON_REGISTER, res ) );
            // onclose
            debugger
            if ( 'passive' === registry.role ) {
                connectionMap.set(registry.address, {
                    address: registry.address,
                    passive: socket,
                    active: null
                });
            }
            const entry = connectionMap.get(registry.address);
            debugger
            if ( undefined === entry ) {
                const debugMsg = `No connection Map entry found for registry: ${JSON.stringify(registry)}`;
                socket.emit(ESignaling.ON_DEBUG_MSG, debugMsg);
                socket.disconnect();
                return;
            }
            socket.on(ESignaling.ON_LOCAL_MESSAGE, (msg: TSignalingMessage) => {
                if ( 'active' === registry.role ) {
                    entry.passive.emit( ESignaling.ON_REMOTE_MESSAGE, msg );
                } else if ( 'passive' === registry.role ) {
                    entry.passive.emit( ESignaling.ON_REMOTE_MESSAGE, msg );
                }
            }) 
        })
});
