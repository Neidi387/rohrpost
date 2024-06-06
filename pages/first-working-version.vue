<template>
    <div>
        <button v-if="!role" @click="role = 'active'">Active</button>
    </div>
    <div>
        <button v-if="!role" @click="role = 'passive'">Passive</button>
    </div>
    <ActiveSignaling v-if="!datachannels && 'active' === role" @datachannels="dcs => datachannels = dcs"></ActiveSignaling>
    <PassiveSignaling v-if="!datachannels && 'passive' === role" @datachannels="dcs => datachannels = dcs"></PassiveSignaling>
    <div v-if="datachannels">
        <SendFiles :dataChannels="datachannels"></SendFiles>
        <ReceiveFiles :dataChannels="datachannels"></ReceiveFiles>
    </div>
</template>

<script lang="ts" setup>
    const role = ref<'active' | 'passive'>();
    const datachannels = ref<{meta: RTCDataChannel, data: RTCDataChannel}>();
    watch(datachannels, x => {
        //debugger
        datachannels.value?.meta.addEventListener('message', e => {
        received.value.push('Meta: ' + e.data);   
        //debugger 
        });
        datachannels.value?.data.addEventListener('message', e => {
            received.value.push('Data: ' + e.data);    
            //debugger
        });
        //debugger
    })
    const msg = ref({
        meta: 'Initial',
        data: 'Initial',
    });
    const received = ref<string[]>([]);
    function sendMsg() {
        //debugger
        datachannels.value?.meta.send(msg.value.meta);
        datachannels.value?.data.send(msg.value.data);
    }
</script>

<style scoped>

</style>