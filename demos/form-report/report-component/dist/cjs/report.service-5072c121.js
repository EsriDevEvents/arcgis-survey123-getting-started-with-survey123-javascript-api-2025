'use strict';

const translate_service = require('./translate.service-6de902ba.js');
const state_service = require('./state.service-2ec8cd7e.js');
const util_service = require('./util.service-a11f2d49.js');

/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Helper for methods with lots of first order request options to pass through as request parameters.
 */
function appendCustomParams(customOptions, keys, baseOptions) {
    const requestOptionsKeys = [
        "params",
        "httpMethod",
        "rawResponse",
        "authentication",
        "portal",
        "fetch",
        "maxUrlLength",
        "headers"
    ];
    const options = Object.assign(Object.assign({ params: {} }, baseOptions), customOptions);
    // merge all keys in customOptions into options.params
    options.params = keys.reduce((value, key) => {
        if (customOptions[key] ||
            typeof customOptions[key] === "boolean" ||
            (typeof customOptions[key] === "number" &&
                customOptions[key] === 0)) {
            value[key] = customOptions[key];
        }
        return value;
    }, options.params);
    // now remove all properties in options that don't exist in IRequestOptions
    return requestOptionsKeys.reduce((value, key) => {
        if (options[key]) {
            value[key] = options[key];
        }
        return value;
    }, {});
}

/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Layer (Feature Service) request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/layer-feature-service-.htm) for more information.
 *
 * ```js
 * import { getLayer } from '@esri/arcgis-rest-feature-service';
 * //
 * getLayer({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0"
 * })
 *   .then(response) // { name: "311", id: 0, ... }
 * ```
 *
 * @param options - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
function getLayer(options) {
    return util_service.request(util_service.cleanUrl(options.url), options);
}

