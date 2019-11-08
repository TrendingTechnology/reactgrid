export function checkLicense(license: string) {
    license = license.trim();
    if (license === 'non-commercial') {
        console.log('You are using ReactGrid with the non-commerial license. Happy coding!');
    } else {
        const licenseWithoutHash = license.slice(0, -3);
        const licenseHash = license.slice(-3);
        const calculatedHash = calcHash(licenseWithoutHash);

        if (licenseHash !== calculatedHash) {
            console.warn('Your ReactGrid license is invalid! Please contact your manager.');
            return;
        }

        const licenseExpirationDate = getLicenceExpirationDate(license);
        if (isLicenseExpired(licenseExpirationDate)) {
            console.warn('ReactGrid license has expired! Please contact your manager.');
            return;
        }
    }
}

function isLicenseExpired(expirationDate: Date): boolean {
    const today = new Date();
    return expirationDate <= today;
}

function getLicenceExpirationDate(license: string): Date {
    const pattern = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/gi;
    const strDate = license.match(pattern);
    if (!strDate) throw 'no date found in license string'
    return new Date(strDate[0]);
}

function calcHash(str: string): string {
    var hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return Math.abs(hash).toString(16).slice(0, 3);
}
