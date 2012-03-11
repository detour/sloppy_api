function WGBorder(aDiv,aWidth,aHeight) {
	var width = aWidth;
	var height = aHeight;
	var div = aDiv;
	init();
	function init() {
    var canvasElement = document.createElement('canvas');	
  	canvasElement.width= Math.floor(aWidth)+10;
		canvasElement.height= Math.floor(aHeight)+10;
  	canvasElement.style.zIndex = -10;
		canvasElement.style.top = "-10px";
		canvasElement.style.position = "absolute";
  	div.append(canvasElement);
  	var processingInstance = new Processing(canvasElement, sketchProc);
  }
	function sketchProc(processing) {
    processing.setup = function() {
			processing.noLoop();
			processing.smooth();
			processing.stroke(33);
			processing.strokeWeight(1);
			processing.noFill();
			var x1 = 5;
			var y1 = 5;
			var x2 = 5+width;
			var y2 = 5+height;
			var dist = processing.dist(x1, y1, x2, y2);
			var basic = 10;
			var pieces = dist/basic;

			var dx = (x2-x1)/pieces;
			var dy = (y2-y1)/pieces;

		 	processing.beginShape();
		  processing.vertex(x1,y1);

			for(var i=0; i<pieces; i++) {
				var tx = x1 + dx*(i + processing.random(2,4)) + processing.random(-1,1);	
				var ty = y1 + dy*i + processing.random(-1,1);	
				processing.vertex( tx, ty);
			}
			processing.endShape();
    }
	}
}

function WGHotnessGraph(elem, aData, aBgColor) {
	elem.css('position','relative');
	var data = aData;
	var width = 400;
	var height = 200;
	var bgColor = aBgColor;
	init();
	function init() {
    var canvasElement = document.createElement('canvas');	
  	canvasElement.height= height;
  	canvasElement.width= width;
  	canvasElement.style.zIndex = -10;
		canvasElement.style.position = "absolute";
		canvasElement.style.top = "0px";
		canvasElement.style.left = "0px";
  	elem.append(canvasElement);
  	var processingInstance = new Processing(canvasElement, sketchProc);
  }
	function sketchProc(processing) {
		var gapX;
		var sorting = [];
		var activeNodes = [];
		var positions = [];
		var maxY = 0;
    processing.setup = function() {
			processing.smooth();
			processing.frameRate(10);
			
			for(var i=0; i<data.length; i++) {
			  var data_value = parseInt(data[i][1]);
				sorting[i] = i;
				positions.push( height-50 );
				if( data_value>maxY )
					maxY = data_value;
			}
			sorting.sort( randOrd );
			gapX = Math.round( (width-100)/(data.length-1) );
			activeNodes.push( sorting.pop() );
    }
		processing.draw = function() {
			if(Math.random()<0.1 && sorting.length>0) {
				activeNodes.push( sorting.pop() );
			}	
			if(activeNodes.length>0) {
				processing.background(bgColor);
				drawGraph();
			}

		}		
		function drawGraph() {
//			processing.noStroke();
			processing.fill(240);
			processing.strokeWeight(0.7);
			processing.stroke(30);
			processing.drawFreehandRect(12,height-20,width-40,2);
      // processing.drawFreehandRect(20,20,4,height-26);
			var arrow1 = [ [width-22,height-18], [width-22-8,height-18+4], [width-22-8,height-18-4]];
      // var arrow2 = [ [22,15], [22-8,15+8], [22+8,15+8]];
			processing.drawFreehandShape(arrow1,true);
      // processing.drawFreehandShape(arrow2,true);     
			// update activeNodes position
			for(var j=0; j<activeNodes.length; j++) {
				var idx = activeNodes[j];
				positions[idx] -= 9;//(height-100)/maxY*data[idx][1]/50;
				var targetY = height-50 - (height-100)/maxY*data[idx][1];
				if( positions[idx]<=targetY )
					activeNodes.splice(j,1);
			}

			processing.stroke(255);
			processing.strokeWeight(1);
			processing.noFill();
			for(var i=0; i<positions.length-1; i++) {
				processing.drawFreehandLineGraph(50+i*gapX, positions[i],50+i*gapX+gapX, positions[i+1]);
			}
			processing.stroke(255);
			processing.strokeWeight(0.5);
			processing.fill(255,0,0);
			for(var k=0; k<positions.length; k++) {
				var x1 = 50+k*gapX;
				processing.drawFreehandArc(x1, positions[k], 3, 3, 0, 2*Math.PI);
			}
		}
		function randOrd(){
			return (Math.round(Math.random())-0.5);
		}
	}	
}

