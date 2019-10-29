export function isBrowserIE() {
    var userAgent = window.navigator.userAgent;
    return userAgent.indexOf('Trident/') > 0;
}
export function getDataToPasteInIE() {
    var data = window.clipboardData.getData('text');
    return data.split('\n').map(function (line) { return line.split('\t').map(function (t) { return ({ text: t, data: t, type: 'text' }); }); });
}
