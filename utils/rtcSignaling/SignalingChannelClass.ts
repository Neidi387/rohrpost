import type { TSignalingMessage } from "./TSignalingMessage";

export class SignalingChannelClass {
    private newRemoteMessageListeners: ((msg: TSignalingMessage) => void)[] = [];

    constructor(
        public sendToRemote: (msg: TSignalingMessage) => void
    ) {

    }

    dispachNewRemoteMessageEvent(msg: TSignalingMessage) {
        this.newRemoteMessageListeners.forEach(listener => listener(msg));
    }

    addNewRemoteMessageListener (listener: (msg: TSignalingMessage) => void) {
        this.newRemoteMessageListeners.push(listener);
    }

}