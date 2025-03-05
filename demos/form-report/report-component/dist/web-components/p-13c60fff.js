const e="web-components";const t={allRenderFn:true,appendChildSlotFix:false,asyncLoading:true,asyncQueue:false,attachStyles:true,cloneNodeFix:false,cmpDidLoad:false,cmpDidRender:true,cmpDidUnload:false,cmpDidUpdate:false,cmpShouldUpdate:false,cmpWillLoad:true,cmpWillRender:false,cmpWillUpdate:false,connectedCallback:false,constructableCSS:true,cssAnnotations:true,devTools:false,disconnectedCallback:false,element:false,event:true,experimentalScopedSlotChanges:false,experimentalSlotFixes:false,formAssociated:false,hasRenderFn:true,hostListener:false,hostListenerTarget:false,hostListenerTargetBody:false,hostListenerTargetDocument:false,hostListenerTargetParent:false,hostListenerTargetWindow:false,hotModuleReplacement:false,hydrateClientSide:false,hydrateServerSide:false,hydratedAttribute:false,hydratedClass:true,hydratedSelectorName:"hydrated",initializeNextTick:false,invisiblePrehydration:true,isDebug:false,isDev:false,isTesting:false,lazyLoad:true,lifecycle:true,lifecycleDOMEvents:false,member:true,method:false,mode:false,observeAttribute:true,profile:false,prop:true,propBoolean:true,propMutable:false,propNumber:false,propString:true,reflect:true,scoped:false,scopedSlotTextContentFix:false,scriptDataOpts:false,shadowDelegatesFocus:false,shadowDom:true,slot:true,slotChildNodesFix:false,slotRelocation:false,state:true,style:true,svg:false,taskQueue:true,transformTagName:false,updatable:true,vdomAttribute:true,vdomClass:true,vdomFunctional:true,vdomKey:true,vdomListener:true,vdomPropOrAttr:true,vdomRef:true,vdomRender:true,vdomStyle:true,vdomText:true,vdomXlink:false,watchCallback:true};var n=Object.defineProperty;var r=(e,t)=>{for(var r in t)n(e,r,{get:t[r],enumerable:true})};var s=new WeakMap;var l=e=>s.get(e);var o=(e,t)=>s.set(t.t=e,t);var a=(e,t)=>{const n={l:0,$hostElement$:e,o:t,i:new Map};{n.u=new Promise((e=>n.v=e));e["s-p"]=[];e["s-rc"]=[]}return s.set(e,n)};var i=(e,t)=>t in e;var f=(e,t)=>(0,console.error)(e,t);var c=new Map;var u=(e,t,n)=>{const r=e.p.replace(/-/g,"_");const s=e.h;if(!s){return void 0}const l=c.get(s);if(l){return l[r]}
/*!__STENCIL_STATIC_IMPORT_SWITCH__*/return import(`./${s}.entry.js${""}`).then((e=>{{c.set(s,e)}return e[r]}),f)};var v=new Map;var d="{visibility:hidden}.hydrated{visibility:inherit}";var p="slot-fb{display:contents}slot-fb[hidden]{display:none}";var h=typeof window!=="undefined"?window:{};var m=h.document||{head:{}};var y={l:0,m:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,r)=>e.addEventListener(t,n,r),rel:(e,t,n,r)=>e.removeEventListener(t,n,r),ce:(e,t)=>new CustomEvent(e,t)};var b=e=>Promise.resolve(e);var w=(()=>{try{new CSSStyleSheet;return typeof(new CSSStyleSheet).replaceSync==="function"}catch(e){}return false})();var S=false;var $=[];var g=[];var k=(e,t)=>n=>{e.push(n);if(!S){S=true;if(t&&y.l&4){j(x)}else{y.raf(x)}}};var C=e=>{for(let t=0;t<e.length;t++){try{e[t](performance.now())}catch(e){f(e)}}e.length=0};var x=()=>{C($);{C(g);if(S=$.length>0){y.raf(x)}}};var j=e=>b().then(e);var O=k(g,true);var L=e=>{const t=new URL(e,y.m);return t.origin!==h.location.origin?t.href:t.pathname};var T={};var E=e=>e!=null;var R=e=>{e=typeof e;return e==="object"||e==="function"};function D(e){var t,n,r;return(r=(n=(t=e.head)==null?void 0:t.querySelector('meta[name="csp-nonce"]'))==null?void 0:n.getAttribute("content"))!=null?r:void 0}var M={};r(M,{err:()=>P,map:()=>U,ok:()=>F,unwrap:()=>A,unwrapErr:()=>N});var F=e=>({isOk:true,isErr:false,value:e});var P=e=>({isOk:false,isErr:true,value:e});function U(e,t){if(e.isOk){const n=t(e.value);if(n instanceof Promise){return n.then((e=>F(e)))}else{return F(n)}}if(e.isErr){const t=e.value;return P(t)}throw"should never get here"}var A=e=>{if(e.isOk){return e.value}else{throw e.value}};var N=e=>{if(e.isErr){return e.value}else{throw e.value}};var W=(e,t="")=>{{return()=>{}}};var H=(e,t)=>{{return()=>{}}};var z=(e,t,...n)=>{let r=null;let s=null;let l=false;let o=false;const a=[];const i=t=>{for(let n=0;n<t.length;n++){r=t[n];if(Array.isArray(r)){i(r)}else if(r!=null&&typeof r!=="boolean"){if(l=typeof e!=="function"&&!R(r)){r=String(r)}if(l&&o){a[a.length-1].S+=r}else{a.push(l?B(null,r):r)}o=l}}};i(n);if(t){if(t.key){s=t.key}{const e=t.className||t.class;if(e){t.class=typeof e!=="object"?e:Object.keys(e).filter((t=>e[t])).join(" ")}}}if(typeof e==="function"){return e(t===null?{}:t,a,G)}const f=B(e,null);f.$=t;if(a.length>0){f.k=a}{f.C=s}return f};var B=(e,t)=>{const n={l:0,j:e,S:t,O:null,k:null};{n.$=null}{n.C=null}return n};var Q={};var q=e=>e&&e.j===Q;var G={forEach:(e,t)=>e.map(I).forEach(t),map:(e,t)=>e.map(I).map(t).map(K)};var I=e=>({vattrs:e.$,vchildren:e.k,vkey:e.C,vname:e.L,vtag:e.j,vtext:e.S});var K=e=>{if(typeof e.vtag==="function"){const t={...e.vattrs};if(e.vkey){t.key=e.vkey}if(e.vname){t.name=e.vname}return z(e.vtag,t,...e.vchildren||[])}const t=B(e.vtag,e.vtext);t.$=e.vattrs;t.k=e.vchildren;t.C=e.vkey;t.L=e.vname;return t};var V=(e,t)=>{if(e!=null&&!R(e)){if(t&4){return e==="false"?false:e===""||!!e}if(t&1){return String(e)}return e}return e};var X=e=>l(e).$hostElement$;var _=(e,t,n)=>{const r=X(e);return{emit:e=>J(r,t,{bubbles:!!(n&4),composed:!!(n&2),cancelable:!!(n&1),detail:e})}};var J=(e,t,n)=>{const r=y.ce(t,n);e.dispatchEvent(r);return r};var Y=new WeakMap;var Z=(e,t,n)=>{let r=v.get(e);if(w&&n){r=r||new CSSStyleSheet;if(typeof r==="string"){r=t}else{r.replaceSync(t)}}else{r=t}v.set(e,r)};var ee=(e,t,n)=>{var r;const s=ne(t);const l=v.get(s);e=e.nodeType===11?e:m;if(l){if(typeof l==="string"){e=e.head||e;let n=Y.get(e);let o;if(!n){Y.set(e,n=new Set)}if(!n.has(s)){{o=m.createElement("style");o.innerHTML=l;const t=(r=y.T)!=null?r:D(m);if(t!=null){o.setAttribute("nonce",t)}e.insertBefore(o,e.querySelector("link"))}if(t.l&4){o.innerHTML+=p}if(n){n.add(s)}}}else if(!e.adoptedStyleSheets.includes(l)){e.adoptedStyleSheets=[...e.adoptedStyleSheets,l]}}return s};var te=e=>{const t=e.o;const n=e.$hostElement$;const r=t.l;const s=W("attachStyles",t.p);const l=ee(n.shadowRoot?n.shadowRoot:n.getRootNode(),t);if(r&10){n["s-sc"]=l;n.classList.add(l+"-h")}s()};var ne=(e,t)=>"sc-"+e.p;var re=(e,t,n,r,s,l)=>{if(n!==r){let o=i(e,t);let a=t.toLowerCase();if(t==="class"){const t=e.classList;const s=le(n);const l=le(r);t.remove(...s.filter((e=>e&&!l.includes(e))));t.add(...l.filter((e=>e&&!s.includes(e))))}else if(t==="style"){{for(const t in n){if(!r||r[t]==null){if(t.includes("-")){e.style.removeProperty(t)}else{e.style[t]=""}}}}for(const t in r){if(!n||r[t]!==n[t]){if(t.includes("-")){e.style.setProperty(t,r[t])}else{e.style[t]=r[t]}}}}else if(t==="key");else if(t==="ref"){if(r){r(e)}}else if(!o&&t[0]==="o"&&t[1]==="n"){if(t[2]==="-"){t=t.slice(3)}else if(i(h,a)){t=a.slice(2)}else{t=a[2]+t.slice(3)}if(n||r){const s=t.endsWith(oe);t=t.replace(ae,"");if(n){y.rel(e,t,n,s)}if(r){y.ael(e,t,r,s)}}}else{const a=R(r);if((o||a&&r!==null)&&!s){try{if(!e.tagName.includes("-")){const s=r==null?"":r;if(t==="list"){o=false}else if(n==null||e[t]!=s){e[t]=s}}else{e[t]=r}}catch(e){}}if(r==null||r===false){if(r!==false||e.getAttribute(t)===""){{e.removeAttribute(t)}}}else if((!o||l&4||s)&&!a){r=r===true?"":r;{e.setAttribute(t,r)}}}}};var se=/\s/;var le=e=>!e?[]:e.split(se);var oe="Capture";var ae=new RegExp(oe+"$");var ie=(e,t,n)=>{const r=t.O.nodeType===11&&t.O.host?t.O.host:t.O;const s=e&&e.$||T;const l=t.$||T;{for(const e of fe(Object.keys(s))){if(!(e in l)){re(r,e,s[e],void 0,n,t.l)}}}for(const e of fe(Object.keys(l))){re(r,e,s[e],l[e],n,t.l)}};function fe(e){return e.includes("ref")?[...e.filter((e=>e!=="ref")),"ref"]:e}var ce;var ue;var ve=false;var de=false;var pe=(e,n,r,s)=>{const l=n.k[r];let o=0;let a;let i;if(l.S!==null){a=l.O=m.createTextNode(l.S)}else{a=l.O=m.createElement(!ve&&t.slotRelocation&&l.l&2?"slot-fb":l.j);{ie(null,l,de)}if(E(ce)&&a["s-si"]!==ce){a.classList.add(a["s-si"]=ce)}if(l.k){for(o=0;o<l.k.length;++o){i=pe(e,l,o);if(i){a.appendChild(i)}}}}a["s-hn"]=ue;return a};var he=(e,t,n,r,s,l)=>{let o=e;let a;if(o.shadowRoot&&o.tagName===ue){o=o.shadowRoot}for(;s<=l;++s){if(r[s]){a=pe(null,n,s);if(a){r[s].O=a;$e(o,a,t)}}}};var me=(e,t,n)=>{for(let r=t;r<=n;++r){const t=e[r];if(t){const e=t.O;Se(t);if(e){e.remove()}}}};var ye=(e,t,n,r,s=false)=>{let l=0;let o=0;let a=0;let i=0;let f=t.length-1;let c=t[0];let u=t[f];let v=r.length-1;let d=r[0];let p=r[v];let h;let m;while(l<=f&&o<=v){if(c==null){c=t[++l]}else if(u==null){u=t[--f]}else if(d==null){d=r[++o]}else if(p==null){p=r[--v]}else if(be(c,d,s)){we(c,d,s);c=t[++l];d=r[++o]}else if(be(u,p,s)){we(u,p,s);u=t[--f];p=r[--v]}else if(be(c,p,s)){we(c,p,s);$e(e,c.O,u.O.nextSibling);c=t[++l];p=r[--v]}else if(be(u,d,s)){we(u,d,s);$e(e,u.O,c.O);u=t[--f];d=r[++o]}else{a=-1;{for(i=l;i<=f;++i){if(t[i]&&t[i].C!==null&&t[i].C===d.C){a=i;break}}}if(a>=0){m=t[a];if(m.j!==d.j){h=pe(t&&t[o],n,a)}else{we(m,d,s);t[a]=void 0;h=m.O}d=r[++o]}else{h=pe(t&&t[o],n,o);d=r[++o]}if(h){{$e(c.O.parentNode,h,c.O)}}}}if(l>f){he(e,r[v+1]==null?null:r[v+1].O,n,r,o,v)}else if(o>v){me(t,l,f)}};var be=(e,t,n=false)=>{if(e.j===t.j){if(!n){return e.C===t.C}return true}return false};var we=(e,t,n=false)=>{const r=t.O=e.O;const s=e.k;const l=t.k;const o=t.j;const a=t.S;if(a===null){{if(o==="slot"&&!ve);else{ie(e,t,de)}}if(s!==null&&l!==null){ye(r,s,t,l,n)}else if(l!==null){if(e.S!==null){r.textContent=""}he(r,null,t,l,0,l.length-1)}else if(s!==null){me(s,0,s.length-1)}}else if(e.S!==a){r.data=a}};var Se=e=>{{e.$&&e.$.ref&&e.$.ref(null);e.k&&e.k.map(Se)}};var $e=(e,t,n)=>{const r=e==null?void 0:e.insertBefore(t,n);return r};var ge=(e,t,n=false)=>{const r=e.$hostElement$;const s=e.o;const l=e.R||B(null,null);const o=q(t)?t:z(null,null,t);ue=r.tagName;if(s.D){o.$=o.$||{};s.D.map((([e,t])=>o.$[t]=r[e]))}if(n&&o.$){for(const e of Object.keys(o.$)){if(r.hasAttribute(e)&&!["key","ref","style","class"].includes(e)){o.$[e]=r[e]}}}o.j=null;o.l|=4;e.R=o;o.O=l.O=r.shadowRoot||r;{ce=r["s-sc"]}ve=(s.l&1)!==0;we(l,o,n)};var ke=(e,t)=>{if(t&&!e.M&&t["s-p"]){t["s-p"].push(new Promise((t=>e.M=t)))}};var Ce=(e,t)=>{{e.l|=16}if(e.l&4){e.l|=512;return}ke(e,e.F);const n=()=>xe(e,t);return O(n)};var xe=(e,t)=>{const n=e.$hostElement$;const r=W("scheduleUpdate",e.o.p);const s=e.t;if(!s){throw new Error(`Can't render component <${n.tagName.toLowerCase()} /> with invalid Stencil runtime! Make sure this imported component is compiled with a \`externalRuntime: true\` flag. For more information, please refer to https://stenciljs.com/docs/custom-elements#externalruntime`)}let l;if(t){{l=De(s,"componentWillLoad")}}r();return je(l,(()=>Le(e,s,t)))};var je=(e,t)=>Oe(e)?e.then(t).catch((e=>{console.error(e);t()})):t();var Oe=e=>e instanceof Promise||e&&e.then&&typeof e.then==="function";var Le=async(e,t,n)=>{var r;const s=e.$hostElement$;const l=W("update",e.o.p);const o=s["s-rc"];if(n){te(e)}const a=W("render",e.o.p);{Te(e,t,s,n)}if(o){o.map((e=>e()));s["s-rc"]=void 0}a();l();{const t=(r=s["s-p"])!=null?r:[];const n=()=>Ee(e);if(t.length===0){n()}else{Promise.all(t).then(n);e.l|=4;t.length=0}}};var Te=(e,t,n,r)=>{try{t=t.render();{e.l&=~16}{e.l|=2}{{{ge(e,t,r)}}}}catch(t){f(t,e.$hostElement$)}return null};var Ee=e=>{const t=e.o.p;const n=e.$hostElement$;const r=W("postUpdate",t);const s=e.t;const l=e.F;{De(s,"componentDidRender")}if(!(e.l&64)){e.l|=64;{Me(n)}r();{e.v(n);if(!l){Re()}}}else{r()}{if(e.M){e.M();e.M=void 0}if(e.l&512){j((()=>Ce(e,false)))}e.l&=~(4|512)}};var Re=t=>{{Me(m.documentElement)}j((()=>J(h,"appload",{detail:{namespace:e}})))};var De=(e,t,n)=>{if(e&&e[t]){try{return e[t](n)}catch(e){f(e)}}return void 0};var Me=e=>{var n;return e.classList.add((n=t.hydratedSelectorName)!=null?n:"hydrated")};var Fe=(e,t)=>l(e).i.get(t);var Pe=(e,t,n,r)=>{const s=l(e);if(!s){throw new Error(`Couldn't find host element for "${r.p}" as it is unknown to this Stencil runtime. This usually happens when integrating a 3rd party Stencil component with another Stencil component or application. Please reach out to the maintainers of the 3rd party Stencil component or report this on the Stencil Discord server (https://chat.stenciljs.com) or comment on this similar [GitHub issue](https://github.com/ionic-team/stencil/issues/5457).`)}const o=s.$hostElement$;const a=s.i.get(t);const i=s.l;const c=s.t;n=V(n,r.P[t][0]);const u=Number.isNaN(a)&&Number.isNaN(n);const v=n!==a&&!u;if((!(i&8)||a===void 0)&&v){s.i.set(t,n);if(c){if(r.U&&i&128){const e=r.U[t];if(e){e.map((e=>{try{c[e](n,a,t)}catch(e){f(e,o)}}))}}if((i&(2|16))===2){Ce(s,false)}}}};var Ue=(e,t,n)=>{var r,s;const o=e.prototype;if(t.P||(t.U||e.watchers)){if(e.watchers&&!t.U){t.U=e.watchers}const a=Object.entries((r=t.P)!=null?r:{});a.map((([e,[r]])=>{if(r&31||n&2&&r&32){Object.defineProperty(o,e,{get(){return Fe(this,e)},set(n){Pe(this,e,n,t)},configurable:true,enumerable:true})}}));if(n&1){const n=new Map;o.attributeChangedCallback=function(e,r,s){y.jmp((()=>{var a;const i=n.get(e);if(this.hasOwnProperty(i)){s=this[i];delete this[i]}else if(o.hasOwnProperty(i)&&typeof this[i]==="number"&&this[i]==s){return}else if(i==null){const n=l(this);const o=n==null?void 0:n.l;if(o&&!(o&8)&&o&128&&s!==r){const l=n.t;const o=(a=t.U)==null?void 0:a[e];o==null?void 0:o.forEach((t=>{if(l[t]!=null){l[t].call(l,s,r,e)}}))}return}this[i]=s===null&&typeof this[i]==="boolean"?false:s}))};e.observedAttributes=Array.from(new Set([...Object.keys((s=t.U)!=null?s:{}),...a.filter((([e,t])=>t[0]&15)).map((([e,r])=>{var s;const l=r[1]||e;n.set(l,e);if(r[0]&512){(s=t.D)==null?void 0:s.push([e,l])}return l}))]))}}return e};var Ae=async(e,t,n,r)=>{let s;if((t.l&32)===0){t.l|=32;const r=n.h;if(r){const e=u(n);if(e&&"then"in e){const t=H();s=await e;t()}else{s=e}if(!s){throw new Error(`Constructor for "${n.p}#${t.A}" was not found`)}if(!s.isProxied){{n.U=s.watchers}Ue(s,n,2);s.isProxied=true}const r=W("createInstance",n.p);{t.l|=8}try{new s(t)}catch(e){f(e)}{t.l&=~8}{t.l|=128}r()}else{s=e.constructor;const n=e.localName;customElements.whenDefined(n).then((()=>t.l|=128))}if(s&&s.style){let e;if(typeof s.style==="string"){e=s.style}const t=ne(n);if(!v.has(t)){const r=W("registerStyles",n.p);Z(t,e,!!(n.l&1));r()}}}const l=t.F;const o=()=>Ce(t,true);if(l&&l["s-rc"]){l["s-rc"].push(o)}else{o()}};var Ne=e=>{};var We=e=>{if((y.l&1)===0){const t=l(e);const n=t.o;const r=W("connectedCallback",n.p);if(!(t.l&1)){t.l|=1;{let n=e;while(n=n.parentNode||n.host){if(n["s-p"]){ke(t,t.F=n);break}}}if(n.P){Object.entries(n.P).map((([t,[n]])=>{if(n&31&&e.hasOwnProperty(t)){const n=e[t];delete e[t];e[t]=n}}))}{Ae(e,t,n)}}else{if(t==null?void 0:t.t);else if(t==null?void 0:t.u){t.u.then((()=>Ne()))}}r()}};var He=e=>{};var ze=async e=>{if((y.l&1)===0){const t=l(e);if(t==null?void 0:t.t);else if(t==null?void 0:t.u){t.u.then((()=>He()))}}};var Be=(e,t={})=>{var n;const r=W();const s=[];const o=t.exclude||[];const i=h.customElements;const f=m.head;const c=f.querySelector("meta[charset]");const u=m.createElement("style");const v=[];let b;let w=true;Object.assign(y,t);y.m=new URL(t.resourcesUrl||"./",m.baseURI).href;let S=false;e.map((e=>{e[1].map((t=>{var n;const r={l:t[0],p:t[1],P:t[2],N:t[3]};if(r.l&4){S=true}{r.P=t[2]}{r.D=[]}{r.U=(n=t[4])!=null?n:{}}const f=r.p;const c=class extends HTMLElement{constructor(e){super(e);this.hasRegisteredEventListeners=false;e=this;a(e,r);if(r.l&1){{if(!e.shadowRoot){{e.attachShadow({mode:"open"})}}else{if(e.shadowRoot.mode!=="open"){throw new Error(`Unable to re-use existing shadow root for ${r.p}! Mode is set to ${e.shadowRoot.mode} but Stencil only supports open shadow roots.`)}}}}}connectedCallback(){l(this);if(!this.hasRegisteredEventListeners){this.hasRegisteredEventListeners=true}if(b){clearTimeout(b);b=null}if(w){v.push(this)}else{y.jmp((()=>We(this)))}}disconnectedCallback(){y.jmp((()=>ze(this)))}componentOnReady(){return l(this).u}};r.h=e[0];if(!o.includes(f)&&!i.get(f)){s.push(f);i.define(f,Ue(c,r,1))}}))}));if(s.length>0){if(S){u.textContent+=p}{u.textContent+=s.sort()+d}if(u.innerHTML.length){u.setAttribute("data-styles","");const e=(n=y.T)!=null?n:D(m);if(e!=null){u.setAttribute("nonce",e)}f.insertBefore(u,c?c.nextSibling:f.firstChild)}}w=false;if(v.length){v.map((e=>e.connectedCallback()))}else{{y.jmp((()=>b=setTimeout(Re,30)))}}r()};var Qe=(e,t)=>t;var qe=e=>y.T=e;export{Qe as F,Q as H,X as a,Be as b,_ as c,L as g,z as h,b as p,o as r,qe as s};
//# sourceMappingURL=p-13c60fff.js.map