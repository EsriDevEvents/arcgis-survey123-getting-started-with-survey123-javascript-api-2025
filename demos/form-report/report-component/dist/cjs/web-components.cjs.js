'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-1f4276ed.js');
const appGlobals = require('./app-globals-3a1e7e63.js');

/*
 Stencil Client Patch Browser v4.19.2 | MIT Licensed | https://stenciljs.com
 */
var patchBrowser = () => {
  const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('web-components.cjs.js', document.baseURI).href));
  const opts = {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return index.promiseResolve(opts);
};

patchBrowser().then(async (options) => {
  await appGlobals.globalScripts();
  return index.bootstrapLazy([["feature-report.cjs",[[1,"feature-report",{"token":[1],"portalUrl":[1,"portal-url"],"apiUrl":[1,"api-url"],"featureLayerUrl":[1,"feature-layer-url"],"surveyItemId":[1,"survey-item-id"],"templateItemId":[1,"template-item-id"],"queryParameters":[1,"query-parameters"],"mergeFiles":[1,"merge-files"],"outputFormat":[1,"output-format"],"outputReportName":[1,"output-report-name"],"outputPackageName":[1,"output-package-name"],"packageFiles":[8,"package-files"],"uploadInfo":[1,"upload-info"],"webmapItemId":[1,"webmap-item-id"],"mapScale":[1,"map-scale"],"locale":[1],"utcOffset":[1,"utc-offset"],"show":[1],"hide":[1],"inputFeatureTemplate":[1,"input-feature-template"],"label":[1],"reportTemplateIds":[1,"report-template-ids"],"clientId":[1,"client-id"],"requestSource":[1,"request-source"],"where":[32],"username":[32],"state":[32],"visibleConf":[32],"checkingList":[32],"jobs":[32],"error":[32],"langTasks":[32],"langCommon":[32],"langCustomPrint":[32],"surveyItemInfo":[32]},null,{"templateItemId":["templateItemIdChanged"],"queryParameters":["queryParametersChanged"],"mergeFiles":["mergeFilesChanged"],"outputFormat":["outputFormatChanged"],"locale":["localeChanged"],"show":["showChanged"],"hide":["hideChanged"],"inputFeatureTemplate":["inputFeatureTemplateChanged"],"label":["labelChanged"],"reportTemplateIds":["reportTemplateIdsChanged"],"requestSource":["requestSourceChanged"]}]]],["credit-estimator.cjs",[[1,"credit-estimator"]]],["report-base.cjs",[[1,"report-base",{"featureLayerUrl":[1,"feature-layer-url"],"token":[1],"url":[1],"username":[1],"surveyItemId":[1,"survey-item-id"],"portalUrl":[1,"portal-url"],"f":[1],"locale":[1]}]]],["sample-report-generator.cjs",[[1,"sample-report-generator"]]],["view-report-link.cjs",[[1,"view-report-link",{"checkingList":[16],"langTasks":[32]}]]],["file-option-chooser.cjs",[[1,"file-option-chooser",{"fileOption":[513,"file-option"],"translator":[32],"langReport":[32]}]]],["error-detail-modal_2.cjs",[[1,"error-detail-modal",{"job":[8],"open":[4],"maxFailedOIDLength":[32]}],[1,"success-detail-modal",{"job":[8],"open":[4]}]]],["detail-table_3.cjs",[[1,"task-info",{"job":[8],"showDetail":[1,"show-detail"],"detailedStatus":[1,"detailed-status"],"detailedStatusEle":[1,"detailed-status-ele"],"isWaitingToConfirmRemove":[32],"isRemoving":[32],"isCanceling":[32]}],[1,"detail-table",{"job":[8],"errorMsg":[32]}],[1,"report-icon",{"icon":[8],"size":[8],"pathData":[32]}]]],["features-preview_5.cjs",[[1,"task-list",{"jobs":[16],"langReport":[32],"langCommon":[32],"langTasks":[32],"state":[32]}],[1,"report-settings",{"mergeFiles":[1,"merge-files"],"outputFormat":[1,"output-format"],"conflictBehavior":[1,"conflict-behavior"],"fileName":[1,"file-name"],"visibleElems":[16],"translator":[32],"langReport":[32],"helperObj":[32],"featureCount":[32],"printTemplates":[32]},null,{"fileName":["onFileNameChange"]}],[1,"features-preview",{"queryParameters":[1,"query-parameters"],"inputFeatureTemplate":[1,"input-feature-template"],"featureCount":[32],"featureStr":[32],"translator":[32],"reportLang":[32],"commonLang":[32]}],[1,"report-generator",{"langObj":[8,"lang-obj"],"visibleConf":[8,"visible-conf"],"templateItemId":[1,"template-item-id"],"featureCount":[32],"supportShowCredits":[32],"printTemplates":[32],"creditsInfo":[32],"creditStatus":[32],"testModeJobObj":[32],"isTestModePrinting":[32],"isPrinting":[32],"translator":[32]}],[1,"template-chooser",{"langObj":[8,"lang-obj"],"selectedTemplateId":[8,"selected-template-id"],"templateIds":[1,"template-ids"],"templates":[32],"translator":[32]},null,{"selectedTemplateId":["selectedTemplateIdChanged"],"templateIds":["templateIdsChanged"]}]]]], options);
});

exports.setNonce = index.setNonce;

//# sourceMappingURL=web-components.cjs.js.map