import type { TSignalingMessage } from "../useRTCDataChannel/TSignalingMessage";

export class SignalingChannelClass {
    private newRemoteMessageListeners: ((msg: object) => void)[] = [];

    constructor(
        public sendToRemote: (msg: object) => void
    ) { }

    dispachNewRemoteMessageEvent(msg: object) {
        this.newRemoteMessageListeners.forEach(listener => listener(msg));
    }

    addNewRemoteMessageListener (listener: (msg: object) => void) {
        this.newRemoteMessageListeners.push(listener);
    }

    close() {
        
    }

}