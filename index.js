require('dotenv').config()
const http = require('http')

const PORT = process.env.PORT || 3000

function requestController(req, res) {
  console.log('Bienvenidos al curso')

  if (req.url !== '/') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Ruta no encontrada\n')
    return
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Despliegue01</title>
      </head>
      <body>
        <h1>Bienvenidos al curso</h1>
        <p>Aplicación corriendo en: ${PORT}</p>
      </body>
    </html>
  `)
}

const server = http.createServer(requestController)

server.listen(PORT, function () {
  console.log('Aplicacion corriendo en: ' + PORT)
})
