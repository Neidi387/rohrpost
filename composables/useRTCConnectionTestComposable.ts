export function useRTCConnectionTestComposable(): {localChannel: Ref<RTCDataChannel | undefined>, remoteChannel: Ref<RTCDataChannel | undefined>, debugWebRTCJSONExamples: WebRTCJSONExamplesDebug} {
    const debugWebRTCJSONExamples = new WebRTCJSONExamplesDebug();
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
            debugWebRTCJSONExamples.local.iceCandidates.push(iceCandidateJSON);
        }
    });
    remotePC.addEventListener('icecandidate', evt => {
        if(evt.candidate){
            localPC.addIceCandidate(evt.candidate);
            // Logging
            const iceCandidateJSON = JSON.stringify(evt.candidate);
            debugWebRTCJSONExamples.remote.iceCandidates.push(iceCandidateJSON);
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
        debugWebRTCJSONExamples.local.offer = offerJSON;
        debugWebRTCJSONExamples.remote.answer = answerJSON;
    })();
    return {localChannel, remoteChannel, debugWebRTCJSONExamples};
}

class WebRTCJSONExamplesDebug {
    local = {
        offer: '',
        iceCandidates: [] as string[],
    };
    remote = {
        answer: '',
        iceCandidates: [] as string[],
    };
};