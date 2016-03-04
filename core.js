(function(window){
	var canvas = {
		e : null,
		elem : function(){},
		drawCircle : function(color,center,radius){},
		drawLine : function(point1,point2){},
		drawGrid : function(point1,point2){}
	};
	var Chain = {
		Balls : [],
		TotalBalls : 0,
		init : function(){},
		redraw : function(){},
		update : function(){}
	};
	var Ball = function(location,velocity,color){
		this.explode = function(){};
		this.location = location;
		this.velocity = velocity;
		this.update = function(){};		//Update Location, radius, color etc..
		this.collided = function(){};   //Return true or false
		return this;
	}; //ToDo Define Ball
	var Vector = function(x,y){}; //ToDo Define Ball
	 = function()
	window.Chain = Chain;
})(window);