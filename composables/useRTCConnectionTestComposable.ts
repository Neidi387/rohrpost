export function useRTCConnectionTestComposable(): {localChannel: RTCDataChannel, remoteChannel: RTCDataChannel} {
    const localChannel = reactive({} as RTCDataChannel);
    const remoteChannel = reactive({} as RTCDataChannel);
    effect( () => {
        const localPC = new RTCPeerConnection();
        const remotePC = new RTCPeerConnection();
        Object.assign(localChannel, localPC.createDataChannel('localDC'));
        remotePC.addEventListener('datachannel', evt => Object.assign(remoteChannel, evt.channel));
        localPC.addEventListener('icecandidate', evt => { 
            if(evt.candidate) {
                remotePC.addIceCandidate(evt.candidate);
            }
        });
        remotePC.addEventListener('icecandidate', evt => {
            if(evt.candidate){
                localPC.addIceCandidate(evt.candidate);
            } 
        });
        (async function () {
            const offer = await localPC.createOffer();
            await localPC.setLocalDescription(offer);
            await remotePC.setRemoteDescription(offer);
            const answer = await remotePC.createAnswer();
            await localPC.setRemoteDescription(answer);
            await remotePC.setLocalDescription(answer);
        })();
    } );
    return {localChannel, remoteChannel};
}