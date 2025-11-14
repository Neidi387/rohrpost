<template>
    <v-container>
        <v-row class="justify-center">
            <v-col cols="12" >
                <v-sheet class="ma-6 ma-md-12" elevation="4">
                    <v-container class="pa-6 pa-md-12">
                        <h1>Datenschutzerklärung</h1>

                        <h2>1. Verantwortlicher</h2>
                        <p>
                        Verantwortlich für die Datenverarbeitung auf dieser Webseite ist:<br>
                        <strong>Marco Neidenberger</strong><br>
                        Stockhornstraße 41<br>
                        68161 Mannheim<br>
                        E-Mail: <a href="mailto:marco.neidenberger@googlemail.com">marco.neidenberger@googlemail.com</a>
                        </p>

                        <h2>2. Allgemeine Hinweise zur Datenverarbeitung</h2>
                        <p>
                        Der Schutz Ihrer persönlichen Daten ist mir wichtig. Ich verarbeite personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen der DSGVO sowie der einschlägigen nationalen Datenschutzgesetze.<br>
                        Diese Webseite besitzt keinen Login-Bereich und kann ohne Registrierung genutzt werden.
                        </p>

                        <h2>3. Verarbeitung personenbezogener Daten bei Nutzung der Anwendung</h2>

                        <h3>3.1 WebRTC</h3>
                        <p>
                        Die Anwendung ermöglicht den Austausch von Daten über <strong>WebRTC</strong>.<br>
                        WebRTC-Verbindungen sind standardmäßig <strong>Ende-zu-Ende verschlüsselt</strong>.<br>
                        Für den Verbindungsaufbau (Signaling) müssen technische Informationen über meinen Server zwischen den Nutzern ausgetauscht werden, darunter:
                        </p>
                        <ul>
                            <li>Session-Informationen</li>
                            <li>Verbindungsparameter</li>
                            <li>ICE-Kandidaten</li>
                        </ul>
                        <p>
                        Diese Daten werden <strong>nicht gespeichert</strong>. Sie werden ausschließlich während des Signalings genutzt und anschließend <strong>sofort gelöscht</strong>.<br>
                        Es werden keinerlei Inhalte gespeichert, die über WebRTC übertragen werden.
                        </p>

                        <h3>3.2 Server-Logfiles</h3>
                        <p>
                        Beim Aufrufen der Webseite werden technische Informationen automatisch erfasst, darunter:
                        </p>
                        <ul>
                            <li>Browsertyp und -version</li>
                            <li>Betriebssystem</li>
                            <li>Referrer URL</li>
                            <li>Ihre IP-Adresse (ggf. anonymisiert)</li>
                            <li>Datum und Uhrzeit der Serveranfrage</li>
                        </ul>
                        <p>
                        Diese Daten sind technisch erforderlich, um die Webseite bereitzustellen. Eine Zusammenführung dieser Daten erfolgt nicht.
                        </p>
                        <h2>4. Weitergabe von Daten</h2>
                        <p>
                        Es findet keine Übermittlung Ihrer Daten an Dritte statt, außer:
                        </p>
                        <ul>
                            <li>Sie haben eingewilligt,</li>
                            <li>es ist technisch notwendig (z. B. Signaling für WebRTC),</li>
                            <li>es besteht eine gesetzliche Verpflichtung.</li>
                        </ul>

                        <h2>5. Speicherdauer</h2>
                        <ul>
                            <li>WebRTC-Signaling-Daten: nur während des Verbindungsaufbaus, danach sofort gelöscht.</li>
                            <li>Server-Logfiles: nur solange wie technisch notwendig und gesetzlich zulässig.</li>
                        </ul>

                        <h2>6. Ihre Rechte</h2>
                        <p>
                        Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
                        </p>
                        <ul>
                            <li>Auskunft</li>
                            <li>Berichtigung</li>
                            <li>Löschung</li>
                            <li>Einschränkung der Verarbeitung</li>
                            <li>Widerspruch</li>
                            <li>Datenübertragbarkeit</li>
                            <li>Widerruf erteilter Einwilligungen</li>
                        </ul>
                        <p>
                        Zur Ausübung Ihrer Rechte kontaktieren Sie mich per E-Mail.
                        </p>

                        <h2>7. Sicherheit</h2>
                        <p>
                        Ich treffe geeignete technische und organisatorische Maßnahmen, um Ihre Daten zu schützen.
                        Die WebRTC-Kommunikation ist vollständig Ende-zu-Ende verschlüsselt.
                        </p>

                        <h2>8. Änderungen dieser Datenschutzerklärung</h2>
                        <p>
                        Ich behalte mir vor, diese Datenschutzerklärung anzupassen. Es gilt jeweils die aktuelle, auf dieser Webseite veröffentlichte Version.
                        </p>
                    </v-container>
            </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    definePageMeta({
        title: 'Datenschutzerklärung',
    });
</script>

<style scoped>

</style>