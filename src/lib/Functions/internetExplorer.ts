export function isBrowserIE() {
    if (typeof window !== 'undefined') { // condition needed for circle ci compiler
        return window.navigator.userAgent.indexOf('Trident') > 0;
    } else
        return false;
}

// TODO this has to be done in a different way
export function getDataToPasteInIE() {
    const data: string = (window as any).clipboardData.getData('text');
    return data.split('\n').map(line => line.split('\t').map(t => ({ text: t, data: t, type: 'text' })));
}
