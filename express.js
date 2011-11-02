"use strict";

/* == CONFIG =================================== */

var config = {};

config['address'] =         '127.0.0.1';
config['frontend_port'] =   3000;
config['backend_port'] =    27017;


/* == REQUIRES =================================== */

var Sys = require( 'sys' ),
    Url = require( 'url' ),
    Path = require( 'path' ),
    Fs = require( 'fs' );
    
/* Jade */

var Jade = require( 'jade' );

/* Express */

var Express = require( 'express' ),
    App = Express.createServer();
    
/* MongoDB */

var Db = require( 'mongodb' ).Db,
    Server = require( 'mongodb' ).Server,
    DbServer = new Db( 'local', new Server( config["address"], config["backend_port"], {} ) );


/* == START =================================== */

/* Config & Environments */

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
  App.use(require('stylus').middleware({ src: __dirname + '/_assets' }));
  
  App.use(App.router);
  
});

App.configure('development', function(){
  App.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));
});

App.configure('production', function(){
  App.use(Express.errorHandler());
});

/* Express */

App.get('/', function(request, response) {
  
  var uri = Url.parse(request.url).pathname;
  
  response.render('index', { 
    title: 'Node Test'
  });
  
});

App.listen( config["frontend_port"] );

Sys.puts( 'Server running at http://localhost:' + config["frontend_port"] + '/' );

/* MongoDB */

DbServer.open(function(err, pClient) {
  DbServer.collection('test_insert', insertData);
  DbServer.collection('test', removeData);
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
