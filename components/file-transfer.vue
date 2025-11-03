<template>
    <v-container class="d-flex flex-column">
        <!-- <v-row class="flex-0-1">
            Bla bla Hier kannsch senden und empfangen
        </v-row> -->
        <v-row class>
            <v-col cols="12" sm="6" class="file-transfer-component overflow-y-auto">
                <v-sheet elevation="4" class="pa-6 fill-height">
                    <SendFiles></SendFiles>
                </v-sheet>
            </v-col>
            <v-col cols="12" sm="6" class="file-transfer-component overflow-y-auto">
                <v-sheet elevation="4" class="pa-6 fill-height">
                    <ReceiveFiles></ReceiveFiles>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">



</script>

<style scoped>
    .file-transfer-component {
        height: 50%;
    }
    @media screen and (min-width: 600px) {
        .file-transfer-component {
            height: 100%;
        }
        
    }
</style>