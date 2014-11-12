//Backbone reimplementation **********************************************






//Pre-Backbone************************************************************
window.antiXSS = function(item){
  if (item === undefined ){
    return '';
  }else{
    item = item.replace(/\&/g,'&amp').replace(/\</g,'&lt')
    .replace(/\>/,'&gt').replace(/\"/,'&quot').replace(/\'/,'&#x27')
    .replace(/\//,'&#x2F')
    return item;
  }
}

var App = function(){
  this.server = 'https://api.parse.com/1/classes/chatterbox';
  this.currentRoom = 'general';
  this.list = {};
  this.friendList = [];
}
var currentRoom = 'general';

App.prototype.init = function(){
  this.fetch();
  setInterval(this.fetch.bind(this), 5000);
  this.username = window.location.search.replace(/\?username\=/g, '');
  $('#main').find('#send').on('click', this.handleSubmit.bind(this));
  $('#main').find('.username').on('click', this.addFriend.bind(this));
  $('#main').find('.roomOption').on('click', this.switchRoom);
}

App.prototype.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){
      console.log('send success');
    },
    error: function(data){
      console.log('send error:',data);
    },
  });
}

App.prototype.fetch = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-createdAt; limit=15',
    success: refreshMsgLog,
    error: function(data){
      console.log('get error');
    }
  });
}

App.prototype.clearMessages = function(){
  $('#chats').children().remove();
}

App.prototype.addMessage = function(message){
  var username = antiXSS(message.username);
  var message = antiXSS(message.text);
  $('body').find('#chats').append('<div class="msgContainer"> <span class="username">'
    +username+'</span> <span class="msgContent">'+message+'</span> </div>');
};

window.refreshMsgLog = function(data){
  $('body').find('#chats').children().remove();
  _.each(data.results, function(msg, index, collection){
    var username = antiXSS(msg.username);
    var message = antiXSS(msg.text);
    var room = antiXSS(msg.roomname);
    $('body').find('#chats').append('<div class="msgContainer"> <span class="username">'
      +username+'</span> in <span class="room">'+room+'</span>: <span class="msgContent">'
      +message+'</span></div>');
  });
}

App.prototype.updateChats = function(data, room){
  $('body').find('#chats').children().remove();
  d3.select('#chats').selectAll('.msgContainer').
    data(data, function(d, i){return d})
}

App.prototype.refreshMsgList = function(data){
  results = data.results;
}

App.prototype.switchRoom = function(){
  $('#chats').children().remove();
  currentRoom = $(this).text();
}

App.prototype.addRoom = function(room){
  $('#roomSelect').append('<button class="roomOption">'+room+'</buton>')
}

App.prototype.addFriend = function(friend){
  if(this.friendList.indexof(friend) === -1){
    this.friendList.push(friend);
  }
}

App.prototype.handleSubmit = function(){
  var username = $('#main').find('#username').val();
  var roomname = $('#main').find('#room').val();
  var message = $('#main').find('#message').val();
  var formattedMessage = {
    username: window.location.search.replace(/\?username\=/g, ''),
    roomname: roomname,
    text: message
  };
  this.send(formattedMessage);
  return;
}

var app = new App();
$('document').ready(function(){
  app.init();
});