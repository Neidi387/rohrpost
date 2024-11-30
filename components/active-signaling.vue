<template>
    <div>
        <h2>Active Signaling</h2>
        <form @submit.prevent="connect">
            <label>
                Adresse
                <input type="text" v-model="address">
            </label>
            <input type="submit">
        </form>
    </div>
</template>

<script setup lang="ts">
import { useLongPollingSignalingChannel } from '~/composables/useLongPollingSignalingChannel';

    const {connect: connectSignaling, isConnected: isSignalingConnected, role, address} = useLongPollingSignalingChannel();
    const {connect: connectRtc} = useRtcDataChannel();

    role.value = 'active';

    async function connect() {
        await connectSignaling();
        await connectRtc();
    }

    onUnmounted(async () => {
        isSignalingConnected.value = false;
    })

</script>

<style scoped>

</style>