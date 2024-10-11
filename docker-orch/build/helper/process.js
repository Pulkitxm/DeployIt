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
exports.executeProcess = executeProcess;
const envVars_1 = require("../envVars");
function executeProcess(method_1, _a) {
    return __awaiter(this, arguments, void 0, function* (method, { initialLog, finalLog }) {
        try {
            initialLog && console.log(initialLog + "\n");
            const res = yield method();
            finalLog && console.log("\n" + finalLog + "\n");
            if (initialLog && finalLog)
                console.log("=".repeat(envVars_1.BREAK_COUNT) + "\n");
            return res;
        }
        catch (err) {
            console.error(err);
            process.exit(1);
            return null;
        }
    });
}
