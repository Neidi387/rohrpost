import { ERtcSignaing } from "./ERtcSignaling"

export async function getPDataChannel(pc: RTCPeerConnection): Promise<RTCDataChannel> {
    return new Promise(res => {
        pc.addEventListener('datachannel', evt => {
            if (ERtcSignaing.DATACHANNEL_LABEL !== evt.channel.label) {
                return
            }
            console.trace('Datachannel Event fired');        
            res(evt.channel)
        })
    })
}