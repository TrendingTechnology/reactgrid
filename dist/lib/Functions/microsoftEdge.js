export function isBrowserEdge() {
    var userAgent = window.navigator.userAgent;
    return userAgent.indexOf('Edge/') > 0;
}
