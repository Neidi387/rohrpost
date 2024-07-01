import type { Socket } from "socket.io-client";
import { ERtcSignaing } from "./ERtcSignaling";
import { ESignalingSocketIo } from "../signaling-socket.io/ESignalingSocketIo";
import { sendIceCandidate } from "./sendIceCandidate";
import { addIceCandidateEL } from "./addIceCandidateEL";
import type { TSignalingMessage } from "./TSignalingMessage";

export async function rtcDoPassiveSignaling(pc: RTCPeerConnection, socket: Socket) {
    pc.addEventListener('icecandidate', evt => sendIceCandidate(socket, evt));
    socket.on(ESignalingSocketIo.ON_REMOTE_MESSAGE, msg => addIceCandidateEL(pc, msg));
    const offer = await new Promise<RTCSessionDescriptionInit>(res => socket.on(ESignalingSocketIo.ON_REMOTE_MESSAGE, (msg: TSignalingMessage) => {
        if ('sdp' in msg && 'offer' === msg.type) {
            res(msg);
        }
    }));
    pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    socket.emit(ESignalingSocketIo.ON_LOCAL_MESSAGE, answer);
    pc.setLocalDescription(answer);
}