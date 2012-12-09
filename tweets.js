var request = require('request')
var url = require ('url')
var app = require('express')();

app.set('views', __dirname);
app.get('/tweets/:username', function(req, response) {
  var username = req.params.username;

  options = {
    protocol: 'http:',
    host: 'api.twitter.com',
    pathname: '/1/statuses/user_timeline.json',
    query: {screen_name: username, count: 10}
  }
  var twitterUrl = url.format(options);
  request(twitterUrl, function(err, res, body) {
    var tweets = JSON.parse(body);
    response.render('tweets.ejs', {tweets: tweets, name: username});
  });

});

app.listen(8080);
