var server = require('../models/server');
var _ = require('underscore');
var connection_pool = require('../models/connection_pool');
var request_pool = require('../models/client_server_request_map.js');

var socket_id = 0;

exports.setListeners = function(io_listener) {
  io_listener.sockets.on('connection', function(socket) {
    socket.on('server', function(data) {
      socket.set('server_name', data.name);
      socket.set('request_id', get_next_socket_id());
      console.log('Socket IO controller got connection...' + _.keys(socket));
      create_bidirectional_channel(socket, data.name);
    });
    socket.on('disconnect', function() {
      console.log("Socket IO Controller IO Connection got disconnected!" + _.keys(socket));
      socket.get('server_name', function(err, name) {
        console.log("Socket IO name to delete: " + name);
        socket.get('request_id', function(err, request_id) {
          console.log("Socket IO request id to delete: " + request_id);
          request_pool.remove_socket(name, request_id);
        });
      });
    });
  });
}

function create_bidirectional_channel(socket, server_name) {
  console.log("creating channel for socket: " + server_name);
  var all_servers = server.getAllAvailableServers();
  if (_.find(all_servers, function(server) { return server.name == server_name;})) {
    console.log("sending first data: " + server_name);
    socket.emit(server_name, 'Fetching logs for server: ' + server_name + '...');

    request_pool.addRequest(server_name, socket);
    var server_conn = connection_pool.getConnection(server_name);
    //send_periodic_data(socket, server_name);
  }
}
function send_periodic_data(socket, server_name) {
  setTimeout(function() {
    socket.emit(server_name, 'data: ' + server_name);
    send_periodic_data(socket, server_name);
  }, 5000);
}

function get_next_socket_id() {
  socket_id++;
  return socket_id;
}

exports.shutdown = function() {
  request_pool.shutdown();
  connection_pool.shutdown();
}

