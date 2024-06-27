import { io } from "socket.io-client";
import { getActiveSocket } from "~/utils/signaling-socket.io/getActiveSocket";
import { getPassiveSocket } from "~/utils/signaling-socket.io/getPassiveSocket";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig().public;
    const socket = io(`${config.url}:${config.socketPort}`, {
        autoConnect: false
    });
    console.log(`${config.url}:${config.socketPort}`);
    return {
    provide: {
        io: socket,
    }
   }
});