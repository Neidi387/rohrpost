<template>
    <h2>Address</h2>
    <p>{{ address }}</p>
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

    const registry: TSignalingRegistry = { role: 'passive', address: address.value };
    $io.connect();
    $io.emit(ESignaling.ON_REGISTER, registry );
    logs.value.push('Registry sent: ' + JSON.stringify(registry));
    $io.on( ESignaling.ON_REMOTE_MESSAGE, async (msg: TSignalingMessage) => {
        if( 'sdp' in msg && 'offer' === msg.type ) {
            logs.value.push('Offer received: ' + JSON.stringify(msg));
            const answer = {type: 'answer', sdp: 'Blabla'};
            $io.emit(ESignaling.ON_LOCAL_MESSAGE,  );
            logs.value.push('Answer sent: ' + JSON.stringify(msg));
            for( let i = 0; i < 20; i++ ) {
                const candidate = { candidate: 'Bla ' + i };
                $io.emit( ESignaling.ON_LOCAL_MESSAGE, candidate );
            }
        }
        if ( 'candidate' in msg ) {
            logs.value.push('Candidate received: ' + JSON.stringify(msg));
        }
    } )
    onBeforeUnmount( () => $io.disconnect() );

</script>

<style scoped>

</style>