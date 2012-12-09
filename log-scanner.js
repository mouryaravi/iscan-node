var app = require('express')();
var http = require("http");
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var connector = require('./log-reader');

server.listen(8080);

app.set('views', __dirname);

app.get('/:server', function(req, res) {
  res.render('log.ejs', {server: req.params.server});
});

io.sockets.on('connection', function (socket) {
  socket.on('server', function() {
    var conn = connector.getConnection(socket);
    conn.connect({
      host: 'host',
      port: port,
      username: 'username',
      password: 'password',
      pingInterval: 10
    });
  });

});

