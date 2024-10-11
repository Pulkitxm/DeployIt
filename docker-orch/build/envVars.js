"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFile = exports.exportProjectDir = exports.workDir = exports.projectDir = exports.BREAK_COUNT = exports.REPO_URL = exports.repoUrlFromSecret = exports.BRANCH = exports.BUILD_COMMAND = exports.BUILD_FOLDER = exports.ROOT_DIR = exports.GITHUB_TOKEN = void 0;
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv.config();
exports.GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
exports.ROOT_DIR = process.env.ROOT_DIR;
exports.BUILD_FOLDER = process.env.BUILD_FOLDER;
exports.BUILD_COMMAND = (_a = process.env.BUILD_COMMAND) !== null && _a !== void 0 ? _a : "npm run build";
exports.BRANCH = process.env.BRANCH;
const PROJECT_EXPORT_DIR = (_b = process.env.PROJECT_EXPORT_DIR) !== null && _b !== void 0 ? _b : "project";
exports.repoUrlFromSecret = `https://${exports.GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git`;
exports.REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
exports.BREAK_COUNT = (_c = parseInt(process.env.BREAK_COUNT)) !== null && _c !== void 0 ? _c : 30;
exports.projectDir = path_1.default.join(__dirname, "../project");
exports.workDir = exports.ROOT_DIR ? path_1.default.join(exports.projectDir, exports.ROOT_DIR) : exports.projectDir;
exports.exportProjectDir = path_1.default.join(__dirname, "../" + PROJECT_EXPORT_DIR);
exports.logFile = exports.exportProjectDir;
[exports.projectDir, exports.exportProjectDir, exports.logFile].forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    else {
        fs_1.default.rmSync(dir, { recursive: true });
        fs_1.default.mkdirSync(dir);
    }
});
console.log({
    GITHUB_TOKEN: exports.GITHUB_TOKEN,
    REPO_OWNER,
    REPO_NAME,
    ROOT_DIR: exports.ROOT_DIR,
    BUILD_FOLDER: exports.BUILD_FOLDER,
    BUILD_COMMAND: exports.BUILD_COMMAND,
    BRANCH: exports.BRANCH,
    PROJECT_EXPORT_DIR,
    projectDir: exports.projectDir,
    workDir: exports.workDir,
    exportProjectDir: exports.exportProjectDir,
    logFile: exports.logFile,
});