/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Query a feature service. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 *
 * ```js
 * import { queryFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * queryFeatures({
 *   url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
 *   where: "STATE_NAME = 'Alaska'"
 * })
 *   .then(result)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the query response.
 */
function queryFeatures(requestOptions) {
    const queryOptions = appendCustomParams(requestOptions, [
        "where",
        "objectIds",
        "relationParam",
        "time",
        "distance",
        "units",
        "outFields",
        "geometry",
        "geometryType",
        "spatialRel",
        "returnGeometry",
        "maxAllowableOffset",
        "geometryPrecision",
        "inSR",
        "outSR",
        "gdbVersion",
        "returnDistinctValues",
        "returnIdsOnly",
        "returnCountOnly",
        "returnExtentOnly",
        "orderByFields",
        "groupByFieldsForStatistics",
        "outStatistics",
        "returnZ",
        "returnM",
        "multipatchOption",
        "resultOffset",
        "resultRecordCount",
        "quantizationParameters",
        "returnCentroid",
        "resultType",
        "historicMoment",
        "returnTrueCurves",
        "sqlFormat",
        "returnExceededLimitFeatures",
        "f"
    ], {
        httpMethod: "GET",
        params: Object.assign({ 
            // set default query parameters
            where: "1=1", outFields: "*" }, requestOptions.params)
    });
    return util_service.request(`${util_service.cleanUrl(requestOptions.url)}/query`, queryOptions);
}

exports.EsriJobStatusType = void 0;
(function (EsriJobStatusType) {
    EsriJobStatusType["submitted"] = "esriJobSubmitted";
    EsriJobStatusType["executing"] = "esriJobExecuting";
    EsriJobStatusType["succeeded"] = "esriJobSucceeded";
    EsriJobStatusType["partialSucceeded"] = "esriJobPartialSucceeded";
    EsriJobStatusType["failed"] = "esriJobFailed";
    EsriJobStatusType["cancelled"] = "esriJobStatusCancelled";
})(exports.EsriJobStatusType || (exports.EsriJobStatusType = {}));
class ReportService {
    constructor() {
        this.checkingList = []; // the job id list which is not complete, should to be checked
        this.isRequestingTasks = false;
        this.jobList = {};
        this.sessionJobs = []; // seems this is not needed.
        this.templateItemsCache = [];
        this.stateService = state_service.StateService.getService();
        // the parameters cache that will be sent to generate report
        this.paramCache = {};
    }
    /**
     * get Service
     * @returns
     */
    static getService() {
        if (!this.service) {
            this.service = new ReportService();
        }
        return this.service;
    }
    /**
     * get the report parameter cache
     * @param key
     */
    getParamCache(key) {
        if (!key) {
            return this.paramCache;
        }
        return this.paramCache ? this.paramCache[key] : null;
    }
    /**
     * set the report parameter cache
     * @param obj
     */
    setParamCache(obj) {
        if (!obj) {
            return;
        }
        this.paramCache = Object.assign(this.paramCache || {}, obj);
    }
    initParamCache() {
    }
    /**
     * get the report parameter cache
     * @param key
     */
    getHelperObj(key) {
        if (!key) {
            return this.helperObj;
        }
        if (!this.helperObj) {
            return null;
        }
        return this.helperObj[key];
    }
    /**
     * set the report parameter cache
     * @param obj
     */
    setHelperObj(obj) {
        if (!obj) {
            return;
        }
        this.helperObj = Object.assign(this.helperObj || {}, obj);
    }
    /**
     * getReportTemplates
     * @param surveyItemId
     */
    getReportTemplates(surveyItemId, options) {
        options = options || {};
        let hasTemplateIds = false;
        if ('templateIds' in options && options.templateIds !== undefined) {
            hasTemplateIds = true;
        }
        const templateIds = (options === null || options === void 0 ? void 0 : options.templateIds) || '';
        const cache = this.templateItemsCache || [];
        // TBD：
        // if (!surveyItemId) {
        //   return Promise.resolve([]);
        // }  
        const utilService = util_service.UtilService.getService();
        // check if the portal support survey2data relation
        return Promise.resolve(true)
            .then(() => {
            const support = utilService.supportFeatureReport();
            if (!support) {
                throw new Error('This portal does not support custom report.');
            }
            return true;
        })
            .then(() => {
            if (hasTemplateIds) {
                // get all the template id item info
                const requests = [];
                templateIds.split(',').forEach((id) => {
                    const existingItem = cache.find((item) => {
                        return item.id === id;
                    });
                    let req = null;
                    if (existingItem) {
                        req = Promise.resolve(existingItem);
                    }
                    else {
                        req = util_service.getItem(id, utilService.getBaseRequestOptions()).then((itemJson) => {
                            return itemJson;
                        }).catch(() => {
                            console.log('Cannot get item info for the report template with id' + id);
                            return {};
                        });
                    }
                    requests.push(req);
                });
                return Promise.all(requests).then((resp) => {
                    return {
                        relatedItems: resp
                    };
                });
            }
            else if (surveyItemId && !this.getHelperObj('surveyIsInvalid')) {
                const params = Object.assign({ id: surveyItemId, relationshipType: 'Survey2Data' }, utilService.getBaseRequestOptions());
                return util_service.getRelatedItems(params);
            }
            else {
                return {
                    relatedItems: []
                };
            }
        })
            .then((res) => {
            if (!res || res.error) {
                throw new Error('Failed to get related templates');
            }
            this.templateItemsCache = res.relatedItems || [];
            const config = {
                typeKeyword: 'Print Template',
                type: 'Microsoft Word'
            };
            const results = res.relatedItems.filter((item) => {
                // only type and typekeywords is match
                return item.type === config.type && item.typeKeywords.indexOf(config.typeKeyword) !== -1;
            });
            return results || [];
        })
            .then((items) => {
            const printTemplates = [];
            items.forEach((item) => {
                const templateUrl = this.getCustomPrintingFileUrl(item.id);
                const template = {
                    id: item.id,
                    name: item.name,
                    title: item.title,
                    summary: item.snippet,
                    modified: new Date(item.modified),
                    url: templateUrl,
                    typeKeywords: item.typeKeywords,
                    type: item.type
                    // isInnerWorking: false
                };
                printTemplates.push(template);
            });
            if (hasTemplateIds) {
                printTemplates.sort((a, b) => {
                    if (a.modified < b.modified) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                });
            }
            return printTemplates;
        });
    }
    /**
     * get layer json
     * @param layerUrl
     */
    getLayerJson(layerUrl) {
        layerUrl = layerUrl || translate_service.PropsService.featureLayerUrl;
        // read from cache
        const cacheLayerJsons = this.getHelperObj('layerJsons') || [];
        const cacheLayer = cacheLayerJsons.find((layerObj) => {
            return layerObj.url === layerUrl && layerObj.json;
        });
        if (cacheLayer) {
            return Promise.resolve(cacheLayer.json);
        }
        return getLayer({
            url: translate_service.PropsService.featureLayerUrl,
            authentication: translate_service.PropsService.token
        }).then((layerJson) => {
            cacheLayerJsons.push({
                url: layerUrl,
                json: layerJson
            });
            this.setHelperObj({ layerJsons: cacheLayerJsons });
            return layerJson;
        });
    }
    /**
     * get feature count
     * @returns
     */
    getFeatureCount() {
        const queryParms = JSON.parse(translate_service.PropsService.queryParameters);
        delete queryParms.orderByFields; // because the feature report's orderByFields is not the same with the rest api's
        /**
         * query features
         */
        const params = Object.assign({
            url: translate_service.PropsService.featureLayerUrl,
            authentication: translate_service.PropsService.token,
            returnCountOnly: true
        }, queryParms);
        const where = 'where' in params ? params.where : null;
        const objectIds = 'objectIds' in params ? params.objectIds : null;
        const additionalParams = {};
        if (where !== null) {
            additionalParams.where = where;
        }
        if (objectIds != null) {
            additionalParams.objectIds = objectIds;
        }
        if (!objectIds && !where) {
            additionalParams.where = '1<>1'; // if no objectIds and where, set where as '1<>1' to avoid requesting error
            delete additionalParams.objectIds;
        }
        params.params = additionalParams;
        delete params.where;
        delete params.objectIds;
        return queryFeatures(params)
            .then((result) => {
            let count = result.count;
            if (queryParms.resultRecordCount < count) {
                count = queryParms.resultRecordCount;
            }
            this.setHelperObj({
                featureCount: count
            });
            this.stateService.notifyDataChanged('feature-count-updated');
            return;
        }).catch((e) => {
            this.manageError(e, 'featureLayerUrl');
        });
    }
    /**
     * get custom printing file url (e.g. word)
     * @param itemId: String
     * @return string
     */
    getCustomPrintingFileUrl(itemId) {
        return `${translate_service.PropsService.portalUrl}/sharing/rest/content/items/${itemId}/data?token=${translate_service.PropsService.token}`;
    }
    /**
     * estimate report costs
     * @param options
     */
    estimateReportCosts(options) {
        const defautlParams = {
            portalUrl: translate_service.PropsService.portalUrl,
            token: translate_service.PropsService.token,
            f: 'json'
        };
        const params = Object.assign(defautlParams, options || {});
        // if (this.isInternalTest()) {
        //   params['isInternalTest'] = true;
        // }
        const body = new URLSearchParams();
        Object.keys(params).forEach((k) => {
            const value = params[k];
            body.append(k, value);
        });
        const url = `${translate_service.PropsService.apiUrl}/estimateCredits`;
        return fetch(url, {
            method: 'POST',
            headers: this._generateRequestHeaders(),
            body
        })
            .then((res) => {
            return res.json();
        });
    }
    /**
     * print report
     */
    executeReport(options) {
        const locale = translate_service.PropsService.locale || 'en';
        const defautlParams = {
            // outputFormat: 'docx',
            portalUrl: translate_service.PropsService.portalUrl,
            utcOffset: '||' + this._getLocalTimezoneOffset(),
            locale: '||' + locale,
            token: translate_service.PropsService.token,
            f: 'json'
        };
        const params = Object.assign(defautlParams, options || {});
        if ((!params.uploadInfo || params.uploadInfo === 'null') && Object.prototype.hasOwnProperty.call(params, 'uploadInfo')) {
            delete params.uploadInfo;
        }
        // if (this.isInternalTest()) {
        //   params['isInternalTest'] = true;
        // }
        const body = new URLSearchParams();
        Object.keys(params).forEach((k) => {
            const value = params[k];
            body.append(k, value);
        });
        const url = `${translate_service.PropsService.apiUrl}/createReport/submitJob`;
        return fetch(url, {
            method: 'POST',
            headers: this._generateRequestHeaders(),
            body
        })
            .then((res) => {
            return res.json();
        });
    }
    /**
   * createSampleReport
   * @param options
   */
    createSampleReport(options) {
        const locale = translate_service.PropsService.locale || 'en';
        const defautlParams = {
            // outputFormat: 'docx',
            portalUrl: translate_service.PropsService.portalUrl,
            utcOffset: '||' + this._getLocalTimezoneOffset(),
            locale: '||' + locale,
            token: translate_service.PropsService.token,
            f: 'json'
        };
        const params = Object.assign(defautlParams, options || {});
        const body = new URLSearchParams();
        Object.keys(params).forEach((k) => {
            const value = params[k];
            body.append(k, value);
        });
        // if (this.isInternalTest()) {
        //   params['isInternalTest'] = true;
        // }
        const url = `${translate_service.PropsService.apiUrl}/createSampleReport/submitJob`;
        return fetch(url, {
            method: 'POST',
            headers: this._generateRequestHeaders(),
            body
        })
            .then((res) => {
            return res.json();
        });
    }
    /**
   * remove job
   * @param jobId
   * @returns
   */
    removeJob(jobId) {
        const params = {
            portalUrl: translate_service.PropsService.portalUrl,
            token: translate_service.PropsService.token,
            f: 'json'
        };
        // if (this.isInternalTest()) {
        //   params['isInternalTest'] = true;
        // }
        const body = new URLSearchParams();
        Object.keys(params).forEach((k) => {
            const value = params[k];
            body.append(k, value);
        });
        const url = `${translate_service.PropsService.apiUrl}/jobs/${jobId}/remove`;
        return fetch(url, {
            method: 'POST',
            headers: this._generateRequestHeaders(),
            body
        })
            .then((res) => {
            return res.json();
        });
    }
    cancelJob(jobId) {
        const params = {
            portalUrl: translate_service.PropsService.portalUrl,
            token: translate_service.PropsService.token,
            f: 'json'
        };
        // if (this.isInternalTest()) {
        //   params['isInternalTest'] = true;
        // }
        const body = new URLSearchParams();
        Object.keys(params).forEach((k) => {
            const value = params[k];
            body.append(k, value);
        });
        const url = `${translate_service.PropsService.apiUrl}/jobs/${jobId}/cancel`;
        return fetch(url, {
            method: 'POST',
            headers: this._generateRequestHeaders(),
            body
        })
            .then((res) => {
            return res.json();
        });
    }
    /**
     * Deprecated, remove job from the job list
     * @param job
     * @returns
     */
    removeJobFromList(job) {
        if (!job) {
            return;
        }
        // const jobId = job.jobId;
        // // if the job is the session job, stop the check status process
        // const isSessionJob = this.sessionJobs.indexOf(job.jobId) >= 0;
        // if (isSessionJob) {
        //   // delete from the sessionJobs
        //   this.sessionJobs.splice(this.sessionJobs.indexOf(jobId), 1);
        //   // delete the timmer
        //   if (this.queryJobStatusTimmerList[jobId]) {
        //     delete this.queryJobStatusTimmerList[jobId];
        //   }
        // }
        // remove the job from the checking
        // this.checkingList.splice(this.checkingList.indexOf(jobId), 1);
        // setTimeout(() => { this.checkingListChange = false; }, 1500);
        // remove the job from the jobs list
        if (this.jobList && this.jobList.jobs) {
            const targetIdx = this.jobList.jobs.findIndex((jobItem) => {
                return jobItem.jobId === job.jobId;
            });
            this.jobList.jobs.splice(targetIdx, 1);
            this.jobList.jobs = [].concat(this.jobList.jobs);
        }
        // todo: query job list again (load the 11th job)  
        // this.queryJobs(true);
    }
    /**
     * query jobs
     * @param forceQuery
     * @returns
     */
    queryJobs(forceQuery) {
        if (this.checkingList.length < 1 && !forceQuery) {
            return Promise.resolve(null);
        }
        // if (!this.surveyId) {
        //   setTimeout(() => { this.queryJobs(forceQuery); }, 1000);
        //   return Promise.resolve(null);
        // }
        // if (this.state !== 'query' && !forceQuery) {
        //   if (this.queryJobTimmer) {
        //     clearTimeout(this.queryJobTimmer);
        //   }
        //   this.queryJobTimmer = setTimeout(() => { this.queryJobs() }, 10000);
        //   return Promise.resolve(null);
        // }
        if (this.isRequestingTasks) {
            return Promise.resolve(null);
        }
        this.isRequestingTasks = true;
        return this.sendQueryJobsRequest(translate_service.PropsService.surveyItemId)
            .then((res) => {
            if (res.error) {
                throw res.error;
            }
            return res;
        })
            .then((res) => {
            this.isRequestingTasks = false;
            // this.jobList = res; // todo: only add the new job
            if (!this.jobList.jobs) {
                this.jobList.jobs = [];
            }
            if (res && res.jobs && res.jobs.length) {
                // add the new job to the job list
                res.jobs.forEach((jobObj, idx) => {
                    const curId = jobObj.jobId;
                    // let isOldJob = this.jobList.jobs.find((item) => {
                    //   return item.jobId === curId;
                    // });
                    // if (!isOldJob) {
                    //   newJobs.push(jobObj);
                    // }
                    // set the old job to the new job to avoid sending the checkJobStatus request,because the new job contains the detail info which is getted from checkjobstatus
                    const oldJob = this.jobList.jobs.filter((item) => {
                        return item.jobId === curId;
                    });
                    if (oldJob && oldJob.length) {
                        res.jobs[idx] = oldJob[0];
                    }
                    // if the job contains runtime data(related to cancel job/ remove job status), keept it
                    if (oldJob && oldJob._tempRuntime) {
                        res.jobs[idx]._tempRuntime = Object.assign(oldJob._tempRuntime, res.jobs[idx]._tempRuntime || {});
                    }
                });
                this.jobList.jobs = res.jobs; // newJobs.concat(this.jobList.jobs);
            }
            else if (res && res.error) {
                const errorMsg = 'Oops! An error occurred loading the job list';
                console.log(res.error && res.error.message ? res.error.message : errorMsg);
                return false;
            }
            // this.checkJobListDetails();
            if (this.queryJobTimmer) {
                clearTimeout(this.queryJobTimmer);
            }
            this.queryJobTimmer = setTimeout(() => { this.queryJobs(); }, 10000);
            return this.jobList;
        }).catch(() => {
            this.isRequestingTasks = false;
            console.log('query jobs failed.');
            if (this.queryJobTimmer) {
                clearTimeout(this.queryJobTimmer);
            }
            this.queryJobTimmer = setTimeout(() => { this.queryJobs(); }, 10000);
            throw new Error();
        });
    }
    /**
     * check all the jobs, if any job is failed, and it has no details, call the status api to get the details
     */
    checkJobListDetails() {
        const jobs = this.jobList.jobs;
        if (!jobs || !jobs.length) {
            return;
        }
        jobs.forEach((job, idx) => {
            // request job status for succeed jobs to show the download buttons
            if ((job.jobStatus === 'esriJobSucceeded' || job.jobStatus === 'esriJobPartialSucceeded') && (!job.resultInfo || !job.resultInfo.resultFiles)) {
                // if the job is succeded, get the download url , and check if it contains error records
                this.checkJobStatus(job.jobId).then((res) => {
                    this.jobList.jobs[idx] = Object.assign({}, this.updateJobDetail(res));
                    this.stateService.notifyDataChanged('job-updated', { value: this.jobList.jobs[idx] });
                    this.stateService.notifyDataChanged('job-complete', { value: this.jobList.jobs[idx] });
                });
            }
            else if (job.jobStatus === exports.EsriJobStatusType.executing || job.jobStatus === exports.EsriJobStatusType.submitted) {
                /**
                 * if the job is executing, check job status until it succeeded or failed, only one exception:
                 * if ther job is the session job, do not checkJobStatus again,
                 * because after executeCustomReport request, we has called checkJobStatus request mannually
                 */
                const isSessionJob = this.sessionJobs.indexOf(job.jobId) >= 0;
                if (!isSessionJob) {
                    this.checkJobStatus(job.jobId);
                }
            }
            else {
                this.jobList.jobs[idx] = Object.assign({}, this.updateJobDetail(this.jobList.jobs[idx]));
                this.stateService.notifyDataChanged('job-updated', { value: this.jobList.jobs[idx] });
                if (job.jobStatus === exports.EsriJobStatusType.failed) {
                    this.stateService.notifyDataChanged('job-complete', { value: job });
                }
            }
            // if (!job.inputInfo) {
            //   // if (!job.inputs && (job.jobStatus === 'esriJobFailed')) {
            //   // if the job is failed, and has no detail,get the details
            //   if (job.jobStatus === 'esriJobFailed') {
            //     this.survey123ApiService.checkJobStatus(job.jobId).then((res) => {
            //       let showDetail = job.showDetail;
            //       job = res;
            //       job.showDetail = showDetail;
            //       this.jobList.jobs[idx] = job;
            //     });
            //   } else if (job.jobStatus === 'esriJobSucceeded') {
            //     // if the job is succeded, get the download url , and check if it contains error records
            //     this.survey123ApiService.checkJobStatus(job.jobId).then((res) => {
            //       this.jobList.jobs[idx] = this.updateJobDetail(res);
            //     });
            //   }
            // }
        });
    }
    /**
     * check job detail, if the job is failed, and it has no details, call the status api to get the details
     */
    checkJobDetails(job) {
        if (!job || job.hasDetail) {
            return Promise.resolve(job);
        }
        if ([exports.EsriJobStatusType.succeeded, exports.EsriJobStatusType.partialSucceeded, exports.EsriJobStatusType.failed, exports.EsriJobStatusType.cancelled].indexOf(job.jobStatus) >= 0) {
            this.stateService.notifyDataChanged('job-complete', { value: job });
        }
        // request job status for succeed jobs to show the download buttons
        if ((job.jobStatus === exports.EsriJobStatusType.succeeded || job.jobStatus === exports.EsriJobStatusType.partialSucceeded) && (!job.resultInfo || !job.resultInfo.resultFiles)) {
            // if the job is succeded, get the download url , and check if it contains error records
            return this.checkJobStatus(job.jobId).then((res) => {
                job = this.updateJobDetail(res);
                this.stateService.notifyDataChanged('job-updated', { value: job });
                this.stateService.notifyDataChanged('job-complete', { value: job });
                // job = {...this.updateJobDetail(res)};
                return job;
            });
        }
        else if (job.jobStatus === exports.EsriJobStatusType.failed && (!job.resultInfo || !job.resultInfo.details)) {
            // failed task
            return this.checkJobStatus(job.jobId).then((res) => {
                job = this.updateJobDetail(res);
                this.stateService.notifyDataChanged('job-updated', { value: job });
                // job = {...this.updateJobDetail(res)};
                return job;
            });
        }
        else if (job.jobStatus === exports.EsriJobStatusType.executing || job.jobStatus === exports.EsriJobStatusType.submitted) {
            this.stateService.notifyDataChanged('job-updated', { value: job });
            /**
             * if the job is executing, check job status until it succeeded or failed, only one exception:
             * if ther job is the session job, do not checkJobStatus again,
             * because after executeCustomReport request, we has called checkJobStatus request mannually
             */
            const isSessionJob = this.sessionJobs.indexOf(job.jobId) >= 0;
            if (!isSessionJob) {
                this.checkJobStatus(job.jobId).then((resp) => {
                    return this.checkJobDetails(resp);
                });
            }
            return Promise.resolve(job);
        }
        else {
            // job = this.updateJobDetail(job);
            job = Object.assign({}, this.updateJobDetail(job));
            this.stateService.notifyDataChanged('job-updated', { value: job });
        }
        return Promise.resolve(job);
    }
    /**
     * query job list
     */
    sendQueryJobsRequest(surveyItemId) {
        const params = {
            // surveyItemId: surveyItemId,
            portalUrl: translate_service.PropsService.portalUrl,
            f: 'json',
            token: translate_service.PropsService.token
        };
        if (surveyItemId) {
            params.surveyItemId = surveyItemId;
        }
        const body = new URLSearchParams();
        Object.keys(params).forEach((k) => {
            const value = params[k];
            body.append(k, value);
        });
        // if (this.isInternalTest()) {
        //   params['isInternalTest'] = true;
        // }
        const url = translate_service.PropsService.apiUrl + '/queryJobs';
        return fetch(url, {
            method: 'POST',
            headers: this._generateRequestHeaders(),
            body
        })
            .then((res) => {
            return res.json();
        });
    }
    /**
     * checkJobStatus
     */
    checkJobStatus(jobId) {
        const params = {
            f: 'json',
            portalUrl: translate_service.PropsService.portalUrl,
            token: translate_service.PropsService.token
        };
        const body = new URLSearchParams();
        Object.keys(params).forEach((k) => {
            const value = params[k];
            body.append(k, value);
        });
        // if (this.isInternalTest()) {
        //   params['isInternalTest'] = true;
        // }
        const url = `${translate_service.PropsService.apiUrl}/jobs/${jobId}/status`;
        return fetch(url, {
            method: 'POST',
            headers: this._generateRequestHeaders(),
            body
        })
            .then((res) => {
            return res.json();
        });
    }
    downloadReport(job) {
        let format = 'docx';
        if (job.inputInfo && job.inputInfo.parameters) {
            format = job.inputInfo.parameters.outputFormat || 'docx';
        }
        this.downloadFile(job, format === 'pdf');
    }
    /**
     * download file
     * @param jobObj
     * @param openInNewtab
     * @returns
     */
    downloadFile(jobObj, openInNewtab) {
        if (!jobObj || !jobObj.resultInfo || !jobObj.resultInfo.resultFiles) {
            return;
        }
        const resultFiles = jobObj.resultInfo.resultFiles;
        resultFiles.forEach((item, idx) => {
            let downloadUrl = item.url;
            if (!downloadUrl) {
                const itemId = item.id || '';
                downloadUrl = `${translate_service.PropsService.portalUrl}/sharing/rest/content/items/${itemId}/data?`;
                downloadUrl = downloadUrl + 'token=' + translate_service.PropsService.token;
            }
            if (idx > 0) {
                setTimeout(() => {
                    this.startDownload(downloadUrl, openInNewtab);
                }, 3000);
            }
            else {
                this.startDownload(downloadUrl, openInNewtab);
            }
        });
    }
    startDownload(url, openInNewtab) {
        const a = document.createElement('a');
        a.style.display = 'block';
        document.body.appendChild(a);
        a.setAttribute('href', url);
        if (openInNewtab) {
            a.setAttribute('target', '_blank');
        }
        a.click();
        a.remove();
    }
    getErrorStr(err) {
        let detail = '';
        if (err) {
            if (typeof err === 'string') {
                detail = err;
            }
            else if (err.error && typeof err.error === 'string') {
                detail = err.error;
            }
            else if (err.error && err.error.message) {
                detail = err.error;
            }
            else if (!detail && err.status && err.statusText) {
                detail = err.status + ' ' + err.statusText;
            }
            else if (!detail && err.status && !err.statusText) {
                detail = 'Error code: ' + err.status;
            }
        }
        return detail;
    }
    /**
    * show error
    * @param errorStr
    */
    showError(err, options) {
        let html = '';
        options = options || {};
        let detail = options.detail || '';
        if (options.errorStr) {
            html = options.errorStr;
        }
        else {
            /**
             * 40x or 50x error(like 404 or 500 error)
             * the strcuture likes:
             * {
             *   error: {
             *    message: ‘Failed to fetch’,
             *    stack: ‘’
             *  }
             * }
             */
            if (err.error && err.error.message) {
                html = err.error.message;
            }
        }
        if (!options.detail && options.showDetails) {
            // if (err.error && err.error instanceof ArcGISRequestError &&  err.error.message) {
            if (err.error.response && err.error.response.error && err.error.response.error.detail) {
                detail = err.error.response.error.detail;
            }
            // }
            if (!detail && options.errorStr && err.error && err.error.message) {
                detail = err.error.message;
            }
        }
        if (!html && err.message) {
            html = err.message;
        }
        this.stateService.notifyDataChanged('show-error', {
            value: {
                alertType: options.alertType || 'danger',
                html: html,
                detail: detail
            }
        });
    }
    /**
     * manage the error from server side
     * @param e
     * @param type
     */
    manageError(e, type) {
        var _a, _b, _c, _d, _e;
        // code: 400, item not exist
        // code 403, has no priviliage to access the item
        if (((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.code) === 400 || e.code === 'CONT_0001'
            || ((_d = (_c = e.response) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.code) === 403 || e.code === 'GWM_0003') {
            const i18n = translate_service.TranslateService.getService().getTranslateSync() || {};
            const errMsg = (_e = i18n.customPrint) === null || _e === void 0 ? void 0 : _e.noItemErr;
            if (errMsg && type) {
                throw Error(errMsg.replace('${$notFoundItemID}', type + '=' + translate_service.PropsService[type]));
            }
        }
        throw e;
    }
    /**
     * update job detail
     * @param res
     * @returns
     */
    updateJobDetail(res) {
        const utilService = util_service.UtilService.getService();
        const job = res;
        // if (job.jobStatus === 'esriJobSucceeded' && job.resultInfo.failedObjectIds && job.resultInfo.failedObjectIds.length > 0) {
        //   job.hasWarnning = true;
        // }
        if (job && this.jobList.jobs && this.jobList.jobs.length) {
            const oldJob = this.jobList.jobs.find((oldJ) => {
                return oldJ.jobId === job.jobId;
            });
            // if the job contains runtime data(related to cancel job/ remove job status), keept it
            if (oldJob && oldJob._tempRuntime) {
                job._tempRuntime = Object.assign(oldJob._tempRuntime, job._tempRuntime || {});
            }
        }
        if (!res || !res.resultInfo) {
            return job;
        }
        // for succeceded job
        if (res.resultInfo.resultFiles && res.resultInfo.resultFiles.length) {
            let url = '';
            const resultFiles = res.resultInfo.resultFiles;
            // todo:check the result file source: res.inputInfo.parameters.uploadInfo? online: s3
            let isS3File = true;
            if (res.inputInfo && res.inputInfo.parameters && res.inputInfo.parameters.uploadInfo && res.inputInfo.parameters.uploadInfo.type === 'arcgis') {
                isS3File = false;
            }
            job.multipleFiles = resultFiles.length > 1 ? true : false;
            if (isS3File) {
                if (!isNaN(Number(job.completed))) {
                    if (!job.multipleFiles) {
                        url = resultFiles[0].url;
                    }
                    if (resultFiles[0].status === 'expired') {
                        job.urlExpired = true;
                    }
                    // const seconds = this.getReportMergeConfig('s3FileRetentionTime');
                    // if (new Date().getTime() - job.completed > seconds) {
                    //   job.urlExpired = true;
                    // }
                }
            }
            else {
                // get the url from online item
                resultFiles.forEach((item, idx) => {
                    const itemId = item.id || '';
                    let fileUrl = `${translate_service.PropsService.portalUrl}/sharing/rest/content/items/${itemId}/data?`;
                    fileUrl = fileUrl + 'token=' + translate_service.PropsService.token;
                    resultFiles[idx].url = fileUrl;
                    resultFiles[idx].size = utilService.getFileSize(item.size);
                });
                if (!job.multipleFiles) {
                    url = resultFiles[0].url;
                }
            }
            if (!job.multipleFiles) {
                job.url = url;
            }
        }
        // for failed jobs(or succeed with faild objectids), merge the same failed objectids
        if (job.resultInfo.details) {
            const details = job.resultInfo.details || [];
            const findMatchedInfo = (source, target) => {
                const status = source.status;
                const messages = source.messages;
                const success = source.success;
                const objectId = source.objectId;
                // tslint:disable-next-line:forin
                for (const i in target) {
                    const item = target[i];
                    if (status === item.status && success === item.success && JSON.stringify(messages || []) === JSON.stringify(item.messages || []) && item.objectIds.indexOf(objectId) < 0) {
                        return item;
                    }
                }
                return null;
            };
            if (details && details.length) {
                const failedInfo = [];
                details.forEach((detail) => {
                    const mathchedInfo = findMatchedInfo(detail, failedInfo);
                    if (!mathchedInfo) {
                        const newFailedOIDs = (detail.objectId + '').split(',').join(', ');
                        failedInfo.push({
                            status: detail.status,
                            messages: detail.messages,
                            success: detail.success,
                            objectIds: [newFailedOIDs]
                        });
                    }
                    else {
                        mathchedInfo.objectIds.push(detail.objectId);
                    }
                });
                failedInfo.forEach((info) => {
                    info.objectIds = info.objectIds.join(', ');
                });
                job.failedInfo = failedInfo;
            }
        }
        job.hasDetail = true;
        return job;
    }
    /**
     * _getLocalTimezoneOffset
     */
    _getLocalTimezoneOffset() {
        if (translate_service.PropsService.utcOffset) {
            return translate_service.PropsService.utcOffset;
        }
        const timezoneOffsetMin = (new Date()).getTimezoneOffset();
        let offsetHrs = Math.abs(timezoneOffsetMin / 60);
        let offsetMin = Math.abs(timezoneOffsetMin % 60);
        if (offsetHrs < 10) {
            offsetHrs = '0' + offsetHrs;
        }
        if (offsetMin < 10) {
            offsetMin = '0' + offsetMin;
        }
        // Add an opposite sign to the offset
        const direction = (timezoneOffsetMin <= 0) ? '+' : '-';
        const timezoneOffset = direction + offsetHrs + ':' + offsetMin;
        // "±hh:mm"
        return timezoneOffset;
    }
    /**
     * generate request headers
     * @returns
     */
    _generateRequestHeaders() {
        const headers = {
            'contentType': 'application/x-www-form-urlencoded'
        };
        if (translate_service.PropsService.requestSource === undefined) {
            headers['X-Esri-Request-Source'] = 'MapsSDKJS/WebComponent';
        }
        else if (!translate_service.PropsService.requestSource || (translate_service.PropsService.requestSource + '').toLowerCase() === 'none') ;
        else {
            headers['X-Esri-Request-Source'] = translate_service.PropsService.requestSource;
        }
        return headers;
    }
}

exports.ReportService = ReportService;
exports.queryFeatures = queryFeatures;

//# sourceMappingURL=report.service-5072c121.js.map