exports.getAllAvailableServers = function() {
  return [
    {
      name: 'qa1', 
      apps: [
        'insight',
        'platform',
        'api'
      ]
    },
    {
      name: 'qa2',
      apps: [
        'insight',
        'platform',
        'api'
      ]
    }
  ];
}
