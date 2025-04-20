<template>
    <label>
    {{ role }}
    <input type="checkbox" v-model="isActive">
    </label>
    <slot name="active" v-if="'active' === role"></slot>
    <slot name="passive" v-if="'passive' === role"></slot>
</template>

<script setup lang="ts">
    const route = useRoute();
    const {role} = useLongPollingSignalingChannel();

    if ('active' === route.query.role || 
        'passive' === route.query.role) {
        role.value = route.query.role
    }

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

</script>

<style scoped>

</style>