var server = require('../models/server');
var _ = require('underscore');

exports.setListeners = function(io_listener) {
  io_listener.sockets.on('connection', function(socket) {
    console.log('Socket IO controller got connection...');
    socket.on('server', function(data) {
      create_bidirectional_channel(socket, data.name);
    });
  });
}

function create_bidirectional_channel(socket, data) {
  console.log("creating channel for socket: " + data);
  var all_servers = server.getAllAvailableServers();
  if (_.find(all_servers, function(server) { return server.name == data;})) {
    console.log("sending first data: " + data);
    socket.emit('log', 'first data...');
    send_periodic_data(socket);
  }
}
function send_periodic_data(socket) {
  setTimeout(function() {
    socket.emit('log', 'super data......');
    send_periodic_data(socket);
  }, 5000);
}

