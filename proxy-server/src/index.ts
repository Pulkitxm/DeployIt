import express, { Request, Response } from "express";
import httpProxy from "http-proxy";

const app = express();
const PORT = 8000;

const BASE_PATH = "https://vercelclonee.s3.amazonaws.com/output";

const proxy = httpProxy.createProxy();

app.use((req: Request, res: Response) => {
  const decodedUrl = decodeURIComponent(req.url);
  req.url = decodedUrl;

  proxy.web(req, res, { target: BASE_PATH, changeOrigin: true }, (err) => {
    res.status(500).send("Something went wrong. Please try again later.");
  });
});

// @ts-ignore
proxy.on("proxyReq", (proxyReq, req: Request) => {
  if (req.url === "/") proxyReq.path += "index.html";
  proxyReq.setHeader("X-Forwarded-For", req.socket.remoteAddress || "");
});

// @ts-ignore
proxy.on("proxyRes", (proxyRes, req: Request, res: Response) => {
  delete proxyRes.headers["x-amz-request-id"];
  delete proxyRes.headers["x-amz-id-2"];
  delete proxyRes.headers["server"];

  proxyRes.headers["server"] = "devpulkit.in";
});

// @ts-ignore
proxy.on("error", (err, req: Request, res: Response) => {
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
