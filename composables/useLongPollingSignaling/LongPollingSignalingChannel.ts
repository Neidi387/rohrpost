const apiPath = location.origin.replace(':3000','') + useRuntimeConfig().public.signaling + '/';

export class LongPollingSignalingChannel {

    static ROOM_NOT_FOUND_EXCEPTION = 'ROOM NOT FOUND';

    static async openRoom(role = 'passive', onAddressOffer: (addressOffer: string, abortOffer: () => void) => Promise<void>): Promise<LongPollingSignalingChannel> {
        // Create room folder on the server
        const {address: newAddress} = await fetch( apiPath + 'room.php', {
            method: 'POST',
        }).then(res => res.json());
        try {
            const abortOffer = async () => {
                const response = await fetch( apiPath + 'room.php', {
                method: 'DELETE',
                body: JSON.stringify({
                    address: newAddress,
                    })
                } );
                const {status} = await response.json();
            }
            await onAddressOffer(newAddress, abortOffer);
        } catch( e ) {
            const response = await fetch( apiPath + 'room.php', {
                method: 'DELETE',
                body: JSON.stringify({
                    address: newAddress,
                })
            } );
            const {status} = await response.json();
            // SOll ich hier jetzt echt nen RoomCreationAbrotedExpection werfen?
        }
        // Create channel instance and do ping pong to ensure connection
        const channel = new LongPollingSignalingChannel(newAddress, role);
        return new Promise((res, rej) => {
            channel.addErrorListener(rej);
            // Expecting Ping message, when active side is ready
            channel.addMessageListener( msg => {
                if (msg && 'type' in msg && 'ping' === msg.type ) {
                    channel.sendMessage({ type: "pong", message: "Hello from the " + role + " side" });
                    res(channel);
                }
            } );
        })
    }

    static async joinRoom(address: string, role = 'active'): Promise<LongPollingSignalingChannel> {
        // Do ping pong to ensure connection
        return new Promise((res, rej) => {
            const channel = new LongPollingSignalingChannel(address, role);
            channel.addErrorListener(rej);
            // Send ping because passive side is waiting for it
            channel.addMessageListener( msg => {
                if (msg && 'type' in msg && 'pong' === msg.type ) {
                    res(channel);
                }
            } );
            channel.sendMessage({ type: "ping", message: "Hello from the " + role + " side" });
        })
    }

    private messageListeners: ((msg: object) => void)[] = [];
    private errorListeners: ((e: any) => void)[] = [];

    private iMessage = {
        sent: 0,
        received: 0,
    }

    private constructor( readonly address: string, readonly role: string ) {
        this.startListeningForMessages();
    }

    async sendMessage(msg: object) {
        const response = await fetch(apiPath + 'message.php', {
            method: 'POST',
            body: JSON.stringify({
                i_message: String(this.iMessage.sent++),
                message: msg,
                address: this.address,
                role: this.role,
            })
        });
        this.checkRoomExistance(response);
    }

    addMessageListener( listener: (msg: object) => void ) {
        this.messageListeners.push(listener);
    }

    // To pass an error from inside another async context to the function that started that
    private addErrorListener( listener: (e: any) => void ) {

    }

    private async startListeningForMessages() {
        while( true ) {
            const params = new URLSearchParams({
                address: this.address,
                role: this.role,
                i_message: String(this.iMessage.received),
                seconds_to_wait: '2',
            });
            const response = await fetch(apiPath + 'message.php' + '?' + params.toString());
            await this.checkRoomExistance(response);
            const {message, status} = await response.json();
            if ( 404 === response.status && 'message not found' === status ) {
                continue;
            } else if (false === response.ok) {
                break;
            }
            this.messageListeners.forEach(fun => {
                fun(message);
            } );
            this.iMessage.received++;
        }
    }

    async closeRoom() {
        const response = await fetch( apiPath + 'room.php', {
            method: 'DELETE',
            body: JSON.stringify({
                address: this.address,
            })
        } );
        const {status} = await response.json();
        
    }

    async checkRoomExistance(response: Response ) {
        const clone = response.clone(); // TODO: Clean this up later, performance....
        if ( 404 === clone.status && 'room not found' === (await clone.json()).status ) {
            const e = new LongPollingSignalingChannelRoomNotFoundException('Room not found');
            this.errorListeners.forEach( fun => { fun(e); } );
        }
    }

    static isRoomNotFoundException( e: unknown ): e is LongPollingSignalingChannelRoomNotFoundException  {
        return e instanceof LongPollingSignalingChannelRoomNotFoundException
            || (!!e && typeof e === 'object' && (e as any).name === LongPollingSignalingChannel.ROOM_NOT_FOUND_EXCEPTION);
    }

}

class LongPollingSignalingChannelRoomNotFoundException extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = LongPollingSignalingChannel.ROOM_NOT_FOUND_EXCEPTION;
    }
}