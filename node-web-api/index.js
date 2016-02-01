var http = require('http');

// The callback function that the createServer method contains is what's 
// executed every time someone visits our web page. 
http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Hello world!\n');
}).listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');
































