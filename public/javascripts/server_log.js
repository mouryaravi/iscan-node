var ServerLog = Backbone.Model.extend({
  defaults:{
    name: 'qa1', 
    apps: [
      'insight',
      'platform',
      'api'
    ]
  },
});

var ServerView = Backbone.View.extend({
  template: _.template('<h2><%= name %></h2>'),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    console.log(this.$el.html);
    return this;
  },

  initialize: function() {
    this.model.on('change', this.render, this);
  }

});

var ServerLogList = Backbone.Collection.extend({
  initialize: function() {
    console.log('In init of list...');
  },
  model: ServerLog,
  url: '/servers',
});

var ServerListView = Backbone.View.extend({
  el: $("#serverlist"),
  addOne: function(serverItem) {
    console.log("model item: " + serverItem.toJSON());
    var serverView = new ServerView({model: serverItem});
    console.log("view item: " + serverView + ", this.el: " + this.$el.html);
    this.$el.append(serverView.render().el);
    console.log("server list views: " + this.$el);
  },
  render: function() {
    this.collection.forEach(this.addOne, this);
  }
});

var renderServerList = function(serverList) {
  console.log(serverList);
  var serverListView = new ServerListView({collection: serverList});
  serverListView.render();
  console.log('server list view element: ' + serverListView.$el.html);
};


