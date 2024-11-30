<template>
    Ich bin die Page
    <router-link to="first-working-version">First Working Version</router-link>
    <label>
        Block
        <input type="checkbox" v-model="isBlocked">
    </label>

    <label>
        Role
        <input type="text" v-model="text">
    </label>

    <ul>
        <li>    isBlocked: {{ isBlocked ? 'Ja' : 'Nein' }}</li>
        <li>text: {{ text }}</li>
    </ul>

    <button @click="setText">Set text</button>
    
</template>

<script setup lang="ts">

const isBlocked = ref(false);

const peerInfo = {
    text: 'Initial Text',
};

const text = computed({
    get(): string {
        return peerInfo.text
    },
    set(val: string) {
        if (isBlocked.value) {
            return
        }
        peerInfo.text = val
    }
});

function setText() {
    text.value = 'Mein neuer Text';
    console.log(text.value);
}

setInterval(() => {
    isBlocked.value = true;
}, 1000 );

watch(isBlocked, () => {
    console.log(isBlocked.value);
    alert('New Value: ' + (isBlocked.value ? 'T' : 'F'));
})

</script>
<style scoped>
    input {
        border: 1px solid black;
    }
</style>