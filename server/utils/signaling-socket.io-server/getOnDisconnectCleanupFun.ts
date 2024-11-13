export function getOnDisconnectCleanupFun(registry: TSignalingRegistry) {
    return function onDisconnectCleanup() {
        connectionMap.delete(registry.address);
    }
}