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
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';
    import { useSocketIOSignalingChannel } from '~/composables/useSocketIOSignalingChannel';

    const address = ref('');
    const {rtcConnectActive} = useRtcDataChannel();
    const {signalingChannel, signalingChannnelAproach, abortSignalingChannnelAproach} = useSocketIOSignalingChannel();

    function startSignaling() {
        signalingChannnelAproach('active', address.value);
    }

    watch(signalingChannel, () => {
        if (null === signalingChannel.value) 
            return;
        rtcConnectActive(signalingChannel.value);
    })
</script>

<style scoped>

</style>