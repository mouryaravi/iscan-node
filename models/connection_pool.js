var _ = require('underscore');
var server_connection = require('./server_connection');
var servers_list = require('./server');
var ssh = require('./ssh_connection');

var connections = {};

exports.getExistingConnection = function(server_name) {
  if (_.has(connections, server_name)) {
    console.log("Got server connection from cache for server: " + server_name);
    return connections[server_name];
  }
  return null;
}

exports.getConnection = function(server_name) {
  var existingConn = this.getExistingConnection(server_name);
  if (existingConn != null) {
    return existingConn;
  }
  var newConnection = getNewConnection(server_name);
  connections[server_name] = newConnection;
  return newConnection;
}

exports.removeConnection = function(server_name) {
  if (_.has(connections, server_name)) {
    console.log("Removing server connection from cache for server: " + server_name);
    delete connections[server_name];
  }
}

function getNewConnection(server_name) {
  console.log("Creating new connection for server: " + server_name);
  var server = servers_list.getServerByName(server_name);  
  if (_.isUndefined(server)) {
    console.log("Error: Can not find server: " + server_name);
    return null;
  }
  console.log("Found server: " + server.name);
  var ssh_conn = ssh.getSSHConnection(server);
  return ssh_conn;
}

function exitConnection(conn, index, list) {
  conn.emit('close');
}

exports.shutdown = function() {
  console.log("Cleaning up connections...");
  _.each(_.values(connections), exitConnection);
}
