import { r as registerInstance, c as createEvent, h, F as Fragment, H as Host } from './index-15add20a.js';
import { P as PropsService, T as TranslateService } from './translate.service-72bb6f5d.js';
import { R as ReportService, E as EsriJobStatusType } from './report.service-c3cee168.js';
import { r as request, c as cleanUrl, A as ArcGISRequestError, e as encodeQueryString, a as ArcGISAuthError, N as NODEJS_DEFAULT_REFERER_HEADER, U as UtilService } from './util.service-95ba91e5.js';
import { S as StateService } from './state.service-a118a4aa.js';

/* Copyright (c) 2022 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * There are 5 potential error codes that might be thrown by {@linkcode ArcGISTokenRequestError}. 2 of these codes are used by both
 * {@linkcode ArcGISIdentityManager} or {@linkcode ApplicationCredentialsManager}:
 *
 * * `TOKEN_REFRESH_FAILED` when a request for an new access token fails.
 * * `UNKNOWN_ERROR_CODE` the error is unknown. More information may be available in {@linkcode ArcGISTokenRequestError.response}
 *
 * The 3 remaining error codes will only be thrown when using {@linkcode ArcGISIdentityManager}:
 *
 * * `GENERATE_TOKEN_FOR_SERVER_FAILED` when a request for a token for a specific federated server fails.
 * * `REFRESH_TOKEN_EXCHANGE_FAILED` when a request for a new refresh token fails.
 * * `NOT_FEDERATED` when the requested server isn't federated with the portal specified in {@linkcode ArcGISIdentityManager.portal}.
 */
var ArcGISTokenRequestErrorCodes;
(function (ArcGISTokenRequestErrorCodes) {
    ArcGISTokenRequestErrorCodes["TOKEN_REFRESH_FAILED"] = "TOKEN_REFRESH_FAILED";
    ArcGISTokenRequestErrorCodes["GENERATE_TOKEN_FOR_SERVER_FAILED"] = "GENERATE_TOKEN_FOR_SERVER_FAILED";
    ArcGISTokenRequestErrorCodes["REFRESH_TOKEN_EXCHANGE_FAILED"] = "REFRESH_TOKEN_EXCHANGE_FAILED";
    ArcGISTokenRequestErrorCodes["NOT_FEDERATED"] = "NOT_FEDERATED";
    ArcGISTokenRequestErrorCodes["UNKNOWN_ERROR_CODE"] = "UNKNOWN_ERROR_CODE";
})(ArcGISTokenRequestErrorCodes || (ArcGISTokenRequestErrorCodes = {}));
/**
 * This error is thrown when {@linkcode ArcGISIdentityManager} or {@linkcode ApplicationCredentialsManager} fails to refresh a token or generate a new token
 * for a request. Generally in this scenario the credentials are invalid for the request and the you should recreate the {@linkcode ApplicationCredentialsManager}
 * or prompt the user to authenticate again with {@linkcode ArcGISIdentityManager}. See {@linkcode ArcGISTokenRequestErrorCodes} for a more detailed description of
 * the possible error codes.
 *
 * ```js
 * request(someUrl, {
 *   authentication: someAuthenticationManager
 * }).catch(e => {
 *   if(e.name === "ArcGISTokenRequestError") {
 *     // ArcGIS REST JS could not generate an appropriate token for this request
 *     // All credentials are likely invalid and the authentication process should be restarted
 *   }
 * })
 * ```
 */
class ArcGISTokenRequestError extends Error {
    /**
     * Create a new `ArcGISTokenRequestError`  object.
     *
     * @param message - The error message from the API
     * @param code - The error code from the API
     * @param response - The original response from the API that caused the error
     * @param url - The original url of the request
     * @param options - The original options and parameters of the request
     */
    constructor(message = "UNKNOWN_ERROR", code = ArcGISTokenRequestErrorCodes.UNKNOWN_ERROR_CODE, response, url, options) {
        // 'Error' breaks prototype chain here
        super(message);
        // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
        // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
        this.name = "ArcGISTokenRequestError";
        this.message = `${code}: ${message}`;
        this.originalMessage = message;
        this.code = code;
        this.response = response;
        this.url = url;
        this.options = options;
    }
}

/* Copyright (c) 2022 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * This error code will be thrown by the following methods when the user cancels or denies an authorization request on the OAuth 2.0
 * authorization screen.
 *
 * * {@linkcode ArcGISIdentityManager.beginOAuth2} when the `popup` option is `true`
 * * {@linkcode ArcGISIdentityManager.completeOAuth2}  when the `popup` option is `false`
 *
 * ```js
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * ArcGISIdentityManager.beginOAuth2({
 *   clientId: "***"
 *   redirectUri: "***",
 *   popup: true
 * }).then(authenticationManager => {
 *   console.log("OAuth 2.0 Successful");
 * }).catch(e => {
 *   if(e.name === "ArcGISAccessDeniedError") {
 *     console.log("The user did not authorize your app.")
 *   } else {
 *     console.log("Something else went wrong. Error:", e);
 *   }
 * })
 * ```
 */
class ArcGISAccessDeniedError extends Error {
    /**
     * Create a new `ArcGISAccessDeniedError`  object.
     */
    constructor() {
        const message = "The user has denied your authorization request.";
        super(message);
        // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
        // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
        this.name = "ArcGISAccessDeniedError";
    }
}

/* Copyright (c) 2017-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
function decodeParam(param) {
    const [key, value] = param.split("=");
    return { key: decodeURIComponent(key), value: decodeURIComponent(value) };
}
/**
 * Decodes the passed query string as an object.
 *
 * @param query A string to be decoded.
 * @returns A decoded query param object.
 */
