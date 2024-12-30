import { generateCodeVerifier, generateCodeChallenge } from './utils.ts';


// client credential flow doesn't require the user the login
// allows access to spotify api but not user info
export async function clientCredential(clientId: string, clientSecret: string) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const headers = { 'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret) };
    const body = new URLSearchParams({ grant_type: 'client_credentials' });

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: headers,
        body: body
    });

    const cc_access_token = await response.json();
    storeCCAccessTokens(cc_access_token)
}

/////////////////////////////////////////
// Redirect to Spotify authorisation page - uses Authentication code 
// without PKCE 
export async function redirectToAuthCodeFlow(clientId: string, redirect_uri: string) {
    const spotifyScope = "user-read-private user-top-read";
    const params = new URLSearchParams({
        "client_id": clientId,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": spotifyScope,
    });
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/////////////////////////////////////////
// Redirect to Spotify authorisation page - uses Authentication code using
// Proof Key for Code Exchange (PKCE) flow where a code verifier is a random
// string that a client app creates to identify itself, and a code challenge
// is a transformation of that code verifier
export async function redirectToAuthCodeFlowPKCE(clientId: string, redirect_uri: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    // stores data in the browsers localstorage object
    localStorage.setItem("verifier", verifier);

    const spotifyScope = "user-read-private user-top-read";
    const params = new URLSearchParams({
        "client_id": clientId,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": spotifyScope,
        "code_challenge_method": "S256",    // S256 is SHA-256 
        "code_challenge": challenge,
    });

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// requests spotify for the access token
export async function getAccessToken(clientId: string,
    clientSecret: string,
    redirect_uri: string,
    code: string): Promise<AccessToken> {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authHeader = 'Basic ' + btoa(clientId + ':' + clientSecret);

    const body = new URLSearchParams({
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
    });

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    });

    const access_token = await response.json();
    storeAccessTokens(access_token);
    return access_token
}

// requests spotify for the access token using PKCCE
export async function getAccessTokenPKCE(clientId: string,
    redirect_uri: string,
    code: string): Promise<AccessToken> {
    const verifier = localStorage.getItem("verifier");
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const body = new URLSearchParams({
        "client_id": clientId,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "code_verifier": verifier!,
    });

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
    });

    const access_token = await response.json();
    storeAccessTokens(access_token);
    return access_token
}

// using the refresh token, update the access token
export async function refreshAccessToken(clientId: string,
    clientSecret: string,
    refresh_token: string) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authHeader = 'Basic ' + btoa(clientId + ':' + clientSecret);

    const body = new URLSearchParams({
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    });

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    });

    const access_token = await response.json();
    storeAccessTokens(access_token);
    return access_token;
}

// using the refresh token, update the access token using pkce
export async function refreshAccessTokenPKCE(clientId: string, refresh_token: string) {
    const verifier = localStorage.getItem("verifier");
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const body = new URLSearchParams({
        "client_id": clientId,
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "code_verifier": verifier!,
    });

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    });

    if (!response.ok) {
        console.log(`Failed to refresh access token: ${response.statusText}`);
        logout()
        window.location.href = "/spotify/login/";
        return;
        // throw new Error(`Failed to refresh access token: ${response.statusText}`);
    }

    const access_token = await response.json();
    storeAccessTokens(access_token);
    return access_token;
}

// store access tokens locally
export function storeAccessTokens(access_token: AccessToken): void {
    localStorage.setItem("token_access", access_token.access_token);
    access_token.expires_in = Date.now() + access_token.expires_in * 1000; // datenow in ms
    localStorage.setItem("token_expires_in", access_token.expires_in.toString());
    localStorage.setItem("token_refresh", access_token.refresh_token);
    localStorage.setItem("token_scope", access_token.scope);
    localStorage.setItem("token_type", access_token.token_type);
}

// store client credentials access tokens locally
export function storeCCAccessTokens(access_token: AccessToken): void {
    localStorage.setItem("cc_token_access", access_token.access_token);
    access_token.expires_in = Date.now() + access_token.expires_in * 1000; // datenow in ms
    localStorage.setItem("cc_token_expires_in", access_token.expires_in.toString());
    localStorage.setItem("cc_token_refresh", access_token.refresh_token);
    localStorage.setItem("cc_token_scope", access_token.scope);
    localStorage.setItem("cc_token_type", access_token.token_type);
}

// get access tokens from users locally
export function getStoredAccessTokens(): AccessToken {
    return {
        "access_token": localStorage.getItem('token_access')!,
        "expires_in": parseInt(localStorage.getItem('token_expires_in')!, 10)!,
        "refresh_token": localStorage.getItem('token_refresh')!,
        "scope": localStorage.getItem('token_scope')!,
        "token_type": localStorage.getItem('token_type')!
    };
}

// get client crendential access tokens from users locally
export function getCCStoredAccessTokens(): AccessToken {
    return {
        "access_token": localStorage.getItem('cc_token_access')!,
        "expires_in": parseInt(localStorage.getItem('cc_token_expires_in')!, 10)!,
        "refresh_token": localStorage.getItem('cc_token_refresh')!,
        "scope": localStorage.getItem('cc_token_scope')!,
        "token_type": localStorage.getItem('cc_token_type')!
    };
}

// check if an access token has expired (can handle client credential as well)
export async function checkExpiryPKCE(accessToken: AccessToken): Promise<AccessToken> {
    if (!(Date.now() < accessToken.expires_in!)) {
        console.log("Token out of date, refreshing now...")
        const clientId = localStorage.getItem("client_id");
        await refreshAccessTokenPKCE(clientId!, accessToken.refresh_token!);
        accessToken = getStoredAccessTokens();
    }
    return accessToken;
}

export async function logout() {
    storeAccessTokens({
        access_token: "",
        expires_in: NaN,
        refresh_token:  "",
        scope: "",
        token_type: "",
    })
}