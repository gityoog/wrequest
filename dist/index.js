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
const abort_1 = __importDefault(require("./callback/abort"));
const fail_1 = __importDefault(require("./callback/fail"));
const final_1 = __importDefault(require("./callback/final"));
const load_1 = __importDefault(require("./callback/load"));
const success_1 = __importDefault(require("./callback/success"));
const generator_1 = __importDefault(require("./generator"));
const utils_1 = require("./utils");
class WRequest {
    constructor(callback) {
        this.generator = new generator_1.default();
        this.loadCallback = new load_1.default();
        this.abortCallback = new abort_1.default();
        this.successCallback = new success_1.default();
        this.failCallback = new fail_1.default();
        this.finalCallback = new final_1.default();
        this.debug = {
            delay: (time = 1000) => {
                this.generator.after(() => new Promise(resolve => {
                    setTimeout(() => resolve(), time);
                }));
                return this;
            },
            success: (data) => {
                this.generator.set(() => Promise.resolve(data));
                return this;
            },
            fail: (error) => {
                this.generator.set(() => Promise.reject(error));
                return this;
            }
        };
        this.after = {
            success: (callback) => {
                this.successCallback.after(callback);
                return this;
            },
            fail: (callback) => {
                this.failCallback.after(callback);
                return this;
            }
        };
        this.generator.set(callback);
        setTimeout(() => this.run());
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.loadCallback.run();
                const result = yield this.generator.run();
                if ((yield this.abortCallback.run()) === true) {
                    this.destroy();
                    return;
                }
                yield this.successCallback.run(result);
            }
            catch (e) {
                yield this.failCallback.run((0, utils_1.getErrorMessage)(e));
            }
            finally {
                yield this.finalCallback.run();
                this.destroy();
            }
        });
    }
    load(callback) {
        this.loadCallback.add(callback);
        return this;
    }
    abort(callback) {
        this.abortCallback.add(callback);
        return this;
    }
    success(callback) {
        this.successCallback.add(callback);
        return this;
    }
    map(callback) {
        this.successCallback.map(callback);
        return this;
    }
    transform(callback) {
        return this.map(callback);
    }
    validate(callback) {
        this.successCallback.validate(callback);
        return this;
    }
    error(callback) {
        this.failCallback.add(callback);
        return this;
    }
    final(callback) {
        this.finalCallback.add(callback);
        return this;
    }
    destroy() {
        this.debug = null;
        this.generator.destroy();
        this.loadCallback.destroy();
        this.abortCallback.destroy();
        this.successCallback.destroy();
        this.failCallback.destroy();
        this.finalCallback.destroy();
    }
}
exports.default = WRequest;
