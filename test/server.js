// const express = require("express");
// const { Octokit } = require("@octokit/rest");
import express from "express";
import { Octokit } from "@octokit/rest";``

const app = express();
const octokit = new Octokit({ auth: "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" }); // Replace with your access token

app.get("/api/repo-content", async (req, res) => {
  const repoName = "wanderai"; // Replace with your repository name
  const repoOwner = "pulkitxm"; // Replace with the repo owner
  const path = req.query.path || "";

  try {
    const { data: contents } = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path,
    });

    const result = contents.map((content) => ({
      name: content.name,
      path: content.path,
      type: content.type, // "file" or "dir"
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching repo content:", error);
    res.status(500).send("Error fetching content.");
  }
});

app.use(express.static("public")); // Serve static files (like index.html and index.js)

app.listen(3001, () => {
  console.log("Server listening on http://localhost:3001");
});
