const apiUrl = useRuntimeConfig().public.signaling;

export class LongPollingSignalingChannel {

    static ROOM_NOT_FOUND_EXCEPTION = 'ROOM NOT FOUND';

    static async openRoom(role = 'passive', onAddressOffer: (addressOffer: string) => Promise<void>): Promise<LongPollingSignalingChannel> {
        // Create room folder on the server
        const {address: newAddress} = await fetch(apiUrl + 'room.php', {
            method: 'POST',
        }).then(res => res.json());
        try {
            await onAddressOffer(newAddress);
        } catch( e ) {
            const response = await fetch( apiUrl + 'room.php', {
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
        return new Promise(res => {
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
        return new Promise(res => {
            const channel = new LongPollingSignalingChannel(address, role);
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

    private iMessage = {
        sent: 0,
        received: 0,
    }

    private constructor( readonly address: string, readonly role: string ) {
        this.startListeningForMessages();
    }

    async sendMessage(msg: object) {
        const response = await fetch(apiUrl + 'message.php', {
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

    private async startListeningForMessages() {
        while( true ) {
            const params = new URLSearchParams({
                address: this.address,
                role: this.role,
                i_message: String(this.iMessage.received),
                seconds_to_wait: '2',
            });
            const response = await fetch(apiUrl + 'message.php' + '?' + params.toString());
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
        const response = await fetch( apiUrl + 'room.php', {
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
            throw new LongPollingSignalingChannelRoomNotFoundException('Room not found');
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