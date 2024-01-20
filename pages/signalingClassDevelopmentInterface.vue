<template>
    <h2>Eigene Adresse</h2>
    <v-chip
    label
        @click.stop.prevent="copyRemoteAddressToClipboard"
        append-icon="mdi-content-copy"
    >
        {{ localAddress }}
    </v-chip>
    <v-snackbar 
        timeout="2000"
        v-model="copiedToClipbarSnackbar">
        "{{ localAddress }}" wurde in die Zwischenablage kopiert.
    </v-snackbar>
    <h2>Mit Anderem Ende verbinden</h2>
    <v-text-field label="Entfernte Adresse" v-model="remoteAddress"></v-text-field>
    <v-btn @click="connectToRemote">Verbinden</v-btn>
    <v-snackbar 
        timeout="2000"
        v-model="connectToRemoteSnackbar">
        Verbindung zu Ende mit der Adresse "{{ remoteAddress }}" wird hergestellt.
    </v-snackbar>
    <h2> Operations </h2>
    <v-text-field label="Test Offer Text" v-model="localOffer.text"></v-text-field>
    <v-btn @click="onSendLocalOffer">Sende Offer an anderes Ende</v-btn>
    <v-text-field label="Test Answer Text" v-model="localAnswer.text"></v-text-field>
    <v-btn @click="onSendLocalAnswer">Sende Answer an anderes Ende</v-btn>
    <v-text-field label="Test ICE Candidate Text" v-model="localIceCandidate.text"></v-text-field>
    <v-btn @click="onSendLocalIceCandidate">Sende ICE Candidate an anderes Ende</v-btn>
    <h2> Eingehende Signaling Messages </h2>
    <v-btn @click="log('Neuer Log')">Teste eingehende Messages Log</v-btn>
    <p v-for="log in logs">{{ log }}</p>
</template>

<script setup lang="ts">
    useHead({
        title: 'Signaling Test'
    });

    const localAddress = useState( 'localAddress', () => generateAddress(10) );
    const copiedToClipbarSnackbar = ref( false );

    const remoteAddress = ref('Initial entfernte Adresse');
    const connectToRemoteSnackbar = ref(false);

    const localOffer = reactive({text: 'Initial Offer Text'});
    const localAnswer = reactive({text: 'Initial Answer Text'});
    const localIceCandidate = reactive({text: 'Initial Ice Candidte Text'});

    const logs = reactive(['Keine Logs bis jetzt', 'Zweite Zeile zum testen']);
        
    function generateAddress(len: number) {
        let address = '';
        for (let i = 0; i < len; i++) {
            const num = Math.floor( 65 + Math.random() * 26);
            const letter = String.fromCharCode(num);
            address += letter;
        }
        return address;
    }

    function copyRemoteAddressToClipboard() {
        navigator.clipboard.writeText(localAddress.value);
        copiedToClipbarSnackbar.value = true;
    }

    // Not working yet. Currently only console log
    function connectToRemote() {
        console.log('Connecting to remote. Remote Address: ' + remoteAddress.value);
        connectToRemoteSnackbar.value = true;
    }

    // Incomming messages
    function log(msg: string) {
        logs.push(msg);
    }
    
    // Not working yet. Currently only console log
    function onSendLocalOffer() {
        console.log('Sending local offer: ' + JSON.stringify(localOffer));
    }
        
    // Not working yet. Currently only console log
    function onSendLocalAnswer() {
        console.log('Sending local offer: ' + JSON.stringify(localAnswer));
    }
        
    // Not working yet. Currently only console log
    function onSendLocalIceCandidate() {
        console.log('Sending local offer: ' + JSON.stringify(localIceCandidate));
    }

    // TODO: 1) Signaling class & useSignaking Composable 2) Fuse Signaling Class with this component
</script>

<style scoped>

</style>-