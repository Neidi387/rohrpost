<template>
    <h2>Passive Signaling</h2>
    {{ address }}
</template>

<script setup lang="ts">
    import type { TSignalingMessage } from '~/utils/signaling-socket.io/TSignalingMessage';
    import type { TSignalingRegistry } from '~/utils/signaling-socket.io/TSignalingRegistry';
    import { ESignaling } from '~/utils/signaling-socket.io/ESignaling';

    const emit = defineEmits<{
        (e: 'datachannels', dataChannels: { 
            meta: RTCDataChannel,
            data: RTCDataChannel
        }): void
    }>();
    const address = ref(getRandomString(5));
    const {$io} = useNuxtApp();
    $io.connect();
    const pc = new RTCPeerConnection();
    const datachannels = {
        meta: {} as RTCDataChannel,
        data: {} as RTCDataChannel
    };

    pc.addEventListener('datachannel', e => {
        if( 'meta' === e.channel.label ) {
            datachannels.meta = e.channel;
            //debugger;
        } if( 'data' === e.channel.label ) {
            datachannels.data = e.channel;
            //debugger;
        }
        if ( 'send' in datachannels.meta && 'send' in datachannels.data && 'open' === datachannels.meta.readyState && 'open' === datachannels.data.readyState ) {
            //debugger
            emit('datachannels', datachannels);
        }
    });

    pc.addEventListener('icecandidate', e => {
        if (null === e.candidate) {
            return;
        }
        $io.emit(ESignaling.ON_LOCAL_MESSAGE, e.candidate);
        //debugger;
    });
    $io.connect();
    $io.on(ESignaling.ON_REMOTE_MESSAGE, (msg: TSignalingMessage) => {
        if ( 'candidate' in msg ) {
            pc.addIceCandidate(msg);
            //debugger;
        }
    })
    startSignaling();
    async function startSignaling() {
        $io.emit(ESignaling.ON_REGISTER, { role: 'passive', address: address.value });
        //debugger;
        const offer = await new Promise<RTCSessionDescriptionInit>(res => $io.on(ESignaling.ON_REMOTE_MESSAGE, (msg: TSignalingMessage) => {
            if ( 'sdp' in msg && 'offer' === msg.type ) {
                res(msg);
                //debugger;
            }
        }))
        pc.setRemoteDescription(offer);
        //debugger;
        const answer: TSignalingMessage = await pc.createAnswer();
        //debugger;
        $io.emit(ESignaling.ON_LOCAL_MESSAGE, answer);
        //debugger;
        pc.setLocalDescription(answer);
        //debugger;
    }
</script>

<style scoped>

</style>