var hotnessLevelLabels = ['Mild','Medium','Spicy','On Fire','Volcanic']; 

$(document).ready(function() {
	//var border = new WGBorder( $('#hBorder'),0,580 );
	
	var API_URL = "http://api.detourlab.com";
	var METHOD_URL = '';
	var method = jQuery.url.param('method') || 'search'
	
	var query = jQuery.url.param('query') || 'google';
	var date = jQuery.url.param('date') || new Date();
	
	var hotSearches = ['google', 'fcebook', 'est', 'ehllo', 'esx', 'enk', 'google slopp', 'ponr', 'Apple', 'Slopyp'];
	var currentIndex = 0;
	var searchLength = hotSearches.length;
	
	renderTrendsPage(hotSearches[currentIndex]);
	currentIndex+=1;
	
	var loopInterval = setInterval(function(){
	    renderTrendsPage(hotSearches[currentIndex]);
	    currentIndex+=1;
	    if(currentIndex >= searchLength) {
	      clearInterval(loopInterval);
	    }
	  }, 10000);
	
	function renderTrendsPage(query) {
	  var hotnessINT = Math.round(Math.random()*4);
  	var hotnessLevel = new WGHotnessLevel( $('#hotness_graph'), hotnessINT+1 );
  	$('#hotness_level').html(hotnessLevelLabels[hotnessINT]);
  	
	  var graph_data = [];
	  $("#search_list ol").html('');
	  $("#related_searches").html('');
	  
	  if (method == 'search') {
  	  METHOD_URL = 'trend_query';
  	  $('#keyword').html(query);
  	} else {
  	  METHOD_URL = 'trend_lang';
  	  $('#keyword').html(jQuery.url.param('title'));
  	}
  	
	  $.ajax({
  	  url: API_URL+'/search_logs/'+METHOD_URL+'.json?query='+query+'&date='+date,
  	  type: 'GET',
  	  dataType: 'jsonp',
  	  success: function(data) {
  	    /*
  	    $.each(data.hot_languages, function(index, value){
  	      $("#language_list ol").append("<li><a class=\"custom_link\" href=\"trends-lang.html?method=lang&query="+value[1]+"&title="+value[2]+"&date="+date+"\">"+value[2]+"</a></li>");
  	    });
  	    */

  	    $.each(data.hot_searches, function(index, value){
  	      $("#search_list ol").append("<li><a class=\"custom_link\" href=\"/sloppy/trends?method=search&query="+value[1]+"\">"+value[1]+"</a></li>");
  	    });

  	    $.each(data.query_details.weekly_query_data, function(index, value){
  	      graph_data.push([index, value]);
  	    });

  	    if(graph_data.length > 0) {
  			  var hotnessGraph = new WGHotnessGraph( $('#hotnessGraph'), graph_data, 0 );
  		  }

  	    $.each(data.query_details.related_searches, function(index, value){
  	      var append_text = (data.query_details.related_searches.length == (index+1) ? value : value+', ')
  	      $("#related_searches").append(append_text);
  	    });

  	    $('#total_search').html(data.query_details.total_searches)

  	    $('#search_list li,#language_list li').each(function(){
  				$(this).hide().delay(Math.random()*3000+200).fadeIn(1000);
  				var item = new WGHyperLink( $(this) );
  			});
  	  }
  	});
	}
});