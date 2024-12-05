export function waitForBufferedAmountLow(dataChannel: RTCDataChannel): Promise<void> {
    return new Promise((resolve) => {
        const onBufferedAmountLow = () => {
            dataChannel.removeEventListener('bufferedamountlow', onBufferedAmountLow);
            resolve();
        };
        dataChannel.addEventListener('bufferedamountlow', onBufferedAmountLow);
    });
}