function WGHotnessLevel(elem, aHotnessINT) { // hotnessINT: 0-4
	elem.css('position','relative');
	var hotnessINT = aHotnessINT;
	init();
	function init() {
    var canvasElement = document.createElement('canvas');	
  	canvasElement.height= 20;
  	canvasElement.width= 340;
  	canvasElement.style.zIndex = -10;
		canvasElement.style.position = "absolute";
		canvasElement.style.top = "0px";
		canvasElement.style.left = "55px";
  	elem.append(canvasElement);
  	var processingInstance = new Processing(canvasElement, sketchProc);
  }
	function sketchProc(processing) {
		var counter = 0;
    processing.setup = function() {
			processing.background(0);
			processing.smooth();
  		processing.frameRate(5);
			processing.noStroke();
    }
		processing.draw = function() {
			if(counter<255) {
				counter+=15;
				var w = 45;
				var h = 5;
				processing.background(0);
				for(var i=0; i<5; i++) {
					var tempH = processing.map(counter,0,255,0,h);
					var tempY = 2+(4-tempH);
					processing.fill(200);
					if(i<hotnessINT)
						processing.fill(255,0,0);
					processing.drawFreehandRect(2+(w+6)*i,tempY,w,tempH);
				}
			}
		}
	}
}

function WGHyperLink(elem) {
	var ele = elem;
	var innerDOM = elem.find('.custom_link');
	var width = innerDOM.text().length*8;//innerDOM.width();
	init();
	function init() {
		ele.mouseenter(function() {
			this.isMouseEnter = true;
		});
		ele.mouseleave(function() {
			this.isMouseEnter = false;
		});
    var canvasElement = document.createElement('canvas');	
  	canvasElement.height= 10;
  	canvasElement.width= Math.floor(width)+10;
  	canvasElement.style.zIndex = -10;
		canvasElement.style.position = "absolute";
		canvasElement.style.top = "10px";
		canvasElement.style.left = "-7px";
  	innerDOM.append(canvasElement);
  	var processingInstance = new Processing(canvasElement, sketchProc);
  }
	function sketchProc(processing) {
    processing.setup = function() {
      /*
			processing.background(255);
			processing.smooth();
  		processing.frameRate(7);
			processing.stroke(33);
			processing.strokeWeight(1);
			processing.drawFreehandLine(5,5,width,5);
			*/
    }
    processing.draw = function() {
			if(ele[0].isMouseEnter) {
				processing.clear();
				processing.drawFreehandLine(5,5,width,5);
			}
		}
	}
}

function WGLabel(div) {
	div.css('position',"relative");
	var width = div.width();
	var height = div.height();
	init();
	function init() {
    var canvasElement = document.createElement('canvas');	
  	canvasElement.height= height+20;
  	canvasElement.width= Math.floor(width)+20;
  	canvasElement.style.zIndex = -10;
		canvasElement.style.position = 'absolute';
		canvasElement.style.top = '-10px';
		canvasElement.style.left = '-12px';
  	div.append(canvasElement);
  	var processingInstance = new Processing(canvasElement, sketchProc);
  }
	function sketchProc(processing) {
		var counter=0;
    processing.setup = function() {
			processing.background(255);
			processing.smooth();
  		processing.frameRate(5);
			processing.strokeWeight(0.2);
    }
    processing.draw = function() {
			if(counter<255) {
				counter+=15;
				processing.clear();
				processing.stroke(150,counter);
				processing.fill(255,255,150,counter);
				processing.drawFreehandRect(5,5,width+10,height+9,false);
			}
		}
	}
}



