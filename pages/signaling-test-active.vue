<template>
    <h2>Address</h2>
    <input type="text" v-model="address"/>
    <button @click="go">Go</button>
    <h2>Logs</h2>
    <div>
        <p v-for="log in logs">{{ log }}</p>
    </div>
</template>

<script lang="ts" setup>
import type { TSignalingMessage } from '~/utils/signaling-socket.io/TSignalingMessage';
import type { TSignalingRegistry } from '~/utils/signaling-socket.io/TSignalingRegistry';
import { ESignaling } from '~/utils/signaling-socket.io/ESignaling';


    const address = ref(getRandomString(5));
    const logs = ref(['no logs yet']);

    const {$io} = useNuxtApp();

    $io.connect();
    function go() {
        const registry: TSignalingRegistry = { role: 'active', address: address.value };
        $io.emit(ESignaling.ON_REGISTER, registry );
        logs.value.push('Registry sent: ' + JSON.stringify(registry));
        const offer = { type: 'offer', sdp: 'Blabla' };
        $io.emit( ESignaling.ON_LOCAL_MESSAGE, offer );
        logs.value.push('Offer sent: ' + JSON.stringify(offer));
        for( let i = 0; i < 20; i++ ) {
            const candidate = { candidate: 'Bla ' + i };
            $io.emit( ESignaling.ON_LOCAL_MESSAGE, candidate );
        }
    }
    $io.on( ESignaling.ON_REMOTE_MESSAGE, async (msg: TSignalingMessage) => {
        if( 'sdp' in msg && 'answer' === msg.type ) {
            logs.value.push('Answer received: ' + JSON.stringify(msg));
        }
        if ( 'candidate' in msg ) {
            logs.value.push('Candidate received: ' + JSON.stringify(msg));
        }
    } )
    onBeforeUnmount( () => $io.disconnect() );

</script>

<style scoped>

</style>