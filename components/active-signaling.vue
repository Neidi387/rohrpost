<template>
    <h2>Active Signaling</h2>
    <form @submit.prevent="startSignaling">
        <label>
            <Address>Adresse</Address>
            <input type="text" v-model="address">
        </label>
        <input type="submit">
    </form>
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
    const address = ref();
    
    const {$io} = useNuxtApp();
    $io.connect();
    const pc = new RTCPeerConnection();
    const dataChannelMeta = pc.createDataChannel('meta');
    const dataChannelData = pc.createDataChannel('data');
    pc.addEventListener('connectionstatechange', e => {
        if ( 'connected' === pc.connectionState ) {
            emit('datachannels', {
                meta: dataChannelMeta,
                data: dataChannelData
            });
            //debugger
        }
    });
    pc.addEventListener('icecandidate', e => {
        if (null === e.candidate) {
            return;
        }
        $io.emit(ESignaling.ON_LOCAL_MESSAGE, e.candidate );
        //debugger;
    });
    $io.on(ESignaling.ON_REMOTE_MESSAGE, (msg: TSignalingMessage) => {
        if ( 'sdp' in msg && 'answer' === msg.type ) {
            pc.setRemoteDescription(msg);
            //debugger
        } else if ( 'candidate' in msg ) {
            pc.addIceCandidate(msg);
            //debugger
        }
    })
    async function startSignaling() {
        $io.connect();
        alert($io.id);
        alert(typeof $io);
        $io.emit(ESignaling.ON_REGISTER, { role: 'active', address: address.value });
        //debugger
        const offer: TSignalingMessage = await pc.createOffer();
        //debugger
        $io.emit(ESignaling.ON_LOCAL_MESSAGE, offer);
        //debugger
        pc.setLocalDescription(offer);
        //debugger
    }
</script>

<style scoped>

</style>