$(document).ready(function() {
  var ARTICLE_DISPLAY_TIME = 10000;
  var REVIEW_DISPLAY_TIME = 2500;
  
  var displaySection = '#main'; //Math.random() > 0.5 ? '#main' : '#articles';
  $(displaySection).fadeIn();
  
  if (displaySection == "#main") {
    var len = reviews.length;
    for(var i=0; i<len; i++) {
      var item = $('<div class="review_item"></div>');
      var profile = $('<div class="profile"><img src="'+ reviews[i].user.profile_image_url +'"/></div>');
      var item_info = $('<div class="item_info"></div>');
      item_info.append('<div class="user_name">'+reviews[i].user.name+'</div>');
    	item_info.append('<div class="text">'+reviews[i].text+'</div>');

    	item.append(profile);
    	item.append(item_info);
      item.append('<div style="clear:both;"/>');
      $('#main').append(item);
    }

    setInterval(function(){
      $('.review_item:first').slideUp(function(){
        var review = $(this);
        review.clone().show().appendTo('#main');
        review.remove();
      });
    }, REVIEW_DISPLAY_TIME);
  } else {
    var articles = $('.article');
    articles.hide();
    $('.article:first').fadeIn();
    setInterval(function(){
      $('.article:first').fadeOut(function(){
        var article = $(this);
        article.clone().appendTo('#articles');
        article.remove();
        $('.article:first').fadeIn();
      });
    }, ARTICLE_DISPLAY_TIME);
  }
});


	
