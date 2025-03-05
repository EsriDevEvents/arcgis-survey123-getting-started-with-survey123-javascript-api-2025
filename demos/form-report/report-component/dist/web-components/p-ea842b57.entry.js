import{r as t,h as i,H as e,c as s,F as o,a as n}from"./p-13c60fff.js";import{T as l,P as a}from"./p-33b03442.js";import{R as r,q as d}from"./p-3023e4d5.js";import{d as h,r as c,U as u}from"./p-fe40b0f4.js";import{S as f}from"./p-b681d68c.js";function v(t){if(t.owner){return Promise.resolve(t.owner)}else if(t.item&&t.item.owner){return Promise.resolve(t.item.owner)}else if(t.authentication&&t.authentication.getUsername){return t.authentication.getUsername()}else{return Promise.reject(new Error("Could not determine the owner of this item. Pass the `owner`, `item.owner`, or `authentication` option."))}}const p=t=>{const{folderId:i,start:e=1,num:s=10,authentication:o}=t;const n=i?`/${i}`:"";return v(t).then((i=>`${h(t)}/content/users/${i}${n}`)).then((t=>c(t,{httpMethod:"GET",authentication:o,params:{start:e,num:s}})))};const m=":host{display:block;min-height:200;padding:0 0.75rem;background-color:var(--calcite-color-foreground-1);color:var(--calcite-color-text-2)}:host .heading{margin-inline:0px;margin-block:1.25rem 1rem;font-size:var(--calcite-font-size-0);line-height:1.25rem;font-weight:var(--calcite-font-weight-medium)}";const b=m;const g=class{constructor(i){t(this,i);this.reportService=r.getService();this.utilService=u.getService();this.stateService=f.getService();this.queryParameters=undefined;this.inputFeatureTemplate=undefined;this.featureCount=0;this.featureStr="";this.translator=undefined;this.reportLang=undefined;this.commonLang=undefined}componentWillLoad(){this.stateService.subscribe("update-features-preview",(t=>{if(t!==undefined){this.inputFeatureTemplate=t}this.featureCount=this.reportService.getHelperObj("featureCount")||0;this.init()}));return Promise.resolve(true).then((()=>{const t=l.getService().getTranslateSync();this.translator=t;this.initTranslateData(t);this.stateService.subscribe("locale-data-changed",(t=>{this.initTranslateData(t)}))})).catch((t=>{this.reportService.showError(t)}))}initTranslateData(t){this.translator=t;this.commonLang=t===null||t===void 0?void 0:t.common;this.reportLang=t===null||t===void 0?void 0:t.customPrint}init(){let t=[];return this.getDisplayFields().then((i=>{t=i;let e=[];e=t;const s=JSON.parse(this.queryParameters);let o=10;if(s.resultRecordCount<10){o=s.resultRecordCount}if(s.orderByFields){s.orderByFields=s.orderByFields.replace("||","")}const n=Object.assign({url:a.featureLayerUrl,authentication:a.token,outFields:e,resultRecordCount:o},s);const l="where"in n?n.where:null;const r="objectIds"in n?n.objectIds:null;const h={};if(l!==null){h.where=l}if(r!=null){h.objectIds=r}if(!r&&!l){h.where="1<>1";delete h.objectIds}n.params=h;delete n.where;delete n.objectIds;return d(n)})).then((i=>{if(this.featureCount===0){this.featureStr=this.commonLang.noResults;return true}const e=i.fields||[];const s={};e.forEach((t=>{s[t.name]=t}));const o=this.featureCount>10?10:this.featureCount;const n=i.features.splice(0,o);this.featureStr=n.map((i=>{let e=this.inputFeatureTemplate;t.forEach((t=>{const o=this.utilService.formatFieldVal(s[t],i.attributes[t]);e=e.replace(`{${t}}`,o)}));return e})).join("<br>");if(this.featureCount>10){this.featureStr+=`<br>...(${this.utilService.formatNumber(this.featureCount-10)} ${this.commonLang.more||"more"})`}return true})).catch((t=>{this.reportService.showError(t)}))}getDisplayFields(){let t=[];return this.reportService.getLayerJson().then((i=>{if(!this.inputFeatureTemplate){if(i.displayField){this.inputFeatureTemplate="{"+i.displayField+"}";t=[i.displayField]}else{const e=i.fields||[];const s=Object.keys(i.editFieldsInfo||{}).map((t=>i.editFieldsInfo[t])).concat([i.objectIdField||"",i.globalIdField||""]);const o=e.find((t=>!s.includes(t.name)&&t.type==="esriFieldTypeString"));const n=e.find((t=>!s.includes(t.name)&&this.utilService.isNumberField(t)));const l=e.find((t=>!s.includes(t.name)&&!this.utilService.isNumberField(t)&&t.type!=="esriFieldTypeString"));const a=o||n||l||e[0];if(a){this.inputFeatureTemplate="{"+a.name+"}";t=[a.name]}}return t}else{const e=i.fields||[];const s=this.inputFeatureTemplate.match(/\{.*?\}/g);(s||[]).forEach((i=>{const s=i.substring(1,i.length-1);const o=e.find((t=>t.name===s));if(t.indexOf(s)<0&&o){t.push(s)}}));if(!t.length){t=[i.objectIdField||"objectid"]}return t}}))}render(){var t,s;return i(e,{key:"f2c77b92f32d439574043b1746bf8b4f36df78e9"},i("div",{key:"250a3421f00f699028066cddbb133be62f3df570"},i("div",{key:"4e2c1ac52c1bd185cfba5df6ab87155a3762615c",class:"heading"},(s=(t=this.translator)===null||t===void 0?void 0:t.customPrint)===null||s===void 0?void 0:s.inputFeatures," (",this.featureCount,")"),i("div",{key:"ad8ebea8558d0ec9d5e25b3b97ee2b3e070b6d11",innerHTML:this.featureStr})),i("slot",{key:"4346d0030a306b4ae30ec8b808667147e0ffc080"}))}};g.style=b;const x=":host{padding:0 0.75rem;display:block}:host .clickable-text{cursor:pointer;font-weight:normal}:host calcite-notice{margin-top:6px}:host .credits-info{margin:10px 0 10px 0;padding:10px 0;background-color:var(--calcite-color-foreground-3);color:var(--calcite-color-text-2);display:flex;justify-content:space-between}:host .credits-info>div{margin:0px 10px}:host .credits-info .show-credits{display:inline-flex;align-items:center}:host .credits-info .show-credits survey123-ui-spinner{line-height:0}:host .credits-info .show-credits ::ng-deep span{line-height:0}:host .credits-info .show-credits .icon-spin.icon-refresh{top:1px}:host .credits-info .show-credits .spinner{-webkit-transition:none;-moz-transition:none;-o-transition:none;transition:none}:host .credits-info .show-credits span:not(.clickable-text){cursor:default}:host .credits-info .show-credits span.clickable-text.disabled{cursor:not-allowed}:host .credits-info .credits-result-info{flex-grow:1;display:flex;justify-content:flex-end}:host .credits-info .credits-result-info span{word-break:break-word}:host .pieview-info{margin-top:10px;margin-bottom:20px}:host .pieview-info .has-spinner>span{cursor:default}:host .pieview-info .has-spinner>span.report-status{padding:0 2px}:host .pieview-info .preview-text{cursor:default;display:flex;align-items:center}:host .pieview-info .preview-text>span{cursor:pointer}:host .pieview-info .preview-text.disabled{text-decoration:underline solid #979797;color:#979797;cursor:not-allowed}:host .pieview-info .preview-text.disabled>span{cursor:not-allowed}:host .execute-btn{overflow:auto;margin:-5px 0 30px 0}:host .execute-btn>span{line-height:41px}:host .execute-btn a{float:inline-start}:host .execute-btn a button{width:auto}:host .execute-btn.portal-btn{margin:20px 0}:host calcite-loader{display:inline-block;margin:0 0 0 10px}";const k=x;const w=class{constructor(i){t(this,i);this.reportCreated=s(this,"reportCreated",7);this.batchPrintLimitCount=2e3;this.checkingList=[];this.reportService=r.getService();this.utilService=u.getService();this.state=f.getService();this.featureCount=undefined;this.supportShowCredits=true;this.printTemplates=[];this.langObj=undefined;this.creditsInfo=undefined;this.creditStatus=undefined;this.testModeJobObj=undefined;this.isTestModePrinting=undefined;this.visibleConf=undefined;this.templateItemId=undefined;this.isPrinting=undefined;this.translator=undefined}componentWillLoad(){this.checkPrivilige();this.printTemplates=this.reportService.getHelperObj("printTemplates")||[];this.state.subscribe("print-templates-updated",(t=>{this.printTemplates=t||[]}));this.state.subscribe("portal-info-update",(()=>{this.checkPrivilige()}));this.state.subscribe("feature-count-updated",(()=>{this.checkPrivilige()}));return Promise.resolve(true).then((()=>{const t=l.getService().getTranslateSync();this.translator=t;this.state.subscribe("locale-data-changed",(t=>{this.translator=t}))}))}checkPrivilige(){this.featureCount=this.reportService.getHelperObj("featureCount")||0;this.isPortal=this.utilService.isPortal;const t=this.utilService.supportFeatureReport();const i=this.utilService.isUserCanPrintFeatureReport();this.canShowEstimateCredits=t?i:false;this.supportShowCredits=!this.isPortal&&this.featureCount<=this.batchPrintLimitCount&&this.canShowEstimateCredits}estimateCredits(){if(this.featureCount>this.batchPrintLimitCount){return}if(this.featureCount<1){return}if(!this.printTemplates||!this.printTemplates.length){return}if(!(this.creditsInfo&&this.creditStatus==="estimating")){const t=this.reportService.getParamCache();const i=t.templateItemId||a.templateItemId;const e={queryParameters:a.queryParameters,featureLayerUrl:a.featureLayerUrl,templateItemId:i,surveyItemId:a.surveyItemId};this.creditStatus="estimating";this.creditsInfo=this.creditsInfo||{};this.reportService.estimateReportCosts(e).then((t=>{if(t.resultInfo){this.creditsInfo=t.resultInfo;this.creditStatus="finished";this.creditsInfo.lastCalculatedCount=this.featureCount;this.creditsInfo.lastSelectedTemplateId=i}else{throw t.error}})).catch((t=>{this.reportService.showError(t);this.creditStatus="changed"}))}}buttonClickable(){const t=true;if(this.templateItemId){return true}if(!this.printTemplates||!this.printTemplates.length){return false}return t}executeCustomPrint(t){var i;const e=this.reportService.getParamCache();if(t&&this.isTestModePrinting){return}this.featureCount=this.reportService.getHelperObj("featureCount")||0;if(this.featureCount<1){this.reportService.showError({},{errorStr:(i=this.translator)===null||i===void 0?void 0:i.common.noResults});return}if(t){this.isTestModePrinting=true}else{this.isPrinting=true}if(t){const t={queryParameters:a.queryParameters,templateItemId:e.templateItemId||a.templateItemId,surveyItemId:a.surveyItemId,featureLayerUrl:a.featureLayerUrl,outputReportName:e.outputPackageName||a.outputPackageName||e.outputReportName||a.outputReportName||""};if(t.outputReportName){const i=this.utilService.extractPlaceholders(t.outputReportName);if(!(i&&i.length)){t.outputPackageName=t.outputReportName}}const i=e.mergeFiles||a.mergeFiles;if(i&&i!=="none"){t.mergeFiles=i}return this.reportService.createSampleReport(t).then((t=>{var i,e;if(!t||!t.success){this.reportService.showError({},{errorStr:(e=(i=this.translator)===null||i===void 0?void 0:i.customPrint)===null||e===void 0?void 0:e.printErrMsg,detail:t.error&&t.error.message?t.error.message:""});this.isTestModePrinting=false}else{this.testModeJobObj=t;this.watchTestModeJob()}})).catch((t=>{var i,e;this.reportService.showError({},{errorStr:(e=(i=this.translator)===null||i===void 0?void 0:i.customPrint)===null||e===void 0?void 0:e.printErrMsg,detail:t.error&&t.error.message?t.error.message:""});this.isTestModePrinting=false}))}let s=e.outputPackageName||a.outputPackageName||e.outputReportName||a.outputReportName||"";if(s.length>250){s=s.substr(0,250)}return Promise.resolve().then((()=>{let t=null;t=e.uploadInfo||a.uploadInfo||{type:"arcgis",parameters:{},conflictBehavior:"rename"};const i=a.packageFiles+""==="true"?true:a.packageFiles+""==="false"?false:"auto";const o={queryParameters:a.queryParameters,templateItemId:e.templateItemId||a.templateItemId,outputReportName:s||"",featureLayerUrl:a.featureLayerUrl,uploadInfo:JSON.stringify(t),packageFiles:i};if(a.surveyItemId){o.surveyItemId=e.surveyItemId||a.surveyItemId}if(e.outputFormat||a.outputFormat){o.outputFormat=e.outputFormat||a.outputFormat}if(a.webmapItemId){o.webmapItemId=a.webmapItemId}if(Number(a.mapScale)||Number(a.mapScale)===0){o.mapScale=Number(a.mapScale)}if(a.locale){o.locale="||"+a.locale}if(a.utcOffset){o.utcOffset=a.utcOffset}const n=e.outputPackageName||a.outputPackageName;if(n){o.outputPackageName=n}const l=e.mergeFiles||a.mergeFiles;if(l&&l!=="none"){o.mergeFiles=l}const r=this.reportService.getHelperObj();if(r.canCreateItem===false){delete o.uploadInfo}let d=null;this.reportService.executeReport(o).then((t=>{var i,e;if(!t||!t.success){this.reportService.showError({},{errorStr:(e=(i=this.translator)===null||i===void 0?void 0:i.customPrint)===null||e===void 0?void 0:e.printErrMsg,detail:t.error.message});this.isPrinting=false}else{d=t.jobId;return this.reportService.checkJobStatus(d)}})).then((()=>{if(this.queryJobTimmer){clearTimeout(this.queryJobTimmer)}this.queryJobTimmer=setTimeout((()=>{this.reportService.queryJobs(true).then((t=>{this.checkingList.push(d);this.reportCreated.emit({jobId:d,checkingList:this.checkingList,jobs:(t===null||t===void 0?void 0:t.jobs)||[]});this.isPrinting=false}))}),100)})).catch((t=>{var i,e;const s=this.reportService.getErrorStr(t);this.reportService.showError(t,{errorStr:(e=(i=this.translator)===null||i===void 0?void 0:i.customPrint)===null||e===void 0?void 0:e.printErrMsg,detail:s});this.isPrinting=false}))}))}watchTestModeJob(){if(!this.testModeJobObj){return}const t=this.testModeJobObj.jobId;const i=()=>this.reportService.checkJobStatus(t).then((t=>{var e,s;this.testModeJobObj=t;if(t.jobStatus==="esriJobSucceeded"||t.jobStatus==="esriJobPartialSucceeded"){this.reportService.downloadFile(t);this.isTestModePrinting=false;if(t.jobStatus==="esriJobPartialSucceeded"){this.reportService.showError({},{alertType:"warning",errorStr:(s=(e=this.translator)===null||e===void 0?void 0:e.customPrint)===null||s===void 0?void 0:s.printErrMsg,detail:t.detail||t.message||(t.messages&&t.messages.length?t.messages.reduce(((t,i)=>t+i)):"")})}return true}else if(this.testModeJobObj.jobStatus==="esriJobFailed"){this.isTestModePrinting=false;throw t}else if(t.error){throw t.error}else{setTimeout((()=>{i()}),1500)}})).catch((t=>{var i,e;this.reportService.showError({},{errorStr:(e=(i=this.translator)===null||i===void 0?void 0:i.customPrint)===null||e===void 0?void 0:e.printErrMsg,detail:t.detail||t.message||(t.messages&&t.messages.length?t.messages.reduce(((t,i)=>t+i)):"")});this.isTestModePrinting=false}));i()}render(){var t,s,n,l,a,r,d,h,c,u,f,v,p,m,b;return i(e,{key:"aca32173e6e0e969c0321fdd6dc10145da134760"},i("p",{key:"2a893d489dfe3a83bb27a2fe590621223025894d"},this.supportShowCredits),this.supportShowCredits&&this.visibleConf.indexOf("showCredits")>=0?i("div",{class:"credits-info"},i("div",{class:"show-credits has-spinner"},this.creditsInfo&&this.creditStatus==="estimating"?i(o,null,i("span",{class:`${this.featureCount<1||!this.printTemplates.length?"disabled":""}`,onClick:()=>this.estimateCredits()},`${(t=this.translator)===null||t===void 0?void 0:t.common.calculating}`),i("calcite-loader",{label:(s=this.translator)===null||s===void 0?void 0:s.common.calculating,inline:"true"})):i("calcite-link",{disabled:`${this.featureCount<1||!this.printTemplates.length?true:false}`,onClick:()=>this.estimateCredits()},`${(l=(n=this.translator)===null||n===void 0?void 0:n.customPrint)===null||l===void 0?void 0:l.creditsEstimate}`)),this.creditsInfo&&this.creditStatus==="finished"&&this.featureCount>0&&this.printTemplates.length?i("div",{class:"credits-result-info"},i("span",null,(r=(a=this.translator)===null||a===void 0?void 0:a.customPrint)===null||r===void 0?void 0:r.creditsRecordsCount.replace("${$recordsCount}",`${this.featureCount}`).replace("${$requiredCredits}",`${this.creditsInfo.cost}`))):"",this.creditsInfo&&this.creditStatus==="changed"&&this.featureCount>0&&this.printTemplates.length?i("div",{class:"credits-result-info"},i("span",null,(h=(d=this.translator)===null||d===void 0?void 0:d.customPrint)===null||h===void 0?void 0:h.credtisResultInvalid)):""):"",i("div",{key:"bc95469bad71ab752a604a34b258471f73992a8f",class:`execute-btn ${!this.isPortal&&this.featureCount<=this.batchPrintLimitCount&&this.canShowEstimateCredits?"":"portal-btn"}`},i("a",{key:"cdc19e375ccf3d035b72706b70ba771b185e9706",class:"no-hover"},i("calcite-button",{key:"32ec0cfa2757e0d8124ba0c9703d90f2d1850e62",id:"submit-btn",disabled:this.isPrinting||!this.buttonClickable(),onClick:()=>this.executeCustomPrint()},(u=(c=this.translator)===null||c===void 0?void 0:c.customPrint)===null||u===void 0?void 0:u.generate,this.isPrinting?i("calcite-loader",{label:(v=(f=this.translator)===null||f===void 0?void 0:f.common)===null||v===void 0?void 0:v.loading,inline:"true"}):null),(this.printTemplates||[]).length>0||this.templateItemId||((p=this.visibleConf)===null||p===void 0?void 0:p.indexOf("selectTemplate"))>=0?null:i("calcite-notice",{open:true,kind:"danger",scale:"s",width:"auto"},i("div",{slot:"message"},(b=(m=this.translator)===null||m===void 0?void 0:m.customPrint)===null||b===void 0?void 0:b.chooseTemplateNoOneYet1)))),i("slot",{key:"5ff5f48aaf6df90e383672eb15e850a46a867f48"}))}};w.style=k;const y=":host{display:block;padding:0 0.75rem}:host .heading{margin-inline:0px;margin-block:1.25rem 1rem;font-size:var(--calcite-font-size-0);line-height:1.25rem;font-weight:var(--calcite-font-weight-medium)}:host .folder-label{display:flex;justify-content:space-between;align-items:center}:host .conflict-name-setting{padding-block:0.5rem;padding-inline:0.75rem;font-size:var(--calcite-font-size--1);line-height:1rem}";const C=y;const I=class{constructor(i){t(this,i);this.fileOptionChange=s(this,"fileOptionChange",7);this.fileNameChange=s(this,"fileNameChange",7);this.selectedFolderChange=s(this,"selectedFolderChange",7);this.selectedFileFormatChange=s(this,"selectedFileFormatChange",7);this.reportService=r.getService();this.state=f.getService();this.mergeFiles=undefined;this.outputFormat="word";this.conflictBehavior="rename";this.fileName=undefined;this.visibleElems=[];this.translator=undefined;this.langReport=undefined;this.helperObj=undefined;this.featureCount=undefined;this.printTemplates=[]}onFileNameChange(){this.fileNameChangeHandler({target:{value:this.fileName}})}componentWillLoad(){return Promise.resolve(true).then((()=>{const t=l.getService().getTranslateSync();this.translator=t;this.langReport=t===null||t===void 0?void 0:t.customPrint;this.state.subscribe("locale-data-changed",(t=>{this.translator=t;this.langReport=t===null||t===void 0?void 0:t.customPrint}));this.printTemplates=this.reportService.getHelperObj("printTemplates")||[];this.state.subscribe("print-templates-updated",(t=>{this.printTemplates=t||[]}));this.helperObj=this.reportService.getHelperObj();this.featureCount=this.reportService.getHelperObj("featureCount")||0;this.state.subscribe("portal-info-update",(()=>{this.featureCount=this.reportService.getHelperObj("featureCount")||0}));this.state.subscribe("feature-count-updated",(()=>{this.featureCount=this.reportService.getHelperObj("featureCount")||0}));return this.getUserFolders()})).catch((t=>{this.reportService.showError(t)}))}fileOptChangeHandler(t){const i=this.reportService.getParamCache();if(t.detail!=="split"){i.mergeFiles=t.detail}else{delete i.mergeFiles}this.fileOptionChange.emit(t.detail)}fileNameChangeHandler(t){this.fileName=t.target.value;const i=this.fileName;if(i){const t=this.extractPlaceholders(i);if(!(t&&t.length)){this.reportService.setParamCache({outputPackageName:i})}}this.reportService.setParamCache({outputReportName:i});this.fileNameChange.emit(this.fileName)}selectedFolderChangeHandler(){const t=this.reportService.getParamCache("uploadInfo")||{type:"arcgis",parameters:{},conflictBehavior:"rename"};t.parameters.folderId=this.selectedFolder.id==="all"?"":this.selectedFolder.id;this.reportService.setParamCache({uploadInfo:t});this.selectedFolderChange.emit(this.selectedFolder)}outputFormatChangeHandler(t){this.outputFormat=t.target.value;this.reportService.setParamCache({outputFormat:this.outputFormat});this.selectedFileFormatChange.emit(this.outputFormat)}getUserFolders(){var t,i;const e=u.getService();const s=(t=e.getUser())===null||t===void 0?void 0:t.username;const o=(i=this.langReport)===null||i===void 0?void 0:i.saveToAGOFolderRoot.replace("${$username}",s);const n=Object.assign({owner:s},e.getBaseRequestOptions());return p(n).then((t=>{this.folders=[];const i=[];i.push({username:s,id:"all",value:"all",title:o,label:o,created:null});if(t&&t.folders&&t.folders.length){t.folders.forEach((t=>{t["label"]=t.title;t["value"]=t.id}));this.folders=i.concat(t.folders)}else{this.folders=i}this.selectedFolder=this.folders[0];return this.folders}))}extractPlaceholders(t){t=t||"";const i=t.match(/\$[^{$]*?{[^}]*?.*?}/g),e=[];if(i){i.forEach((t=>{if(e.indexOf(t)===-1){e.push(t)}}))}return e}changeConflictBehavior(t){this.conflictBehavior=t.target.value;const i=this.reportService.getParamCache("uploadInfo")||{type:"arcgis",parameters:{},conflictBehavior:"rename"};i.conflictBehavior=this.conflictBehavior;this.reportService.setParamCache({uploadInfo:i})}render(){var t,s,o,n,l,a,r,d,h,c,u,f,v,p,m,b,g,x,k,w,y,C,I,$,T,P,j,F,S,N;return i(e,{key:"f7533ed880148f57d8d02b32f1c098b7a50aaf0c"},i("div",{key:"2a9949c62bbb802797eb7f959769290f665d5d58",class:"heading"},(s=(t=this.translator)===null||t===void 0?void 0:t.customPrint)===null||s===void 0?void 0:s.resultSettingsLabel1),this.visibleElems.indexOf("fileOptions")<0?null:i("file-option-chooser",{fileOption:this.mergeFiles,onFileOptionChange:t=>{this.fileOptChangeHandler(t)}}),this.visibleElems.indexOf("reportName")<0?null:i("calcite-label",null,(n=(o=this.translator)===null||o===void 0?void 0:o.customPrint)===null||n===void 0?void 0:n.saveToAGOItemName,i("calcite-input-text",{placeholder:(a=(l=this.translator)===null||l===void 0?void 0:l.customPrint)===null||a===void 0?void 0:a.saveToAGOItemName,value:this.fileName,onCalciteInputTextChange:t=>this.fileNameChangeHandler(t)})),this.visibleElems.indexOf("saveToAGSAccount")<0?null:i("calcite-label",null,i("div",{class:"folder-label"},i("span",null,(d=(r=this.translator)===null||r===void 0?void 0:r.customPrint)===null||d===void 0?void 0:d.saveToAGOFolder),i("calcite-dropdown",{width:"l",scale:"m","close-on-select-disabled":true,type:"click","width-scale":"l"},i("calcite-button",{slot:"trigger","icon-start":"gear",appearance:"transparent"}),i("calcite-dropdown-group",null,i("div",{class:"conflict-name-setting"},i("calcite-radio-button-group",{name:"conflict-name-options",layout:"vertical"},i("calcite-label",{layout:"inline"},(c=(h=this.translator)===null||h===void 0?void 0:h.customPrint)===null||c===void 0?void 0:c.nameConflictOptLabel,i("calcite-icon",{id:"info-icon",icon:"question",scale:"s"}," "),i("calcite-tooltip",{label:(f=(u=this.translator)===null||u===void 0?void 0:u.customPrint)===null||f===void 0?void 0:f.nameConflictOptLabel,"reference-element":"info-icon"},i("span",null,(p=(v=this.translator)===null||v===void 0?void 0:v.customPrint)===null||p===void 0?void 0:p.nameConflictOptLabel))),i("calcite-label",{layout:"inline"},i("calcite-radio-button",{value:"rename",checked:this.conflictBehavior=="rename",onCalciteRadioButtonChange:t=>this.changeConflictBehavior(t)}),(b=(m=this.translator)===null||m===void 0?void 0:m.customPrint)===null||b===void 0?void 0:b.nameConflictOptRename),i("calcite-label",{layout:"inline"},i("calcite-radio-button",{value:"replace",checked:this.conflictBehavior=="replace",onCalciteRadioButtonChange:t=>this.changeConflictBehavior(t)}),(x=(g=this.translator)===null||g===void 0?void 0:g.customPrint)===null||x===void 0?void 0:x.nameConflictOptReplace),i("calcite-label",{layout:"inline"},i("calcite-radio-button",{value:"fail",checked:this.conflictBehavior=="fail",onCalciteRadioButtonChange:t=>this.changeConflictBehavior(t)}),(w=(k=this.translator)===null||k===void 0?void 0:k.customPrint)===null||w===void 0?void 0:w.nameConflictOptSkip)))))),i("calcite-tooltip",{label:this.helperObj.canCreateItem===false?this.langReport.saveToAGONoCreatePrivilegeTip:"","reference-element":"folder-selector"},i("span",null,this.helperObj.canCreateItem===false?this.langReport.saveToAGONoCreatePrivilegeTip:"")),i("calcite-combobox",{id:"folder-selector",disabled:this.helperObj.canCreateItem===false,placeholder:(C=(y=this.translator)===null||y===void 0?void 0:y.customPrint)===null||C===void 0?void 0:C.saveToAGOFolder,"selection-mode":"single-persist",clearDisabled:"true",maxItems:"7",value:this.selectedFolder,onCalciteComboboxChange:()=>{this.selectedFolderChangeHandler()}},(this.folders||[]).map((t=>{var e;return i("calcite-combobox-item",{value:t.value,"text-label":t.label,selected:t.value===((e=this.selectedFolder)===null||e===void 0?void 0:e.id)})})))),this.visibleElems.indexOf("outputFormat")<0?null:i("calcite-label",null,($=(I=this.translator)===null||I===void 0?void 0:I.customPrint)===null||$===void 0?void 0:$.outputFormat,i("calcite-combobox",{placeholder:(P=(T=this.translator)===null||T===void 0?void 0:T.customPrint)===null||P===void 0?void 0:P.outputFormat,"selection-mode":"single-persist",clearDisabled:"true",value:this.outputFormat,onCalciteComboboxChange:t=>this.outputFormatChangeHandler(t)},i("calcite-combobox-item",{value:"docx",selected:this.outputFormat==="docx","text-label":(F=(j=this.translator)===null||j===void 0?void 0:j.customPrint)===null||F===void 0?void 0:F.outputFormatDocx}),i("calcite-combobox-item",{value:"pdf",selected:this.outputFormat==="pdf","text-label":(N=(S=this.translator)===null||S===void 0?void 0:S.customPrint)===null||N===void 0?void 0:N.outputFormatPdf}))),i("slot",{key:"0ea7f1954b4d990870bce17a6f6ab3d9904242df"}))}static get watchers(){return{fileName:["onFileNameChange"]}}};I.style=C;const $=":host{display:block}:host *{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}:host *{font-size:14px}:host .banner{cursor:pointer;font-weight:700;line-height:60px}:host .banner a{cursor:pointer;float:inline-start;transform:rotateZ(180deg);top:16px}:host .banner span{float:inline-start;padding-left:10px}:host .no-tasks{margin-bottom:20px}:host .list{height:calc(100% - 60px);padding:0 0.75rem;overflow:auto;width:100%}:host .list ul{padding-left:0}:host .list ul li{list-style:none;margin-bottom:15px;border-radius:2px}:host .list p.job-date{color:#979797;line-height:40px;margin-bottom:0}:host-context([dir=rtl]) .banner a{transform:none !important}:host-context([dir=rtl]) .banner span{padding-right:10px;padding-left:unset !important}:host-context([dir=rtl]) list ul{padding-right:0;padding-left:unset !important}";const T=$;const P=class{constructor(i){t(this,i);this.goBackClicked=s(this,"goBackClicked",7);this.recentTasksCount=10;this.reportService=r.getService();this.stateService=f.getService();this.utilService=u.getService();this.langReport=undefined;this.langCommon=undefined;this.langTasks=undefined;this.state="loading";this.jobs=undefined}componentWillLoad(){this.state="loading";Promise.resolve(true).then((()=>{var t;const i=l.getService().getTranslateSync();this.langReport=i===null||i===void 0?void 0:i.customPrint;this.langCommon=i===null||i===void 0?void 0:i.common;this.langTasks=i===null||i===void 0?void 0:i.customPrint.recentTasks;this.stateService.subscribe("locale-data-changed",(t=>{this.langReport=t===null||t===void 0?void 0:t.customPrint;this.langCommon=t===null||t===void 0?void 0:t.common;this.langTasks=t===null||t===void 0?void 0:t.customPrint.recentTasks}));if((t=this.jobs)===null||t===void 0?void 0:t.length){return{jobs:this.jobs}}return this.reportService.queryJobs(true)})).then((t=>{var i;this.jobList=t;this.jobs=((i=this.jobList)===null||i===void 0?void 0:i.jobs)||[];this.state="ready";return this.jobList}))}jobSplitDate(t,i){if(!this.jobs||i<0||i>=this.jobs.length||!t){return null}const e=this.utilService.formatDateTime(t.submitted,"date");if(i===0){return e}if(this.jobs[i-1]){const t=this.utilService.formatDateTime(this.jobs[i-1].submitted,"date");if(t===e){return null}else{return e}}return null}goBack(){this.goBackClicked.emit()}removeJob(t){const i=t.detail;if(this.jobs){const t=this.jobs.findIndex((t=>t.jobId===i.jobId));this.jobs.splice(t,1);this.jobs=[].concat(this.jobs)}}render(){var t,s;return i(e,{key:"9e04f7f484918b584487a2cd887a4473424e2a86"},i("div",{key:"7bd7270ce284bdc0d8bf858c6d4726e165d96b88",class:"banner"},i("calcite-action",{key:"53d1f3665321ff931bfd32771d01baba7995676c",onClick:()=>this.goBack(),text:(t=this.langTasks)===null||t===void 0?void 0:t.label,icon:"chevrons-left","text-enabled":true})),this.state==="ready"&&this.langReport&&this.langCommon&&this.langTasks&&this.jobList?i("div",{class:"list"},this.jobs.length<1?i("div",{class:"no-tasks"},this.langTasks.noTaskDesc):"",this.jobs.length?i(o,null,i("div",{class:"no-tasks"},this.langTasks.limitationDesc.replace("${$maxJobCount}",`${this.recentTasksCount}`)),i("ul",null,this.jobs.map(((t,e)=>i("li",{key:"li_"+t.jobId},this.jobSplitDate(t,e)?i("p",{class:"job-date"},this.jobSplitDate(t,e)):"",i("task-info",{key:t.jobId,job:t,onJobRemoved:t=>this.removeJob(t)})))))):""):i("div",{class:"loading"},i("calcite-loader",{label:(s=this.langCommon)===null||s===void 0?void 0:s.loading})),i("slot",{key:"6e879c58da983aa00e6040ae7a5e7efbf61d8a2b"}))}};P.style=T;const j=":host{display:block;padding:0 0.75rem}:host calcite-notice{margin-top:6px}:host .heading{margin-inline:0px;margin-block:1.25rem 1rem;font-size:var(--calcite-font-size-0);line-height:1.25rem;font-weight:var(--calcite-font-weight-medium)}";const F=j;const S=class{constructor(i){t(this,i);this.selectedTemplateChange=s(this,"selectedTemplateChange",7);this.reportService=r.getService();this.stateService=f.getService();this.langObj=undefined;this.selectedTemplateId=undefined;this.templateIds=undefined;this.templates=[];this.translator=undefined}selectedTemplateIdChanged(){this.reportService.setParamCache({templateItemId:this.selectedTemplateId})}templateIdsChanged(){this.init()}componentWillLoad(){this.reportService.setParamCache({templateItemId:this.selectedTemplateId});return Promise.resolve(true).then((()=>{const t=l.getService().getTranslateSync();this.translator=t;this.stateService.subscribe("locale-data-changed",(t=>{this.translator=t}));return this.init()}))}init(){const t=a;const i=r.getService();return Promise.resolve(true).then((()=>{if(this.templateIds===undefined){return i.getReportTemplates(t.surveyItemId)}else{return i.getReportTemplates(t.surveyItemId,{templateIds:this.templateIds})}})).then((t=>{this.templates=t;this.stateService.notifyDataChanged("print-templates-updated",{value:t});this.reportService.setHelperObj({printTemplates:t});if(!this.selectedTemplateId&&t.length){this.selectedTemplateId=t[0].id;this.reportService.setParamCache({templateItemId:this.selectedTemplateId});this.selectedTemplateChange.emit(this.selectedTemplateId)}return true})).catch((t=>{this.reportService.showError(t)}))}selectedTemplateChangeHandler(t){this.reportService.setParamCache({templateItemId:t.target.value});this.selectedTemplateChange.emit(t.target.value)}render(){var t,s,o;return i(e,{key:"7f3ef2c784e04f8a1a0d1861200d4c794ed50fb7"},i("div",{key:"5e54734af22f84f41e1f5a6c87773e6c0a302869",class:"heading"},(t=this.translator)===null||t===void 0?void 0:t.customPrint.chooseTemplateLabel1),i("calcite-combobox",{key:"7eb5e61f8d97e61b6421ac73a6a814842e5e11a0",placeholder:(s=this.translator)===null||s===void 0?void 0:s.customPrint.chooseTemplateLabel1,"selection-mode":"single-persist",clearDisabled:"true",value:this.selectedTemplateId,onCalciteComboboxChange:t=>{this.selectedTemplateChangeHandler(t)}},(this.templates||[]).map((t=>i("calcite-combobox-item",{value:t.id,"text-label":t.title,selected:t.id===this.selectedTemplateId})))),(this.templates||[]).length>0?null:i("calcite-notice",{open:true,kind:"danger",scale:"s",width:"auto"},i("div",{slot:"message"},(o=this.translator)===null||o===void 0?void 0:o.customPrint.chooseTemplateNoOneYet1)),i("slot",{key:"2cea7b7e4e0d4591c35e8466f4295af2b6119c66"}))}get element(){return n(this)}static get watchers(){return{selectedTemplateId:["selectedTemplateIdChanged"],templateIds:["templateIdsChanged"]}}};S.style=F;export{g as features_preview,w as report_generator,I as report_settings,P as task_list,S as template_chooser};
//# sourceMappingURL=p-ea842b57.entry.js.map