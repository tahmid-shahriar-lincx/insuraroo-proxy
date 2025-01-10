require('dotenv').config() // Load environment variables from a .env file if present
const https = require('https')
const http = require('http')
const httpProxy = require('http-proxy')

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  secure: false // Disable SSL verification
})

// Create an HTTPS agent that ignores SSL errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false // Ignore invalid SSL certificates
})

// Start the proxy server
const server = http.createServer((req, res) => {
  // Log the request
  console.log(req.method, req.url)
  // Rewrite the Host header to match the target server
  req.headers.host = 'insuraroo.com' // The target server expects this Host header

  // Forward the request to the target server over HTTPS
  proxy.web(req, res, {
    target: 'https://104.196.131.10',
    agent: httpsAgent // Use the HTTPS agent
  }, (err) => {
    console.error('Proxy error:', err)
    res.writeHead(502, { 'Content-Type': 'text/plain' })
    res.end('Bad Gateway')
  })
})

server.listen(process.env.PORT, () => {
  console.log(`HTTPS proxy server running on http://localhost:8080/${process.env.PORT}`)
})
