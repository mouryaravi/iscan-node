var _ = require('underscore');

var request_map = {};

exports.addRequest = function(server_name, socket) {
  var requests = this.getRequests(server_name);
  requests.push(socket);
}

exports.getRequests = function(server_name) {
  if (!_.has(request_map, server_name)) {
    request_map[server_name] = [];
  }
  return request_map[server_name];
}
