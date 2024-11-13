import { Server } from "socket.io";
import { TSignalingRegistry } from "../utils/signaling-socket.io-server/TSignalingRegistry";
import { connectionMap } from "../utils/signaling-socket.io-server/connectionMap";
import { TSignalingMessage } from "../utils/signaling-socket.io-server/TSignalingMessage";
import { onConnectionRegisterPassive } from "../utils/signaling-socket.io-server/onConnectionRegisterPassive";
import { onConnectionRegisterActive } from "../utils/signaling-socket.io-server/onConnectionRegisterActive";

export default defineNitroPlugin(async nitroApp => {
    const socketServer = new Server(
        useRuntimeConfig().public.socketPort, {
        serveClient: false,
        cors: { 
            origin: '*',
        },
    } );
    socketServer.on('connection', onConnectionRegisterPassive);
    socketServer.on('connection', onConnectionRegisterActive);
    socketServer.on('connection', onDisconnectCleanup);
});
