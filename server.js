var http = require('http');

var handleRequest = function(req, res){
	
};

var server = http.createServer(handleRequest);
server.listen(7000, function(){
	console.log('listening ... ');
});