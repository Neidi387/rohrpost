import type { Socket } from "socket.io-client";
import { ERtcSignaing } from "./ERtcSignaling";
import { ESignalingSocketIo } from "../signaling-socket.io/ESignalingSocketIo";
import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";

export async function rtcDoActiveSignaling(pc: RTCPeerConnection, socket: Socket) {
    pc.addEventListener('icecandidate', evt => sendIceCandidate(socket, evt));
    socket.on(ESignalingSocketIo.ON_REMOTE_MESSAGE, msg => addIceCandidateEL(pc, msg));
    const pAnswer = new Promise<RTCSessionDescriptionInit>(res => socket.on(ESignalingSocketIo.ON_REMOTE_MESSAGE, (msg: TSignalingMessage) => {
        if ('sdp' in msg && 'answer' === msg.type) {
            res(msg);
        }
    }));
    const offer = await pc.createOffer();
    socket.emit(ESignalingSocketIo.ON_LOCAL_MESSAGE, offer);
    pc.setLocalDescription(offer);
    pc.setRemoteDescription(await pAnswer);
}