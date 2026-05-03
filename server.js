const { join, extname } = require('node:path')
const { existsSync } = require('node:fs')

const port = parseInt(process.env.PORT || '4141', 10)
const distDir = join(__dirname, 'dist')

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
}

Bun.serve({
  port,
  hostname: '0.0.0.0',
  async fetch(req) {
    const url = new URL(req.url)
    let pathname = decodeURIComponent(url.pathname)
    if (pathname === '/') pathname = '/index.html'
    let filePath = join(distDir, pathname)
    if (!existsSync(filePath) || !filePath.startsWith(distDir)) {
      filePath = join(distDir, 'index.html')
    }
    const file = Bun.file(filePath)
    const ext = extname(filePath).toLowerCase()
    const headers = {
      'content-type': mime[ext] || 'application/octet-stream',
      'cache-control': pathname === '/index.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    }
    return new Response(file, { headers })
  },
})

console.log(`vue-weather listening on :${port}`)
