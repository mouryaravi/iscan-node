var server = require('../models/server');

exports.index = function(req, res) {
  res.render('index', { title: 'Log Scanner', 
                        servers_list: server.getAllAvailableServers()
                      });
}

exports.findAllAvailableServers = function(req, res) {
  res.send( server.getAllAvailableServers() );
}
