const url = "http://localhost:4000";

const PROXY_CONFIG = [
  {
    context: ["/api"],
    target: url,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader("X-Forwarded-For", req.connection.remoteAddress);
    },
  },
  {
    context: ["/auth"],
    target: url,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader("X-Forwarded-For", req.connection.remoteAddress);
    },
  },
  {
    context: ["/file"],
    target: url,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader("X-Forwarded-For", req.connection.remoteAddress);
    },
  },
];

module.exports = PROXY_CONFIG;
