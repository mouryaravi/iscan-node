var Connection = require('ssh2');
var _ = require('underscore');
var request_pool = require('./client_server_request_map.js');
var connection_pool = require('./connection_pool');
var config = require('./config');

function getDataToSendAfterFiltering(data) {
	var filtered_data = "";
	var lines = data.split('\n');
	for(var idx = 0; idx < lines.length; idx++) {
		if (lines[idx].indexOf("org.quartz.plugins.history.LoggingTriggerHistoryPlugin") == -1) {
			filtered_data += lines[idx];
		}
	}	
  return filtered_data;
}

function send_data(server_name, data) {
  var client_sockets = request_pool.getCompactedRequests(server_name);
  data = getDataToSendAfterFiltering(data);
  if (server_name !== 'self') {
    console.log("Got sockets for server: " + server_name  + ", connection count: " + 
      client_sockets.length + ", data length: " + data.length);
  }
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
  var command = server.command;
  var c = new Connection();
  c.on('connect', function() {
    console.log("Connection:: connection");
  });

  c.on('ready', function() {
    console.log("Connection::ready for server: " + server.name);
    c.exec(command, function(err, stream) {
      stream.on('data', function(data, extended) {
        var data_str = data.toString("utf8");
	      	send_data(server.name, data_str);
      });
      stream.on('end', function() {
        console.log('Stream :: EOF for server: ' + server.name);
        onServerDisconnect(server.name);
      });
      stream.on('close', function() {
        console.log('Stream :: Close for server: ' + server.name);
        c.end();
        onServerDisconnect(server.name);
      });
      stream.on('exit', function(code, signal) {
        console.log('Stream:: exit:: code: ' + code + ", signal: " + signal + " for server: " + server.name);
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

