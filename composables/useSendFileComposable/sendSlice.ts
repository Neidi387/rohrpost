import { waitForBufferedAmountLow } from "./waitForBufferedAmountLow";

export async function sendSlice(dataChannel: RTCDataChannel, _state: any, MAX_SLICE_SIZE: number) {
    const pReady = waitForBufferedAmountLow(dataChannel);
    const sliceFrom = _state.activeFile.iSlice * MAX_SLICE_SIZE;
    const sliceTo = Math.min((_state.activeFile.iSlice + 1) * MAX_SLICE_SIZE, _state.activeFile.file.size);
    const pArrayBuffer = _state.activeFile.file.slice(sliceFrom, sliceTo).arrayBuffer();
    const arrayBuffer = await pArrayBuffer;
    await pReady;
    dataChannel.send(arrayBuffer);
}