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
            const id = Math.random();
            console.log(id, 'New Socket. ID: ', id);
            const registry = await new Promise<TSignalingRegistry>(res => socket.on( ESignaling.ON_REGISTER, res ) );
            console.log(id, 'registry', registry);
            // onclose
            if ( 'passive' === registry.role ) {
                connectionMap.set(registry.address, {
                    address: registry.address,
                    passive: socket,
                    active: null
                });
                console.log(id, 'passive map entry creaed');
            }
            const entry = connectionMap.get(registry.address);
            if ( undefined === entry ) {
                const debugMsg = `No connection Map entry found for registry: ${JSON.stringify(registry)}`;
                // socket.emit(ESignaling.ON_DEBUG_MSG, debugMsg);
                console.log(id, debugMsg);
                socket.disconnect();
                return;
            }
            if ( 'active' === registry.role ) {
                entry.active = socket;
            }
            console.log(id, 'Entry: ', entry);
            socket.on(ESignaling.ON_LOCAL_MESSAGE, (msg: TSignalingMessage) => {
                console.log(id, 'new local message: ', msg);
                if ( 'active' === registry.role ) {
                    entry.passive.emit( ESignaling.ON_REMOTE_MESSAGE, msg );
                    console.log(id, 'sent from active to passive', msg);
                } else if ( 'passive' === registry.role ) {
                    debugger
                    entry.active?.emit( ESignaling.ON_REMOTE_MESSAGE, msg );
                    console.log(id, 'sent from passive to active', msg);
                }
            }) 
        })
});
