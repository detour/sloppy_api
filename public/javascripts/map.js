var po = org.polymaps;

var div = document.getElementById("map");

var map = po.map()
    .container(div.appendChild(po.svg("svg")))
    .add(po.interact());

var markers = [];

map.add(po.image()
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/a40d93cd4de948058cf84558f6554653" // http://cloudmade.com/register
    + "/35977/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));

var MAGNET_URL = 'http://magnet.detourlab.com';
var like_items;
var currentUrlIndex = 0;
var request_path = null;

if ($.url.param("latest")) {
  request_path = '/disabling_logs/latest_logs.json';
} else {
  request_path = '/lang_mappings/links.json';
}

$.ajax({
  url: MAGNET_URL+request_path,
  type: 'GET',
  dataType: 'jsonp',
  success: function(data) {
    like_items = data;
    
    var panelDOM = $("<div id='panel'></div>");
    $.each(like_items, function(index, elem){
      panelDOM.append("<div id='"+elem.css_id+"' class='like_item'><span class='like_text'>"+
                       elem.like_text+"</span>"+
                       "<span class='locale'>"+elem.locale+"</span>"+
                       "<span class='btns_count'>"+elem.btns_count+"</span>"+"</div>");
    });
    $('#map').append(panelDOM);
    runMapAnimation(like_items[currentUrlIndex]);
  }
});
/*
 * Load the "AerialWithLabels" metadata. "Aerial" and "Road" also work. For more
 * information about the Imagery Metadata service, see
 * http://msdn.microsoft.com/en-us/library/ff701716.aspx
 * You should register for your own key at https://www.bingmapsportal.com/.
 */

/*
var script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", "http://dev.virtualearth.net"
    + "/REST/V1/Imagery/Metadata/Road"
    + "?key=AmT-ZC3HPevQq5IBJ7v8qiDUxrojNaqbW1zBsKF0oMNEs53p7Nk5RlAuAmwSG7bg"
    + "&jsonp=imageryCallback");
document.body.appendChild(script);
*/

function imageryCallback(data) {

  /* Display each resource as an image layer. */
  var resourceSets = data.resourceSets;
  for (var i = 0; i < resourceSets.length; i++) {
    var resources = data.resourceSets[i].resources;
    for (var j = 0; j < resources.length; j++) {
      var resource = resources[j];
      map.add(po.image()
          .url(template(resource.imageUrl, resource.imageUrlSubdomains)))
          .tileSize({x: resource.imageWidth, y: resource.imageHeight});
    }
  }

  /* Display brand logo. */
  // document.getElementById("logo").src = data.brandLogoUri;

  /* Display copyright notice. */
  // document.getElementById("copy").appendChild(document.createTextNode(data.copyright));

  /* Display compass control. */
  //map.add(po.compass()
  //    .pan("none"));

  //setUpSearch();

}

/** Returns a Bing URL template given a string and a list of subdomains. */
function template(url, subdomains) {
  var n = subdomains.length,
      salt = ~~(Math.random() * n); // per-session salt

  /** Returns the given coordinate formatted as a 'quadkey'. */
  function quad(column, row, zoom) {
    var key = "";
    for (var i = 1; i <= zoom; i++) {
      key += (((row >> zoom - i) & 1) << 1) | ((column >> zoom - i) & 1);
    }
    return key;
  }

  return function(c) {
    var quadKey = quad(c.column, c.row, c.zoom),
        server = Math.abs(salt + c.column + c.row + c.zoom) % n;
    return url
        .replace("{quadkey}", quadKey)
        .replace("{subdomain}", subdomains[server]);
  };
}

/////////////////////// search...

function setUpSearch() {
    var search = document.getElementById('search');
    search.q.disabled = null;
    search.submit.disabled = null;
    
    search.onsubmit = function() {
        if (search.q.value && search.q.value.length > 0) {        
            search.q.disabled = 'true';
            search.submit.disabled = 'true';   
            doSearch(search.q.value);
        }
        return false;
    }
}

function doSearch(q) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "http://dev.virtualearth.net"
        + "/REST/V1/Locations"
        + "?key=AmT-ZC3HPevQq5IBJ7v8qiDUxrojNaqbW1zBsKF0oMNEs53p7Nk5RlAuAmwSG7bg"
        + "&query=" + encodeURIComponent(q)
        + "&jsonp=searchCallback");
    document.body.appendChild(script);
}

function searchCallback(rsp) {
    try {
        // console.log(rsp);
    
        var bbox = rsp.resourceSets[0].resources[0].bbox; // [s,w,n,e]
        var adjustedBound = adjustToProperBounds(bbox[0], bbox[1], bbox[2], bbox[3]);
        moveToBounds(adjustedBound[0], adjustedBound[1], adjustedBound[2], adjustedBound[3]);
    }
    catch(e) {    
        console.error(e);
        // TODO: what? reset map position/zoom, perhaps? show error?
    }
    var search = document.getElementById('search');    
    search.q.disabled = null;
    search.submit.disabled = null;
}

