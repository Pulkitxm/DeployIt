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
exports.runCommand = void 0;
const child_process_1 = require("child_process");
const runCommand = (_a) => __awaiter(void 0, [_a], void 0, function* ({ command, cwd, }) {
    return new Promise((resolve, reject) => {
        const process = (0, child_process_1.exec)(command, { cwd });
        console.log(`Running command: ${command}`);
        if (process.stdout) {
            process.stdout.on("data", (data) => {
                console.log(data.toString());
            });
        }
        if (process.stderr) {
            process.stderr.on("data", (data) => {
                console.error(`Error: ${data.toString()}`);
            });
        }
        process.on("close", (code) => {
            if (code === 0) {
                resolve(`Process completed with code ${code}`);
            }
            else {
                reject(new Error(`Process failed with exit code ${code}`));
            }
        });
        process.on("error", (err) => {
            reject(new Error(`Failed to start process: ${err.message}`));
        });
    });
});
exports.runCommand = runCommand;
