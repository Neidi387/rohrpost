import type { TSignalingMessage } from "./TSignalingMessage";

export interface TSignalingChannel {
    sendToRemote(msg: object): void;
    dispachNewRemoteMessageEvent(msg: object): void;
    addNewRemoteMessageListener (listener: (msg: object) => void): void
}