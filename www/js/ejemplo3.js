var http = require('http');
http.createServer(fuction(req,res){
	res.writeHead(200,{'Content-Type':'text/plain'});
	rse.end('hola #backendpro\n');
}).lesten(3000,'127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');