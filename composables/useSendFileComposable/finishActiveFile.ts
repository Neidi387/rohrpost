import type { IFileStore } from "~/stores/files";
import { getMetaMessage } from "./getMetaMessage";
import type { I_State } from "../useSendFileComposable";

export function finishActiveFile(filesStore: IFileStore, dataChannel: RTCDataChannel, MAX_SLICE_SIZE: number, _state: I_State) {
    const file = filesStore.send.find(file => file.identifier === _state.activeFile!.identifier);
    if (!file) {
        throw Error('File not found');
    }
    file.state = 'done';
    _state.activeFile = null;
    const metaMessage = getMetaMessage([file]);
    dataChannel.send(metaMessage);
}