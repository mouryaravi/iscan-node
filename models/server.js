var _ = require("underscore");

exports.getAllAvailableServers = function() {
  return [
    {
      name: 'qa1a', 
      apps: [
        'insight',
        'platform',
        'api'
      ],
      host_name: 'qa1a.corp.crowdfactory.com',
      port:'22213'
    },
    {
      name: 'qa1b', 
      apps: [
        'insight',
        'platform',
        'api'
      ],
      host_name: 'qa1b.corp.crowdfactory.com',
      port:'22214'
    },
    {
      name: 'qa2a',
      apps: [
        'insight',
        'platform',
        'api'
      ],
      host_name: 'qa2a.corp.crowdfactory.com',
      port:'22215'
    },
    {
      name: 'qa2b',
      apps: [
        'insight',
        'platform',
        'api'
      ],
      host_name: 'qa2b.corp.crowdfactory.com',
      port:'22216'
    },
    {
      name: 'cdev1a',
      apps: [
        'insight',
        'platform',
        'api'
      ],
      host_name: 'cdev1a.corp.crowdfactory.com',
      port:'22217'
    },
    {
      name: 'cdev1b',
      apps: [
        'insight',
        'platform',
        'api'
      ],
      host_name: 'cdev1b.corp.crowdfactory.com',
      port:'22218'
    }
  ];
}

exports.getServerByName = function(server_name) {
  var server = _.find(this.getAllAvailableServers(), function(server) {
    return server.name == server_name;
  });
  return server;
}
