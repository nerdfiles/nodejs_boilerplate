var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    events = require("events"),
    port = '8125'

function load_file(uri, response) {

	var filename = path.join(process.cwd(), uri),
	    headers = {};
	
	path.exists(filename, function(exists) {
	    var ext = filename.substr(filename.lastIndexOf('.'));
	    
	    switch ( ext ) {
	       case (".css"):
	           headers["Content-Type"] = "text/css";
	           break;
           case (".js"):
	           headers["Content-Type"] = "text/javascript";
	           break;
	       case (".html"):
	           headers["Content-Type"] = "text/html";
	           break;
	       default:
	           headers["Content-Type"] = "text/plain";
	    }
	
        if ( !exists ) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}

			response.writeHead(200, headers);
			response.write(file, "binary");
			response.end();
		});
		
	});
	
}

http.createServer(function(request, response) {
    
    var uri = url.parse(request.url).pathname;

    if ( uri === '/' || uri === '' ) {
        load_file('index.html', response);
    } else {
        load_file(uri, response);
    }
    
}).listen(port);

sys.puts("Server running at http://localhost:"+port+"/");
