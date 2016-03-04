(function(window){
	var canvas = {
		e : null,
		elem : function(){},
		drawCircle : function(color,center,radius){},
		drawLine : function(point1,point2){},
		drawGrid : function(point1,point2){}
	};
	var Chain = {
		FPS : 0,
		MaxLifeSpan : 20,
		Balls : [],
		TotalBalls : 0,
		Pointer : null,
		init : function(){},
		redraw : function(){},
		update : function(){}
	};
	var pointer = function(location,color) {
		this.location = location;
		this.color = color;
		this.destroy = function(){};
		this.timeRemaining = 0;
	}
	var Ball = function(location,velocity,color){
		this.explode = function(){};
		this.destroy = function(){};
		this.location = location;
		this.color = color;
		this.velocity = velocity;
		this.update = function(){};		//Update Location, radius, color etc..
		this.collided = function(ball){};   //Return true or false
		return this;
	}; //ToDo Define Ball
	var Vector = function(x,y){}; //ToDo Define Ball
	 = function()
	window.Chain = Chain;
})(window);