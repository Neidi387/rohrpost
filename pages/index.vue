<template>
    Ich bin die Page
    <router-link to="first-working-version">First Working Version</router-link>
    <br><br>
    <button v-on:click="toggle">toggle</button>
    {{ role }}
</template>

<script setup lang="ts">

    const _role = ref('passive');
    let inProgress = false;

    const role = computed({
        get: () => {
            return _role.value
        },
        set: (val: string) => {
            if (inProgress) {
                return;
            }
            setTimeout(() => {
                _role.value = val;
                inProgress = false;
            }, 5000)
        }
    })

    function toggle() {
        if (role.value === 'active') {
            debugger
            role.value = 'passive';
        } else {
            debugger
            role.value = 'active';
        }
    }

</script>
<style scoped>
    input {
        border: 1px solid black;
    }
</style>