function findBounds(points) {
  var lons = [];
  var lats = [];
  var len = points.length;
  for (var i = 0; i < len; i++) {
    lons.push(points[i].geometry.coordinates[0]);
    lats.push(points[i].geometry.coordinates[1]);
  }
  
  lons.sort(compare);
  lats.sort(compare);
  return [lats[0], lons[0], lats[len-1], lons[len-1]]; // s, w, n, e
}

function compare(a,b){
  return a-b;
}

function moveToBounds(s, w, n, e) {
  // compute the extent in points, scale factor, and center
  // -- borrowed from map.extent(), thanks Mike
  var bl = map.locationPoint({ lat: s, lon: w }),
      tr = map.locationPoint({ lat: n, lon: e }),
      sizeActual = map.size(),
      k = Math.max((tr.x - bl.x) / sizeActual.x, (bl.y - tr.y) / sizeActual.y),
      l = map.pointLocation({x: (bl.x + tr.x) / 2, y: (bl.y + tr.y) / 2});

  // update the zoom level
  var z = map.zoom() - Math.log(k) / Math.log(2);

  animateCenterZoom(map, l, z);
}

function adjustToProperBounds(s, w, n, e) {
  var bufferPercentage = 10;
  delta_y = (n - s)*(bufferPercentage/100);
  delta_x = (e - w)*(bufferPercentage/100);
  return [s-delta_y, w-delta_x, n+delta_y, e+delta_x];
}

function runMapAnimation(item) {
  markers = []; // reset markers
  
  $.ajax({
    url: item.url,
    type: 'GET',
    dataType: 'jsonp',
    success: function(data) {
      setTimeout(function(){highlightCities(data.points);}, 1500);
    }
  });
}

function highlightCities(cities) {
  if (cities.length > 1) {    
    var bounds = findBounds(cities);
  } else {
    lon = cities[0].geometry.coordinates[0];
    lat = cities[0].geometry.coordinates[1];
    var bounds = [lat-3, lon-3, lat+3, lon+3];
  }
  var adjustedBound = adjustToProperBounds(bounds[0], bounds[1], bounds[2], bounds[3]);
  moveToBounds(adjustedBound[0], adjustedBound[1], adjustedBound[2], adjustedBound[3]);
  
  loadInterval = setInterval(function() {
    if (interval==0) {
      setTimeout(function(){
        //console.log('zoomed');
        map.add(po.geoJson()
           .on("load", load)
           .features(cities));
           
        var looper = new Looper(markers, false, function() {
          $.each(markers, function(index, elem) {
            elem.fadeOut();
          });
          
          $('#'+like_items[currentUrlIndex].css_id).slideUp(function(){$(this).remove()});
          currentUrlIndex+=1;
          if (currentUrlIndex < like_items.length) {
            runMapAnimation(like_items[currentUrlIndex]);
          }
        });
        looper.start();
      }, 800);
      clearInterval(loadInterval);
    }
  }, 50);
}

function load(e) {
  console.log(markers);
  markers = [];
  for (var i = 0; i < e.features.length; i++) {
    console.log(e.features.length);
    var feature = e.features[i];
    feature.element.setAttribute("id", feature.data.id);
    
    loc = map.locationPoint({ lat: feature.data.geometry.coordinates[1], lon: feature.data.geometry.coordinates[0] });
    var marker = $("<div class='marker'></div>");
    marker.css('top', (loc.y-20)+'px').css('left', (loc.x-20)+'px').html(feature.data.properties.html);
    
    $('#map').append(marker);
    markers.push(marker);
  }
}

function Looper(items, loop, callback, delay) {
  var _items = items || [];
  var _nextItem = null;
  var _timeouts = [];
  var _nextIndex = null;
  var _currentIndex = null;
  var _loop = false || loop;
  var _delay = 3000 || delay;

  function clearTimeouts() {
    for (var name in _timeouts) {
      clearTimeout(_timeouts[name]);
    }
  }
  
  function displayNext() {
    if (_items.length == 0) {
      return;
    } else {
      if (_nextItem == null) { _nextItem = _items[0]; }
      _nextItem.fadeIn(500);
    }
  
    // determine next item
    var _currentIndex = $.inArray(_nextItem, _items);
    var _nextIndex = _currentIndex + 1;
    var len = _items.length-1;
    if ( _currentIndex == len) {
      if (_loop) {
        _nextIndex = 0;
      } else {
        clearTimeouts();
        if (callback != undefined) { setTimeout(function() {callback();}, _delay); }
        return;
      }
    }
    _nextItem = _items[_nextIndex];
  
    var d = new Date();
    _timeouts[d.getTime().toString()] = setTimeout(function(){displayNext();}, 1500);
  }
  
  this.start = function() {
    displayNext();
  }
}