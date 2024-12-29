import { refreshAccessTokenPKCE, getAccessTokenPKCE, 
    getStoredAccessTokens, redirectToAuthCodeFlowPKCE } from '../src/auth';
import { getAuthorisationCode, isAnyPropertyEmpty } from '../src/utils';

// client id from the spotify app develop page
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

localStorage.setItem("client_id", clientId);

// look at current url to see if there is a "code" query
const code = getAuthorisationCode();
var accessToken = getStoredAccessTokens();
var accessTokenIsEmpty = isAnyPropertyEmpty(getStoredAccessTokens());

// the main function is this below, which either send the user to spotify to get
// authorised, or gets the access token and profile to display on the screen
if (accessTokenIsEmpty) {
    // using the the auth code spotify returned us in the url, get access token 
    if (code) {
        accessToken = await getAccessTokenPKCE(clientId, redirectUri, code);
        // console.log("newaccestoken: ", accessToken)
    } else {
        // button to login if no token and no code
        redirectToAuthCodeFlowPKCE(clientId, redirectUri);
    }
}

// check if tokens need to be refreshed
accessTokenIsEmpty = isAnyPropertyEmpty(accessToken);
if (!accessTokenIsEmpty) {
    if (!(Date.now() < accessToken.expires_in!)) {
        console.log("Token out of date, refreshing now...")
        refreshAccessTokenPKCE(clientId, accessToken.refresh_token!);
    }
}

window.location.href = "/spotify/";
