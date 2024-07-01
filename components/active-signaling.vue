<template>
    <div>
        <h2>Active Signaling</h2>
        <form @submit.prevent="startSignaling">
            <label>
                Adresse
                <input type="text" v-model="address">
            </label>
            <input type="submit">
        </form>
    </div>
</template>

<script setup lang="ts">
    import type { TSignalingRegistry } from '#build/types/nitro-imports';
import { io } from 'socket.io-client';
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';
import { SignalingChannelClass } from '~/utils/rtcSignaling/SignalingChannelClass';
    import { ESignalingSocketIo } from "~/utils/signaling-socket.io/ESignalingSocketIo";

    const address = ref('');
    const {rtcConnectActive} = useRtcDataChannel();
    const config = useRuntimeConfig().public;
    const socket = io(`${config.url}:${config.socketPort}`, {
        autoConnect: false
    });
    socket.connect();
    const signalingChannel = new SignalingChannelClass((msg) => socket.emit(ESignalingSocketIo.ON_LOCAL_MESSAGE, msg));
    socket.on(ESignalingSocketIo.ON_REMOTE_MESSAGE, (msg) => signalingChannel.dispachNewRemoteMessageEvent(msg));
    function startSignaling() {
        const msg: TSignalingRegistry = {
            role: 'active',
            address: address.value,
        };
        socket.emit(ESignalingSocketIo.ON_REGISTER_MESSAGE, msg);
        rtcConnectActive(signalingChannel);
    }
</script>

<style scoped>

</style>