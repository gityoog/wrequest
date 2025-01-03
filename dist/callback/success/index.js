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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
class SuccessCallback {
    constructor() {
        this.callbacks = [];
        this.afterCallbacks = [];
    }
    run(data) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const callback of this.callbacks) {
                switch (callback.type) {
                    case 'map':
                        data = yield callback.fn(data);
                        break;
                    case 'validate':
                        const result = yield callback.fn(data);
                        if (result !== undefined && result !== true) {
                            throw new utils_1.WRequestError(typeof result === 'string' ? result : 'validate fail');
                        }
                        break;
                    default:
                        yield callback.fn(data);
                }
            }
            for (const callback of this.afterCallbacks) {
                yield callback();
            }
        });
    }
    add(callback) {
        this.callbacks.push({
            type: 'normal',
            fn: callback
        });
    }
    map(callback) {
        this.callbacks.push({
            type: 'map',
            fn: callback
        });
    }
    validate(callback) {
        this.callbacks.push({
            type: 'validate',
            fn: callback
        });
    }
    removeMap() {
        this.callbacks = this.callbacks.filter(callback => {
            return callback.type !== 'map';
        });
    }
    removeValidate() {
        this.callbacks = this.callbacks.filter(callback => {
            return callback.type !== 'validate';
        });
    }
    after(callback) {
        this.afterCallbacks.push(callback);
    }
    destroy() {
        this.callbacks = [];
        this.afterCallbacks = [];
    }
}
exports.default = SuccessCallback;
