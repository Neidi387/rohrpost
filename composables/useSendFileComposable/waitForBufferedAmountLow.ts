export function waitForBufferedAmountLow(dataChannel: RTCDataChannel): Promise<void> {
    return new Promise((resolve) => {
        const onBufferedAmountLow = () => {
            dataChannel.removeEventListener('bufferedamountlow', onBufferedAmountLow);
            setTimeout(() => {
                // Extra delay to ensure buffer is really low
                resolve();
            }, 1000);
            // resolve();
        };
        dataChannel.addEventListener('bufferedamountlow', onBufferedAmountLow);
    });
}