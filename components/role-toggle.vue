<template>
<v-container style="max-width: 100vw;">
    <v-row>
        <v-col class="d-flex justify-center">
            <v-sheet elevation="2" class="pa-2 rounded-lg d-flex justify-center">
                <v-col>
                    <v-row>
                        <v-btn-toggle v-model="role" color="primary" mandatory>
                        <!-- <v-btn icon="mdi-alphabetical-variant" value="passive"></v-btn> -->
                        <v-btn icon="mdi-monitor" value="passive"></v-btn>
                        <!-- <v-btn icon="mdi-pen" value="active"></v-btn> -->
                        <v-btn icon="mdi-cellphone" value="active"></v-btn>
                        </v-btn-toggle>
                    </v-row>
                    <v-row class="justify-center mt-6">
                        {{ role === 'active' ? 'Handy' : 'Computer' }}
                    </v-row>
                </v-col>
            </v-sheet>
        </v-col>
    </v-row>
    <v-row class="justify-center">
        <slot name="active" v-if="'active' === role"></slot>
        <slot name="passive" v-if="'passive' === role"></slot>
    </v-row>
        <v-row>
        <v-col class="d-flex justify-center">
            <v-sheet  class="pa-2 rounded-lg d-flex justify-center">
                <v-col>
                    <v-row class="justify-center">
                        <h2 class="text-grey-darken-1">
                            mob2pc.com 
                            <v-icon icon="mdi-cellphone"></v-icon>
                            <v-icon icon="mdi-swap-horizontal"></v-icon>
                            <v-icon icon="mdi-monitor"></v-icon>
                        </h2>
                    </v-row>
                    <v-row class="justify-center">
                        <p class="text-center text-grey-darken-1">
                            Der einfachste Weg Dateien zwischen deinem Handy ud PC auszutauschen.
                        </p>
                    </v-row>
                    <!-- <v-row class="justify-center mt-6"> -->
                    <!-- </v-row> -->
                </v-col>
            </v-sheet>
        </v-col>
    </v-row>
</v-container>
</template>

<script setup lang="ts">
const route = useRoute();
const { isMobile } = useDevice();

const role = ref<'passive' | 'active'>('passive');

if ('active' === route.query.role ||
    'passive' === route.query.role) {
    role.value = route.query.role
} else if ( isMobile ) {
    role.value = 'active';
} else {
    role.value = 'passive';
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
    .cnt {
        max-width: 600px;
    }
</style>