function WGResultImage(div,w,h) {
	var width = w;//div.offsetWidth;
	var height = h;//div.offsetHeight;
	var imgDiv = div;
	var x = 13;//Math.random()*20+10;
	var y = 13;//Math.random()*20+10;
  init();

  function init() {
    var canvasElement = document.createElement('canvas');	
  	canvasElement.height= height+20;
  	canvasElement.width= width+20;
  	canvasElement.style.position = "absolute";
  	canvasElement.style.left = -10+"px";
  	canvasElement.style.top = -10+"px";
  	canvasElement.style.zIndex = 0;
  	imgDiv.appendChild(canvasElement);
  	var processingInstance = new Processing(canvasElement, sketchProc);
  }
	
  function sketchProc(processing) {
    processing.setup = function() {
			processing.background(255);
			processing.smooth();
  		processing.frameRate(5);
			processing.stroke(33);
			processing.fill(0);
    }
    processing.draw = function() {
			processing.background(255);
				processing.saveContext();
			processing.globalCompositeOperation("destination-out");
			processing.drawFreehandRect( x, y, width-6, height-6, false);
			processing.restoreContext();
		}
	}
}


function WGTextfield(txtField,flag){	
  var x = 300;
  var y = 80;
  var width = txtField.offsetWidth;
  var height = txtField.offsetHeight;
  var htmlTxtfield = txtField;
  var scaleInt;
	var isActive = false;
  init();
	
	this.isActive = function() {
		return isActive;
	}
	
  function init() {
    var canvasElement = document.createElement('canvas');	
  	canvasElement.height= Math.floor(height)+160;
  	canvasElement.width= Math.floor(width)+600;
  	canvasElement.style.position = "absolute";
  	canvasElement.style.left = -300+"px";
  	canvasElement.style.top = -80+"px";
  	canvasElement.style.zIndex = -10;
  	htmlTxtfield.appendChild(canvasElement);
  	var processingInstance = new Processing(canvasElement, sketchProc);
  }
  
	this.activeYawn = function(size,period) {
		scaleInt = new Integrator(size,period);
		isActive = true;
		$('#dynamic_textfield').show();
		$('div#input_div input').css('opacity', 0.0);
	}
	
  function sketchProc(processing) {
    processing.setup = function() {
			processing.background(255);
			processing.smooth();
  		processing.frameRate(10);
			processing.stroke(33);
			processing.fill(255);
  		processing.drawFreehandRect( x, y, width, height, false);
    }
    processing.draw = function() {
			var dynText   = $('#dynamic_textfield');
			var searchBar = $('div#input_div input');
			if(scaleInt!=null){
  	    if(scaleInt.stage==3){
					searchBar.css('opacity', 1.0);
					dynText.hide();
					
  	      processing.clear();processing.background(255,255,255,0);
					processing.stroke(33);
					processing.noFill();
  				processing.drawFreehandRect(x, y, width, height,false);
  	      scaleInt = null;
					isActive = false;
					
					var txtValue = $('div#input_div input').val();
					for(var i=0; i<txtValue.length; i++) { 
						var dom = $("#dt_"+i);
						dom.css('font-size', '18px');
					}
  	    }
  	    else{
  	      processing.clear();processing.background(255,255,255,0);
  	      scaleInt.update();
					processing.fill(255);
					var sc = scaleInt.getScaleValue();
 	      	processing.drawFreehandEllipse( processing.width/2, processing.height/2, sc*processing.map(scaleInt.value, 0, 1, 1, 1.05)*width, sc*processing.map(scaleInt.value, 0, 1, 1, 3.9)*height, 0, 2*Math.PI);
					
					var txtValue = searchBar.val();
					var midValue = 0;
					for(var i=0; i<txtValue.length; i++) {
						var font_size = 18 + Math.round(scaleInt.value*3*i)+"px";
						var dom = $("#dynamic_textfield span:eq("+i+")");
						if (dom != undefined) {
							if (dom.position() != null && dom.position().left < 220) {
								dom.css('font-size', font_size);
							} 
							else if(midValue==0){
								dom.css('font-size', font_size);
								midValue = i;
							}
							else {
								var font_size3 = 18 + Math.round(scaleInt.value*3*(midValue-i+midValue))+"px";
								if(dom.position().left>480)
									dom.css('font-size', 0);
								else
									dom.css('font-size', font_size3);
							}
						}
					}
  	    }
  	  }

    };
  }
}


