(()=>{var e={351:e=>{var t;var r;var n;var o;var i;var a;var c;var u;var s;var f;var l;var p;var y;var d;var v;var _;var b;var h;var m;var w;var g;var O;var j;var S;var x;(function(t){var r=typeof global==="object"?global:typeof self==="object"?self:typeof this==="object"?this:{};if(typeof define==="function"&&define.amd){define("tslib",["exports"],(function(e){t(createExporter(r,createExporter(e)))}))}else if(true&&typeof e.exports==="object"){t(createExporter(r,createExporter(e.exports)))}else{t(createExporter(r))}function createExporter(e,t){if(e!==r){if(typeof Object.create==="function"){Object.defineProperty(e,"__esModule",{value:true})}else{e.__esModule=true}}return function(r,n){return e[r]=t?t(r,n):n}}})((function(e){var P=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)if(Object.prototype.hasOwnProperty.call(t,r))e[r]=t[r]};t=function(e,t){if(typeof t!=="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");P(e,t);function __(){this.constructor=e}e.prototype=t===null?Object.create(t):(__.prototype=t.prototype,new __)};r=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o))e[o]=t[o]}return e};n=function(e,t){var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0)r[n]=e[n];if(e!=null&&typeof Object.getOwnPropertySymbols==="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++){if(t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o]))r[n[o]]=e[n[o]]}return r};o=function(e,t,r,n){var o=arguments.length,i=o<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,r):n,a;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")i=Reflect.decorate(e,t,r,n);else for(var c=e.length-1;c>=0;c--)if(a=e[c])i=(o<3?a(i):o>3?a(t,r,i):a(t,r))||i;return o>3&&i&&Object.defineProperty(t,r,i),i};i=function(e,t){return function(r,n){t(r,n,e)}};a=function(e,t){if(typeof Reflect==="object"&&typeof Reflect.metadata==="function")return Reflect.metadata(e,t)};c=function(e,t,r,n){function adopt(e){return e instanceof r?e:new r((function(t){t(e)}))}return new(r||(r=Promise))((function(r,o){function fulfilled(e){try{step(n.next(e))}catch(e){o(e)}}function rejected(e){try{step(n["throw"](e))}catch(e){o(e)}}function step(e){e.done?r(e.value):adopt(e.value).then(fulfilled,rejected)}step((n=n.apply(e,t||[])).next())}))};u=function(e,t){var r={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},n,o,i,a;return a={next:verb(0),throw:verb(1),return:verb(2)},typeof Symbol==="function"&&(a[Symbol.iterator]=function(){return this}),a;function verb(e){return function(t){return step([e,t])}}function step(a){if(n)throw new TypeError("Generator is already executing.");while(r)try{if(n=1,o&&(i=a[0]&2?o["return"]:a[0]?o["throw"]||((i=o["return"])&&i.call(o),0):o.next)&&!(i=i.call(o,a[1])).done)return i;if(o=0,i)a=[a[0]&2,i.value];switch(a[0]){case 0:case 1:i=a;break;case 4:r.label++;return{value:a[1],done:false};case 5:r.label++;o=a[1];a=[0];continue;case 7:a=r.ops.pop();r.trys.pop();continue;default:if(!(i=r.trys,i=i.length>0&&i[i.length-1])&&(a[0]===6||a[0]===2)){r=0;continue}if(a[0]===3&&(!i||a[1]>i[0]&&a[1]<i[3])){r.label=a[1];break}if(a[0]===6&&r.label<i[1]){r.label=i[1];i=a;break}if(i&&r.label<i[2]){r.label=i[2];r.ops.push(a);break}if(i[2])r.ops.pop();r.trys.pop();continue}a=t.call(e,r)}catch(e){a=[6,e];o=0}finally{n=i=0}if(a[0]&5)throw a[1];return{value:a[0]?a[1]:void 0,done:true}}};s=function(e,t){for(var r in e)if(r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r))x(t,e,r)};x=Object.create?function(e,t,r,n){if(n===undefined)n=r;var o=Object.getOwnPropertyDescriptor(t,r);if(!o||("get"in o?!t.__esModule:o.writable||o.configurable)){o={enumerable:true,get:function(){return t[r]}}}Object.defineProperty(e,n,o)}:function(e,t,r,n){if(n===undefined)n=r;e[n]=t[r]};f=function(e){var t=typeof Symbol==="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length==="number")return{next:function(){if(e&&n>=e.length)e=void 0;return{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};l=function(e,t){var r=typeof Symbol==="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),o,i=[],a;try{while((t===void 0||t-- >0)&&!(o=n.next()).done)i.push(o.value)}catch(e){a={error:e}}finally{try{if(o&&!o.done&&(r=n["return"]))r.call(n)}finally{if(a)throw a.error}}return i};p=function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(l(arguments[t]));return e};y=function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;for(var n=Array(e),o=0,t=0;t<r;t++)for(var i=arguments[t],a=0,c=i.length;a<c;a++,o++)n[o]=i[a];return n};d=function(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,i;n<o;n++){if(i||!(n in t)){if(!i)i=Array.prototype.slice.call(t,0,n);i[n]=t[n]}}return e.concat(i||Array.prototype.slice.call(t))};v=function(e){return this instanceof v?(this.v=e,this):new v(e)};_=function(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=r.apply(e,t||[]),o,i=[];return o={},verb("next"),verb("throw"),verb("return"),o[Symbol.asyncIterator]=function(){return this},o;function verb(e){if(n[e])o[e]=function(t){return new Promise((function(r,n){i.push([e,t,r,n])>1||resume(e,t)}))}}function resume(e,t){try{step(n[e](t))}catch(e){settle(i[0][3],e)}}function step(e){e.value instanceof v?Promise.resolve(e.value.v).then(fulfill,reject):settle(i[0][2],e)}function fulfill(e){resume("next",e)}function reject(e){resume("throw",e)}function settle(e,t){if(e(t),i.shift(),i.length)resume(i[0][0],i[0][1])}};b=function(e){var t,r;return t={},verb("next"),verb("throw",(function(e){throw e})),verb("return"),t[Symbol.iterator]=function(){return this},t;function verb(n,o){t[n]=e[n]?function(t){return(r=!r)?{value:v(e[n](t)),done:n==="return"}:o?o(t):t}:o}};h=function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],r;return t?t.call(e):(e=typeof f==="function"?f(e):e[Symbol.iterator](),r={},verb("next"),verb("throw"),verb("return"),r[Symbol.asyncIterator]=function(){return this},r);function verb(t){r[t]=e[t]&&function(r){return new Promise((function(n,o){r=e[t](r),settle(n,o,r.done,r.value)}))}}function settle(e,t,r,n){Promise.resolve(n).then((function(t){e({value:t,done:r})}),t)}};m=function(e,t){if(Object.defineProperty){Object.defineProperty(e,"raw",{value:t})}else{e.raw=t}return e};var T=Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:true,value:t})}:function(e,t){e["default"]=t};w=function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)if(r!=="default"&&Object.prototype.hasOwnProperty.call(e,r))x(t,e,r);T(t,e);return t};g=function(e){return e&&e.__esModule?e:{default:e}};O=function(e,t,r,n){if(r==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof t==="function"?e!==t||!n:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return r==="m"?n:r==="a"?n.call(e):n?n.value:t.get(e)};j=function(e,t,r,n,o){if(n==="m")throw new TypeError("Private method is not writable");if(n==="a"&&!o)throw new TypeError("Private accessor was defined without a setter");if(typeof t==="function"?e!==t||!o:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return n==="a"?o.call(e,r):o?o.value=r:t.set(e,r),r};S=function(e,t){if(t===null||typeof t!=="object"&&typeof t!=="function")throw new TypeError("Cannot use 'in' operator on non-object");return typeof e==="function"?t===e:e.has(t)};e("__extends",t);e("__assign",r);e("__rest",n);e("__decorate",o);e("__param",i);e("__metadata",a);e("__awaiter",c);e("__generator",u);e("__exportStar",s);e("__createBinding",x);e("__values",f);e("__read",l);e("__spread",p);e("__spreadArrays",y);e("__spreadArray",d);e("__await",v);e("__asyncGenerator",_);e("__asyncDelegator",b);e("__asyncValues",h);e("__makeTemplateObject",m);e("__importStar",w);e("__importDefault",g);e("__classPrivateFieldGet",O);e("__classPrivateFieldSet",j);e("__classPrivateFieldIn",S)}))},677:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:true});const n=r(147);const o=r(816);const i="results.json";const a=console.log;const c=50;function endOfTest(e){const t=(0,o.getCurrentHash)();if(t==="")return;const r=JSON.parse((0,n.readFileSync)(i,"utf8"));const a=e.stats;const u=e.suite.file;if(!u||!a)return;const s=r.find((e=>e.file===u))||{file:u,runs:[]};s.runs=[{gitHash:t,timestamp:(new Date).getTime(),pass:a.failures===0},...s.runs];if(s.runs.length>c)s.runs.pop();const f=[...r.filter((e=>e.file!==u)),s];if(Array.isArray(f)){(0,n.writeFileSync)(i,JSON.stringify(f,null,2))}}class Reporter{constructor(e){e.once("start",(()=>a("start"))).once("end",(()=>{endOfTest(e);const t=e.stats;if(!t)return;a(`end: ${t.passes}/${t.passes+t.failures} ok`)})).on("pass",(e=>a(`pass: ${e.fullTitle()}`))).on("fail",((e,t)=>a(`fail: ${e.fullTitle()} → ${t.message}`)))}}e.exports=Reporter},126:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:true});t.getAllFiles=void 0;const n=r(351);const o=n.__importDefault(r(17));const i=n.__importDefault(r(147));const getAllFiles=(e,t=[])=>{const r=[];const ls=e=>{i.default.readdirSync(e).filter((e=>!t.includes(e))).forEach((t=>{const n=o.default.resolve(e,t);if(i.default.lstatSync(n).isDirectory()){ls(o.default.resolve(e,t))}else{r.push(n)}}))};ls(e);return r.map((t=>t.replace(e+"/",""))).filter((e=>e!==""))};t.getAllFiles=getAllFiles},82:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:true});t.hasUncommittedChanges=t.isAncestor=t.getHash=t.getCurrentHash=t.getCommitTime=void 0;const n=r(81);function getStdout(e,t=[]){return((0,n.spawnSync)(e,t,{encoding:"utf8"}).output[1]||"").trimEnd()}function getCommitTime(e){const t=getStdout("git",["show","-s","--format=%ci",e]);return new Date(t).getTime()}t.getCommitTime=getCommitTime;function getCurrentHash(){const e=getStdout("git",["rev-parse","HEAD"]);return e.slice(0,12)}t.getCurrentHash=getCurrentHash;function getHash(e){const t=getStdout("git",["rev-parse",e]);return t.slice(0,12)}t.getHash=getHash;function isAncestor(e,t){return(0,n.spawnSync)("git",["merge-base","--is-ancestor",e,t],{encoding:"utf8"}).status===0}t.isAncestor=isAncestor;function hasUncommittedChanges(){const e=(0,n.spawnSync)("git",["status","--porcelain"],{encoding:"utf8"}).output[1];return((e===null||e===void 0?void 0:e.match(/\n/))||[]).length===0}t.hasUncommittedChanges=hasUncommittedChanges},816:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:true});const n=r(351);n.__exportStar(r(126),t);n.__exportStar(r(82),t)},81:e=>{"use strict";e.exports=require("child_process")},147:e=>{"use strict";e.exports=require("fs")},17:e=>{"use strict";e.exports=require("path")}};var t={};function __nccwpck_require__(r){var n=t[r];if(n!==undefined){return n.exports}var o=t[r]={exports:{}};var i=true;try{e[r](o,o.exports,__nccwpck_require__);i=false}finally{if(i)delete t[r]}return o.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var r=__nccwpck_require__(677);module.exports=r})();