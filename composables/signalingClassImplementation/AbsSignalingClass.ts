export abstract class AbsSignalingClass {
    protected _state: 'attempt-active' | 'attempt-passive' | 'connected' | 'error';

    constructor ( role: 'active' | 'passive' ) {
        if('active' === role) {
            this._state = 'attempt-active';
        } else if ('passive' === role) {
            this._state = 'attempt-passive';
        } 
        this._state = 'error';
    }

    public abstract waitForConnectionAttept(localAddress: string): Promise<void>;
    public abstract connectionAttempt(remoteAddress: string): Promise<void>;

    protected abstract sendMessage(localAddress: string): Promise<void>;
    protected abstract receiveMessage(remoteAddress: string): Promise<void>;

    public sendOffer( offer: RTCSessionDescriptionInit ) {
        this.sendMessage( JSON.stringify(offer) );
    }

    public sendAnswer( answer: RTCSessionDescriptionInit ) {
        this.sendMessage( JSON.stringify(answer) );
    }

    public sendIceCandidate( iceCandidate: RTCIceCandidateInit ) {
        this.sendMessage( JSON.stringify(iceCandidate) );
    }

    set onOffer( cb: (offer: RTCSessionDescriptionInit) => void ) {
        if (  )
        cb(offer);
    }

    get state() {
        return this._state;
    }

}