function WGButtonForYawn(btn,left,top,mode){
	
  var x = 10;
  var y = 10;
  var width = btn.width()-7;
  var height = btn.height()+2;
  var targetX = 0;
  var targetY = 0;
  var isMoving = false;
	var htmlBtn = btn;
  var moveBtn;
	var nativeMovingBtn;
  var reverseCount = 0;
	var isActive = mode;
	var originLeft;
	var originTop;
	var canvasElement;
  init();
	
  function init() {
		htmlBtn.wrap('<span class="wg_btn_inner"></span>');
		htmlBtn.css('position', 'relative').css('z-index', 5);

		var innerBtn = htmlBtn.parent('.wg_btn_inner');
		innerBtn.css('position', 'relative');
		innerBtn.wrap('<span class="wg_btn_outer" />');
		var outerBtn = innerBtn.parent('.wg_btn_outer');
		outerBtn.css('position', 'absolute').css('left', left+'px').css('top', top+'px');
		moveBtn = outerBtn;
		
		// $('.ds').each(function(index) {
		// 		$(this).css('top','0px');
		// 		console.log( this,this.offsetTop );
		// 	});
		// 	
    canvasElement = document.createElement('canvas');
  	canvasElement.height= Math.floor(height)*1.3+20;
  	canvasElement.width= Math.floor(width)*1.3+20;
  	canvasElement.style.position = "absolute";
  	canvasElement.style.left = "-13px";
  	canvasElement.style.top = "-13px";
  	canvasElement.style.zIndex = 1;
  	innerBtn.append(canvasElement);
		nativeMovingBtn = moveBtn[0];
		originLeft = parseFloat(nativeMovingBtn.style.left);
		originTop = parseFloat(nativeMovingBtn.style.top);
		context = canvasElement.getContext("2d");
  	var processingInstance = new Processing(canvasElement, sketchProc);
		
  }

  function sketchProc(processing) {
    processing.setup = function() {
      processing.smooth();
  		processing.frameRate(20);
			processing.stroke(33);
		  processing.fill(255, 255, 240);

			//console.log(processing.width, processing.height)
			//context.clearRect(0,0,processing.width,processing.height);
			//processing.rect(10,10,30,30);
			
  		processing.drawFreehandRect( x, y, width*1.3, height*1.3, true);
    }
    processing.draw = function() {
      if(isMoving){
        updatePosition();
       	processing.clear(0,0,processing.width, processing.height);

			  processing.stroke(33);
			  processing.fill(255, 255, 240);
			  processing.drawFreehandRect( x, y, width*1.3, height*1.3, true);
      }
    }
		function updatePosition() {
			var delta = 4;
			
		  if( targetX!=0 ) {
		    var newX = targetX>0 ? parseFloat(nativeMovingBtn.style.left)+delta : parseFloat(nativeMovingBtn.style.left)-delta;
		    nativeMovingBtn.style.left = newX+"px";
		    targetX = targetX>0 ? (targetX-delta) : (targetX+delta);
		  }
		  if( targetY!=0 ) {
		    var newY = targetY>0 ? parseFloat(nativeMovingBtn.style.top)+delta : parseFloat(nativeMovingBtn.style.top)-delta;
		    nativeMovingBtn.style.top = newY+"px";
		    targetY = targetY>0 ? targetY-delta : targetY+delta;
		  }
			if( Math.abs(targetX)<=delta )
				targetX = 0;
			if( Math.abs(targetY)<=delta )
				targetY = 0;
		  if( targetX==0 && targetY==0)
		    isMoving = false;
		}
	}
		
	this.setTargetPosition = function(tx,ty) {
  	targetX = tx;
		targetY = ty;
	  isMoving = true;
	}
	this.resetPosition = function(tx,ty) {

		this.setTargetPosition( originLeft-parseFloat(nativeMovingBtn.style.left), originTop-parseFloat(nativeMovingBtn.style.top) ); 
	}
  
}

