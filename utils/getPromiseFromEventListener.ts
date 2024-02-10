export async function getPromiseFromEventListener( name: string, target: EventTarget ): Promise<Event> {
    let resolve: ( e: Event ) => void;
    const p = new Promise<Event>( res => resolve = res );
    target.addEventListener(name, e => {
        resolve(e);
    } );
    return p;
}