var Connection=require('ssh2');
var _ = require('underscore');
var request_pool = require('./client_server_request_map.js');
var connection_pool = require('./connection_pool');
var config = require('./config');

function send_data(server_name, data) {
  var client_sockets = request_pool.getCompactedRequests(server_name);
  console.log("Got sockets for server: " + server_name  + ", count: " + client_sockets.length);
  console.log("Data got from server: " + server_name + ", length: " + data.length);
  client_sockets.forEach(function(entry) {
    if (entry != null) {
      entry.emit(server_name, data);
    }
  });
}

function onServerDisconnect(server_name) {
  connection_pool.removeConnection(server_name);
  request_pool.removeClientConnections(server_name);
}

exports.getSSHConnection = function(server) {
  var command = "tail -f /home/jboss/insight/tomcat-7.0.27/logs/server.log  /home/jboss/insight/tomcat-7.0.27/logs/api.log /home/jboss/universe/tomcat-7.0.27/logs/server.log";
  var c = new Connection();
  c.on('connect', function() {
    console.log("Connection:: connection");
  });

  c.on('ready', function() {
    console.log("Connection::ready");
    c.exec(command, function(err, stream) {
      stream.on('data', function(data, extended) {
        var data_str = data.toString("utf8");
        data_str = data_str.replace(/\n/g, '<br />');
        send_data(server.name, data_str);
      });
      stream.on('end', function() {
        console.log('Stream :: EOF');
        onServerDisconnect(server.name);
      });
      stream.on('close', function() {
        console.log('Stream :: Close');
        onServerDisconnect(server.name);
      });
      stream.on('exit', function(code, signal) {
        console.log('Stream:: exit:: code: ' + code + ", signal: " + signal);
        c.end();
        onServerDisconnect(server.name);
      });
    });
  });

  c.on('error', function(err) {
    console.log('Connection error: ' + err);
  });

  c.on('close', function() {
    console.log('Connection: close');
    onServerDisconnect(server.name);
  });

  c.connect({
    host:server.host_name,
    port:server.port,
    username:config.get('username'),
    password:config.get('password'),
    pingInterval:config.get('pingInterval')
  });

  return c;
}

