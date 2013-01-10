var _ = require('underscore');
var server_connection = require('./server_connection');
var servers_list = require('./server');
var ssh = require('./ssh_connection');

var connections = {};

exports.getConnection = function(server_name) {
  if (_.has(connections, server_name)) {
    console.log("Got server connection from cache for server: " + server_name);
    return connections[server_name];
  }
  var newConnection = getNewConnection(server_name);
  connections[server_name] = newConnection;
  return newConnection;
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
