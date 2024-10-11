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
exports.buildAndCLone = void 0;
const envVars_1 = require("../envVars");
const shell_1 = require("../helper/shell");
const git_1 = require("./git");
const process_1 = require("./process");
const buildAndCLone = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, process_1.executeProcess)(function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!envVars_1.REPO_URL || !envVars_1.GITHUB_TOKEN || !envVars_1.BRANCH) {
                    console.error("Error: Missing environment variables.");
                    return process.exit(1);
                }
                yield (0, git_1.cloneRepo)(envVars_1.repoUrlFromSecret, envVars_1.BRANCH);
            });
        }, {
            initialLog: "Cloning repository from Github",
            finalLog: `Project cloned`,
        });
        yield (0, process_1.executeProcess)(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, shell_1.runCommand)({
                    command: "npm install",
                    cwd: envVars_1.workDir,
                });
            });
        }, {
            initialLog: "Installing dependencies",
            finalLog: `Successfully installed dependencies`,
        });
        yield (0, process_1.executeProcess)(function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!envVars_1.BUILD_COMMAND) {
                    console.error("Error: Missing BUILD_COMMAND");
                    process.exit(1);
                }
                console.log("Building the project", envVars_1.BUILD_COMMAND);
                yield (0, shell_1.runCommand)({
                    command: envVars_1.BUILD_COMMAND,
                    cwd: envVars_1.workDir,
                });
            });
        }, {
            initialLog: "Building the project",
            finalLog: `Successfully cloned, installed dependencies, and built the project`,
        });
        console.log("Successfully built the project");
        yield (0, process_1.executeProcess)(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, shell_1.runCommand)({
                    command: `mv '${envVars_1.workDir}/${envVars_1.BUILD_FOLDER}/'* '${envVars_1.exportProjectDir}'`,
                    cwd: envVars_1.workDir,
                });
            });
        }, {});
    }
    catch (err) {
        console.error(`Failed to complete the process: ${err.message}`);
        process.exit(1);
    }
});
exports.buildAndCLone = buildAndCLone;
