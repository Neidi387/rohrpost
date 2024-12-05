import type { IFileStore } from "~/stores/files";
import { getMetaMessage } from "./getMetaMessage";
import type { I_State } from "../useSendFileComposable";

export function initializeNextFile(filesStore: IFileStore, dataChannel: RTCDataChannel, MAX_SLICE_SIZE: number, _state: I_State) {
    const nextFile = filesStore.send.find(file => 'queue' === file.state);
    if (!nextFile) {
        throw Error('No enqueued files');
    }
    if (nextFile.file === null) {
        throw Error('File is null');
    }
    nextFile.state = 'progress';
    _state.activeFile = {
        identifier: nextFile.identifier,
        sliceCount: Math.ceil(nextFile.meta.size / MAX_SLICE_SIZE),
        iSlice: 0,
        file: nextFile.file,
    }
    const metaMessage = getMetaMessage([nextFile]);
    dataChannel.send(metaMessage);
}