function decodeQueryString(query) {
    if (!query || query.length <= 0) {
        return {};
    }
    return query
        .replace(/^#/, "")
        .replace(/^\?/, "")
        .split("&")
        .reduce((acc, entry) => {
        const { key, value } = decodeParam(entry);
        acc[key] = value;
        return acc;
    }, {});
}

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
const FIVE_MINUTES_IN_MILLISECONDS = 5 * 60 * 1000;
function fetchToken(url, requestOptions) {
    const options = requestOptions;
    // we generate a response, so we can't return the raw response
    options.rawResponse = false;
    return request(url, options).then((response) => {
        // Typescript uses the "in" keyword to determine we have a generateToken response or an oauth token response
        if ("token" in response && "expires" in response) {
            return {
                token: response.token,
                username: requestOptions.params.username,
                expires: new Date(response.expires)
            };
        }
        const portalTokenResponse = {
            token: response.access_token,
            username: response.username,
            expires: new Date(
            // convert seconds in response to milliseconds and add the value to the current time to calculate a static expiration timestamp
            // we subtract 5 minutes here to make sure that we refresh the token early if the user makes requests
            Date.now() + response.expires_in * 1000 - FIVE_MINUTES_IN_MILLISECONDS),
            ssl: response.ssl === true
        };
        if (response.refresh_token) {
            portalTokenResponse.refreshToken = response.refresh_token;
        }
        if (response.refresh_token_expires_in) {
            portalTokenResponse.refreshTokenExpires = new Date(
            // convert seconds in response to milliseconds and add the value to the current time to calculate a static expiration timestamp
            // we subtract 5 minutes here to make sure that we refresh the token early if the user makes requests
            Date.now() +
                response.refresh_token_expires_in * 1000 -
                FIVE_MINUTES_IN_MILLISECONDS);
        }
        return portalTokenResponse;
    });
}

/**
 * Used to test if a URL is an ArcGIS Online URL
 */
const arcgisOnlineUrlRegex = /^https?:\/\/(\S+)\.arcgis\.com.+/;
function isOnline(url) {
    return arcgisOnlineUrlRegex.test(url);
}
function normalizeOnlinePortalUrl(portalUrl) {
    if (!arcgisOnlineUrlRegex.test(portalUrl)) {
        return portalUrl;
    }
    switch (getOnlineEnvironment(portalUrl)) {
        case "dev":
            return "https://devext.arcgis.com/sharing/rest";
        case "qa":
            return "https://qaext.arcgis.com/sharing/rest";
        default:
            return "https://www.arcgis.com/sharing/rest";
    }
}
function getOnlineEnvironment(url) {
    if (!arcgisOnlineUrlRegex.test(url)) {
        return null;
    }
    const match = url.match(arcgisOnlineUrlRegex);
    const subdomain = match[1].split(".").pop();
    if (subdomain.includes("dev")) {
        return "dev";
    }
    if (subdomain.includes("qa")) {
        return "qa";
    }
    return "production";
}
function isFederated(owningSystemUrl, portalUrl) {
    const normalizedPortalUrl = cleanUrl(normalizeOnlinePortalUrl(portalUrl)).replace(/https?:\/\//, "");
    const normalizedOwningSystemUrl = cleanUrl(owningSystemUrl).replace(/https?:\/\//, "");
    return new RegExp(normalizedOwningSystemUrl, "i").test(normalizedPortalUrl);
}
function canUseOnlineToken(portalUrl, requestUrl) {
    const portalIsOnline = isOnline(portalUrl);
    const requestIsOnline = isOnline(requestUrl);
    const portalEnv = getOnlineEnvironment(portalUrl);
    const requestEnv = getOnlineEnvironment(requestUrl);
    if (portalIsOnline && requestIsOnline && portalEnv === requestEnv) {
        return true;
    }
    return false;
}

/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Validates that the user has access to the application
 * and if they user should be presented a "View Only" mode
 *
 * This is only needed/valid for Esri applications that are "licensed"
 * and shipped in ArcGIS Online or ArcGIS Enterprise. Most custom applications
 * should not need or use this.
 *
 * ```js
 * import { validateAppAccess } from '@esri/arcgis-rest-request';
 *
 * return validateAppAccess('your-token', 'theClientId')
 * .then((result) => {
 *    if (!result.value) {
 *      // redirect or show some other ui
 *    } else {
 *      if (result.viewOnlyUserTypeApp) {
 *        // use this to inform your app to show a "View Only" mode
 *      }
 *    }
 * })
 * .catch((err) => {
 *  // two possible errors
 *  // invalid clientId: {"error":{"code":400,"messageCode":"GWM_0007","message":"Invalid request","details":[]}}
 *  // invalid token: {"error":{"code":498,"message":"Invalid token.","details":[]}}
 * })
 * ```
 *
 * Note: This is only usable by Esri applications hosted on *arcgis.com, *esri.com or within
 * an ArcGIS Enterprise installation. Custom applications can not use this.
 *
 * @param token platform token
 * @param clientId application client id
 * @param portal Optional
 */
function validateAppAccess(token, clientId, portal = "https://www.arcgis.com/sharing/rest") {
    const url = `${portal}/oauth2/validateAppAccess`;
    const ro = {
        method: "POST",
        params: {
            f: "json",
            client_id: clientId,
            token
        }
    };
    return request(url, ro);
}

/**
 * Revokes a token generated via any oAuth 2.0 method. `token` can be either a refresh token OR an access token. If you are using  {@linkcode ArcGISIdentityManager} you should use  {@linkcode ArcGISIdentityManager.destroy} instead. Cannot revoke API keys or tokens generated by {@linkcode ApplicationCredentialsManager}.
 *
 * See [`revokeToken`](https://developers.arcgis.com/rest/users-groups-and-items/revoke-token.htm) on the ArcGIS REST API for more details.
 */
function revokeToken(requestOptions) {
    const url = `${cleanUrl(requestOptions.portal || "https://www.arcgis.com/sharing/rest")}/oauth2/revokeToken/`;
    const token = requestOptions.token;
    const clientId = requestOptions.clientId;
    delete requestOptions.portal;
    delete requestOptions.clientId;
    delete requestOptions.token;
    const options = Object.assign(Object.assign({}, requestOptions), { httpMethod: "POST", params: {
            client_id: clientId,
            auth_token: token
        } });
    return request(url, options).then((response) => {
        if (!response.success) {
            throw new ArcGISRequestError("Unable to revoke token", 500, response, url, options);
        }
        return response;
    });
}

/**
 * Encodes a `Uint8Array` to base 64. Used internally for hashing the `code_verifier` and `code_challenge` for PKCE.
 */
function base64UrlEncode(value, win = window) {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
        win = window;
    }
    return win
        .btoa(String.fromCharCode.apply(null, value))
        .replace(/\+/g, "-") // replace + with -
        .replace(/\//g, "_") // replace / with _
        .replace(/=+$/, ""); // trim trailing =
}

/**
 * Utility to hash the codeVerifier using sha256
 */
function generateCodeChallenge(codeVerifier, win = window) {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
        win = window;
    }
    if (codeVerifier && win.isSecureContext && win.crypto && win.crypto.subtle) {
        const encoder = new win.TextEncoder();
        const bytes = encoder.encode(codeVerifier);
        return win.crypto.subtle
            .digest("SHA-256", bytes)
            .then((buffer) => base64UrlEncode(new Uint8Array(buffer), win));
    }
    return Promise.resolve(null);
}

/**
 * Utility to generate a random string to use as our `code_verifier`
 *
 * @param win the global `window` object for accepting a mock while testing.
 */
function generateRandomString(win) {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
        win = window;
    }
    const randomBytes = win.crypto.getRandomValues(new Uint8Array(32));
    return base64UrlEncode(randomBytes);
}

/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Used to authenticate both ArcGIS Online and ArcGIS Enterprise users. `ArcGISIdentityManager` includes helper methods for [OAuth 2.0](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/oauth-2.0/) in both browser and server applications.
 *
 * **It is not recommended to construct `ArcGISIdentityManager` directly**. Instead there are several static methods used for specific workflows. The 2 primary workflows relate to oAuth 2.0:
 *
 * * {@linkcode ArcGISIdentityManager.beginOAuth2} and {@linkcode ArcGISIdentityManager.completeOAuth2()} for oAuth 2.0 in browser-only environment.
 * * {@linkcode ArcGISIdentityManager.authorize} and {@linkcode ArcGISIdentityManager.exchangeAuthorizationCode} for oAuth 2.0 for server-enabled application.
 *
 * Other more specialized helpers for less common workflows also exist:
 *
 * * {@linkcode ArcGISIdentityManager.fromToken} for when you have an existing token from another source and would like create an `ArcGISIdentityManager` instance.
 * * {@linkcode ArcGISIdentityManager.fromCredential} for creating  an `ArcGISIdentityManager` instance from a `Credentials` object in the ArcGIS JS API `IdentityManager`
 * * {@linkcode ArcGISIdentityManager.signIn} for authenticating directly with a user's username and password for environments with a user interface for oAuth 2.0.
 *
 * Once a manager is created there are additional utilities:
 *
 * * {@linkcode ArcGISIdentityManager.serialize} can be used to create a JSON object representing an instance of `ArcGISIdentityManager`
 * * {@linkcode ArcGISIdentityManager.deserialize} will create a new `ArcGISIdentityManager` from a JSON object created with {@linkcode ArcGISIdentityManager.serialize}
 * * {@linkcode ArcGISIdentityManager.destroy} or {@linkcode ArcGISIdentityManager.signOut} will invalidate any tokens in use by the  `ArcGISIdentityManager`.
 */
class ArcGISIdentityManager {
    constructor(options) {
        this.clientId = options.clientId;
        this._refreshToken = options.refreshToken;
        this._refreshTokenExpires = options.refreshTokenExpires;
        this._username = options.username;
        this.password = options.password;
        this._token = options.token;
        this._tokenExpires = options.tokenExpires;
        this.portal = options.portal
            ? cleanUrl(options.portal)
            : "https://www.arcgis.com/sharing/rest";
        this.ssl = options.ssl;
        this.provider = options.provider || "arcgis";
        this.tokenDuration = options.tokenDuration || 20160;
        this.redirectUri = options.redirectUri;
        this.server = options.server;
        this.referer = options.referer;
        this.federatedServers = {};
        this.trustedDomains = [];
        // if a non-federated server was passed explicitly, it should be trusted.
        if (options.server) {
            // if the url includes more than '/arcgis/', trim the rest
            const root = this.getServerRootUrl(options.server);
            this.federatedServers[root] = {
                token: options.token,
                expires: options.tokenExpires
            };
        }
        this._pendingTokenRequests = {};
    }
    /**
     * The current ArcGIS Online or ArcGIS Enterprise `token`.
     */
    get token() {
        return this._token;
    }
    /**
     * The expiration time of the current `token`.
     */
    get tokenExpires() {
        return this._tokenExpires;
    }
    /**
     * The current token to ArcGIS Online or ArcGIS Enterprise.
     */
    get refreshToken() {
        return this._refreshToken;
    }
    /**
     * The expiration time of the current `refreshToken`.
     */
    get refreshTokenExpires() {
        return this._refreshTokenExpires;
    }
    /**
     * The currently authenticated user.
     */
    get username() {
        if (this._username) {
            return this._username;
        }
        if (this._user && this._user.username) {
            return this._user.username;
        }
    }
    /**
     * Returns `true` if these credentials can be refreshed and `false` if it cannot.
     */
    get canRefresh() {
        if (this.username && this.password) {
            return true;
        }
        if (this.clientId && this.refreshToken && this.redirectUri) {
            return true;
        }
        return false;
    }
    /**
     * Begins a new browser-based OAuth 2.0 sign in. If `options.popup` is `true` the authentication window will open in a new tab/window. Otherwise, the user will be redirected to the authorization page in their current tab/window and the function will return `undefined`.
     *
     * If `popup` is `true` (the default) this method will return a `Promise` that resolves to an `ArcGISIdentityManager` instance and you must call {@linkcode ArcGISIdentityManager.completeOAuth2()} on the page defined in the `redirectUri`. Otherwise it will return undefined and the {@linkcode ArcGISIdentityManager.completeOAuth2()} method will return a `Promise` that resolves to an `ArcGISIdentityManager` instance.
     *
     * A {@linkcode ArcGISAccessDeniedError} error will be thrown if the user denies the request on the authorization screen.
     *
     * @browserOnly
     */
    static beginOAuth2(options, win) {
        /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
        if (!win && window) {
            win = window;
        }
        const { portal, provider, clientId, expiration, redirectUri, popup, popupWindowFeatures, locale, params, style, pkce, state } = Object.assign({
            portal: "https://www.arcgis.com/sharing/rest",
            provider: "arcgis",
            expiration: 20160,
            popup: true,
            popupWindowFeatures: "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes",
            locale: "",
            style: "",
            pkce: true
        }, options);
        /**
         * Generate a  random string for the `state` param and store it in local storage. This is used
         * to validate that all parts of the oAuth process were performed on the same client.
         */
        const stateId = state || generateRandomString(win);
        const stateStorageKey = `ARCGIS_REST_JS_AUTH_STATE_${clientId}`;
        win.localStorage.setItem(stateStorageKey, stateId);
        // Start setting up the URL to the authorization screen.
        let authorizeUrl = `${cleanUrl(portal)}/oauth2/authorize`;
        const authorizeUrlParams = {
            client_id: clientId,
            response_type: pkce ? "code" : "token",
            expiration: expiration,
            redirect_uri: redirectUri,
            state: JSON.stringify({
                id: stateId,
                originalUrl: win.location.href // this is used to reset the URL back the original URL upon return
            }),
            locale: locale,
            style: style
        };
        // If we are authorizing through a specific social provider update the params and base URL.
        if (provider !== "arcgis") {
            authorizeUrl = `${cleanUrl(portal)}/oauth2/social/authorize`;
            authorizeUrlParams.socialLoginProviderName = provider;
            authorizeUrlParams.autoAccountCreateForSocial = true;
        }
        /**
         * set a value that will be set to a promise which will later resolve when we are ready
         * to send users to the authorization page.
         */
        let setupAuth;
        if (pkce) {
            /**
             * If we are authenticating with PKCE we need to generate the code challenge which is
             * async so we generate the code challenge and assign the resulting Promise to `setupAuth`
             */
            const codeVerifier = generateRandomString(win);
            const codeVerifierStorageKey = `ARCGIS_REST_JS_CODE_VERIFIER_${clientId}`;
            win.localStorage.setItem(codeVerifierStorageKey, codeVerifier);
            setupAuth = generateCodeChallenge(codeVerifier, win).then(function (codeChallenge) {
                authorizeUrlParams.code_challenge_method = codeChallenge
                    ? "S256"
                    : "plain";
                authorizeUrlParams.code_challenge = codeChallenge
                    ? codeChallenge
                    : codeVerifier;
            });
        }
        else {
            /**
             * If we aren't authenticating with PKCE we can just assign a resolved promise to `setupAuth`
             */
            setupAuth = Promise.resolve();
        }
        /**
         * Once we are done setting up with (for PKCE) we can start the auth process.
         */
        return setupAuth.then(() => {
            // combine the authorize URL and params
            authorizeUrl = `${authorizeUrl}?${encodeQueryString(authorizeUrlParams)}`;
            // append additional params passed by the user
            if (params) {
                authorizeUrl = `${authorizeUrl}&${encodeQueryString(params)}`;
            }
            if (popup) {
                // If we are authenticating a popup we need to return a Promise that will resolve to an ArcGISIdentityManager later.
                return new Promise((resolve, reject) => {
                    // Add an event listener to listen for when a user calls `ArcGISIdentityManager.completeOAuth2()` in the popup.
                    win.addEventListener(`arcgis-rest-js-popup-auth-${clientId}`, (e) => {
                        if (e.detail.error === "access_denied") {
                            const error = new ArcGISAccessDeniedError();
                            reject(error);
                            return error;
                        }
                        if (e.detail.errorMessage) {
                            const error = new ArcGISAuthError(e.detail.errorMessage, e.detail.error);
                            reject(error);
                            return error;
                        }
                        resolve(new ArcGISIdentityManager({
                            clientId,
                            portal,
                            ssl: e.detail.ssl,
                            token: e.detail.token,
                            tokenExpires: e.detail.expires,
                            username: e.detail.username,
                            refreshToken: e.detail.refreshToken,
                            refreshTokenExpires: e.detail.refreshTokenExpires,
                            redirectUri
                        }));
                    }, {
                        once: true
                    });
                    // open the popup
                    win.open(authorizeUrl, "oauth-window", popupWindowFeatures);
                    win.dispatchEvent(new CustomEvent("arcgis-rest-js-popup-auth-start"));
                });
            }
            else {
                // If we aren't authenticating with a popup just send the user to the authorization page.
                win.location.href = authorizeUrl;
                return undefined;
            }
        });
    }
    /**
     * Completes a browser-based OAuth 2.0 sign in. If `options.popup` is `true` the user
     * will be returned to the previous window and the popup will close. Otherwise a new `ArcGISIdentityManager` will be returned. You must pass the same values for `clientId`, `popup`, `portal`, and `pkce` as you used in `beginOAuth2()`.
     *
     * A {@linkcode ArcGISAccessDeniedError} error will be thrown if the user denies the request on the authorization screen.
     * @browserOnly
     */
    static completeOAuth2(options, win) {
        /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
        if (!win && window) {
            win = window;
        }
        // pull out necessary options
        const { portal, clientId, popup, pkce, redirectUri } = Object.assign({
            portal: "https://www.arcgis.com/sharing/rest",
            popup: true,
            pkce: true
        }, options);
        // pull the saved state id out of local storage
        const stateStorageKey = `ARCGIS_REST_JS_AUTH_STATE_${clientId}`;
        const stateId = win.localStorage.getItem(stateStorageKey);
        // get the params provided by the server and compare the server state with the client saved state
        const params = decodeQueryString(pkce
            ? win.location.search.replace(/^\?/, "")
            : win.location.hash.replace(/^#/, ""));
        const state = params && params.state ? JSON.parse(params.state) : undefined;
        function reportError(errorMessage, error, originalUrl) {
            win.localStorage.removeItem(stateStorageKey);
            if (popup && win.opener) {
                win.opener.dispatchEvent(new CustomEvent(`arcgis-rest-js-popup-auth-${clientId}`, {
                    detail: {
                        error,
                        errorMessage
                    }
                }));
                win.close();
                return;
            }
            if (originalUrl) {
                win.history.replaceState(win.history.state, "", originalUrl);
            }
            if (error === "access_denied") {
                return Promise.reject(new ArcGISAccessDeniedError());
            }
            return Promise.reject(new ArcGISAuthError(errorMessage, error));
        }
        // create a function to create the final ArcGISIdentityManager from the token info.
        function createManager(oauthInfo, originalUrl) {
            win.localStorage.removeItem(stateStorageKey);
            if (popup && win.opener) {
                win.opener.dispatchEvent(new CustomEvent(`arcgis-rest-js-popup-auth-${clientId}`, {
                    detail: Object.assign({}, oauthInfo)
                }));
                win.close();
                return;
            }
            win.history.replaceState(win.history.state, "", originalUrl);
            return new ArcGISIdentityManager({
                clientId,
                portal,
                ssl: oauthInfo.ssl,
                token: oauthInfo.token,
                tokenExpires: oauthInfo.expires,
                username: oauthInfo.username,
                refreshToken: oauthInfo.refreshToken,
                refreshTokenExpires: oauthInfo.refreshTokenExpires,
                // At 4.0.0 it was possible (in JS code) to not pass redirectUri and fallback to win.location.href, however this broke support for redirect URIs with query params.
                // Now similar to 3.x.x you must pass the redirectUri parameter explicitly. See https://github.com/Esri/arcgis-rest-js/issues/995
                redirectUri: redirectUri ||
                    /* istanbul ignore next: TypeScript wont compile if we omit redirectUri */ location.href.replace(location.search, "")
            });
        }
        if (!stateId || !state) {
            return reportError("No authentication state was found, call `ArcGISIdentityManager.beginOAuth2(...)` to start the authentication process.", "no-auth-state");
        }
        if (state.id !== stateId) {
            return reportError("Saved client state did not match server sent state.", "mismatched-auth-state");
        }
        if (params.error) {
            const error = params.error;
            const errorMessage = params.error_description || "Unknown error";
            return reportError(errorMessage, error, state.originalUrl);
        }
        /**
         * If we are using PKCE the authorization code will be in the query params.
         * For implicit grants the token will be in the hash.
         */
        if (pkce && params.code) {
            const tokenEndpoint = cleanUrl(`${portal}/oauth2/token/`);
            const codeVerifierStorageKey = `ARCGIS_REST_JS_CODE_VERIFIER_${clientId}`;
            const codeVerifier = win.localStorage.getItem(codeVerifierStorageKey);
            win.localStorage.removeItem(codeVerifierStorageKey);
            // exchange our auth code for a token + refresh token
            return fetchToken(tokenEndpoint, {
                httpMethod: "POST",
                params: {
                    client_id: clientId,
                    code_verifier: codeVerifier,
                    grant_type: "authorization_code",
                    // using location.href here does not support query params but shipped with 4.0.0. See https://github.com/Esri/arcgis-rest-js/issues/995
                    redirect_uri: redirectUri || location.href.replace(location.search, ""),
                    code: params.code
                }
            })
                .then((tokenResponse) => {
                return createManager(Object.assign(Object.assign({}, tokenResponse), state), state.originalUrl);
            })
                .catch((e) => {
                return reportError(e.originalMessage, e.code, state.originalUrl);
            });
        }
        if (!pkce && params.access_token) {
            return Promise.resolve(createManager(Object.assign({ token: params.access_token, expires: new Date(Date.now() + parseInt(params.expires_in, 10) * 1000), ssl: params.ssl === "true", username: params.username }, state), state.originalUrl));
        }
        return reportError("Unknown error", "oauth-error", state.originalUrl);
    }
    /**
     * Request credentials information from the parent application
     *
     * When an application is embedded into another application via an IFrame, the embedded app can
     * use `window.postMessage` to request credentials from the host application. This function wraps
     * that behavior.
     *
     * The ArcGIS API for Javascript has this built into the Identity Manager as of the 4.19 release.
     *
     * Note: The parent application will not respond if the embedded app's origin is not:
     * - the same origin as the parent or *.arcgis.com (JSAPI)
     * - in the list of valid child origins (REST-JS)
     *
     *
     * @param parentOrigin origin of the parent frame. Passed into the embedded application as `parentOrigin` query param
     * @browserOnly
     */
    static fromParent(parentOrigin, win) {
        /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
        if (!win && window) {
            win = window;
        }
        // Declare handler outside of promise scope so we can detach it
        let handler;
        // return a promise that will resolve when the handler receives
        // session information from the correct origin
        return new Promise((resolve, reject) => {
            // create an event handler that just wraps the parentMessageHandler
            handler = (event) => {
                // ensure we only listen to events from the parent
                if (event.source === win.parent && event.data) {
                    try {
                        return resolve(ArcGISIdentityManager.parentMessageHandler(event));
                    }
                    catch (err) {
                        return reject(err);
                    }
                }
            };
            // add listener
            win.addEventListener("message", handler, false);
            win.parent.postMessage({ type: "arcgis:auth:requestCredential" }, parentOrigin);
        }).then((manager) => {
            win.removeEventListener("message", handler, false);
            return manager;
        });
    }
    /**
     * Begins a new server-based OAuth 2.0 sign in. This will redirect the user to
     * the ArcGIS Online or ArcGIS Enterprise authorization page.
     *
     * @nodeOnly
     */
    static authorize(options, response) {
        const { portal, clientId, expiration, redirectUri, state } = Object.assign({ portal: "https://arcgis.com/sharing/rest", expiration: 20160 }, options);
        const queryParams = {
            client_id: clientId,
            expiration,
            response_type: "code",
            redirect_uri: redirectUri
        };
        if (state) {
            queryParams.state = state;
        }
        const url = `${portal}/oauth2/authorize?${encodeQueryString(queryParams)}`;
        response.writeHead(301, {
            Location: url
        });
        response.end();
    }
    /**
     * Completes the server-based OAuth 2.0 sign in process by exchanging the `authorizationCode`
     * for a `access_token`.
     *
     * @nodeOnly
     */
    static exchangeAuthorizationCode(options, authorizationCode) {
        const { portal, clientId, redirectUri } = Object.assign({
            portal: "https://www.arcgis.com/sharing/rest"
        }, options);
        return fetchToken(`${portal}/oauth2/token`, {
            params: {
                grant_type: "authorization_code",
                client_id: clientId,
                redirect_uri: redirectUri,
                code: authorizationCode
            }
        })
            .then((response) => {
            return new ArcGISIdentityManager({
                clientId,
                portal,
                ssl: response.ssl,
                redirectUri,
                refreshToken: response.refreshToken,
                refreshTokenExpires: response.refreshTokenExpires,
                token: response.token,
                tokenExpires: response.expires,
                username: response.username
            });
        })
            .catch((e) => {
            throw new ArcGISTokenRequestError(e.message, ArcGISTokenRequestErrorCodes.REFRESH_TOKEN_EXCHANGE_FAILED, e.response, e.url, e.options);
        });
    }
    static deserialize(str) {
        const options = JSON.parse(str);
        return new ArcGISIdentityManager({
            clientId: options.clientId,
            refreshToken: options.refreshToken,
            refreshTokenExpires: options.refreshTokenExpires
                ? new Date(options.refreshTokenExpires)
                : undefined,
            username: options.username,
            password: options.password,
            token: options.token,
            tokenExpires: options.tokenExpires
                ? new Date(options.tokenExpires)
                : undefined,
            portal: options.portal,
            ssl: options.ssl,
            tokenDuration: options.tokenDuration,
            redirectUri: options.redirectUri,
            server: options.server
        });
    }
    /**
     * Translates authentication from the format used in the [`IdentityManager` class in the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-Credential.html).
     *
     * You will need to call both [`IdentityManger.findCredential`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#findCredential) and [`IdentityManger.findServerInfo`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#findServerInfo) to obtain both parameters for this method.
     *
     * This method can be used with {@linkcode ArcGISIdentityManager.toCredential} to interop with the ArcGIS API for JavaScript.
     *
     * ```js
     * require(["esri/id"], (esriId) => {
     *   const credential = esriId.findCredential("https://www.arcgis.com/sharing/rest");
     *   const serverInfo = esriId.findServerInfo("https://www.arcgis.com/sharing/rest");
     *
     *   const manager = ArcGISIdentityManager.fromCredential(credential, serverInfo);
     * });
     * ```
     *
     * @returns ArcGISIdentityManager
     */
    static fromCredential(credential, serverInfo) {
        // At ArcGIS Online 9.1, credentials no longer include the ssl and expires properties
        // Here, we provide default values for them to cover this condition
        const ssl = typeof credential.ssl !== "undefined" ? credential.ssl : true;
        const expires = credential.expires || Date.now() + 7200000; /* 2 hours */
        if (serverInfo.hasServer) {
            return new ArcGISIdentityManager({
                server: credential.server,
                ssl,
                token: credential.token,
                username: credential.userId,
                tokenExpires: new Date(expires)
            });
        }
        return new ArcGISIdentityManager({
            portal: cleanUrl(credential.server.includes("sharing/rest")
                ? credential.server
                : credential.server + `/sharing/rest`),
            ssl,
            token: credential.token,
            username: credential.userId,
            tokenExpires: new Date(expires)
        });
    }
    /**
     * Handle the response from the parent
     * @param event DOM Event
     */
    static parentMessageHandler(event) {
        if (event.data.type === "arcgis:auth:credential") {
            return new ArcGISIdentityManager(event.data.credential);
        }
        if (event.data.type === "arcgis:auth:error") {
            const err = new Error(event.data.error.message);
            err.name = event.data.error.name;
            throw err;
        }
        else {
            throw new Error("Unknown message type.");
        }
    }
    /**
     * Revokes all active tokens for a provided {@linkcode ArcGISIdentityManager}. The can be considered the equivalent to signing the user out of your application.
     */
    static destroy(manager) {
        return revokeToken({
            clientId: manager.clientId,
            portal: manager.portal,
            token: manager.refreshToken || manager.token
        });
    }
    /**
     * Create a  {@linkcode ArcGISIdentityManager} from an existing token. Useful for when you have a users token from a different authentication system and want to get a  {@linkcode ArcGISIdentityManager}.
     */
    static fromToken(options) {
        const manager = new ArcGISIdentityManager(options);
        return manager.getUser().then(() => {
            return manager;
        });
    }
    /**
     * Initialize a {@linkcode ArcGISIdentityManager} with a user's `username` and `password`. **This method is intended ONLY for applications without a user interface such as CLI tools.**.
     *
     * If possible you should use {@linkcode ArcGISIdentityManager.beginOAuth2} to authenticate users in a browser or {@linkcode ArcGISIdentityManager.authorize} for authenticating users with a web server.
     */
    static signIn(options) {
        const manager = new ArcGISIdentityManager(options);
        return manager.getUser().then(() => {
            return manager;
        });
    }
    /**
     * Returns authentication in a format useable in the [`IdentityManager.registerToken()` method in the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#registerToken).
     *
     * This method can be used with {@linkcode ArcGISIdentityManager.fromCredential} to interop with the ArcGIS API for JavaScript.
     *
     * ```js
     * require(["esri/id"], (esriId) => {
     *   esriId.registerToken(manager.toCredential());
     * })
     
     * ```
     *
     * @returns ICredential
     */
    toCredential() {
        return {
            expires: this.tokenExpires.getTime(),
            server: this.server || this.portal,
            ssl: this.ssl,
            token: this.token,
            userId: this.username
        };
    }
    /**
     * Returns information about the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic.
     *
     * ```js
     * manager.getUser()
     *   .then(response => {
     *     console.log(response.role); // "org_admin"
     *   })
     * ```
     *
     * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
     * @returns A Promise that will resolve with the data from the response.
     */
    getUser(requestOptions) {
        if (this._pendingUserRequest) {
            return this._pendingUserRequest;
        }
        else if (this._user) {
            return Promise.resolve(this._user);
        }
        else {
            const url = `${this.portal}/community/self`;
            const options = Object.assign(Object.assign({ httpMethod: "GET", authentication: this }, requestOptions), { rawResponse: false });
            this._pendingUserRequest = request(url, options).then((response) => {
                this._user = response;
                this._pendingUserRequest = null;
                return response;
            });
            return this._pendingUserRequest;
        }
    }
    /**
     * Returns information about the currently logged in user's [portal](https://developers.arcgis.com/rest/users-groups-and-items/portal-self.htm). Subsequent calls will *not* result in additional web traffic.
     *
     * ```js
     * manager.getPortal()
     *   .then(response => {
     *     console.log(portal.name); // "City of ..."
     *   })
     * ```
     *
     * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
     * @returns A Promise that will resolve with the data from the response.
     */
    getPortal(requestOptions) {
        if (this._pendingPortalRequest) {
            return this._pendingPortalRequest;
        }
        else if (this._portalInfo) {
            return Promise.resolve(this._portalInfo);
        }
        else {
            const url = `${this.portal}/portals/self`;
            const options = Object.assign(Object.assign({ httpMethod: "GET", authentication: this }, requestOptions), { rawResponse: false });
            this._pendingPortalRequest = request(url, options).then((response) => {
                this._portalInfo = response;
                this._pendingPortalRequest = null;
                return response;
            });
            return this._pendingPortalRequest;
        }
    }
    /**
     * Returns the username for the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic. This is also used internally when a username is required for some requests but is not present in the options.
     *
     * ```js
     * manager.getUsername()
     *   .then(response => {
     *     console.log(response); // "casey_jones"
     *   })
     * ```
     */
    getUsername() {
        if (this.username) {
            return Promise.resolve(this.username);
        }
        else {
            return this.getUser().then((user) => {
                return user.username;
            });
        }
    }
    /**
     * Gets an appropriate token for the given URL. If `portal` is ArcGIS Online and
     * the request is to an ArcGIS Online domain `token` will be used. If the request
     * is to the current `portal` the current `token` will also be used. However if
     * the request is to an unknown server we will validate the server with a request
     * to our current `portal`.
     */
    getToken(url, requestOptions) {
        if (canUseOnlineToken(this.portal, url)) {
            return this.getFreshToken(requestOptions);
        }
        else if (new RegExp(this.portal, "i").test(url)) {
            return this.getFreshToken(requestOptions);
        }
        else {
            return this.getTokenForServer(url, requestOptions);
        }
    }
    /**
     * Get application access information for the current user
     * see `validateAppAccess` function for details
     *
     * @param clientId application client id
     */
    validateAppAccess(clientId) {
        return this.getToken(this.portal).then((token) => {
            return validateAppAccess(token, clientId);
        });
    }
    toJSON() {
        return {
            clientId: this.clientId,
            refreshToken: this.refreshToken,
            refreshTokenExpires: this.refreshTokenExpires || undefined,
            username: this.username,
            password: this.password,
            token: this.token,
            tokenExpires: this.tokenExpires || undefined,
            portal: this.portal,
            ssl: this.ssl,
            tokenDuration: this.tokenDuration,
            redirectUri: this.redirectUri,
            server: this.server
        };
    }
    serialize() {
        return JSON.stringify(this);
    }
    /**
     * For a "Host" app that embeds other platform apps via iframes, after authenticating the user
     * and creating a ArcGISIdentityManager, the app can then enable "post message" style authentication by calling
     * this method.
     *
     * Internally this adds an event listener on window for the `message` event
     *
     * @param validChildOrigins Array of origins that are allowed to request authentication from the host app
     */
    enablePostMessageAuth(validChildOrigins, win) {
        /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
        if (!win && window) {
            win = window;
        }
        this._hostHandler = this.createPostMessageHandler(validChildOrigins);
        win.addEventListener("message", this._hostHandler, false);
    }
    /**
     * For a "Host" app that has embedded other platform apps via iframes, when the host needs
     * to transition routes, it should call `ArcGISIdentityManager.disablePostMessageAuth()` to remove
     * the event listener and prevent memory leaks
     */
    disablePostMessageAuth(win) {
        /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
        if (!win && window) {
            win = window;
        }
        win.removeEventListener("message", this._hostHandler, false);
    }
    /**
     * Manually refreshes the current `token` and `tokenExpires`.
     */
    refreshCredentials(requestOptions) {
        // make sure subsequent calls to getUser() don't returned cached metadata
        this._user = null;
        if (this.username && this.password) {
            return this.refreshWithUsernameAndPassword(requestOptions);
        }
        if (this.clientId && this.refreshToken) {
            return this.refreshWithRefreshToken();
        }
        return Promise.reject(new ArcGISTokenRequestError("Unable to refresh token. No refresh token or password present.", ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED));
    }
    /**
     * Determines the root of the ArcGIS Server or Portal for a given URL.
     *
     * @param url the URl to determine the root url for.
     */
    getServerRootUrl(url) {
        const [root] = cleanUrl(url).split(/\/rest(\/admin)?\/services(?:\/|#|\?|$)/);
        const [match, protocol, domainAndPath] = root.match(/(https?:\/\/)(.+)/);
        const [domain, ...path] = domainAndPath.split("/");
        // only the domain is lowercased because in some cases an org id might be
        // in the path which cannot be lowercased.
        return `${protocol}${domain.toLowerCase()}/${path.join("/")}`;
    }
    /**
     * Returns the proper [`credentials`] option for `fetch` for a given domain.
     * See [trusted server](https://enterprise.arcgis.com/en/portal/latest/administer/windows/configure-security.htm#ESRI_SECTION1_70CC159B3540440AB325BE5D89DBE94A).
     * Used internally by underlying request methods to add support for specific security considerations.
     *
     * @param url The url of the request
     * @returns "include" or "same-origin"
     */
    getDomainCredentials(url) {
        if (!this.trustedDomains || !this.trustedDomains.length) {
            return "same-origin";
        }
        return this.trustedDomains.some((domainWithProtocol) => {
            return url.startsWith(domainWithProtocol);
        })
            ? "include"
            : "same-origin";
    }
    /**
     * Convenience method for {@linkcode ArcGISIdentityManager.destroy} for this instance of `ArcGISIdentityManager`
     */
    signOut() {
        return ArcGISIdentityManager.destroy(this);
    }
    /**
     * Return a function that closes over the validOrigins array and
     * can be used as an event handler for the `message` event
     *
     * @param validOrigins Array of valid origins
     */
    createPostMessageHandler(validOrigins) {
        // return a function that closes over the validOrigins and
        // has access to the credential
        return (event) => {
            // Verify that the origin is valid
            // Note: do not use regex's here. validOrigins is an array so we're checking that the event's origin
            // is in the array via exact match. More info about avoiding postMessage xss issues here
            // https://jlajara.gitlab.io/web/2020/07/17/Dom_XSS_PostMessage_2.html#tipsbypasses-in-postmessage-vulnerabilities
            const isValidOrigin = validOrigins.indexOf(event.origin) > -1;
            // JSAPI handles this slightly differently - instead of checking a list, it will respond if
            // event.origin === window.location.origin || event.origin.endsWith('.arcgis.com')
            // For Hub, and to enable cross domain debugging with port's in urls, we are opting to
            // use a list of valid origins
            // Ensure the message type is something we want to handle
            const isValidType = event.data.type === "arcgis:auth:requestCredential";
            // Ensure we don't pass an expired session forward
            const isTokenValid = this.tokenExpires.getTime() > Date.now();
            if (isValidOrigin && isValidType) {
                let msg = {};
                if (isTokenValid) {
                    const credential = this.toJSON();
                    msg = {
                        type: "arcgis:auth:credential",
                        credential
                    };
                }
                else {
                    msg = {
                        type: "arcgis:auth:error",
                        error: {
                            name: "tokenExpiredError",
                            message: "Token was expired, and not returned to the child application"
                        }
                    };
                }
                event.source.postMessage(msg, event.origin);
            }
        };
    }
    /**
     * Validates that a given URL is properly federated with our current `portal`.
     * Attempts to use the internal `federatedServers` cache first.
     */
    getTokenForServer(url, requestOptions) {
        // requests to /rest/services/ and /rest/admin/services/ are both valid
        // Federated servers may have inconsistent casing, so lowerCase it
        const root = this.getServerRootUrl(url);
        const existingToken = this.federatedServers[root];
        if (existingToken &&
            existingToken.expires &&
            existingToken.expires.getTime() > Date.now()) {
            return Promise.resolve(existingToken.token);
        }
        if (this._pendingTokenRequests[root]) {
            return this._pendingTokenRequests[root];
        }
        this._pendingTokenRequests[root] = this.fetchAuthorizedDomains().then(() => {
            return request(`${root}/rest/info`, {
                credentials: this.getDomainCredentials(url)
            })
                .then((serverInfo) => {
                if (serverInfo.owningSystemUrl) {
                    /**
                     * if this server is not owned by this portal
                     * bail out with an error since we know we wont
                     * be able to generate a token
                     */
                    if (!isFederated(serverInfo.owningSystemUrl, this.portal)) {
                        throw new ArcGISTokenRequestError(`${url} is not federated with ${this.portal}.`, ArcGISTokenRequestErrorCodes.NOT_FEDERATED);
                    }
                    else {
                        /**
                         * if the server is federated, use the relevant token endpoint.
                         */
                        return request(`${serverInfo.owningSystemUrl}/sharing/rest/info`, requestOptions);
                    }
                }
                else if (serverInfo.authInfo &&
                    this.federatedServers[root] !== undefined) {
                    /**
                     * if its a stand-alone instance of ArcGIS Server that doesn't advertise
                     * federation, but the root server url is recognized, use its built in token endpoint.
                     */
                    return Promise.resolve({
                        authInfo: serverInfo.authInfo
                    });
                }
                else {
                    throw new ArcGISTokenRequestError(`${url} is not federated with any portal and is not explicitly trusted.`, ArcGISTokenRequestErrorCodes.NOT_FEDERATED);
                }
            })
                .then((serverInfo) => {
                // an expired token cant be used to generate a new token so refresh our credentials before trying to generate a server token
                if (this.token && this.tokenExpires.getTime() < Date.now()) {
                    // If we are authenticated to a single server just refresh with username and password and use the new credentials as the credentials for this server.
                    if (this.server) {
                        return this.refreshCredentials().then(() => {
                            return {
                                token: this.token,
                                expires: this.tokenExpires
                            };
                        });
                    }
                    // Otherwise refresh the credentials for the portal and generate a URL for the specific server.
                    return this.refreshCredentials().then(() => {
                        return this.generateTokenForServer(serverInfo.authInfo.tokenServicesUrl, root);
                    });
                }
                else {
                    return this.generateTokenForServer(serverInfo.authInfo.tokenServicesUrl, root);
                }
            })
                .then((response) => {
                this.federatedServers[root] = response;
                delete this._pendingTokenRequests[root];
                return response.token;
            });
        });
        return this._pendingTokenRequests[root];
    }
    /**
     * Generates a token for a given `serverUrl` using a given `tokenServicesUrl`.
     */
    generateTokenForServer(tokenServicesUrl, serverUrl) {
        return request(tokenServicesUrl, {
            params: {
                token: this.token,
                serverUrl,
                expiration: this.tokenDuration
            }
        })
            .then((response) => {
            return {
                token: response.token,
                expires: new Date(response.expires - 1000 * 60 * 5)
            };
        })
            .catch((e) => {
            throw new ArcGISTokenRequestError(e.message, ArcGISTokenRequestErrorCodes.GENERATE_TOKEN_FOR_SERVER_FAILED, e.response, e.url, e.options);
        });
    }
    /**
     * Returns an unexpired token for the current `portal`.
     */
    getFreshToken(requestOptions) {
        if (this.token && !this.tokenExpires) {
            return Promise.resolve(this.token);
        }
        if (this.token &&
            this.tokenExpires &&
            this.tokenExpires.getTime() > Date.now()) {
            return Promise.resolve(this.token);
        }
        if (!this._pendingTokenRequests[this.portal]) {
            this._pendingTokenRequests[this.portal] = this.refreshCredentials(requestOptions).then(() => {
                this._pendingTokenRequests[this.portal] = null;
                return this.token;
            });
        }
        return this._pendingTokenRequests[this.portal];
    }
    /**
     * Refreshes the current `token` and `tokenExpires` with `username` and
     * `password`.
     */
    refreshWithUsernameAndPassword(requestOptions) {
        const params = {
            username: this.username,
            password: this.password,
            expiration: this.tokenDuration,
            client: "referer",
            referer: this.referer
                ? this.referer
                : typeof window !== "undefined" &&
                    typeof window.document !== "undefined" &&
                    window.location &&
                    window.location.origin
                    ? window.location.origin
                    : /* istanbul ignore next */
                        NODEJS_DEFAULT_REFERER_HEADER
        };
        return (this.server
            ? request(`${this.getServerRootUrl(this.server)}/rest/info`).then((response) => {
                return request(response.authInfo.tokenServicesUrl, Object.assign({ params }, requestOptions));
            })
            : request(`${this.portal}/generateToken`, Object.assign({ params }, requestOptions)))
            .then((response) => {
            this.updateToken(response.token, new Date(response.expires));
            return this;
        })
            .catch((e) => {
            throw new ArcGISTokenRequestError(e.message, ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED, e.response, e.url, e.options);
        });
    }
    /**
     * Refreshes the current `token` and `tokenExpires` with `refreshToken`.
     */
    refreshWithRefreshToken(requestOptions) {
        // If our refresh token expires sometime in the next 24 hours then refresh the refresh token
        const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
        if (this.refreshToken &&
            this.refreshTokenExpires &&
            this.refreshTokenExpires.getTime() - ONE_DAY_IN_MILLISECONDS < Date.now()) {
            return this.exchangeRefreshToken(requestOptions);
        }
        const options = Object.assign({ params: {
                client_id: this.clientId,
                refresh_token: this.refreshToken,
                grant_type: "refresh_token"
            } }, requestOptions);
        return fetchToken(`${this.portal}/oauth2/token`, options)
            .then((response) => {
            return this.updateToken(response.token, response.expires);
        })
            .catch((e) => {
            throw new ArcGISTokenRequestError(e.message, ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED, e.response, e.url, e.options);
        });
    }
    /**
     * Update the stored {@linkcode ArcGISIdentityManager.token} and {@linkcode ArcGISIdentityManager.tokenExpires} properties. This method is used internally when refreshing tokens.
     * You may need to call this if you want update the token with a new token from an external source.
     *
     * @param newToken The new token to use for this instance of `ArcGISIdentityManager`.
     * @param newTokenExpiration The new expiration date of the token.
     * @returns
     */
    updateToken(newToken, newTokenExpiration) {
        this._token = newToken;
        this._tokenExpires = newTokenExpiration;
        return this;
    }
    /**
     * Exchanges an unexpired `refreshToken` for a new one, also updates `token` and
     * `tokenExpires`.
     */
    exchangeRefreshToken(requestOptions) {
        const options = Object.assign({ params: {
                client_id: this.clientId,
                refresh_token: this.refreshToken,
                redirect_uri: this.redirectUri,
                grant_type: "exchange_refresh_token"
            } }, requestOptions);
        return fetchToken(`${this.portal}/oauth2/token`, options)
            .then((response) => {
            this._token = response.token;
            this._tokenExpires = response.expires;
            this._refreshToken = response.refreshToken;
            this._refreshTokenExpires = response.refreshTokenExpires;
            return this;
        })
            .catch((e) => {
            throw new ArcGISTokenRequestError(e.message, ArcGISTokenRequestErrorCodes.REFRESH_TOKEN_EXCHANGE_FAILED, e.response, e.url, e.options);
        });
    }
    /**
     * ensures that the authorizedCrossOriginDomains are obtained from the portal and cached
     * so we can check them later.
     *
     * @returns this
     */
    fetchAuthorizedDomains() {
        // if this token is for a specific server or we don't have a portal
        // don't get the portal info because we cant get the authorizedCrossOriginDomains
        if (this.server || !this.portal) {
            return Promise.resolve(this);
        }
        return this.getPortal().then((portalInfo) => {
            /**
             * Specific domains can be configured as secure.esri.com or https://secure.esri.com this
             * normalizes to https://secure.esri.com so we can use startsWith later.
             */
            if (portalInfo.authorizedCrossOriginDomains &&
                portalInfo.authorizedCrossOriginDomains.length) {
                this.trustedDomains = portalInfo.authorizedCrossOriginDomains
                    .filter((d) => !d.startsWith("http://"))
                    .map((d) => {
                    if (d.startsWith("https://")) {
                        return d;
                    }
                    else {
                        return `https://${d}`;
                    }
                });
            }
            return this;
        });
    }
}

const featureReportCss = ":host{background-color:var(--calcite-color-foreground-1);color:var(--calcite-color-text-2);display:block;overflow:auto}:host div.banner{display:block;cursor:pointer;line-height:60px}:host .task-num{display:inline-block;height:16px;text-align:center;border-radius:16px;border-color:#31872E;background-color:#31872E;margin-left:4px;color:#ffffff;line-height:16px !important;transition:all 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28)}:host .task-num span{position:relative;line-height:1 !important;color:#ffffff;padding:1px 4px}:host .task-num.active{-webkit-transform:scale(1.2);transform:scale(1.2)}:host .error-message{word-break:break-word}:host-context([dir=rtl]) .task-num{margin-left:unset !important;margin-right:4px}";
const FeatureReportStyle0 = featureReportCss;

const FeatureReport = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.userInfoGetted = createEvent(this, "userInfoGetted", 7);
        this.i18nStringUpdated = createEvent(this, "i18nStringUpdated", 7);
        this._credentialGetted = createEvent(this, "_credentialGetted", 7);
        this.stateService = StateService.getService();
        this.reportService = ReportService.getService();
        this.token = undefined;
        this.portalUrl = undefined;
        this.apiUrl = undefined;
        this.featureLayerUrl = undefined;
        this.surveyItemId = undefined;
        this.templateItemId = undefined;
        this.queryParameters = undefined;
        this.mergeFiles = undefined;
        this.outputFormat = undefined;
        this.outputReportName = undefined;
        this.outputPackageName = undefined;
        this.packageFiles = undefined;
        this.uploadInfo = undefined;
        this.webmapItemId = undefined;
        this.mapScale = undefined;
        this.locale = undefined;
        this.utcOffset = undefined;
        this.show = undefined;
        this.hide = undefined;
        this.inputFeatureTemplate = undefined;
        this.label = undefined;
        this.reportTemplateIds = undefined;
        this.clientId = undefined;
        this.requestSource = undefined;
        this.where = undefined;
        this.username = undefined;
        this.state = 'generate-report';
        this.visibleConf = [];
        this.checkingList = [];
        this.jobs = [];
        this.error = undefined;
        this.langTasks = undefined;
        this.langCommon = undefined;
        this.langCustomPrint = undefined;
        this.surveyItemInfo = undefined;
    }
    templateItemIdChanged(newVal) {
        PropsService.setProps({ templateItemId: newVal });
    }
    queryParametersChanged(newVal) {
        PropsService.setProps({
            queryParameters: newVal
        });
        return this.reportService.getFeatureCount().then(() => {
            this.stateService.notifyDataChanged('update-features-preview', { value: undefined }); // no not use {value: null} here.
        });
    }
    mergeFilesChanged(newVal) {
        PropsService.setProps({
            mergeFiles: newVal
        });
    }
    outputFormatChanged(newVal) {
        PropsService.setProps({ outputFormat: newVal });
        this.outputFormat = PropsService.outputFormat;
    }
    localeChanged(newVal) {
        this.localeChangeHandler(newVal);
        UtilService.getService().setDir();
    }
    showChanged(newValue) {
        // console.log(newValue, oldValue);
        PropsService.setProps({ show: newValue });
        this.visibleConf = this.generateVisibleElems();
        this.reportService.setHelperObj({
            visibleConf: this.visibleConf
        });
    }
    hideChanged(newVal) {
        PropsService.setProps({ hide: newVal });
        this.visibleConf = this.generateVisibleElems();
        this.reportService.setHelperObj({
            visibleConf: this.visibleConf
        });
    }
    inputFeatureTemplateChanged(newVal) {
        PropsService.setProps({ inputFeatureTemplate: newVal });
        this.stateService.notifyDataChanged('update-features-preview', { value: this.inputFeatureTemplate });
    }
    labelChanged(newVal) {
        PropsService.setProps({ label: newVal });
        return Promise.resolve(true)
            .then(() => {
            return TranslateService.getService().getTranslate();
        })
            .then((res) => {
            const langTasks = res.customPrint.recentTasks;
            this.langCustomPrint = res.customPrint;
            this.langTasks = langTasks;
            this.langCommon = res.common;
            this.stateService.notifyDataChanged('locale-data-changed', { value: res });
        });
    }
    reportTemplateIdsChanged(newVal) {
        PropsService.setProps({
            reportTemplateIds: newVal
        });
        // the select segment is hidden, update the report templates
        this.updateTemplateList();
    }
    requestSourceChanged(newVal) {
        PropsService.setProps({
            requestSource: newVal
        });
    }
    componentWillLoad() {
        PropsService.setProps(this);
        this.portalUrl = PropsService.portalUrl;
        this.outputFormat = PropsService.outputFormat;
        return Promise.resolve(true)
            .then(() => {
            return TranslateService.getService().getTranslate();
        })
            .then((res) => {
            const langTasks = res.customPrint.recentTasks;
            this.langCustomPrint = res.customPrint;
            this.langTasks = langTasks;
            this.langCommon = res.common;
            this.i18nStringUpdated.emit({ locale: PropsService.locale, i18n: this.langCommon });
            if (!this.isOAuthCallbackpage()) {
                if (!this.featureLayerUrl) {
                    this.error = { html: res.customPrint.missingRequiredParamsErr.replace('${$paramName}', `featureLayerUrl`) };
                    throw new Error('featureLayerUrl is required.');
                }
                if (!this.queryParameters) {
                    this.error = { html: res.customPrint.missingRequiredParamsErr.replace('${$paramName}', `queryParameters`) };
                    throw new Error('queryParameters is required.');
                }
            }
        })
            .then(() => {
            if (this.token) {
                this.init();
                return true;
            }
            else if (!this.token) {
                // the callback page navigated from the oauth page
                if (this.isOAuthCallbackpage()) {
                    /**
                     * the code is added from the oauth page navigation, as this is a web component, we can't use a dedicated oauth callback page, we have to use the original page,
                     * but if set the redirectUri as window.location.href here, the completeOAuth2 request will return invalid redirectUri error, because the url parameter has 'codes' and 'state'
                     * in fact, we didn't know what the correct redirectUri is, because it's not set by us, we are not the client id owner.
                     * so, maybe we should not call the ArcGISIdentityManager.beginOAuth2() here.
                     * Need a discussion with team.
                     */
                    const portalRest = `${this.portalUrl}/sharing/rest`;
                    const url = new URL(window.location.href);
                    const redirect_url = `${url.origin}${url.pathname}?portalUrl=${this.portalUrl}&isOAuthCallback=true`;
                    // #749, the redirect_url in completeOAuth2 and beginOAuth2 must be the same.
                    ArcGISIdentityManager.completeOAuth2({ portal: portalRest, popup: true, clientId: this.clientId, redirectUri: redirect_url });
                    return;
                }
                else {
                    // there is a bug in the platformSelf function inside of the @esri/arcgis-rest-request: the request: the "withCredentials" is from 
                    // platformSelf(this.clientId, 'https://localhost:3333/', this.portalUrl).then(response => {
                    const requestUrl = `${this.portalUrl}/sharing/rest/oauth2/platformSelf?f=json`;
                    const param = {
                        httpMethod: 'POST',
                        headers: {
                            "X-Esri-Auth-Client-Id": this.clientId,
                            "X-Esri-Auth-Redirect-Uri": window.location.href
                        },
                        params: {
                            f: 'json'
                        },
                        credentials: 'include'
                    };
                    return request(requestUrl, param).then((response) => {
                        if (response.expires_in) {
                            response.expires = new Date().valueOf() + response.expires_in * 1000 - 1000 * 5;
                            delete response.expires_in;
                        }
                        this._credentialGetted.emit(response);
                        this.token = response.token;
                        PropsService.setProps(this);
                        this.init();
                        return true;
                    }).catch(() => {
                        this.state = 'login';
                        // this.switchState('login');
                        // (document.querySelector('#login-modal') as any).open = true;
                        // return this.waitingUserLogin();
                    });
                }
            }
        }).catch((e) => {
            console.error(e);
        });
    }
    /**
     * init the component
     * before enter in this function, the token prop must be ready
     */
    init() {
        // init the constructor of the props service
        const utilService = UtilService.getService();
        this.stateService.subscribe('job-complete', (job) => {
            var _a;
            const idx = this.checkingList.indexOf(job.jobId);
            if (idx >= 0) {
                if (job.jobStatus === EsriJobStatusType.partialSucceeded || job.jobStatus === EsriJobStatusType.succeeded) {
                    if ((_a = job === null || job === void 0 ? void 0 : job.resultInfo) === null || _a === void 0 ? void 0 : _a.resultFiles) {
                        this.checkingList.splice(idx, 1);
                        this.checkingList = [].concat(this.checkingList);
                        this.reportService.downloadReport(job);
                    }
                }
            }
        });
        this.stateService.subscribe('show-error', (err) => {
            this.error = err;
        });
        return Promise.resolve(true)
            .then(() => {
            // PropsService.setProps(this);
            if (this.uploadInfo) {
                this.reportService.setParamCache({
                    uploadInfo: JSON.parse(this.uploadInfo)
                });
            }
            return true;
        })
            // .then(() => {
            //   return TranslateService.getService().getTranslate();
            // })
            // .then((res) => {
            //   const langTasks = res.customPrint.recentTasks;
            //   this.langTasks = langTasks;
            // })
            .then(() => {
            return utilService.getPortalInfo();
        }).then((portalInfo) => {
            /**
             * check canCreateItem privilege
             */
            const canCreateItem = portalInfo.user.privileges.includes('portal:user:createItem');
            this.reportService.setHelperObj({ canCreateItem: canCreateItem });
            this.userInfoGetted.emit(portalInfo.user);
            if (!this.locale) {
                const newLocale = PropsService.getLocale({
                    userInfo: portalInfo.user,
                    portalInfo: portalInfo
                });
                if (newLocale !== PropsService.locale) {
                    this.localeChangeHandler(newLocale);
                }
            }
            else {
                this.i18nStringUpdated.emit({ locale: this.locale, i18n: this.langCommon });
            }
            UtilService.getService().setDir();
            // show elements after user info is gotten, because the user name is needed for the report setting section.
            this.visibleConf = this.generateVisibleElems();
            this.reportService.setHelperObj({
                visibleConf: this.visibleConf
            });
            this.stateService.notifyDataChanged('portal-info-updated');
            if (PropsService.surveyItemId) {
                return utilService.getSurveyItemInfo(PropsService.surveyItemId);
            }
            // return true;
        })
            .catch((e) => {
            this.reportService.setHelperObj({ surveyIsInvalid: true });
            this.surveyItemInfo = {};
            this.reportService.manageError(e, 'surveyItemId');
        })
            .then((surveyItemInfo) => {
            this.surveyItemInfo = surveyItemInfo;
            this.reportService.setHelperObj({ surveyIsInvalid: false });
            this.reportService.initParamCache();
            return this.reportService.getFeatureCount();
        })
            .then(() => {
            this.stateService.notifyDataChanged('update-features-preview', { value: undefined });
            // if the template chooser component will hidden, get the templates
            // todo: seems we only need to choose the selected template?
            return this.updateTemplateList();
        })
            .catch((err) => {
            if (err.message && !err.html) {
                err.html = err.message;
            }
            this.error = err;
        });
    }
    /**
     * todo: when the component is embeded in an iframe, will hit the same-origin policy problem:
     * the beginOAuth2 is called in iframe, it will write some info(stateId) to localStorage, but the completeOAuth2 will called in a stanalone page, it cann't read the stateId.
     * @returns
     */
    startLogin() {
        const portalRest = `${this.portalUrl}/sharing/rest`;
        const url = new URL(window.location.href);
        const redirect_url = `${url.origin}${url.pathname}?portalUrl=${this.portalUrl}&isOAuthCallback=true`;
        return ArcGISIdentityManager.beginOAuth2({ portal: portalRest, popup: true, clientId: this.clientId, redirectUri: redirect_url }).then((idm) => {
            this.token = idm.token;
            PropsService.setProps(this);
            this.switchState('generate-report');
            this.init();
            this._credentialGetted.emit(idm.toCredential());
            return true;
        });
    }
    isOAuthCallbackpage() {
        const url = new URL(window.location.href);
        return (url.search + '').includes("isOAuthCallback=true");
    }
    /**
     * locale change handler
     * @param newLocale
     * @returns
     */
    localeChangeHandler(newLocale) {
        PropsService.setProps({ locale: newLocale });
        return Promise.resolve(true)
            .then(() => {
            return TranslateService.getService().getTranslate();
        })
            .then((res) => {
            const langTasks = res.customPrint.recentTasks;
            this.langCustomPrint = res.customPrint;
            this.langTasks = langTasks;
            this.langCommon = res.common;
            this.stateService.notifyDataChanged('locale-data-changed', { value: res });
            this.i18nStringUpdated.emit({ locale: newLocale, i18n: this.langCommon });
            return true;
        });
    }
    /**
     * get visible elements
     * @returns
     */
    generateVisibleElems() {
        var _a, _b;
        const elems = ['inputFeatures', 'selectTemplate', 'fileOptions', 'reportName', 'saveToAGSAccount', 'outputFormat', 'showCredits', 'recentReports'];
        let result = [];
        if ((_a = this.show) === null || _a === void 0 ? void 0 : _a.length) {
            result = this.show.split(',');
        }
        else if ((_b = this.hide) === null || _b === void 0 ? void 0 : _b.length) {
            const hides = this.hide.split(',');
            result = elems.filter((ele) => {
                return hides.indexOf(ele) < 0;
            });
        }
        else {
            result = elems;
        }
        if (result.indexOf('fileOptions') < 0 && result.indexOf('reportName') < 0 && result.indexOf('saveToAGSAccount') < 0 && result.indexOf('outputFormat') < 0) ;
        else {
            result.push('reportSetting');
        }
        return [].concat(result);
    }
    switchState(state) {
        this.state = state;
    }
    /**
     * update template list
     * @returns
     */
    updateTemplateList() {
        return Promise.resolve(true).then(() => {
            if (this.visibleConf.indexOf('selectTemplate') < 0) {
                const param = this.reportTemplateIds === undefined ? {} : { templateIds: this.reportTemplateIds };
                return this.reportService.getReportTemplates(this.surveyItemId, param);
            }
        })
            .then((templates) => {
            if (templates) {
                this.reportService.setHelperObj({
                    printTemplates: templates
                });
                this.stateService.notifyDataChanged('print-templates-updated', { value: templates });
                // set the first template as the default template if the templateItemId is not provided.
                const paramStore = this.reportService.getParamCache();
                const templateItemId = paramStore.templateItemId || PropsService.templateItemId;
                if (!templateItemId && templates.length) {
                    const selectedTemplateId = templates[0].id;
                    this.reportService.setParamCache({
                        templateItemId: selectedTemplateId
                    });
                    // this.selectedTemplateChange.emit(this.selectedTemplateId);
                }
            }
        });
    }
    generateReportHander(evt) {
        const detail = evt.detail;
        this.jobs = detail.jobs;
        // this.checkingList.push()
        this.checkingList = [...this.checkingList, evt.detail.jobId];
        // if (this.visibleConf.indexOf('recentReports') >= 0) {
        this.state = 'report-list';
        // }
        // this.checkingList = [].concat(detail.checkingList || []);
    }
    render() {
        var _a, _b, _c, _d, _e;
        return (h(Host, { key: '372606ed791cd7d1ef7fb882c716ca76840a45f2' }, h("calcite-panel", { key: 'a7346f03688cfdb7440bf8e40363176fa1c8515b' }, h("div", { key: '652e818cf3cf99a5df2a0a19e0c141c96acd080d', style: { display: (this.state === 'generate-report' && this.token) ? 'block' : 'none' } }, this.visibleConf.indexOf('inputFeatures') < 0 ? '' : h("features-preview", { queryParameters: this.queryParameters, inputFeatureTemplate: this.inputFeatureTemplate }), this.visibleConf.indexOf('selectTemplate') < 0 || !this.surveyItemInfo ? '' : h("template-chooser", { selectedTemplateId: this.templateItemId, templateIds: this.reportTemplateIds }), this.visibleConf.indexOf('reportSetting') < 0 ? '' : h("report-settings", { visibleElems: this.visibleConf, mergeFiles: this.mergeFiles, outputFormat: this.outputFormat, fileName: this.outputReportName }), h("report-generator", { key: 'c5d2c57bd3086446b9317ef344c5ae86a9f11420', visibleConf: this.visibleConf, templateItemId: this.templateItemId, onReportCreated: (evt) => { this.generateReportHander(evt); } }), this.visibleConf.indexOf('recentReports') < 0 ?
            null :
            h("div", { class: "banner" }, h("calcite-action", { onClick: () => this.switchState('report-list'), icon: "chevrons-right", "text-enabled": true }, h("span", null, (_a = this.langTasks) === null || _a === void 0 ? void 0 : _a.label), ((_b = this.checkingList) === null || _b === void 0 ? void 0 : _b.length) ?
                h(Fragment, null, h("div", { class: "task-num", id: 'task-num' }, h("span", null, `${this.checkingList.length || ''}`)), h("calcite-tooltip", { label: this.langTasks.panelNumberTip, "reference-element": "task-num" }, h("span", null, this.langTasks.panelNumberTip)))
                : null))), this.token ?
            h("task-list", { style: { display: (this.state === 'report-list') ? 'block' : 'none' }, jobs: this.jobs, onGoBackClicked: () => { this.state = 'generate-report'; } })
            : '', this.error ?
            h("calcite-alert", { slot: "alerts", open: true, onCalciteAlertClose: () => { this.error = null; }, label: this.error.html, icon: true, kind: this.error.alertType || 'danger', placement: "top", scale: "s" }, h("div", { class: "error-message", slot: "message" }, this.error.html, this.error.detail ?
                h("p", { innerHTML: this.error.detail })
                : null))
            : null, this.state === 'login' && !PropsService.token ?
            h("calcite-modal", { "aria-labelledby": "modal-title", id: "login-modal", "outside-close-disabled": "true", scale: "s", "width-scale": "s", "close-button-disabled": "true", open: "true" }, h("div", { slot: "header", id: "modal-title" }, (_c = this.langCommon) === null || _c === void 0 ? void 0 : _c.signIn), h("div", { slot: "content" }, h("calcite-label", { style: { height: '100px' } }, h("p", null, (_d = this.langCommon) === null || _d === void 0 ? void 0 : _d.signInMsg), h("calcite-button", { id: "reportLoginBtn", kind: "brand", onClick: () => this.startLogin() }, (_e = this.langCommon) === null || _e === void 0 ? void 0 : _e.signIn))))
            : ''), h("slot", { key: '22b3f6908b27655eabd64ab0e452f706d4528752' })));
    }
    static get watchers() { return {
        "templateItemId": ["templateItemIdChanged"],
        "queryParameters": ["queryParametersChanged"],
        "mergeFiles": ["mergeFilesChanged"],
        "outputFormat": ["outputFormatChanged"],
        "locale": ["localeChanged"],
        "show": ["showChanged"],
        "hide": ["hideChanged"],
        "inputFeatureTemplate": ["inputFeatureTemplateChanged"],
        "label": ["labelChanged"],
        "reportTemplateIds": ["reportTemplateIdsChanged"],
        "requestSource": ["requestSourceChanged"]
    }; }
};
FeatureReport.style = FeatureReportStyle0;

export { FeatureReport as feature_report };

//# sourceMappingURL=feature-report.entry.js.map