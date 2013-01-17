var express = require('express')
  , logs_controller = require('./controllers/logs_controller')
  , http = require('http')
  , io = require('socket.io')
  , path = require('path')
  , socket_io_controller = require('./controllers/socket_io_controller')
  , config = require('./models/config');

var app = express();
var http_server = http.createServer(app);
var io_listener = io.listen(http_server);


config.loadConfig();

app.configure(function(){
  app.set('port', config.get('port'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', logs_controller.index);
app.get('/servers', logs_controller.findAllAvailableServers);


http_server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


io_listener.configure('production', function () {
  io_listener.set('transports', ['xhr-polling']);
  io_listener.enable('browser client etag');
  io_listener.set('log level', 1);
});

socket_io_controller.setListeners(io_listener);

process.on('SIGINT', function() {
  socket_io_controller.shutdown();
  console.log('Shutting down...');
  process.exit(0);
});
