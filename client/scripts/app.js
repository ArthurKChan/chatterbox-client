// YOUR CODE HERE:
var App = function(){
  this.server = 'https://api.parse.com/1/classes/chatterbox';

}

App.prototype.init = function(){

}

App.prototype.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){
      console.log('send success:',data);
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
    success: refreshMsgLog,
    error: function(data){
      console.log('error');
    }
  });
}

window.refreshMsgLog = function(data){
  $('body').find('#chatLog').find('.msg').remove();
  _.each(data.results, function(msg, index, collection){
    var username = JSON.stringify(msg.username);
    username = username.split('').splice(1, username.length-2).join('');
    var message = JSON.stringify(msg.text);
    message = message.split('').splice(1, message.length-2).join('');
    $('body').find('#chatLog').append('<div class="msg">'+ username + ': ' + message +'</div>')
  });
}

var app = new App();
$('document').ready(function(){
  app.fetch();
  setInterval(app.fetch.bind(app), 5000);
});