var Connection=require('ssh2');
var _ = require('underscore');
var request_pool = require('./client_server_request_map.js');

function send_data(response_io, data) {
  response_io.emit('log', data);
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
        var client_sockets = request_pool.getRequests(server.name);
        console.log("Got sockets: " + client_sockets.length);
        console.log("Data got from server: " + server.name + ": " + data_str);
        client_sockets.forEach(function(entry) {
          send_data(entry, data_str);
        });
      });
      stream.on('end', function() {
        console.log('Stream :: EOF');
      });
      stream.on('close', function() {
        console.log('Stream :: Close');
      });
      stream.on('exit', function(code, signal) {
        console.log('Stream:: exit:: code: ' + code + ", signal: " + signal);
        c.end();
      });
    });
  });

  c.on('error', function(err) {
    console.log('Connection error: ' + err);
  });

  c.on('close', function() {
    console.log('Connection: close');
  });

  c.connect({
    host:server.host_name,
    port:server.port,
    username:'ravi',
    password:'xxxxxx',
    pingInterval:10
  });

  return c;
}

