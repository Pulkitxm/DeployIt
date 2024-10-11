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
exports.cloneRepo = cloneRepo;
const fs_1 = __importDefault(require("fs"));
const simple_git_1 = __importDefault(require("simple-git"));
const envVars_1 = require("../envVars");
const git = (0, simple_git_1.default)();
function cloneRepo(repoUrl, branch) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.default.existsSync(envVars_1.projectDir)) {
            fs_1.default.rmSync(envVars_1.projectDir, { recursive: true });
        }
        else {
            fs_1.default.mkdirSync(envVars_1.projectDir);
        }
        yield git.clone(repoUrl, envVars_1.projectDir);
        yield git.cwd(envVars_1.projectDir);
        yield git.checkout(branch);
    });
}
