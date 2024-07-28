const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/res', {
      // target: 'http://121.43.170.128:3002',
      target: 'http://127.0.0.1:3002',
      changeOrigin: true
    }),
    createProxyMiddleware('/api', {
      // target: 'http://121.43.170.128:3002',
      target: 'http://127.0.0.1:3002',
      changeOrigin: true
    }),
    createProxyMiddleware('/static', {
      // target: 'http://121.43.170.128:3002',
      target: 'http://127.0.0.1:3002',
      changeOrigin: true
    }),
    createProxyMiddleware('/upload', {
      // target: 'http://121.43.170.128:3002',
      target: 'http://127.0.0.1:3002',
      changeOrigin: true
    })
  )
}
