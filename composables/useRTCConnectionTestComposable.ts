export function useRTCConnectionTestComposable(): {localChannel: Ref<RTCDataChannel | undefined>, remoteChannel: Ref<RTCDataChannel | undefined>} {
    const localChannel = ref<RTCDataChannel>();
    const remoteChannel = ref<RTCDataChannel>();
    const localPC = new RTCPeerConnection();
    const remotePC = new RTCPeerConnection();
    localChannel.value = localPC.createDataChannel('localDC');
    remotePC.addEventListener('datachannel', evt => remoteChannel.value = evt.channel);
    localPC.addEventListener('icecandidate', evt => { 
        if(evt.candidate) {
            remotePC.addIceCandidate(evt.candidate);
            // Logging
            const iceCandidateJSON = JSON.stringify(evt.candidate);
            console.log('WebRTC JSON\n\nNew Local -> remote ICE Candidate:\n' + iceCandidateJSON);
        }
    });
    remotePC.addEventListener('icecandidate', evt => {
        if(evt.candidate){
            localPC.addIceCandidate(evt.candidate);
            // Logging
            const iceCandidateJSON = JSON.stringify(evt.candidate);
            console.log('WebRTC JSON\n\nNew Remote -> local ICE Candidate:\n' + iceCandidateJSON);
        } 
    });
    (async function () {
        const offer = await localPC.createOffer();
        await localPC.setLocalDescription(offer);
        await remotePC.setRemoteDescription(offer);
        const answer = await remotePC.createAnswer();
        await localPC.setRemoteDescription(answer);
        await remotePC.setLocalDescription(answer);
        // For Logging
        const offerJSON = JSON.stringify(offer)
        const answerJSON = JSON.stringify(answer);
        console.log(`WebRTC JSON\n\nOffer:\n${offerJSON}\n\nAnswer:\n${answerJSON}`);
    })();
    return {localChannel, remoteChannel};
}