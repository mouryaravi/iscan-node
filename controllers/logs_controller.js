var server = require('../models/server');

exports.index = function(req, res) {
  res.render('index', {title: 'Log Scanner'});
}

exports.findAllAvailableServers = function(req, res) {
  res.send(server.getAllAvailableServers());
}
