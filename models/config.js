var nconf = require('nconf');
var _ = require('underscore');

var DEFAULT_CONF = "./config.json"

exports.loadConfig = function() {
  nconf.env().argv();

  var confFile = nconf.get('file');
  confFile = confFile || DEFAULT_CONF;
  console.log("Using config file: " + confFile);

  nconf.file(confFile);
  nconf.defaults(getDefaults());

}

exports.get = function(key) {
  return  nconf.get(key);
}


function getDefaults() {
  return {
    "port": 3000,
    "servers": [
      {
        "name": "google",
        "host_name": "www.google.com",
        "port":"80"
      }
    ],
    "use_ssh": false
  }
}
