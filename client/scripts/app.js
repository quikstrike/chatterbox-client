// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
};

app.init = function (){};

app.fetch = function(){
  $.ajax({
      url: app.server,
      type:'GET',
      contentType: 'application/json',
      success : function(data){
        app.printMessages(data.results);
      }
    });
};

app.send = function(message){
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

var message = {
  username: 'thugMansion',
  text: 'Edwin4President',
  roomname: 'Este-b-dog'
};

//app.send(message);
app.fetch()

app.printMessages = function(collection){

  _.each(collection, function(item){
    //console.log(item)
    if(item.username){
    $('#messages-container').append('<div class="message '+ item.roomname+'" id=' + item.objectId + '>')

      $('#' + item.objectId + '')
      .append('<span class=username>' + item.username + '</span>')
      .append('<span class=text>' + item.text + '</span>')
      .append('<span class=createdAt>' + item.createdAt + '</span>')
      .append('<span class=updatedAt>' + item.updatedAt + '</span>')
    }
  })
}

