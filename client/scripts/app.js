// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox/',
};

app.init = function (){
  allRooms = {};
  oldAllRoom = {}
  //Create the homepage
  app.fetch(false)
  //Refresh messages
  setInterval(app.fetch, 1000);
  app.currentRoom = 'Lobby';
  $('#rooms').on('change',app.saveroom)
};

app.saveroom = function(){
  var selectIndex = $('#rooms').prop('selectedIndex')
  if(selectIndex === 0){
    var roomname = prompt('Enter Room Name')
    if(roomname){
      app.currentRoom = roomname;
      app.addRoom(roomname);
      $('#rooms').val(app.currentRoom);
      app.fetch();
    }
  }else{
    app.currentRoom = $('#rooms').val();
    app.roomDisplay(app.currentRoom);
    app.fetch();
  }
}

app.roomDisplay = function(roomname){
  $('.message').css("display","none");
  $("."+roomname+"").show();
}

app.addRoom = function(roomname){
  $('#rooms').append($('<option>').val(roomname).text(roomname));
}

app.fetch = function(refresher){
  $.ajax({
      url: app.server,
      type:'GET',
      contentType: 'application/json',
      success : function(data){
        var b = true;
        if(refresher!=undefined){
          b=false;
        }
        app.printMessages(data.results, b);
      },
      error: function(data){
      }
    });
};



app.send = function(message){
var submitMessage = {
    username: window.location.search.slice(10),
    text: $('#submitform').val(),
    roomname: app.currentRoom
}

  console.log("I am here")

  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(submitMessage),
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


app.printMessages = function(collection, refresher){

  //$("#rooms").empty()
  _.each(collection, function(item){
    if(item.username){
       if(item.roomname){
         if(allRooms[item.roomname] === undefined){
           //console.log(item.roomname)
           allRooms[item.roomname] = item.roomname
         }
       }

      if($('#' + item.objectId + '').length === 0) {

        //Update messages
        if(!refresher){
          $('#messages').append('<div class="message '+ item.roomname+'" id=' + item.objectId + '>');
          // console.log(item.roomname)
          // $('#rooms').append('<div class=room>').text(item.roomname);
        }else{
          $('#messages').prepend('<div class="message '+ item.roomname+'" id=' + item.objectId + '>');
          // console.log(item)
          // $('#rooms').prepend('<div class=room>').text(item.roomname);
        }
        $('#' + item.objectId + '')
        .append('<span class=username></span>')
        .append('<span class=text></span>')
        .append('<span class=createdAt></span>')
        .append('<span class=updatedAt>' + JSON.stringify(item.updatedAt) + '</span>')

        $('#' + item.objectId + ' > .text').text(item.text);
        $('#' + item.objectId + ' > .username').text('username: ' + item.username);
        $('#' + item.objectId + ' > .createdAt').text(parseTwitterDate(item.createdAt));
      }




    }
  })
  //console.log(allRooms)
  if(oldAllRoom !== allRooms){
    oldAllRoom = allRooms
    for(var k in oldAllRoom){
      $('#rooms').append($('<option>').val(k).text(k));
    }

  }
}


function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    if (K.ie) {
        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    }
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "on " + system_date;
}

// Helper function for parseTwitterDate
var K = function () {
    var a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    }
}();

app.init();

$("#submission").submit(function(event){
  app.send();
  event.preventDefault();
});



