import express from "express";
import httpProxy from "http-proxy";
import url from "url";

const app = express();
const PORT = 8000;
const BASE_PATH = "https://test-vultr.s3.ap-south-1.amazonaws.com";
const proxy = httpProxy.createProxy();

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];
  req.subdomain = subdomain;

  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req) => {
  const subdomain = req.subdomain;
  let path = url.parse(req.url).pathname;

  if (path === "/" || !path.includes(".")) {
    path = "/index.html";
  }

  proxyReq.path = `/${subdomain}${path}`;

  proxyReq.setHeader("X-Forwarded-Host", req.headers.host);
  proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
  proxyReq.setHeader("Server", "devpulkit.in");
});

proxy.on("proxyRes", (proxyRes, req, res) => {
  const awsKeywords = ["amz-", "x-amz-", "s3", "aws"];

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
