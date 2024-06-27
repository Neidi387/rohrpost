<template>
    <div>
        <button v-if="!role" @click="role = 'active'">Active</button>
    </div>
    <div>
        <button v-if="!role" @click="role = 'passive'">Passive</button>
    </div>
    <div v-if="!rtcDataChannel">
        <ActiveSignaling v-if="!rtcDataChannel && 'active' === role"></ActiveSignaling>
        <PassiveSignaling v-if="!rtcDataChannel && 'passive' === role"></PassiveSignaling>
    </div>
    <div v-if="rtcDataChannel">
        <SendFiles></SendFiles>
        <ReceiveFiles></ReceiveFiles>
    </div>
</template>

<script lang="ts" setup>
    import { useRtcDataChannel } from '~/composables/useRtcDataChannel';

    const role = ref<'active' | 'passive'>(useRoute().query.role ?? '');
    const {rtcDataChannel} = useRtcDataChannel();

</script>

<style scoped>

</style>