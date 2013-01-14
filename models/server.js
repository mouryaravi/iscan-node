var _ = require("underscore");
var config = require("./config");

exports.getAllAvailableServers = function() {
  return config.get('servers');
}

exports.getServerByName = function(server_name) {
  var server = _.find(this.getAllAvailableServers(), function(server) {
    return server.name == server_name;
  });
  return server;
}
