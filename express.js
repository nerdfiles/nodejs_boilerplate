"use strict";

/* == CONFIG =================================== */

var config = {};

config['host'] =						'localhost';
config['address'] =         '127.0.0.1';
config['frontend_port'] =   3000;
config['backend_port'] =    27017;


/* == REQUIRES =================================== */

/* node */

var Sys = require( 'sys' ),
    Url = require( 'url' ),
    Path = require( 'path' ),
    Fs = require( 'fs' );
    
/* jade */

var Jade = require( 'jade' );

/* express */

var Express = require( 'express' ),
    App = Express.createServer();

/* express third-party */

var Resourse = require( 'express-resource' ),
    Expose = require('express-expose');
    
/* mongodb */

var Db = require( 'mongodb' ).Db,
    Server = require( 'mongodb' ).Server,
    DbServer = new Db( 'journal', new Server( config["address"], config["backend_port"], {} ) );

/* request */

var Request = require( 'request' );

Request('http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //console.log(body) // Print the google web page.
  }
});

/* optimist */

var Optimist = require( 'optimist' );

/* colors */

var Colors = require( 'colors' );

/* socket.io */

var Io = require( 'socket.io' ).listen(App);


/* == CONFIG =================================== */

function handler(request, response) {
  Fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      response.writeHead(500);
      return response.end('Error loading index.html');
    }

    response.writeHead(200);
    response.end(data);
  });
}


/* == CONFIG =================================== */

App.configure(function(){

  App.set('views', __dirname + '/views');
  App.set('view engine', 'jade');
  App.set('view options', {
    layout: false
  });
  
  App.use(Express.methodOverride());
  App.use(Express.bodyParser());
  App.use(Express.static(__dirname + '/_assets'));
  App.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));
  App.use(require('stylus').middleware({ src: __dirname + '/_assets', compile: compile }));

  function compile (str, path) {
    return stylus(str)
      .set('filename', path)
      .use(nib());
  };

  App.use(App.router);
  
});

App.configure('development', function(){
  App.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));
});

App.configure('production', function(){
  App.use(Express.errorHandler());
});


/* == VIEWS =================================== */

App.get('/', function(request, response) {
  
  var uri = Url.parse(request.url).pathname;
  
  response.render('index', { 
    title: 'Node Test',
  });
  
});

App.get('/test', function(request, response) {
  
  var uri = Url.parse(request.url).pathname;
  
  response.render('test', { 
    title: 'Node Test',
  });
  
});

App.get('/socketio-test', function(request, response) {

  response.render('socket-index', {
    title: 'Socket.IO Test',
  });

});


/* == START =================================== */

App.listen( config["frontend_port"], function() {
  var addr = App.address();
  console.log( 'Server running at '.green + ('http://' + addr.address + ':' + addr.port + '/').yellow );
});


/* == MONGODB =================================== */
/*
DbServer.open(function(err, pClient) {
  DbServer.collection('test_insert', insertData);
  DbServer.collection('test_insert', removeData);
});
*/

/* == SOCKET.IO =================================== */


Io.sockets.on('connection', function (socket) {
	// spit out some data on connect
  socket.emit('news', { hello: 'world!!' });
	
	// use an event
  socket.on('some event', function (data) {
		console.log(data);
  });

	socket.on('test form', function(data) {
		DbServer.open(function(err, pClient) {
			DbServer.collection('test', function(err, collection) {
				console.log(data.form);
				console.log('record shit to db?');
				collection.insert({name: data.form});
			});
			//DbServer.collection('test_insert', removeData);
		});
	});
});


/* == CRUD =================================== */

var insertData = function(err, collection) {
  collection.insert({name: "Kristiono Setyadi"});
  collection.insert({name: "Meghan Gill"});
  collection.insert({name: "Spiderman"});
  // you can add as many object as you want into the database
}

var removeData = function(err, collection) {
  collection.remove({name: "Kristiono Setyadi"});
  collection.remove({name: "Meghan Gill"});
  collection.remove({name: "Spiderman"});
}

var updateData = function(err, collection) {
  collection.update({name: "Kristiono Setyadi"}, {name: "Kristiono Setyadi", sex: "Male"});
}

var listAllData = function(err, collection) {
  collection.find().toArray(function(err, results) {
    console.log(results);
  });
}
