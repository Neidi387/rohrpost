const peerConnection = ref<RTCPeerConnection | null>(null);
const dataChannel = ref<RTCDataChannel | null>(null);

export function useRtcDataChannelMock() {
    return {
        connect,
        peerConnection,
        dataChannel,
    }
}

async function connect() {
    peerConnection.value = new RTCPeerConnection();
    dataChannel.value = true as RTCDataChannel;
}