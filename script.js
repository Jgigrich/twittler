$(document).ready(function(){

  var lastLength;
  var currentUser = "home";

  var userPhrases = {
    shawndrost: 'Coding the world... one char at a time',
    sharksforcheap: 'Nothing but sharks!',
    mracus: 'Why whine about wine?',
    douglascalhoun: 'I\'m a liar and that\'s the truth',
    tweetsAlot: 'This is me!'
  };

  function createTweet(tweetObj){
    var tweetHeader = createTweetHeader(tweetObj);
    var tweetMessage = $('<p>'+tweetObj.message+'</p>');
    var tweetFooter = createTweetFooter(tweetObj);
    var tweetDiv = $('<div class="tweetDiv"></div>');
    tweetDiv.append(tweetHeader);
    tweetDiv.append(tweetMessage);
    tweetDiv.append(tweetFooter);
    $('.tweetsContainer').append(tweetDiv);
  }

  function createTweetHeader(tweetObj){
    var tweetUserLink = $('<a href="#">'+tweetObj.user+'</a>');
    var tweetUserName = $('<p>&nbsp&nbsp@'+tweetObj.user+'&nbsp&nbsp</p>');
    var tweetTime = $('<time class="timeago" datetime="' + tweetObj.created_at.toISOString()  + '">temp</time>');
    var tweetHeader = $('<div class="tweetHeader"></div>');
    tweetHeader.append(tweetUserLink);
    tweetHeader.append(tweetUserName);
    tweetHeader.append(tweetTime);
    return tweetHeader;
  }

  function createTweetFooter(tweetObj){
    var tweetFooter = $('<div class="tweetFooter"></div>');
    tweetFooter.append('<i class="footerIcons ion-ios-chatbubble-outline"></i>');
    tweetFooter.append('<i class="footerIcons ion-share"></i>');
    tweetFooter.append('<i class="footerIcons ion-ios-heart-outline"></i>');
    tweetFooter.append('<i class="footerIcons ion-ios-email-outline"></i>');
    return tweetFooter;
  }

  function createViewNewTweets(numNewTweets){
    $('#newTweets').detach();
    var newTweetsDiv = $('<div id="newTweets"></div>');
    var tweetTweets = numNewTweets > 1 ? 'Tweets' : 'Tweet';
    var newTweetsMessage = $('<p>View '+numNewTweets+' new ' + tweetTweets + '</p>');
    $('.tweetsContainer').before(newTweetsDiv);
    $('#newTweets').append(newTweetsMessage);
  };

  function updateUser(){
    var user = currentUser === 'home' ? 'tweetsAlot' : currentUser  // 'home' feed is handled differently than 'user' feed
    $('#user').empty();
    $('#user').append('<h4><strong>'+user+'<strong></h4>');
    $('#user').append('<h6>@'+user+'</h6>');
    var motto = $('<div class="motto"></div>');
    motto.append('<p>'+userPhrases[user]+'</p>');
    $('#user').append(motto);
    var numOfTweets = currentUser === 'home' ? streams.users.tweetsAlot.length : getCurrentUser().length;
    $('#user').append('<div class="userStats"><p class="userStatsTitle">Tweets</p><p class="userStatsValue">'+numOfTweets+'</p></div>');
    $('#user').append('<div class="userStats"><p class="userStatsTitle">Following</p><p class="userStatsValue">'+(userPhrases[user].length*50)+'</p></div>');
    $('#user').append('<div class="userStats"><p class="userStatsTitle">Followers</p><p class="userStatsValue">'+(userPhrases[user].length*30)+'</p></div>');
  }

  function getCurrentUser(){
    return currentUser === 'home' ? streams.home : streams.users[currentUser];
  }

  function refresh(){
    var user = getCurrentUser();
    updateUser();
    lastLength = user.length;
    var showNum = user.length-100;
    showNum = showNum < 0 ? 0 : showNum;
    $(".tweetsContainer").empty();
    for(var i=user.length-1; i>=showNum; i--){
      createTweet(user[i])
    }
    jQuery("time.timeago").timeago();   // makes time elements into timeago elements
    $('#newTweets').detach();           // removes "View new Tweets"
  }

  function checkForTweets(){
    var user = getCurrentUser();
    if(user.length > lastLength){
      var newTweets = user.length-lastLength;
      createViewNewTweets(newTweets);
    }
  }


  // handlers
  $('#main').on("click", "#newTweets", refresh);

  $('.tweetsContainer').on("click", "a", function(e){
    currentUser = e.target.innerText;
    refresh();
  });

  $('nav').find('a').first().on("click", function(e){
    currentUser = e.target.innerText.toLowerCase();
    refresh();
  });

  $('#inputNewTweet textarea').on("focus", function(e){
    this.value = '';
  });

  $('#inputNewTweet textarea').on("blur", function(e){
    this.value = "What's happening?";
  });

  $('#inputNewTweet textarea').on("keydown", function(e){
    if(e.which === 13){
      writeTweet(this.value);
      this.blur();
      refresh();
    }
  });


  refresh();
  setInterval(checkForTweets, 5000);


});
