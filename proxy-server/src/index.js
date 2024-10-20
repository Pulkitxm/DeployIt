import express from "express";
import httpProxy from "http-proxy";
import url from "url";
import { getProjectDetails } from "./db.js";
import { NOT_FOUND_PATH, BASE_PATH, CACHE_EXPIRY, DOMAIN } from "./envVars.js";
import { getDetails, setDetails } from "./redis.js";

const app = express();
const PORT = 8000;
const proxy = httpProxy.createProxy();

app.use(async (req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];
  console.log(subdomain);
  const slug = subdomain;
  let data = { id: null, private: false };

  try {
    const cachedData = await getDetails(slug);
    if (cachedData) {
      console.log("Using cached data");
      data = JSON.parse(cachedData);
    } else {
      console.log("Fetching data from database");
      const newData = await getProjectDetails(slug);
      if (newData && newData.id) {
        data = newData;
        setDetails(slug, JSON.stringify(data), CACHE_EXPIRY);
      }
    }
  } catch (err) {
    console.log(err);
  }

  if (!data.id || data.private || data.status != "build_success") {
    proxy.web(req, res, { target: NOT_FOUND_PATH, changeOrigin: true });
    return;
  }

  req.id = data.id;
  const resolvesTo = `${BASE_PATH}/${data.id}`;
  proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req) => {
  const id = req.id;
  let path = url.parse(req.url).pathname;

  if (path === "/" || !path.includes(".")) {
    path = "/index.html";
  }
  if (id) {
    proxyReq.path = `/${id}${path}`;
  } else {
    proxyReq.path = path;
  }

  proxyReq.setHeader("X-Forwarded-Host", req.headers.host);
  proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
  proxyReq.setHeader("Server", "devpulkit.in");
});

proxy.on("proxyRes", (proxyRes, req, res) => {
  const awsKeywords = [
    "amz-",
    "x-amz-",
    "s3",
    "aws",
    "vercel",
    "cdn",
    "digitaloceanspaces",
    "cloudflare",
    "cloudfront",
    "aws-us-gov",
    "aws-cn",
    "aws-iso",
    "aws-iso-b",
    "digitalocean",
    "aws-s3",
    "aws-s3-cn",
    "aws-s3-us-gov",
    "aws-s3-iso",
    "aws-s3-iso-b",
  ];

  Object.keys(proxyRes.headers).forEach((header) => {
    const headerLower = header.toLowerCase();
    const valueLower = String(proxyRes.headers[header]).toLowerCase();
    if (
      awsKeywords.some(
        (keyword) =>
          headerLower.includes(keyword) || valueLower.includes(keyword),
      )
    ) {
      delete proxyRes.headers[header];
    }
  });

  proxyRes.headers["server"] = "devpulkit.in";
  proxyRes.headers["x-powered-by"] = "devpulkit.in";
});

proxy.on("error", (err, req, res) => {
  console.error("Proxy Error:", err);
  res.status(500).send("Proxy Error");
});

app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
