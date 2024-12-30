// create a random password given a length
export function generateCodeVerifier(length: number) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// encrypts a given string and returns as ascii
export async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    // btoa creates ascii encoded string from binary string
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// check if the current url link includes the spotify authorisation code
// by reading the url search, finding param code and seeing if 
// theres anything after it
export function getAuthorisationCode() {
    // Get the full URL (window.location.href) and parse the query string
    const urlParams = new URLSearchParams(window.location.search);

    // Retrieve the 'code' parameter from the URL
    const authorisationCode = urlParams.get('code');

    if (authorisationCode) {
        return (authorisationCode);
    } else {
        return null;
    }
}


export function isAnyPropertyEmpty<T>(obj: T): boolean {
    for (let key in obj) {
        const value = obj[key];
  
        // Check if the value is "null" (string), null, undefined, an empty
        // object, an empty array, or an empty string
        if (
            value === "undefined" ||
            value === "null" ||
            value === null ||
            value === undefined ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'string' && value.trim() === '')
        ) {
            return true;
        }
    }
    return false;
}