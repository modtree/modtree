/******/ ;(() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ 351: /***/ (module) => {
      /******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
      /* global global, define, System, Reflect, Promise */
      var __extends
      var __assign
      var __rest
      var __decorate
      var __param
      var __metadata
      var __awaiter
      var __generator
      var __exportStar
      var __values
      var __read
      var __spread
      var __spreadArrays
      var __spreadArray
      var __await
      var __asyncGenerator
      var __asyncDelegator
      var __asyncValues
      var __makeTemplateObject
      var __importStar
      var __importDefault
      var __classPrivateFieldGet
      var __classPrivateFieldSet
      var __classPrivateFieldIn
      var __createBinding
      ;(function (factory) {
        var root =
          typeof global === 'object'
            ? global
            : typeof self === 'object'
            ? self
            : typeof this === 'object'
            ? this
            : {}
        if (typeof define === 'function' && define.amd) {
          define('tslib', ['exports'], function (exports) {
            factory(createExporter(root, createExporter(exports)))
          })
        } else if (true && typeof module.exports === 'object') {
          factory(createExporter(root, createExporter(module.exports)))
        } else {
          factory(createExporter(root))
        }
        function createExporter(exports, previous) {
          if (exports !== root) {
            if (typeof Object.create === 'function') {
              Object.defineProperty(exports, '__esModule', { value: true })
            } else {
              exports.__esModule = true
            }
          }
          return function (id, v) {
            return (exports[id] = previous ? previous(id, v) : v)
          }
        }
      })(function (exporter) {
        var extendStatics =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (d, b) {
              d.__proto__ = b
            }) ||
          function (d, b) {
            for (var p in b)
              if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]
          }

        __extends = function (d, b) {
          if (typeof b !== 'function' && b !== null)
            throw new TypeError(
              'Class extends value ' +
                String(b) +
                ' is not a constructor or null'
            )
          extendStatics(d, b)
          function __() {
            this.constructor = d
          }
          d.prototype =
            b === null
              ? Object.create(b)
              : ((__.prototype = b.prototype), new __())
        }

        __assign =
          Object.assign ||
          function (t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i]
              for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
            }
            return t
          }

        __rest = function (s, e) {
          var t = {}
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
              t[p] = s[p]
          if (s != null && typeof Object.getOwnPropertySymbols === 'function')
            for (
              var i = 0, p = Object.getOwnPropertySymbols(s);
              i < p.length;
              i++
            ) {
              if (
                e.indexOf(p[i]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(s, p[i])
              )
                t[p[i]] = s[p[i]]
            }
          return t
        }

        __decorate = function (decorators, target, key, desc) {
          var c = arguments.length,
            r =
              c < 3
                ? target
                : desc === null
                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                : desc,
            d
          if (
            typeof Reflect === 'object' &&
            typeof Reflect.decorate === 'function'
          )
            r = Reflect.decorate(decorators, target, key, desc)
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if ((d = decorators[i]))
                r =
                  (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) ||
                  r
          return c > 3 && r && Object.defineProperty(target, key, r), r
        }

        __param = function (paramIndex, decorator) {
          return function (target, key) {
            decorator(target, key, paramIndex)
          }
        }

        __metadata = function (metadataKey, metadataValue) {
          if (
            typeof Reflect === 'object' &&
            typeof Reflect.metadata === 'function'
          )
            return Reflect.metadata(metadataKey, metadataValue)
        }

        __awaiter = function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value)
                })
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value))
              } catch (e) {
                reject(e)
              }
            }
            function rejected(value) {
              try {
                step(generator['throw'](value))
              } catch (e) {
                reject(e)
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected)
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            )
          })
        }

        __generator = function (thisArg, body) {
          var _ = {
              label: 0,
              sent: function () {
                if (t[0] & 1) throw t[1]
                return t[1]
              },
              trys: [],
              ops: [],
            },
            f,
            y,
            t,
            g
          return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === 'function' &&
              (g[Symbol.iterator] = function () {
                return this
              }),
            g
          )
          function verb(n) {
            return function (v) {
              return step([n, v])
            }
          }
          function step(op) {
            if (f) throw new TypeError('Generator is already executing.')
            while (_)
              try {
                if (
                  ((f = 1),
                  y &&
                    (t =
                      op[0] & 2
                        ? y['return']
                        : op[0]
                        ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                        : y.next) &&
                    !(t = t.call(y, op[1])).done)
                )
                  return t
                if (((y = 0), t)) op = [op[0] & 2, t.value]
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op
                    break
                  case 4:
                    _.label++
                    return { value: op[1], done: false }
                  case 5:
                    _.label++
                    y = op[1]
                    op = [0]
                    continue
                  case 7:
                    op = _.ops.pop()
                    _.trys.pop()
                    continue
                  default:
                    if (
                      !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                      (op[0] === 6 || op[0] === 2)
                    ) {
                      _ = 0
                      continue
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                      _.label = op[1]
                      break
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1]
                      t = op
                      break
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2]
                      _.ops.push(op)
                      break
                    }
                    if (t[2]) _.ops.pop()
                    _.trys.pop()
                    continue
                }
                op = body.call(thisArg, _)
              } catch (e) {
                op = [6, e]
                y = 0
              } finally {
                f = t = 0
              }
            if (op[0] & 5) throw op[1]
            return { value: op[0] ? op[1] : void 0, done: true }
          }
        }

        __exportStar = function (m, o) {
          for (var p in m)
            if (p !== 'default' && !Object.prototype.hasOwnProperty.call(o, p))
              __createBinding(o, m, p)
        }

        __createBinding = Object.create
          ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              var desc = Object.getOwnPropertyDescriptor(m, k)
              if (
                !desc ||
                ('get' in desc
                  ? !m.__esModule
                  : desc.writable || desc.configurable)
              ) {
                desc = {
                  enumerable: true,
                  get: function () {
                    return m[k]
                  },
                }
              }
              Object.defineProperty(o, k2, desc)
            }
          : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
            }

        __values = function (o) {
          var s = typeof Symbol === 'function' && Symbol.iterator,
            m = s && o[s],
            i = 0
          if (m) return m.call(o)
          if (o && typeof o.length === 'number')
            return {
              next: function () {
                if (o && i >= o.length) o = void 0
                return { value: o && o[i++], done: !o }
              },
            }
          throw new TypeError(
            s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
          )
        }

        __read = function (o, n) {
          var m = typeof Symbol === 'function' && o[Symbol.iterator]
          if (!m) return o
          var i = m.call(o),
            r,
            ar = [],
            e
          try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
              ar.push(r.value)
          } catch (error) {
            e = { error: error }
          } finally {
            try {
              if (r && !r.done && (m = i['return'])) m.call(i)
            } finally {
              if (e) throw e.error
            }
          }
          return ar
        }

        /** @deprecated */
        __spread = function () {
          for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]))
          return ar
        }

        /** @deprecated */
        __spreadArrays = function () {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j]
          return r
        }

        __spreadArray = function (to, from, pack) {
          if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
              if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i)
                ar[i] = from[i]
              }
            }
          return to.concat(ar || Array.prototype.slice.call(from))
        }

        __await = function (v) {
          return this instanceof __await ? ((this.v = v), this) : new __await(v)
        }

        __asyncGenerator = function (thisArg, _arguments, generator) {
          if (!Symbol.asyncIterator)
            throw new TypeError('Symbol.asyncIterator is not defined.')
          var g = generator.apply(thisArg, _arguments || []),
            i,
            q = []
          return (
            (i = {}),
            verb('next'),
            verb('throw'),
            verb('return'),
            (i[Symbol.asyncIterator] = function () {
              return this
            }),
            i
          )
          function verb(n) {
            if (g[n])
              i[n] = function (v) {
                return new Promise(function (a, b) {
                  q.push([n, v, a, b]) > 1 || resume(n, v)
                })
              }
          }
          function resume(n, v) {
            try {
              step(g[n](v))
            } catch (e) {
              settle(q[0][3], e)
            }
          }
          function step(r) {
            r.value instanceof __await
              ? Promise.resolve(r.value.v).then(fulfill, reject)
              : settle(q[0][2], r)
          }
          function fulfill(value) {
            resume('next', value)
          }
          function reject(value) {
            resume('throw', value)
          }
          function settle(f, v) {
            if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1])
          }
        }

        __asyncDelegator = function (o) {
          var i, p
          return (
            (i = {}),
            verb('next'),
            verb('throw', function (e) {
              throw e
            }),
            verb('return'),
            (i[Symbol.iterator] = function () {
              return this
            }),
            i
          )
          function verb(n, f) {
            i[n] = o[n]
              ? function (v) {
                  return (p = !p)
                    ? { value: __await(o[n](v)), done: n === 'return' }
                    : f
                    ? f(v)
                    : v
                }
              : f
          }
        }

        __asyncValues = function (o) {
          if (!Symbol.asyncIterator)
            throw new TypeError('Symbol.asyncIterator is not defined.')
          var m = o[Symbol.asyncIterator],
            i
          return m
            ? m.call(o)
            : ((o =
                typeof __values === 'function'
                  ? __values(o)
                  : o[Symbol.iterator]()),
              (i = {}),
              verb('next'),
              verb('throw'),
              verb('return'),
              (i[Symbol.asyncIterator] = function () {
                return this
              }),
              i)
          function verb(n) {
            i[n] =
              o[n] &&
              function (v) {
                return new Promise(function (resolve, reject) {
                  ;(v = o[n](v)), settle(resolve, reject, v.done, v.value)
                })
              }
          }
          function settle(resolve, reject, d, v) {
            Promise.resolve(v).then(function (v) {
              resolve({ value: v, done: d })
            }, reject)
          }
        }

        __makeTemplateObject = function (cooked, raw) {
          if (Object.defineProperty) {
            Object.defineProperty(cooked, 'raw', { value: raw })
          } else {
            cooked.raw = raw
          }
          return cooked
        }

        var __setModuleDefault = Object.create
          ? function (o, v) {
              Object.defineProperty(o, 'default', {
                enumerable: true,
                value: v,
              })
            }
          : function (o, v) {
              o['default'] = v
            }

        __importStar = function (mod) {
          if (mod && mod.__esModule) return mod
          var result = {}
          if (mod != null)
            for (var k in mod)
              if (
                k !== 'default' &&
                Object.prototype.hasOwnProperty.call(mod, k)
              )
                __createBinding(result, mod, k)
          __setModuleDefault(result, mod)
          return result
        }

        __importDefault = function (mod) {
          return mod && mod.__esModule ? mod : { default: mod }
        }

        __classPrivateFieldGet = function (receiver, state, kind, f) {
          if (kind === 'a' && !f)
            throw new TypeError('Private accessor was defined without a getter')
          if (
            typeof state === 'function'
              ? receiver !== state || !f
              : !state.has(receiver)
          )
            throw new TypeError(
              'Cannot read private member from an object whose class did not declare it'
            )
          return kind === 'm'
            ? f
            : kind === 'a'
            ? f.call(receiver)
            : f
            ? f.value
            : state.get(receiver)
        }

        __classPrivateFieldSet = function (receiver, state, value, kind, f) {
          if (kind === 'm')
            throw new TypeError('Private method is not writable')
          if (kind === 'a' && !f)
            throw new TypeError('Private accessor was defined without a setter')
          if (
            typeof state === 'function'
              ? receiver !== state || !f
              : !state.has(receiver)
          )
            throw new TypeError(
              'Cannot write private member to an object whose class did not declare it'
            )
          return (
            kind === 'a'
              ? f.call(receiver, value)
              : f
              ? (f.value = value)
              : state.set(receiver, value),
            value
          )
        }

        __classPrivateFieldIn = function (state, receiver) {
          if (
            receiver === null ||
            (typeof receiver !== 'object' && typeof receiver !== 'function')
          )
            throw new TypeError("Cannot use 'in' operator on non-object")
          return typeof state === 'function'
            ? receiver === state
            : state.has(receiver)
        }

        exporter('__extends', __extends)
        exporter('__assign', __assign)
        exporter('__rest', __rest)
        exporter('__decorate', __decorate)
        exporter('__param', __param)
        exporter('__metadata', __metadata)
        exporter('__awaiter', __awaiter)
        exporter('__generator', __generator)
        exporter('__exportStar', __exportStar)
        exporter('__createBinding', __createBinding)
        exporter('__values', __values)
        exporter('__read', __read)
        exporter('__spread', __spread)
        exporter('__spreadArrays', __spreadArrays)
        exporter('__spreadArray', __spreadArray)
        exporter('__await', __await)
        exporter('__asyncGenerator', __asyncGenerator)
        exporter('__asyncDelegator', __asyncDelegator)
        exporter('__asyncValues', __asyncValues)
        exporter('__makeTemplateObject', __makeTemplateObject)
        exporter('__importStar', __importStar)
        exporter('__importDefault', __importDefault)
        exporter('__classPrivateFieldGet', __classPrivateFieldGet)
        exporter('__classPrivateFieldSet', __classPrivateFieldSet)
        exporter('__classPrivateFieldIn', __classPrivateFieldIn)
      })

      /***/
    },

    /***/ 677: /***/ (module, exports, __nccwpck_require__) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', { value: true })
      const fs_1 = __nccwpck_require__(147)
      const utils_1 = __nccwpck_require__(816)
      const filepath = 'results.json'
      const log = console.log
      const historyLength = 50
      function endOfTest(runner) {
        const gitHash = (0, utils_1.getCurrentHash)()
        if (gitHash === '') return
        const json = JSON.parse((0, fs_1.readFileSync)(filepath, 'utf8'))
        const stats = runner.stats
        const file = runner.suite.file
        if (!file || !stats) return
        /**
         * read current file data from json
         * if it's not found, then create a new blank entry
         */
        const fileData = json.find((t) => t.file === file) || {
          file,
          runs: [],
        }
        /**
         * push the status of the current test run
         */
        fileData.runs = [
          {
            gitHash,
            timestamp: new Date().getTime(),
            pass: stats.failures === 0,
          },
          ...fileData.runs,
        ]
        if (fileData.runs.length > historyLength) fileData.runs.pop()
        /**
         * push the file's data back into the json data
         */
        const final = [...json.filter((t) => t.file !== file), fileData]
        /**
         * update the json file
         */
        if (Array.isArray(final)) {
          ;(0, fs_1.writeFileSync)(filepath, JSON.stringify(final, null, 2))
        }
      }
      class Reporter {
        constructor(runner) {
          runner
            .once('start', () => log('start'))
            .once('end', () => {
              endOfTest(runner)
              const stats = runner.stats
              if (!stats) return
              log(`end: ${stats.passes}/${stats.passes + stats.failures} ok`)
            })
            .on('pass', (t) => log(`pass: ${t.fullTitle()}`))
            .on('fail', (t, err) =>
              log(`fail: ${t.fullTitle()} → ${err.message}`)
            )
        }
      }
      module.exports = Reporter

      /***/
    },

    /***/ 126: /***/ (
      __unused_webpack_module,
      exports,
      __nccwpck_require__
    ) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', { value: true })
      exports.getAllFiles = void 0
      const tslib_1 = __nccwpck_require__(351)
      const path_1 = tslib_1.__importDefault(__nccwpck_require__(17))
      const fs_1 = tslib_1.__importDefault(__nccwpck_require__(147))
      /**
       * gets all files recursively under the root provided
       */
      const getAllFiles = (root, ignore = []) => {
        const allFiles = []
        const ls = (cwd) => {
          fs_1.default
            .readdirSync(cwd)
            .filter((x) => !ignore.includes(x))
            .forEach((file) => {
              const filepath = path_1.default.resolve(cwd, file)
              if (fs_1.default.lstatSync(filepath).isDirectory()) {
                ls(path_1.default.resolve(cwd, file))
              } else {
                allFiles.push(filepath)
              }
            })
        }
        ls(root)
        return allFiles
          .map((path) => path.replace(root + '/', ''))
          .filter((entry) => entry !== '')
      }
      exports.getAllFiles = getAllFiles

      /***/
    },

    /***/ 82: /***/ (__unused_webpack_module, exports, __nccwpck_require__) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', { value: true })
      exports.hasUncommittedChanges =
        exports.isAncestor =
        exports.getCurrentHash =
        exports.getCommitTime =
          void 0
      const child_process_1 = __nccwpck_require__(81)
      /**
       * gets stdout of a shell command
       */
      function getStdout(cmd, args = []) {
        return (
          (0, child_process_1.spawnSync)(cmd, args, {
            encoding: 'utf8',
          }).output[1] || ''
        ).trimEnd()
      }
      /**
       * extract epoch time (in milliseconds) from a commit id or a reference
       *
       * @param {string} commitId
       * @returns {number} epoch time
       */
      function getCommitTime(commitId) {
        const output = getStdout('git', [
          'show',
          '-s',
          '--format=%ci',
          commitId,
        ])
        return new Date(output).getTime()
      }
      exports.getCommitTime = getCommitTime
      /**
       * get current git hash, specifically of HEAD
       *
       * @returns {string}
       */
      function getCurrentHash() {
        const output = getStdout('git', ['rev-parse', 'HEAD'])
        return output.slice(0, 12)
      }
      exports.getCurrentHash = getCurrentHash
      /**
       * checks if a commit hash is ancestor of another
       *
       * @param {string} ancestor
       * @param {string} child
       * @returns {boolean}
       */
      function isAncestor(ancestor, child) {
        return (
          (0, child_process_1.spawnSync)(
            'git',
            ['merge-base', '--is-ancestor', ancestor, child],
            {
              encoding: 'utf8',
            }
          ).status === 0
        )
      }
      exports.isAncestor = isAncestor
      /**
       * checks if there are uncommitted changes
       *
       * @returns {boolean}
       */
      function hasUncommittedChanges() {
        const output = (0, child_process_1.spawnSync)(
          'git',
          ['status', '--porcelain'],
          {
            encoding: 'utf8',
          }
        ).output[1]
        return (
          (
            (output === null || output === void 0
              ? void 0
              : output.match(/\n/)) || []
          ).length === 0
        )
      }
      exports.hasUncommittedChanges = hasUncommittedChanges

      /***/
    },

    /***/ 816: /***/ (
      __unused_webpack_module,
      exports,
      __nccwpck_require__
    ) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', { value: true })
      const tslib_1 = __nccwpck_require__(351)
      tslib_1.__exportStar(__nccwpck_require__(126), exports)
      tslib_1.__exportStar(__nccwpck_require__(82), exports)

      /***/
    },

    /***/ 81: /***/ (module) => {
      'use strict'
      module.exports = require('child_process')

      /***/
    },

    /***/ 147: /***/ (module) => {
      'use strict'
      module.exports = require('fs')

      /***/
    },

    /***/ 17: /***/ (module) => {
      'use strict'
      module.exports = require('path')

      /***/
    },

    /******/
  }
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {}
  /******/
  /******/ // The require function
  /******/ function __nccwpck_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId]
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    })
    /******/
    /******/ // Execute the module function
    /******/ var threw = true
    /******/ try {
      /******/ __webpack_modules__[moduleId](
        module,
        module.exports,
        __nccwpck_require__
      )
      /******/ threw = false
      /******/
    } finally {
      /******/ if (threw) delete __webpack_module_cache__[moduleId]
      /******/
    }
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/compat */
  /******/
  /******/ if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/'
  /******/
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module is referenced by other modules so it can't be inlined
  /******/ var __webpack_exports__ = __nccwpck_require__(677)
  /******/ module.exports = __webpack_exports__
  /******/
  /******/
})()
