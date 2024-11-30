<template>
    <label>
        {{ role }}
        <input type="checkbox" v-model="isActive">
    </label>
    <div v-if="!dataChannel">
        <ActiveSignaling v-if="'active' === role"></ActiveSignaling>
        <PassiveSignaling v-if="'passive' === role"></PassiveSignaling>
    </div>
    <div v-if="dataChannel">
        <SendFiles></SendFiles>
        <ReceiveFiles></ReceiveFiles>
    </div>
</template>

<script lang="ts" setup>

    const route = useRoute();
    const {role} = useLongPollingSignalingChannel();
    const {dataChannel} = useRtcDataChannel();

    const isActive = computed({
        get(): boolean {
            return 'active' === role.value
        },
        set(isActive: boolean) {
            if (isActive) {
                role.value = 'active';
            } else {
                role.value = 'passive';
            }
        }
    })

    if ('active' === route.query.role || 
        'passive' === route.query.role) {
        role.value = route.query.role
    }




</script>

<style scoped>

</style>