Processing.prototype.drawFreehandShape = function(points,isCloseShape) {
		
 	this.beginShape();
  this.vertex(points[0][0],points[0][1]);
	
	for(var j=0; j<points.length-1; j++) {	
		var dist = this.dist(points[j][0], points[j][1], points[j+1][0], points[j+1][1]);
		var basic = 4;
		var pieces = dist/basic;
		var dx = (points[j+1][0]-points[j][0])/pieces;
		var dy = (points[j+1][1]-points[j][1])/pieces;
	
		for(var i=0; i<pieces; i++) {	
			var tx = points[j][0] + dx*(i + this.random(0,.8));
			var ty = points[j][1] + dy*(i + this.random(-0.3,0.3));// + this.random(-.5,.5);	
			this.vertex( tx, ty);
		}
	}
	
	this.vertex(points[points.length-1][0],points[points.length-1][1]);
	if(isCloseShape)
		this.endShape(this.CLOSE);
	else
		this.endShape();
}

Processing.prototype.drawFreehandLineGraph = function(x1, y1, x2, y2) {

	var dist = this.dist(x1, y1, x2, y2);
	var basic = 4;
	var pieces = dist/basic;
	
	var dx = (x2-x1)/pieces;
	var dy = (y2-y1)/pieces;
	
 	this.beginShape();
  this.vertex(x1,y1);
	
	for(var i=0; i<pieces; i++) {
		var tx = x1 + dx*(i + this.random(0,.8));
		var ty = y1 + dy*(i + this.random(-0.3,0.3));// + this.random(-.5,.5);	
		this.vertex( tx, ty);
	}
	this.vertex(x2,y2);
	
	this.endShape();
}


Processing.prototype.drawFreehandLine = function(x1, y1, x2, y2) {

	var dist = this.dist(x1, y1, x2, y2);
	var basic = 4;
	var pieces = dist/basic;
	
	var dx = (x2-x1)/pieces;
	var dy = (y2-y1)/pieces;
	
 	this.beginShape();
  this.vertex(x1,y1);
	
	for(var i=0; i<pieces; i++) {
		var tx = x1 + dx*(i + this.random(2,4));
		var ty = y1 + dy*(i + this.random(-4,4)) + this.random(-.5,.5);	
		this.vertex( tx, ty);
	}
	
	this.endShape();
}

