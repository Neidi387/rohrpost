<template>
    <div>
        <h2>Passive Signaling</h2>
        {{ address }}
    </div>
</template>

<script setup lang="ts">
    import type { TSignalingRegistry } from '#build/types/nitro-imports';
import { io } from 'socket.io-client';
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';
import { SignalingChannelClass } from '~/utils/rtcSignaling/SignalingChannelClass';
    import { ESignalingSocketIo } from "~/utils/signaling-socket.io/ESignalingSocketIo";


    const address = ref(getRandomString(5));
    const {rtcConnectPassive} = useRtcDataChannel();
    const config = useRuntimeConfig().public;
    const socket = io(`${config.url}:${config.socketPort}`, {
        autoConnect: false
    });
    socket.connect();
    const msg: TSignalingRegistry = {
        role: 'passive',
        address: address.value,
    };
    const signalingChannel = new SignalingChannelClass((msg) => socket.emit(ESignalingSocketIo.ON_LOCAL_MESSAGE, msg));
    socket.on(ESignalingSocketIo.ON_REMOTE_MESSAGE, (msg) => signalingChannel.dispachNewRemoteMessageEvent(msg));
    setTimeout(() => {
        socket.emit(ESignalingSocketIo.ON_REGISTER_MESSAGE, msg);
        rtcConnectPassive(signalingChannel);
    }, 100)
</script>

<style scoped>

</style>