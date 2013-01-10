var server = require('../models/server');
var _ = require('underscore');
var connection_pool = require('../models/connection_pool');
var request_pool = require('../models/client_server_request_map.js');

exports.setListeners = function(io_listener) {
  io_listener.sockets.on('connection', function(socket) {
    console.log('Socket IO controller got connection...');
    socket.on('server', function(data) {
      create_bidirectional_channel(socket, data.name);
    });
  });
}

function create_bidirectional_channel(socket, server_name) {
  console.log("creating channel for socket: " + server_name);
  var all_servers = server.getAllAvailableServers();
  if (_.find(all_servers, function(server) { return server.name == server_name;})) {
    console.log("sending first data: " + server_name);
    socket.emit('log', 'Fetching logs for server: ' + server_name + '...');

    request_pool.addRequest(server_name, socket);
    var server_conn = connection_pool.getConnection(server_name);
    //send_periodic_data(socket, server_name);
  }
}
function send_periodic_data(socket, server_name) {
  setTimeout(function() {
    socket.emit('log', 'data: ' + server_name);
    send_periodic_data(socket, server_name);
  }, 5000);
}

