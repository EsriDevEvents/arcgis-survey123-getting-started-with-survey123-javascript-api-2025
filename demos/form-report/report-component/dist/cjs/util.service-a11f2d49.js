'use strict';

const translate_service = require('./translate.service-6de902ba.js');

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Checks parameters to see if we should use FormData to send the request
 * @param params The object whose keys will be encoded.
 * @return A boolean indicating if FormData will be required.
 */
function requiresFormData(params) {
    return Object.keys(params).some((key) => {
        let value = params[key];
        if (!value) {
            return false;
        }
        if (value && value.toParam) {
            value = value.toParam();
        }
        const type = value.constructor.name;
        switch (type) {
            case "Array":
                return false;
            case "Object":
                return false;
            case "Date":
                return false;
            case "Function":
                return false;
            case "Boolean":
                return false;
            case "String":
                return false;
            case "Number":
                return false;
            default:
                return true;
        }
    });
}
/**
 * Converts parameters to the proper representation to send to the ArcGIS REST API.
 * @param params The object whose keys will be encoded.
 * @return A new object with properly encoded values.
 */
function processParams(params) {
    const newParams = {};
    Object.keys(params).forEach((key) => {
        var _a, _b;
        let param = params[key];
        if (param && param.toParam) {
            param = param.toParam();
        }
        if (!param &&
            param !== 0 &&
            typeof param !== "boolean" &&
            typeof param !== "string") {
            return;
        }
        const type = param.constructor.name;
        let value;
        // properly encodes objects, arrays and dates for arcgis.com and other services.
        // ported from https://github.com/Esri/esri-leaflet/blob/master/src/Request.js#L22-L30
        // also see https://github.com/Esri/arcgis-rest-js/issues/18:
        // null, undefined, function are excluded. If you want to send an empty key you need to send an empty string "".
        switch (type) {
            case "Array":
                // Based on the first element of the array, classify array as an array of arrays, an array of objects
                // to be stringified, or an array of non-objects to be comma-separated
                // eslint-disable-next-line no-case-declarations
                const firstElementType = (_b = (_a = param[0]) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name;
                value =
                    firstElementType === "Array"
                        ? param // pass thru array of arrays
                        : firstElementType === "Object"
                            ? JSON.stringify(param) // stringify array of objects
                            : param.join(","); // join other types of array elements
                break;
            case "Object":
                value = JSON.stringify(param);
                break;
            case "Date":
                value = param.valueOf();
                break;
            case "Function":
                value = null;
                break;
            case "Boolean":
                value = param + "";
                break;
            default:
                value = param;
                break;
        }
        if (value ||
            value === 0 ||
            typeof value === "string" ||
            Array.isArray(value)) {
            newParams[key] = value;
        }
    });
    return newParams;
}

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Encodes keys and parameters for use in a URL's query string.
 *
 * @param key Parameter's key
 * @param value Parameter's value
 * @returns Query string with key and value pairs separated by "&"
 */
function encodeParam(key, value) {
    // For array of arrays, repeat key=value for each element of containing array
    if (Array.isArray(value) && value[0] && Array.isArray(value[0])) {
        return value
            .map((arrayElem) => encodeParam(key, arrayElem))
            .join("&");
    }
    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
}
/**
 * Encodes the passed object as a query string.
 *
 * @param params An object to be encoded.
 * @returns An encoded query string.
 */
function encodeQueryString(params) {
    const newParams = processParams(params);
    return Object.keys(newParams)
        .map((key) => {
        return encodeParam(key, newParams[key]);
    })
        .join("&");
}

var browserPonyfill = {
  FormData: globalThis.FormData,
  File: globalThis.File,
  Blob: globalThis.Blob
};

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Encodes parameters in a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object in browsers or in a [FormData](https://github.com/form-data/form-data) in Node.js
 *
 * @param params An object to be encoded.
 * @returns The complete [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object.
 */
function encodeFormData(params, forceFormData) {
    // see https://github.com/Esri/arcgis-rest-js/issues/499 for more info.
    const useFormData = requiresFormData(params) || forceFormData;
    const newParams = processParams(params);
    if (useFormData) {
        const formData = new browserPonyfill.FormData();
        Object.keys(newParams).forEach((key) => {
            if (typeof Blob !== "undefined" && newParams[key] instanceof Blob) {
                /* To name the Blob:
                 1. look to an alternate request parameter called 'fileName'
                 2. see if 'name' has been tacked onto the Blob manually
                 3. if all else fails, use the request parameter
                */
                const filename = newParams["fileName"] || newParams[key].name || key;
                formData.append(key, newParams[key], filename);
            }
            else {
                formData.append(key, newParams[key]);
            }
        });
        return formData;
    }
    else {
        return encodeQueryString(params);
    }
}

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * This represents a generic error from an ArcGIS endpoint. There will be details about the error in the {@linkcode ArcGISRequestError.message},  {@linkcode ArcGISRequestError.originalMessage} properties on the error. You
 * can also access the original server response at  {@linkcode ArcGISRequestError.response} which may have additional details.
 *
 * ```js
 * request(someUrl, someOptions).catch(e => {
 *   if(e.name === "ArcGISRequestError") {
 *     console.log("Something went wrong with the request:", e);
 *     console.log("Full server response", e.response);
 *   }
 * })
 * ```
 */
class ArcGISRequestError extends Error {
    /**
     * Create a new `ArcGISRequestError`  object.
     *
     * @param message - The error message from the API
     * @param code - The error code from the API
     * @param response - The original response from the API that caused the error
     * @param url - The original url of the request
     * @param options - The original options and parameters of the request
     */
    constructor(message, code, response, url, options) {
        // 'Error' breaks prototype chain here
        super(message);
        // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
        // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
        message = message || "UNKNOWN_ERROR";
        code = code || "UNKNOWN_ERROR_CODE";
        this.name = "ArcGISRequestError";
        this.message =
            code === "UNKNOWN_ERROR_CODE" ? message : `${code}: ${message}`;
        this.originalMessage = message;
        this.code = code;
        this.response = response;
        this.url = url;
        this.options = options;
    }
}

/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Method used internally to surface messages to developers.
 */
function warn(message) {
    if (console && console.warn) {
        console.warn.apply(console, [message]);
    }
}

var getFetch = function getFetch() {
  return Promise.resolve({
    fetch: globalThis.fetch,
    Headers: globalThis.Headers,
    Response: globalThis.Response,
    Request: globalThis.request
  });
};

/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
const NODEJS_DEFAULT_REFERER_HEADER = `@esri/arcgis-rest-js`;
function getDefaultRequestOptions() {
    return (globalThis.DEFAULT_ARCGIS_REQUEST_OPTIONS || {
        httpMethod: "POST",
        params: {
            f: "json"
        }
    });
}
/**
 * This error is thrown when a request encounters an invalid token error. Requests that use {@linkcode ArcGISIdentityManager} or
 * {@linkcode ApplicationCredentialsManager} in the `authentication` option the authentication manager will automatically try to generate
 * a fresh token using either {@linkcode ArcGISIdentityManager.refreshCredentials} or
 * {@linkcode ApplicationCredentialsManager.refreshCredentials}. If the request with the new token fails you will receive an `ArcGISAuthError`
 * if refreshing the token fails you will receive an instance of {@linkcode ArcGISTokenRequestError}.
 *
 * ```js
 * request(someUrl, {
 *   authentication: identityManager,
 *   // some additional options...
 * }).catch(e => {
 *   if(e.name === "ArcGISAuthError") {
 *     console.log("Request with a new token failed you might want to have the user authorize again.")
 *   }
 *
 *   if(e.name === "ArcGISTokenRequestError") {
 *     console.log("There was an error refreshing the token you might want to have the user authorize again.")
 *   }
 * })
 * ```
 */
class ArcGISAuthError extends ArcGISRequestError {
    /**
     * Create a new `ArcGISAuthError`  object.
     *
     * @param message - The error message from the API
     * @param code - The error code from the API
     * @param response - The original response from the API that caused the error
     * @param url - The original url of the request
     * @param options - The original options of the request
     */
    constructor(message = "AUTHENTICATION_ERROR", code = "AUTHENTICATION_ERROR_CODE", response, url, options) {
        super(message, code, response, url, options);
        this.name = "ArcGISAuthError";
        this.message =
            code === "AUTHENTICATION_ERROR_CODE" ? message : `${code}: ${message}`;
        // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
        // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
    }
    retry(getSession, retryLimit = 1) {
        let tries = 0;
        const retryRequest = (resolve, reject) => {
            tries = tries + 1;
            getSession(this.url, this.options)
                .then((session) => {
                const newOptions = Object.assign(Object.assign({}, this.options), { authentication: session });
                return internalRequest(this.url, newOptions);
            })
                .then((response) => {
                resolve(response);
            })
                .catch((e) => {
                if (e.name === "ArcGISAuthError" && tries < retryLimit) {
                    retryRequest(resolve, reject);
                }
                else if (e.name === this.name &&
                    e.message === this.message &&
                    tries >= retryLimit) {
                    reject(this);
                }
                else {
                    reject(e);
                }
            });
        };
        return new Promise((resolve, reject) => {
            retryRequest(resolve, reject);
        });
    }
}
/**
 * Checks for errors in a JSON response from the ArcGIS REST API. If there are no errors, it will return the `data` passed in. If there is an error, it will throw an `ArcGISRequestError` or `ArcGISAuthError`.
 *
 * @param data The response JSON to check for errors.
 * @param url The url of the original request
 * @param params The parameters of the original request
 * @param options The options of the original request
 * @returns The data that was passed in the `data` parameter
 */
function checkForErrors(response, url, params, options, originalAuthError) {
    // this is an error message from billing.arcgis.com backend
    if (response.code >= 400) {
        const { message, code } = response;
        throw new ArcGISRequestError(message, code, response, url, options);
    }
    // error from ArcGIS Online or an ArcGIS Portal or server instance.
    if (response.error) {
        const { message, code, messageCode } = response.error;
        const errorCode = messageCode || code || "UNKNOWN_ERROR_CODE";
        if (code === 498 || code === 499) {
            if (originalAuthError) {
                throw originalAuthError;
            }
            else {
                throw new ArcGISAuthError(message, errorCode, response, url, options);
            }
        }
        throw new ArcGISRequestError(message, errorCode, response, url, options);
    }
    // error from a status check
    if (response.status === "failed" || response.status === "failure") {
        let message;
        let code = "UNKNOWN_ERROR_CODE";
        try {
            message = JSON.parse(response.statusMessage).message;
            code = JSON.parse(response.statusMessage).code;
        }
        catch (e) {
            message = response.statusMessage || response.message;
        }
        throw new ArcGISRequestError(message, code, response, url, options);
    }
    return response;
}
/**
 * This is the internal implementation of `request` without the automatic retry behavior to prevent
 * infinite loops when a server continues to return invalid token errors.
 *
 * @param url - The URL of the ArcGIS REST API endpoint.
 * @param requestOptions - Options for the request, including parameters relevant to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 * @internal
 */
function internalRequest(url, requestOptions) {
    const defaults = getDefaultRequestOptions();
    const options = Object.assign(Object.assign(Object.assign({ httpMethod: "POST" }, defaults), requestOptions), {
        params: Object.assign(Object.assign({}, defaults.params), requestOptions.params),
        headers: Object.assign(Object.assign({}, defaults.headers), requestOptions.headers)
    });
    const { httpMethod, rawResponse } = options;
    const params = Object.assign({ f: "json" }, options.params);
    let originalAuthError = null;
    const fetchOptions = {
        method: httpMethod,
        signal: options.signal,
        /* ensures behavior mimics XMLHttpRequest.
        needed to support sending IWA cookies */
        credentials: options.credentials || "same-origin"
    };
    // the /oauth2/platformSelf route will add X-Esri-Auth-Client-Id header
    // and that request needs to send cookies cross domain
    // so we need to set the credentials to "include"
    if (options.headers &&
        options.headers["X-Esri-Auth-Client-Id"] &&
        url.indexOf("/oauth2/platformSelf") > -1) {
        fetchOptions.credentials = "include";
    }
    let authentication;
    // Check to see if this is a raw token as a string and create a IAuthenticationManager like object for it.
    // Otherwise this just assumes that options.authentication is an IAuthenticationManager.
    if (typeof options.authentication === "string") {
        const rawToken = options.authentication;
        authentication = {
            portal: "https://www.arcgis.com/sharing/rest",
            getToken: () => {
                return Promise.resolve(rawToken);
            }
        };
        /* istanbul ignore else - we don't need to test NOT warning people */
        if (!options.authentication.startsWith("AAPK") && // doesn't look like an API Key
            !options.suppressWarnings && // user doesn't want to suppress warnings for this request
            !globalThis.ARCGIS_REST_JS_SUPPRESS_TOKEN_WARNING // we havn't shown the user this warning yet
        ) {
            warn(`Using an oAuth 2.0 access token directly in the token option is discouraged. Consider using ArcGISIdentityManager or Application session. See https://esriurl.com/arcgis-rest-js-direct-token-warning for more information.`);
            globalThis.ARCGIS_REST_JS_SUPPRESS_TOKEN_WARNING = true;
        }
    }
    else {
        authentication = options.authentication;
    }
    // for errors in GET requests we want the URL passed to the error to be the URL before
    // query params are applied.
    const originalUrl = url;
    return (authentication
        ? authentication.getToken(url).catch((err) => {
            /**
             * append original request url and requestOptions
             * to the error thrown by getToken()
             * to assist with retrying
             */
            err.url = url;
            err.options = options;
            /**
             * if an attempt is made to talk to an unfederated server
             * first try the request anonymously. if a 'token required'
             * error is thrown, throw the UNFEDERATED error then.
             */
            originalAuthError = err;
            return Promise.resolve("");
        })
        : Promise.resolve(""))
        .then((token) => {
        if (token.length) {
            params.token = token;
        }
        if (authentication && authentication.getDomainCredentials) {
            fetchOptions.credentials = authentication.getDomainCredentials(url);
        }
        // Custom headers to add to request. IRequestOptions.headers with merge over requestHeaders.
        const requestHeaders = {};
        if (fetchOptions.method === "GET") {
            // Prevents token from being passed in query params when hideToken option is used.
            /* istanbul ignore if - window is always defined in a browser. Test case is covered by Jasmine in node test */
            if (params.token &&
                options.hideToken &&
                // Sharing API does not support preflight check required by modern browsers https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
                typeof window === "undefined") {
                requestHeaders["X-Esri-Authorization"] = `Bearer ${params.token}`;
                delete params.token;
            }
            // encode the parameters into the query string
            const queryParams = encodeQueryString(params);
            // dont append a '?' unless parameters are actually present
            const urlWithQueryString = queryParams === "" ? url : url + "?" + encodeQueryString(params);
            if (
            // This would exceed the maximum length for URLs specified by the consumer and requires POST
            (options.maxUrlLength &&
                urlWithQueryString.length > options.maxUrlLength) ||
                // Or if the customer requires the token to be hidden and it has not already been hidden in the header (for browsers)
                (params.token && options.hideToken)) {
                // the consumer specified a maximum length for URLs
                // and this would exceed it, so use post instead
                fetchOptions.method = "POST";
                // If the token was already added as a Auth header, add the token back to body with other params instead of header
                if (token.length && options.hideToken) {
                    params.token = token;
                    // Remove existing header that was added before url query length was checked
                    delete requestHeaders["X-Esri-Authorization"];
                }
            }
            else {
                // just use GET
                url = urlWithQueryString;
            }
        }
        /* updateResources currently requires FormData even when the input parameters dont warrant it.
    https://developers.arcgis.com/rest/users-groups-and-items/update-resources.htm
        see https://github.com/Esri/arcgis-rest-js/pull/500 for more info. */
        const forceFormData = new RegExp("/items/.+/updateResources").test(url);
        if (fetchOptions.method === "POST") {
            fetchOptions.body = encodeFormData(params, forceFormData);
        }
        // Mixin headers from request options
        fetchOptions.headers = Object.assign(Object.assign({}, requestHeaders), options.headers);
        // This should have the same conditional for Node JS as ArcGISIdentityManager.refreshWithUsernameAndPassword()
        // to ensure that generated tokens have the same referer when used in Node with a username and password.
        /* istanbul ignore next - karma reports coverage on browser tests only */
        if ((typeof window === "undefined" ||
            (window && typeof window.document === "undefined")) &&
            !fetchOptions.headers.referer) {
            fetchOptions.headers.referer = NODEJS_DEFAULT_REFERER_HEADER;
        }
        /* istanbul ignore else blob responses are difficult to make cross platform we will just have to trust the isomorphic fetch will do its job */
        if (!requiresFormData(params) && !forceFormData) {
            fetchOptions.headers["Content-Type"] =
                "application/x-www-form-urlencoded";
        }
        /**
         * Check for a global fetch first and use it if available. This allows us to use the default
         * configuration of fetch-mock in tests.
         */
        /* istanbul ignore next coverage is based on browser code and we don't test for the absence of global fetch so we can skip the else here. */
        return globalThis.fetch
            ? globalThis.fetch(url, fetchOptions)
            : getFetch().then(({ fetch }) => {
                return fetch(url, fetchOptions);
            });
    })
        .then((response) => {
        // the request got back an error status code (4xx, 5xx)
        if (!response.ok) {
            // we need to determine if the server returned a JSON body with more details.
            // this is the format used by newer services such as the Places and Style service.
            return response
                .json()
                .then((jsonError) => {
                // The body can be parsed as JSON
                const { status, statusText } = response;
                const { message, details } = jsonError.error;
                const formattedMessage = `${message}. ${details ? details.join(" ") : ""}`.trim();
                throw new ArcGISRequestError(formattedMessage, `HTTP ${status} ${statusText}`, jsonError, url, options);
            })
                .catch((e) => {
                // if we already were about to format this as an ArcGISRequestError throw that error
                if (e.name === "ArcGISRequestError") {
                    throw e;
                }
                // server responded w/ an actual error (404, 500, etc) but we could not parse it as JSON
                const { status, statusText } = response;
                throw new ArcGISRequestError(statusText, `HTTP ${status}`, response, url, options);
            });
        }
        if (rawResponse) {
            return response;
        }
        switch (params.f) {
            case "json":
                return response.json();
            case "geojson":
                return response.json();
            case "html":
                return response.text();
            case "text":
                return response.text();
            /* istanbul ignore next blob responses are difficult to make cross platform we will just have to trust that isomorphic fetch will do its job */
            default:
                return response.blob();
        }
    })
        .then((data) => {
        // Check for an error in the JSON body of a successful response.
        // Most ArcGIS Server services will return a successful status code but include an error in the response body.
        if ((params.f === "json" || params.f === "geojson") && !rawResponse) {
            const response = checkForErrors(data, originalUrl, params, options, originalAuthError);
            if (originalAuthError) {
                /* If the request was made to an unfederated service that
                didn't require authentication, add the base url and a dummy token
                to the list of trusted servers to avoid another federation check
                in the event of a repeat request */
                const truncatedUrl = url
                    .toLowerCase()
                    .split(/\/rest(\/admin)?\/services\//)[0];
                options.authentication.federatedServers[truncatedUrl] = {
                    token: [],
                    // default to 24 hours
                    expires: new Date(Date.now() + 86400 * 1000)
                };
                originalAuthError = null;
            }
            return response;
        }
        else {
            return data;
        }
    });
}
/**
 * Generic method for making HTTP requests to ArcGIS REST API endpoints.
 *
 * ```js
 * import { request } from '@esri/arcgis-rest-request';
 *
 * request('https://www.arcgis.com/sharing/rest')
 *   .then(response) // response.currentVersion === 5.2
 *
 * request('https://www.arcgis.com/sharing/rest', {
 *   httpMethod: "GET"
 * })
 *
 * request('https://www.arcgis.com/sharing/rest/search', {
 *   params: { q: 'parks' }
 * })
 *   .then(response) // response.total => 78379
 * ```
 *
 * @param url - The URL of the ArcGIS REST API endpoint.
 * @param requestOptions - Options for the request, including parameters relevant to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
function request(url, requestOptions = { params: { f: "json" } }) {
    return internalRequest(url, requestOptions).catch((e) => {
        if (e instanceof ArcGISAuthError &&
            requestOptions.authentication &&
            typeof requestOptions.authentication !== "string" &&
            requestOptions.authentication.canRefresh &&
            requestOptions.authentication.refreshCredentials) {
            return e.retry(() => {
                return requestOptions.authentication.refreshCredentials();
            }, 1);
        }
        else {
            return Promise.reject(e);
        }
    });
}

/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Helper method to ensure that user supplied urls don't include whitespace or a trailing slash.
 */
function cleanUrl(url) {
    // Guard so we don't try to trim something that's not a string
    if (typeof url !== "string") {
        return url;
    }
    // trim leading and trailing spaces, but not spaces inside the url
    url = url.trim();
    // remove the trailing slash to the url if one was included
    if (url[url.length - 1] === "/") {
        url = url.slice(0, -1);
    }
    return url;
}

/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Helper that returns the appropriate portal url for a given request. `requestOptions.portal` is given
 * precedence over `authentication.portal`. If neither `portal` nor `authentication` is present,
 * `www.arcgis.com/sharing/rest` is returned.
 *
 * @param requestOptions - Request options that may have authentication manager
 * @returns Portal url to be used in API requests
 */
function getPortalUrl(requestOptions = {}) {
    // use portal in options if specified
    if (requestOptions.portal) {
        return cleanUrl(requestOptions.portal);
    }
    // if auth was passed, use that portal
    if (requestOptions.authentication &&
        typeof requestOptions.authentication !== "string") {
        // the portal url is already scrubbed in the auth package
        return requestOptions.authentication.portal;
    }
    // default to arcgis.com
    return "https://www.arcgis.com/sharing/rest";
}

/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * ```
 * import { getItem } from "@esri/arcgis-rest-portal";
 * //
 * getItem("ae7")
 *   .then(response);
 * // or
 * getItem("ae7", { authentication })
 *   .then(response)
 * ```
 * Get an item by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item.htm) for more information.
 *
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
function getItem(id, requestOptions) {
    const url = getItemBaseUrl(id, requestOptions);
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    return request(url, options);
}
/**
 * Get the fully qualified base URL to the REST end point for an item.
 * @param id Item Id
 * @param portalUrlOrRequestOptions a portal URL or request options
 * @returns URL to the item's REST end point, defaults to `https://www.arcgis.com/sharing/rest/content/items/{id}`
 */
const getItemBaseUrl = (id, portalUrlOrRequestOptions) => {
    const portalUrl = typeof portalUrlOrRequestOptions === "string"
        ? portalUrlOrRequestOptions
        : getPortalUrl(portalUrlOrRequestOptions);
    return `${portalUrl}/content/items/${id}`;
};
/**
 * ```
 * import { getRelatedItems } from "@esri/arcgis-rest-portal";
 * //
 * getRelatedItems({
 *   id: "ae7",
 *   relationshipType: "Service2Layer" // or several ["Service2Layer", "Map2Area"]
 * })
 *   .then(response)
 * ```
 * Get the related items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/related-items.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
function getRelatedItems(requestOptions) {
    const url = `${getItemBaseUrl(requestOptions.id, requestOptions)}/relatedItems`;
    const options = Object.assign({ httpMethod: "GET", params: {
            direction: requestOptions.direction
        } }, requestOptions);
    if (typeof requestOptions.relationshipType === "string") {
        options.params.relationshipType = requestOptions.relationshipType;
    }
    else {
        options.params.relationshipTypes = requestOptions.relationshipType;
    }
    delete options.direction;
    delete options.relationshipType;
    return request(url, options);
}

/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Fetch information about the specified portal by id. If no id is passed, portals/self will be called.
 *
 * If you intend to request a portal by id and it is different from the portal specified by options.authentication, you must also pass options.portal.
 *
 *  ```js
 * import { getPortal } from "@esri/arcgis-rest-portal";
 * //
 * getPortal()
 * getPortal("fe8")
 * getPortal(null, { portal: "https://custom.maps.arcgis.com/sharing/rest/" })
 * ```
 *
 * @param id
 * @param requestOptions
 */
function getPortal(id, requestOptions) {
    // construct the search url
    const idOrSelf = id ? id : "self";
    const url = `${getPortalUrl(requestOptions)}/portals/${idOrSelf}`;
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    // send the request
    return request(url, options);
}

class UtilService {
    constructor() {
        this.isPortal = false;
        // private surveyItemInfo: any;
        // store all the svg for icon component
        this.svgCache = {};
    }
    /**
     * get Service
     * @returns
     */
    static getService() {
        if (!this.service) {
            this.service = new UtilService();
        }
        return this.service;
    }
    /**
     * get portalInfo
     */
    getPortalInfo() {
        if (this.portalInfo && this.portalInfo.user) {
            return Promise.resolve(this.portalInfo);
        }
        return getPortal(null, this.getBaseRequestOptions())
            .then((res) => {
            if (!res.error) {
                this.portalInfo = res;
                this.isPortal = res.isPortal;
                return res;
            }
            else {
                throw new Error(JSON.stringify(res));
            }
        });
    }
    getUser() {
        var _a;
        return ((_a = this.portalInfo) === null || _a === void 0 ? void 0 : _a.user) || {};
    }
    // set dir
    setDir() {
        document.getElementsByTagName('html')[0].dir = ['ar', 'he'].indexOf(translate_service.PropsService.locale) !== -1 ? 'rtl' : 'ltr';
    }
    /**
     *
     * @param surveyItemId
     * @returns
     */
    getSurveyItemInfo(surveyItemId) {
        return getItem(surveyItemId, this.getBaseRequestOptions())
            .then((info) => {
            // this.surveyItemInfo = info;
            return info;
        });
    }
    /**
     * getBaseRequestOptions
     * @returns
     */
    getBaseRequestOptions() {
        return {
            authentication: translate_service.PropsService.token,
            portal: `${translate_service.PropsService.portalUrl}/sharing/rest`
        };
    }
    /**
     * supportFeatureReport
     * @returns
     */
    supportFeatureReport() {
        return (!this.isPortal || (this.isPortal && this.compareVersion(this.portalInfo.currentVersion, this.getRestApiVersion('10.5.0')) >= 0));
    }
    /**
     * format fieldtype
     * @param fieldType
     * @param val
     * @returns
     */
    formatFieldVal(field, val) {
        var _a, _b;
        if (!val) {
            return val;
        }
        const fieldType = field.type;
        const codedValues = (_a = field.domain) === null || _a === void 0 ? void 0 : _a.codedValues;
        // date field
        if (fieldType === 'esriFieldTypeDate') {
            val = this.formatDateTime(val);
        }
        else if (codedValues) {
            // has coded value
            val = ((_b = codedValues.find((codeVal) => {
                return codeVal.code === val;
            })) === null || _b === void 0 ? void 0 : _b.name) || val;
        }
        else if (this.isNumberField(field)) {
            val = this.formatNumber(val);
        }
        return val;
    }
    /**
     * is number field type
     * @param field
     * @returns
     */
    isNumberField(field) {
        if (!field) {
            return false;
        }
        const fieldType = field.type;
        return 'esriFieldTypeSingle,esriFieldTypeDouble,esriFieldTypeInteger,esriFieldTypeSmallInteger'.split(',').includes(fieldType);
    }
    /**
     * format number
     * @param num
     */
    formatNumber(num) {
        return new Intl.NumberFormat(translate_service.PropsService.locale || 'default').format(num);
    }
    /**
     * format date/time/datetime
     * @param date
     * @param type
     * @param options
     */
    formatDateTime(date, type) {
        type = type || 'date';
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const parms = {
            date: {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            },
            time: {
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            },
            datetime: {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            }
        };
        if (!date) {
            return '';
        }
        return new Intl.DateTimeFormat(translate_service.PropsService.locale || 'default', parms[type]).format(date);
    }
    /**
     * But need to check the new percentage pipe support to show the value like 99.999999999%
     * @param percent
     * @param returnNumber
     */
    getPercentage(job, percent, returnNumber) {
        let numberVal = 0;
        if ((!job || !job.jobStatusInfo) && !percent) {
            return '';
        }
        const percentage = percent ? percent : Number(job.jobStatusInfo.progress + '' || '0');
        let decimal = 1;
        if (Math.round(percentage * 100) === 100 && percentage !== 1) {
            const decimalStr = (percentage + '').substr(3);
            let index = decimalStr.split('').findIndex((str) => {
                return parseInt(str, 10) < 9;
            });
            // if the last number is still 9, use str length
            if (index === -1) {
                index = decimalStr.split('').length - 1;
            }
            decimal = index + 1;
        }
        numberVal = Math.round(percentage * Math.pow(10, decimal + 2)) / Math.pow(10, decimal);
        if (returnNumber) {
            return numberVal;
        }
        return new Intl.NumberFormat(translate_service.PropsService.locale, { style: 'percent' }).format(numberVal / 100); // percentage  + '%';  
    }
    /**
     * getFileSize
     * @param bytes
     * @returns
     */
    getFileSize(bytes) {
        let result = 0;
        let type = 'KB';
        // if (bytes && bytes > (1024 * 1024 * 1024)) {
        //   result = (bytes / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
        // } else
        if (bytes && bytes > (1024 * 1024)) {
            result = Number((bytes / (1024 * 1024)).toFixed(1)); // + 'MB';
            type = 'MB';
        }
        else {
            result = Number((bytes / (1024)).toFixed(1)); // + 'KB';
            type = 'KB';
        }
        //  else {
        //   result = (bytes).toFixed(1) + 'B';
        // }
        return result + type;
    }
    // remove placeholders in output file name expression
    extractPlaceholders(exp) {
        exp = exp || '';
        const matches = exp.match(/\$[^{$]*?{[^}]*?.*?}/g), returnedMatches = [];
        if (matches) {
            matches.forEach((match) => {
                // if not duplicate, push it
                if (returnedMatches.indexOf(match) === -1) {
                    returnedMatches.push(match);
                }
            });
        }
        return returnedMatches;
    }
    /**
     * parse markdown,
     * eg: convert 'Failed to parse `${tag}` and `${tag}`' to 'Failed to parse <i>${tag}</i> and <i>${tag}</i>'
     */
    parseMarkdown(html) {
        const arr = (html + '').split('`');
        let result = '';
        arr.forEach((seg, index) => {
            if (index % 2 === 0) {
                result += seg;
            }
            else {
                result += '<i>' + seg + '</i>';
            }
        });
        return result;
    }
    /**
     * check if the currrent user has the privilige: premium:user:featurereport
     */
    isUserCanPrintFeatureReport() {
        const privileges = this.getUser().privileges || [];
        const checkValues = ['premium:user:featurereport'];
        return privileges.filter((elem) => {
            return checkValues.indexOf(elem) > -1;
        }).length === checkValues.length;
    }
    /**
     * set the svg cache
     * @param obj
     */
    setSvgCache(key, svgStr) {
        if (!key || !svgStr) {
            return;
        }
        this.svgCache[key] = svgStr;
    }
    /**
    * get svg cache
    * @param key
    * @returns
    */
    getSvgCache(key) {
        if (!key) {
            return this.svgCache;
        }
        if (!this.svgCache) {
            return null;
        }
        return this.svgCache[key];
    }
    /**
    * compare version
    * -1: a < b
    * 0: a = b
    * 1: a > b
    * @param a
    * @param b
    */
    compareVersion(a, b) {
        /**
         * convert version to string
         * the versoin may be number in very old survey
         */
        a = '' + a;
        b = '' + b;
        if (!a || !b) {
            throw new Error('version is not existed');
        }
        let i, diff;
        const regExStrip0 = /(\.0+)+$/;
        const segmentsA = a.replace(regExStrip0, '').split('.');
        const segmentsB = b.replace(regExStrip0, '').split('.');
        const l = Math.min(segmentsA.length, segmentsB.length);
        for (i = 0; i < l; i++) {
            diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
            if (diff) {
                return diff;
            }
        }
        return segmentsA.length - segmentsB.length;
    }
    /**
     * get rest api version by portalVersion
     * portal    rest version
     * 10.7   >> 6.4
     * 10.6   >> 5.3
     * 10.5.2 >> 5.2
     * 10.5.1 >> 5.1
     * 10.5.0 >> 4.4
     * 10.4.0 >> 3.10
     */
    getRestApiVersion(portalVersion) {
        if (!portalVersion) {
            return '';
        }
        if (portalVersion === '10.9.1') {
            return '9.2';
        }
        if (portalVersion === '10.9.0') {
            return '8.4';
        }
        if (portalVersion === '10.8.1') {
            return '8.2';
        }
        if (portalVersion === '10.8.0') {
            return '7.3';
        }
        if (portalVersion === '10.7.2') {
            return '7.2';
        }
        if (portalVersion === '10.7.1') {
            return '7.1';
        }
        /**
         * portal mistype the version of 10.7.0 to 7.1
         * it will be difficult to distingish 10.7.0 and 10.7.1
         */
        if (portalVersion === '10.7.0') {
            return '7.1'; // '6.4';
        }
        if (portalVersion === '10.6.1') {
            return '6.1';
        }
        if (portalVersion === '10.6.0') {
            return '5.3';
        }
        if (portalVersion === '10.5.2') {
            return '5.2';
        }
        if (portalVersion === '10.5.1') {
            return '5.1';
        }
        if (portalVersion === '10.5.0') {
            return '4.4';
        }
        if (portalVersion === '10.4.0') {
            return '3.10';
        }
        return '';
    }
}

exports.ArcGISAuthError = ArcGISAuthError;
exports.ArcGISRequestError = ArcGISRequestError;
exports.NODEJS_DEFAULT_REFERER_HEADER = NODEJS_DEFAULT_REFERER_HEADER;
exports.UtilService = UtilService;
exports.cleanUrl = cleanUrl;
exports.encodeQueryString = encodeQueryString;
exports.getItem = getItem;
exports.getPortalUrl = getPortalUrl;
exports.getRelatedItems = getRelatedItems;
exports.request = request;

//# sourceMappingURL=util.service-a11f2d49.js.map