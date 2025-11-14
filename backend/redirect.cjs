// backend/redirect.js
const http = require('http');

const PUERTO = 5173; // Port where the frontend starts
const DESTINO = 'https://canaryweather.xyz'; // My domain

http.createServer((req, res) => {
  const nuevaUrl = `${DESTINO}${req.url}`;

  res.writeHead(301, { Location: nuevaUrl });
  res.end();
}).listen(PUERTO, () => {
  console.log(`🔀 Redirección activa en http://0.0.0.0:${PUERTO}`);
});