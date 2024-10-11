"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envVars_1 = require("./envVars");
const build_1 = require("./helper/build");
if (!envVars_1.GITHUB_TOKEN || !envVars_1.REPO_URL) {
    console.error("Error: Missing environment variables.");
    process.exit(1);
}
(0, build_1.buildAndCLone)();
