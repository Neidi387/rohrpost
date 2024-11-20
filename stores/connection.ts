import { defineStore } from "pinia";

export const useConnectionStore = defineStore<'connection', IConnectionStore>({
    id: 'connection',
    state: () => {
        const state: IConnectionStore = {
            signaling: {
                address: '',
                role: 'passive',
                isConnected: false
            },
            rtcConnection: {
                peerConnection: null,
                dataChannel: null
            }
        }
        return state;
    }
})

interface IConnectionStore {
    signaling: {
        address: string;
        role: 'passive' | 'active';
        isConnected: boolean;
    };
    rtcConnection: {
        peerConnection: RTCPeerConnection | null;
        dataChannel: RTCDataChannel | null;
    };
}