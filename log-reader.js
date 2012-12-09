var Connection = require('ssh2')

var getConnection = function(response_io) {
  var c = new Connection();
  c.on('connect', function() {
    console.log("Connection:: connection");
  });

  c.on('ready', function() {
    console.log("Connection::ready");
    c.exec('tail -f ravi.txt', function(err, stream) {
      stream.on('data', function(data, extended) {
        var data_str = data.toString("utf8");
        data_str = data_str.replace(/\n/g, '<br />');
        response_io.emit('log', data_str);
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
  return c;
}

exports.getConnection = getConnection;
