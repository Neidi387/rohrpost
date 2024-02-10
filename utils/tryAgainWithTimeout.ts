export async function tryAgainWithTimeout<T>(cb: () => T, timeout: number, atempts: number, errorCheckerFn?: (e: any) => boolean): Promise<T> {
    while (true) {
        try {
            debugger
            let result = await cb(); // Await in case T is a promise
            debugger
            return result
        } catch (e) {
            debugger
            if( errorCheckerFn && false === errorCheckerFn(e) ) {
                debugger
                throw e;
            }
            debugger
            if ( --atempts < 1 ) {
                debugger
                console.log('No attempts left');
                throw e;
            }
            debugger
            await new Promise(res => setTimeout(res, timeout));
            debugger
        }
    }
}