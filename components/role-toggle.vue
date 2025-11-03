<template>
<v-container>
    <v-row>
        <v-col class="d-flex justify-center">
            <v-btn-toggle v-model="role" color="primary" mandatory>
            <v-btn icon="mdi-alphabetical-variant" value="passive"></v-btn>
            <v-btn icon="mdi-pen" value="active"></v-btn>
            </v-btn-toggle>
        </v-col>
    </v-row>
    <v-row class="fill-height">
        <v-col>
            <slot name="active" v-if="'active' === role"></slot>
            <slot name="passive" v-if="'passive' === role"></slot>
        </v-col>
    </v-row>
</v-container>
</template>

<script setup lang="ts">
const route = useRoute();
const { role } = useLongPollingSignalingChannel();

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

<style scoped></style>