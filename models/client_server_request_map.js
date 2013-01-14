var _ = require('underscore');

var request_map = {};

exports.addRequest = function(server_name, socket) {
  var requests = this.getCompactedRequests(server_name);
  requests.push(socket);
}

exports.getCompactedRequests = function(server_name) {
  if (!_.has(request_map, server_name)) {
    request_map[server_name] = [];
  }
  request_map[server_name] = _.compact(request_map[server_name]);
  return request_map[server_name];
}

exports.removeClientConnections = function(server_name) {
  var requests = this.getCompactedRequests(server_name);
  if (requests.length > 0) {
    _.each(requests, closeSocket);
    console.log("Deleting all requests for server: " + server_name);
    delete request_map[server_name];
  }
}

exports.remove_socket = function(server_name, request_id) {
  var requests = this.getCompactedRequests(server_name);
  console.log("Requests count: " + requests.length);
  if (requests.length > 0) {
    _.each(requests, function(element, index, list) {
      if (element != null) {
        element.get('request_id', function(err, found_request_id) {
          console.log("found request id: " + found_request_id + ", act: " + request_id);
          if (found_request_id == request_id) {
            console.log("Removing socket at index: " + index);
            list[index] = null;
          }
        });
      }
    });
  }
}

function closeSocket(socket, index, list) {
  socket.emit('error', 'Connection closed. Refresh or restart server');
  socket.disconnect();
}

function closeConnections(sockets, index, list) {
  _.each(sockets, closeSocket);
}

exports.shutdown = function() {
  console.log("Cleaning up requests...");
  _.each(_.values(request_map), closeConnections);
}
