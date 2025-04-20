<template>
    <div v-if="!dataChannel">
        <RoleToggle>
            <template v-slot:active>
                <ActiveSignaling></ActiveSignaling>
            </template>
            <template v-slot:passive>
                <PassiveSignaling></PassiveSignaling>
            </template>
        </RoleToggle>
    </div>
    <div v-if="dataChannel">
        <SendFiles></SendFiles>
        <ReceiveFiles></ReceiveFiles>
    </div>
</template>

<script lang="ts" setup>

    const {dataChannel} = useRtcDataChannel();

    




</script>

<style scoped>

</style>