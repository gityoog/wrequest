"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WRequestOriginError = exports.WRequestError = void 0;
const builder_1 = require("./builder");
const abort_1 = __importDefault(require("./callback/abort"));
const fail_1 = __importDefault(require("./callback/fail"));
const final_1 = __importDefault(require("./callback/final"));
const load_1 = __importDefault(require("./callback/load"));
const success_1 = __importDefault(require("./callback/success"));
const generator_1 = __importDefault(require("./generator"));
const utils_1 = require("./utils");
Object.defineProperty(exports, "WRequestError", { enumerable: true, get: function () { return utils_1.WRequestError; } });
Object.defineProperty(exports, "WRequestOriginError", { enumerable: true, get: function () { return utils_1.WRequestOriginError; } });
// todo 增加完整状态
// todo 增加完成状态后添加回调提示
class WRequest {
    getSuccessCallback() {
        return this.successCallback || (this.successCallback = new success_1.default());
    }
    getFailCallback() {
        return this.failCallback || (this.failCallback = new fail_1.default());
    }
    constructor(callback) {
        this.generator = new generator_1.default();
        this.debug = {
            delay: (time = 1000) => {
                this.generator.after(() => new Promise(resolve => {
                    setTimeout(() => resolve(), time);
                }));
                return this;
            },
            success: (data) => {
                var _a;
                this.generator.set(() => Promise.resolve(data));
                (_a = this.successCallback) === null || _a === void 0 ? void 0 : _a.removeMap();
                return this;
            },
            fail: (error) => {
                this.generator.set(() => Promise.reject(error));
                return this;
            }
        };
        this.after = {
            success: (callback) => {
                this.getSuccessCallback().after(callback);
                return this;
            },
            fail: (callback) => {
                this.getFailCallback().after(callback);
                return this;
            }
        };
        this.generator.set(callback);
        setTimeout(() => this.run());
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                yield ((_a = this.loadCallback) === null || _a === void 0 ? void 0 : _a.run());
                const result = yield this.generator.run();
                if ((yield ((_b = this.abortCallback) === null || _b === void 0 ? void 0 : _b.run(result))) === true) {
                    return this.destroy();
                }
                if (result.type === 'success') {
                    yield ((_c = this.successCallback) === null || _c === void 0 ? void 0 : _c.run(result.data));
                }
                else {
                    throw result.error;
                }
            }
            catch (e) {
                if (e instanceof Error && !(e instanceof utils_1.WRequestError)) {
                    console.error(e);
                }
                yield ((_d = this.failCallback) === null || _d === void 0 ? void 0 : _d.run((0, utils_1.getErrorMessage)(e), e instanceof utils_1.WRequestOriginError ? e : undefined));
            }
            finally {
                yield ((_e = this.finalCallback) === null || _e === void 0 ? void 0 : _e.run());
                this.destroy();
            }
        });
    }
    load(callback) {
        this.loadCallback || (this.loadCallback = new load_1.default());
        this.loadCallback.add(callback);
        return this;
    }
    abort(callback) {
        this.abortCallback || (this.abortCallback = new abort_1.default());
        this.abortCallback.add(callback);
        return this;
    }
    success(callback) {
        this.getSuccessCallback().add(callback);
        return this;
    }
    map(callback) {
        this.getSuccessCallback().map(callback);
        return this;
    }
    transform(callback) {
        return this.map(callback);
    }
    validate(callback) {
        this.getSuccessCallback().validate(callback);
        return this;
    }
    fail(callback) {
        this.getFailCallback().add(callback);
        return this;
    }
    final(callback) {
        this.finalCallback || (this.finalCallback = new final_1.default());
        this.finalCallback.add(callback);
        return this;
    }
    promise() {
        return new Promise((resolve, reject) => {
            this.success(data => {
                resolve(data);
            });
            this.fail(err => {
                reject(err);
                return err;
            });
        });
    }
    destroy() {
        var _a, _b, _c, _d, _e;
        this.debug = null;
        this.generator.destroy();
        (_a = this.loadCallback) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.abortCallback) === null || _b === void 0 ? void 0 : _b.destroy();
        (_c = this.successCallback) === null || _c === void 0 ? void 0 : _c.destroy();
        (_d = this.failCallback) === null || _d === void 0 ? void 0 : _d.destroy();
        (_e = this.finalCallback) === null || _e === void 0 ? void 0 : _e.destroy();
    }
}
WRequest.Build = builder_1.Build;
exports.default = WRequest;
