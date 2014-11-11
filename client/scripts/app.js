// YOUR CODE HERE:
var App = function(){
  this.server = 'https://api.parse.com/1/classes/chatterbox';

}

App.prototype.init = function(){
  this.fetch();
  setInterval(this.fetch.bind(this), 5000);
  $('body').find('#send .submit').on('submit',this.handleSubmit);
  $('#main').find('.username').on('click', this.addFriend);
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
      console.log('error');
    }
  });
}

App.prototype.clearMessages = function(){
  $('#chats').children().remove();
}

App.prototype.addMessage = function(message){
  var username = antiXSS(message.username);
  var message = antiXSS(message.text);
  $('body').find('#chats').append('<div class="msg"> <span class="username">'
    +username+'</span> <span class="msgContent">'+message+'</span> </div>');
  // $('body').find('#chats').append('<div class="msg '+username+'">'+username+': '+message+'</div>');
};

window.refreshMsgLog = function(data){
  $('body').find('#chats').find('.msg').remove();
  _.each(data.results, function(msg, index, collection){
    var username = antiXSS(msg.username);
    var message = antiXSS(msg.text);
    //var roomname = antiXSS(msg.roomname);
    $('body').find('#chats').append('<div class="msg '+username+'">'+username+': '+message+'</div>');
  });
}

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

App.prototype.addRoom = function(room){
  $('#roomSelect').append('<div id="'+room+'"></div>')
}

App.prototype.addFriend = function(friend){
  //TODO

}

App.prototype.handleSubmit = function(){

}

var app = new App();
$('document').ready(function(){
  app.init();
});