Processing.prototype.drawFreehandEllipse = function(x, y, w, h, start, end) {
  var currentAngle = 0;
  var totalDots = Math.floor( (w+h)/40 );
	if(totalDots<5)
    totalDots = 5;
  var angleGap = 2*Math.PI/totalDots;
	var dots = new this.ArrayList();	

  for(var i=0; i<totalDots; i++) {
		if(currentAngle>=start && currentAngle<=end) {
    	var p = new Point( x+Math.cos(currentAngle)*w/2*(1+Math.random()*0.1), y+Math.sin(currentAngle)*h/2*(1+Math.random()*0.1) );
			dots.add(p);
    }
		currentAngle+=angleGap;
  }
	
	if(dots.size()>=4) {
  	for(var j=0; j<dots.size(); j++){
	    var p1,p2,p3,p4;
	    p1 = dots.get(j);
	    if( j==dots.size()-3){
	      p2 = dots.get(j+1);
	      p3 = dots.get(j+2);
	      p4 = dots.get(0);
	    }
	    else if(j==dots.size()-2){
	      p2 = dots.get(j+1);
	      p3 = dots.get(0);
	      p4 = dots.get(1);
	    }
	    else if(j==dots.size()-1){
	      p2 = dots.get(0);
	      p3 = dots.get(1);
	      p4 = dots.get(2);
	    }
	    else{
	      p2 = dots.get(j+1);
	      p3 = dots.get(j+2);
	      p4 = dots.get(j+3);
	    }
			this.fill(255);
	    this.curve(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
	  }
	}
	dots = null;
}


Processing.prototype.drawFreehandArc = function(x, y, w, h, start, end) {
  var currentAngle = 0;
  var totalDots = Math.floor( (w+h)/40 );
	if(totalDots<5)
    totalDots = 40;
  var angleGap = 2*Math.PI/totalDots;
	var dots = new this.ArrayList();	

  for(var i=0; i<totalDots; i++) {
		if(currentAngle>=start && currentAngle<=end) {
    	var p = new Point( x+Math.cos(currentAngle)*w/2*(1+Math.random()*0.1), y+Math.sin(currentAngle)*h/2*(1+Math.random()*0.1) );
			dots.add(p);
    }
		currentAngle+=angleGap;
  }
	
	this.beginShape();
 	for(var j=0; j<dots.size(); j++){
    var p = dots.get(j);
		this.vertex(p.x, p.y);
  }
	this.endShape();
	dots = null;
}


Processing.prototype.drawFreehandRect = function(x, y, w, h, hasLeg) {
	
  var gap = 2;

  var freeFactor = 0.15;
	if(h<5)
		freeFactor = 0.05;
	
  this.beginShape();
  this.vertex(x,y);  
  var currentX = x;
  var currentY = y;
  var vertex = [];

  // MOUTH
	// TOP 
	while( currentX<(x+w) ){
		var randomX = Math.random()*gap;
		var randomY = Math.random()>0.5 ? Math.random() : -1*Math.random();
		currentX += randomX;
		currentY += randomY*freeFactor;
		this.vertex( currentX, currentY);
		vertex[0] = new Point(currentX, currentY);
	}
	// RIGHT
	while( currentY<(y+h) ){
		var randomY = Math.random()*gap;
		var randomX = Math.random()>0.5 ? Math.random() : -1*Math.random();
		currentX += randomX*freeFactor;
		currentY += randomY;
		this.vertex( currentX, currentY);
		vertex[1] = new Point(currentX, currentY);
	}
	// BOTTOM
	while( currentX>x ){
		var randomX = -1*Math.random()*gap;
		var randomY = Math.random()>0.5 ? Math.random() : -1*Math.random();
		currentX += randomX;
		currentY += randomY*freeFactor;
		this.vertex( currentX, currentY);
		vertex[2] = new Point(currentX, currentY);
	}
	// LEFT
	while( currentY>y ){
		var randomY = -1*Math.random()*gap;
		var randomX = Math.random()>0.5 ? Math.random() : -1*Math.random();
		currentX += randomX*freeFactor;
		currentY += randomY;
		this.vertex( currentX, currentY);
		vertex[3] = new Point(currentX, currentY);
	}
  this.endShape(this.CLOSE);

  if(hasLeg){
	  for(var i=0; i<3; i++){
	    this.line(vertex[i].x, vertex[i].y, vertex[i].x+4, vertex[i].y+3);
	  }
	}

}





function Point(x,y){
  this.x = x;
  this.y = y; 
}

function DIntegrator(value, damping, attraction) {      
  var _value = value;
  var _vel = 0;
  var _accel = 0;
  var _force = 0;
  var _mass = 1;

  var _damping = damping;
  var _attraction = attraction;
  var _targeting = true;
  var _target;

  this.set = function(v) {
  	_value = v;
  }
	this.getValue = function() {
		return _value;
	}
	this.getTarget = function() {
		return _target;
	}
  this.update = function() {
    if (_targeting)
      _force += _attraction * (_target - _value);

    _accel = _force / _mass;
    _vel = (_vel + _accel) * _damping;
    _value += _vel;

    _force = 0;
  }

  this.setTarget = function(t) {
    _targeting = true;
    _target = t;
  }

  this.noTarget = function() {
    _targeting = false;
  }
}

function Integrator(size,period) {
  this.value = 0;
  this.stage = 0;
	var scale = size;
  var timer = 0;
	var peakTime = period;
	var yawnTime = peakTime + Math.round( 0.6*peakTime );
	var endTime = peakTime + Math.round( 0.8*peakTime );
	
	this.getScaleValue = function() {
		return scale;
	}
	
  this.update = function() {
    var tmpValue = 0;

    switch(this.stage){
      case 0:
        this.value = curveValue(timer-peakTime, peakTime);
        timer++;
        if(this.value==1)
          this.stage = 1;
        break;
      case 1:
        timer++;
        if(timer==yawnTime)
          this.stage = 2;
        break;
      case 2:
        this.value = curveValue(timer-yawnTime, endTime);
        timer++;
        if(this.value<=0)
          this.stage = 3;
        break;
    }
  }

  function curveValue(x, xx){ // x range: -xx to xx, curveValue range: 0 - 1 - 0
    var yValue = -1/Math.pow(xx,2)*Math.pow(x,2) + 1;
    return yValue;
  }
	
}

function chunks(cuts) { // 0-1
	var avr = 1.0/cuts;
	var array = new Array(cuts);
	array[0] = 's';
	for(var i=0; i<cuts; i++) {
		array[i] = avr;
	}

	for(var j=0; j<cuts; j++) {
		var diff = array[j] * Math.random()/2;
		array[j] -= diff;
		if(j==cuts-1)
			array[0] += diff;
		else
			array[j+1] += diff;
	}

	return array;
}

/* Basic DOM functions 
 *
 * -------------------------- */
 
function removeChildNodes(node)
{
  while (node.childNodes[0])
  {
    node.removeChild(node.childNodes[0]);
  }
}

function getElementsByClass(node,searchClass,tag) {
	
  var classElements = new Array();
  var els = node.getElementsByTagName(tag); // use "*" for all elements	

  var elsLen = els.length;

	var pattern = new RegExp(searchClass);
    for (i = 0, j = 0; i < elsLen; i++) {
	
         if ( pattern.test(els[i].className) ) {
             classElements[j] = els[i];
             j++;
         }
    }
    return classElements;
}

function checkOverlap(x1, w1, x2, w2, buffer){
  var result;
  if(x1 < x2)
    result = x2<(x1+w1-buffer);
  else
    result = x1<(x2+w2-buffer);
  return result;
}

function findPosX(obj) {
  var curleft = 0;
  if(obj.offsetParent)
      while(1) 
      {
        curleft += obj.offsetLeft;
        if(!obj.offsetParent)
          break;
        obj = obj.offsetParent;
      }
  else if(obj.x)
      curleft += obj.x;
  return curleft;
}

function findPosY(obj) {
  var curtop = 0;
  if(obj.offsetParent)
      while(1)
      {
        curtop += obj.offsetTop;
        if(!obj.offsetParent)
          break;
        obj = obj.offsetParent;
      }
  else if(obj.y)
      curtop += obj.y;
  return curtop;
}