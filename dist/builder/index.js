"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Build = void 0;
const __1 = __importDefault(require(".."));
function Build(origin) {
    const handles = [];
    const transformers = [];
    const Generator = function (params) {
        for (const transformer of transformers) {
            params = transformer(params);
        }
        let wRequest = new __1.default(() => origin(params));
        for (const handle of handles) {
            wRequest = handle(wRequest);
        }
        return wRequest;
    };
    Generator.handle = function (handler) {
        handles.push(handler);
        return Generator;
    };
    Generator.params = function (transformer) {
        transformers.push(transformer);
        return Generator;
    };
    let cache;
    Generator.cache = function (params, keys) {
        if (!cache) {
            cache = new Map();
        }
        const key = (keys === null || keys === void 0 ? void 0 : keys.toString()) || JSON.stringify(params) || 'default';
        if (cache.has(key)) {
            const result = cache.get(key);
            return new __1.default(() => result);
        }
        else {
            const wRequest = Generator(params);
            cache.set(key, wRequest.promise());
            wRequest.after.fail(() => {
                cache.delete(key);
            });
            return wRequest;
        }
    };
    return Generator;
}
exports.Build = Build;
