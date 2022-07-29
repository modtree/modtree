/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./libs/cy-reporter/src/json.ts":
/*!**************************************!*\
  !*** ./libs/cy-reporter/src/json.ts ***!
  \**************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst reporter_1 = __webpack_require__(/*! ./reporter */ \"./libs/cy-reporter/src/reporter.ts\");\nconsole.log('THIS IS THE REPORTER FILE');\nclass Reporter {\n    constructor(runner) {\n        (0, reporter_1.main)(runner);\n    }\n}\nmodule.exports = Reporter;\n\n\n//# sourceURL=webpack://modtree/./libs/cy-reporter/src/json.ts?");

/***/ }),

/***/ "./libs/cy-reporter/src/reporter.ts":
/*!******************************************!*\
  !*** ./libs/cy-reporter/src/reporter.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Reporter = exports.main = void 0;\nconst child_process_1 = __webpack_require__(/*! child_process */ \"child_process\");\nconst log = console.log;\n// core logic\nconst main = (runner) => {\n    // start forked process for sender\n    // path given here is relative to apps/web-e2e\n    const sender = (0, child_process_1.fork)('reporters/sender', [], {\n        detached: true,\n    });\n    // package data to send to sender\n    const send = (action) => sender.send({\n        action,\n        data: { stats: runner.stats, file: runner.suite.file },\n    });\n    // send data to postgres\n    runner.once('end', () => send('end'));\n    runner.once('start', () => send('start'));\n    // intermittent stuff\n    runner.on('pass', (t) => log('pass:', t.fullTitle()));\n    runner.on('fail', (t, err) => log('fail:', t.fullTitle(), '→', err.message));\n    // upon the reporter script (this script) exiting,\n    // disconnect the sender to allow it to gracefully exit too\n    process.on('exit', () => {\n        if (sender && sender.connected) {\n            sender.disconnect();\n        }\n    });\n};\nexports.main = main;\n/**\n * the reporter class\n * the constructor is called upon the execution of a reported test\n */\nclass Reporter {\n    constructor(runner) {\n        (0, exports.main)(runner);\n    }\n}\nexports.Reporter = Reporter;\n\n\n//# sourceURL=webpack://modtree/./libs/cy-reporter/src/reporter.ts?");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./libs/cy-reporter/src/json.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;