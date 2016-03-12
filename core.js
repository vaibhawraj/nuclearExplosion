(function(window){
	var canvas = {
		canvas : null,
		canvasCtx : null,
		outerContainerEl : null,
		elem : function(elemId){
			this.outerContainerEl = document.querySelector(elemId);
			c = document.createElement('canvas');
			this.height = parseInt(this.outerContainerEl.style.height);
			this.width = parseInt(this.outerContainerEl.style.width);
			c.setAttribute("height",this.height + 'px');
			c.setAttribute("width",this.width + 'px');
			this.canvas = c;
			this.outerContainerEl.appendChild(this.canvas);
			this.canvasCtx = this.canvas.getContext("2d");
		},
		clearCanvas: function() {
    		this.canvasCtx.clearRect(0, 0, this.width,this.height);
  		},
		drawCircle : function(color,center,radius){
			this.canvasCtx.beginPath();
			this.canvasCtx.fillStyle = color;
			this.canvasCtx.arc(center.x,center.y,radius,0,2*Math.PI);
			this.canvasCtx.fill();
			this.canvasCtx.closePath();
		},
		drawLine : function(point1,point2){},
		drawGrid : function(point1,point2){},
		drawScore : function(){
			this.drawText("Score : "+Score.score,20);
			this.drawText("Level : "+Score.level,45);
			this.drawText("Target Ball : "+Score.targetBall,70);
		},
		drawText : function(text,y) {
			this.canvasCtx.fillStyle = 'rgb(200,50,14)';
			this.canvasCtx.font="20px Georgia";
			this.canvasCtx.fillText(text,10,y);
		}
	};
	var Chain = {
		FPS : 0,
		MaxLifeSpan : 100,
		Balls : [],
		MinBallRadius : 10,
		MaxBallRadius : 40,
		ChangeInRadius : 4,
		TotalBalls : 0,
		Pointer : null,
		height: 0,
		width: 0,
		Interval : null,
		init : function(option){
			if(typeof(option)!="object") {
				return;
			}
			if(typeof(option.elemId)!="undefined") {
				canvas.elem(option.elemId);
				this.height = canvas.height;
				this.width = canvas.width;
			}
			if(typeof(option.n)!="undefined") {
				this.TotalBalls = option.n
			};
			this.initializeGame();
		},
		initializeGame : function(){
			//Create Balls
			this.Balls = [];
			for(var i=0;i<this.TotalBalls;i++) {
				var location = new Vector(Math.random()*this.width,Math.random()*this.height);
				var velocity = new Vector(5 * ((Math.random()>0.5)?1:-1),(Math.random()>0.5)?1:-1);
				var b = new Ball(location,velocity,this.MinBallRadius,"rgba("+parseInt(40+(Math.random()*200))+","+parseInt(40+(Math.random()*200))+","+parseInt(40+(Math.random()*200))+",0.87)");
				this.Balls.push(b);
			}
			this.Pointer = new pointer(new Vector(0,0),"rgba(255,23,0,0.4)",this.MaxBallRadius);
			var that = this;
			canvas.canvas.addEventListener('mousemove',function(event){
				if(!that.Pointer.dropped) {
					that.Pointer.location.x = event.x;
					that.Pointer.location.y = event.y;
				}
			});
			canvas.canvas.addEventListener('click',function(event){
				if(!that.Pointer.dropped){
					that.Pointer.drop();
					var b = new Ball(that.Pointer.location,new Vector(0,0),that.MaxBallRadius,that.Pointer.color);
					b.stable = false;
					b.reactive = true;
					b.exploded = true;
					that.Balls.push(b);
				}
			});
			//this.update();
			if(this.Interval != null){
				clearInterval(this.Interval);
			}
			this.Interval = setInterval(function(){Chain.update();},25);
			Score.ballExploded = 0;
		},
		redraw : function(){
			canvas.clearCanvas();
			for(i in this.Balls) {
				var b = this.Balls[i];
				canvas.drawCircle(b.color,b.location,b.radius);
			}
			canvas.drawCircle(this.Pointer.color,this.Pointer.location,this.Pointer.radius);
			canvas.drawScore();
		},
		update : function(){
			this.redraw();
			var boundary = new Vector(this.width,this.height);
			for(i in this.Balls) {
				var b = this.Balls[i];
				if(b.reactive)
				{
					for(j in this.Balls) {
						if(i!=j) {
							var c = this.Balls[j];
							if(c.stable && c.collided(b)) {
									c.explode();
								}
						}
					}
				}
				b.reflect(boundary);
				b.update();
			}
		}
	};
	var pointer = function(location,color,radius) {
		this.location = location;
		this.radius = radius;
		this.color = color;
		this.dropped = false;
		this.destroy = function(){};
		this.drop = function(){
			this.dropped = true;
			this.radius = 0;
		};
		this.timeRemaining = 0;
	}
	var Ball = function(location,velocity,radius,color){
		this.location = location;
		this.color = color;
		this.stable = true;
		this.reactive = false;
		this.exploding = false;
		this.exploded = false;
		this.destroying = false;
		this.destroyed = false;
		this.life = 0;
		this.velocity = velocity;
		this.radius = radius;
		this.explode = function(){
			if(this.exploded) {
				console.log('Error');
			}
			this.stable = false;
			this.reactive = true;
			this.exploding = true;
			this.velocity.x = 0;
			this.velocity.y = 0;
			Score.ballExploded++;
			Score.score = Score.score + (Score.ballExploded*49 + 10);
		}
		this.reflect = function(boundary){
			if(this.location.x - this.radius < 0) {this.location.x = this.location.x + this.radius; this.velocity.x *= -1;}
			else if(this.location.x + this.radius > boundary.x) {this.location.x = boundary.x - this.radius;this.velocity.x *= -1;}
			if(this.location.y - this.radius < 0) {this.location.y = this.radius;this.velocity.y *= -1;}
			else if(this.location.y + this.radius > boundary.y) {this.location.y = boundary.y - this.radius;this.velocity.y *= -1;}
		}
		this.update = function(){
			try{
				this.location.add(velocity);
				if(this.exploding) {
					this.radius+=Chain.ChangeInRadius;
					if(this.radius >= Chain.MaxBallRadius) {
						this.radius = Chain.MaxBallRadius;
						this.exploding = false;
						this.exploded = true;
					}
				}
				else if(this.exploded) {
					this.life++;
					if(this.life >= Chain.MaxLifeSpan) {
						this.exploded = false;
						this.destroying = true;
					}
				}
				else if(this.destroying) {
					this.radius-=3;
					if(this.radius < 0) {
						this.radius = 0;
						this.destroyed = true;
						this.destroying = false;
						this.reactive = false;
					}
				}
			} catch(e) {
				throw e;
			}
		};		//Update Location, radius, color etc..
		this.collided = function(ball){
			var distance = this.location.distance(ball.location);
			return (distance <= (this.radius+ball.radius));
		};   //Return true or false
		return this;
	}; //ToDo Define Ball
	var Vector = function(x,y){
		this.x = x;
		this.y = y;
		this.add = function(v) {
			this.x += v.x;
			this.y += v.y;
		};
		this.distance = function(v) {
			var x2 = Math.pow(this.x - v.x,2);
			var y2 = Math.pow(this.y - v.y,2);
			var dist = Math.sqrt(x2+y2);
			return dist;
		};
		return this;
	}; //ToDo Define Ball
	var Score = {
		score : 0,
		targetBall : 3,
		totalBall : 8,
		ballExploded : 0,
		level : 1
	};
	window.Chain = Chain;
	window.Score = Score;
})(window);