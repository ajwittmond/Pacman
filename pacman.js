function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
};
function doDivBuild(body, bodyRect, node){
	if(node.getClientRects){
		rects = node.getClientRects();
		for(var i in rects){
			var r = rects[i];
			var marker = document.createElement("div");
			marker.style.borderStyle = "solid";
			marker.style.position = "absolute";
			marker.style.width = (r.right-r.left) + "px";
			marker.style.height = (r.bottom-r.top) + "px";
			marker.style.zIndex = "1000";
			marker.style.left = (r.left - bodyRect.left) + "px";
			marker.style.top = (r.top - bodyRect.top) + "px";
			body.appendChild(marker);
		}
		
		for(i in node.childNodes){
			doDivBuild(body,bodyRect,node.childNodes[i]);
		}
		
		
	}
};
function divBuilder(){
	var body = document.getElementsByTagName("body")[0];
	var bodyRect = body.getBoundingClientRect();
	var bodyRects = body.getClientRects();
	
	doDivBuild(body,bodyRect,body);
};

function pacman(){
	var pacmanStart = new Sound("http://soundbible.com/grab.php?id=1563&type=mp3");
	//pacmanStart.play();
	
	var overlap = function(a,b){
		return a.x < b.x+(b.offsetWidth || b.width) && a.x+(a.width || a.offsetWidth)>b.x && a.y<b.y+(b.height || b.offsetHeight) && a.y+(a.height||a.offsetHeight)>b.y;
	};
	
	
	
	var pacman = document.createElement("img");
	pacman.setAttribute("src","http://i.imgur.com/ihWD6z6.gif");
	pacman.source = "http://i.imgur.com/ihWD6z6.gif";
	pacman.style.position = "fixed";
	pacman.style.zIndex = "10000";
	pacman.style.width = "64px";
	pacman.style.height = "64px";
	document.getElementsByTagName("body")[0].appendChild(pacman);
	pacman.alive = true;
	
	
	var mouse= document.createElement("p");
	document.getElementsByTagName("body")[0].appendChild(mouse);
	
	var dots = [];
	
	var ghosts = [];
	var ghost_images = [
	"http://orig01.deviantart.net/8557/f/2013/021/f/9/1blinkyghost_by_camdencc-d5s8ix5.gif",
	"http://orig05.deviantart.net/f745/f/2013/021/d/3/1inkyghost_by_camdencc-d5sab38.gif",
	"http://orig08.deviantart.net/977f/f/2013/021/0/2/1clydeghost_by_camdencc-d5sab7r.gif"];
	var ghost_colors = [
	"red",
	"blue",
	"orange"
	]
		
	
	var blue_ghost_image = "https://media0.giphy.com/media/r8AKGSaw7qRRS/200_s.gif";
	
	var particles = [];
	
	var Particle = function(x,y,v,color,round,w){
		var drag = 0.5;
		if(!w)
			w=8
		var elem = document.createElement("div");
		this.element = elem;
		this.body = document.getElementsByTagName("body")[0];
		var styleString = "width:"+w+"px;height:"+w+"px;background-color:"+color+";z-index:1000;position:fixed;";
		if(round)
			styleString += "border-radius:"+(w/2)+"px;"
		
		elem.setAttribute("style",styleString);
		elem.style.left = x+"px";
		elem.style.top = y+"px";
		var theta = Math.PI*2*Math.random();
		this.x = x;
		this.y = y;
		this.vx = Math.cos(theta)*v;
		this.vy = Math.sin(theta)*v;
		this.t = 0;
		this.update = function(delta){
			this.x+=this.vx*delta;
			this.y+=this.vy*delta;
			this.vx-= this.vx*drag*delta;
			this.vy-= this.vy*drag*delta;
			this.t+= delta;
			elem.style.left = this.x+"px";
			elem.style.top = this.y+"px";
			var u = 1.0 - this.t/3;
			elem.style.opacity = u + ""
			if(this.t>3){
				this.body.removeChild(this.element);
				particles.splice(particles.indexOf(this),1);
				
			}
		}
		elem.style.left = this.x+"px";
		elem.style.top = this.y+"px";
		this.index = particles.length;
		particles.push(this);
		this.body.appendChild(elem);
	}
	
	var Dot = function(x,y){
		var elem = document.createElement("div");
		this.element = elem;
		this.large = (Math.random()<0.01);
		this.body = document.getElementsByTagName("body")[0];
		if(this.large){
			elem.setAttribute("style","width:32px;height:32px;background-color: yellow;border-radius:16px;z-index:1000;position:fixed");
		}else{
			elem.setAttribute("style","width:16px;height:16px;background-color: yellow;border-radius:8px;z-index:1000;position:fixed");
		}
		elem.style.left = x+"px";
		elem.style.top = y+"px";
		this.destroy = function(){
			this.body.removeChild(this.element);
			dots.splice(dots.indexOf(this),1);
		}
		this.box = {
			x:x,
			y:y,
			width:32,
			height:32
			
		}
		this.body.appendChild(elem);
		this.index = dots.length;
		dots.push(this);
	};
	
	
	var mousex = 0;
	var mousey = 0;
	
	document.onmousemove = function(evt){
		mousex = evt.clientX;
		mousey = evt.clientY;
	};
	
	var r1 = 0;
	var r2 = 0;
	
	updateObj = new Updatable();
	updateObj.update = function(delta){
		
		pacman.style.top = (mousey-32) + "px";
		pacman.style.left = (mousex-32) + "px";
		
		r1 += Math.random()*delta;
		r2 += Math.random()*delta;
		if(r1>1){
			var ghost = document.createElement("img");
			var rand = Math.floor(Math.random()*3)
			var src = ghost_images[rand];
			ghost.partColor = ghost_colors[rand]
			ghost.source = src;
			ghost.setAttribute("src",ghost.source);
			ghost.style.position = "fixed";
			ghost.style.zIndex = "1";
			ghost.style.width = "64px";
			ghost.style.height = "64px";
			ghost.style.zIndex = "10000";
			document.getElementsByTagName("body")[0].appendChild(ghost);
			ghost.gx = Math.floor(window.innerWidth*Math.random());
			ghost.gy = Math.floor(window.innerHeight*Math.random());
			ghost.style.left = ghost.gx+"px";
			ghost.style.top = ghost.gy+"px";
			ghosts.push(ghost);
			r1 = 0;
		}
		
		if(r2>1){
			var x = Math.floor(window.innerWidth*Math.random());
			var y = Math.floor(window.innerHeight*Math.random());
			
			if(Math.random()>0.5){
				for(var i = 0; i<8; i++){
					new Dot(x,y);
					x+=40;
				}
			}else{
				for(var i = 0; i<8; i++){
					new Dot(x,y);
					y+=40;
				}
			}
			r2=0;
		}
		
		for(var i in ghosts){
			var ghost = ghosts[i];
			var dx = pacman.x - ghost.gx;
			var dy = pacman.y - ghost.gy;
			var d = Math.sqrt((dx*dx) + (dy*dy));
			ghost.gx += (dx/d)*300*delta;
			ghost.gy += (dy/d)*300*delta;
			ghost.style.left = Math.floor(ghost.gx)+"px";
			ghost.style.top = Math.floor(ghost.gy)+"px";
			if(dx<0){
				ghost.style.transform = "scaleX(1)"
			}else{
				ghost.style.transform = "scaleX(-1)"
			}
			if(pacman.alive && overlap(ghost,pacman)){
				for(var i = 0; i<32; i++)
					new Particle(pacman.x,pacman.y,100,"yellow",false)
				pacman.alive = false;
				document.getElementsByTagName("body")[0].removeChild(pacman);
			}
		}
		
		if(!pacman.alive){
			var ghost
			while(ghost = ghosts.pop()){
				for(var i = 0; i<32; i++)
					new Particle(ghost.x,ghost.y,100,ghost.partColor,true)
				document.getElementsByTagName("body")[0].removeChild(ghost);
			}
		}
		
		for(var i in particles){
			particles[i].update(delta);
		}
		
		var removes = [];
		for(var i in dots){
			if(overlap(dots[i].box,pacman)){
				
				for(var j = 0; j<5; j++)
					new Particle(dots[i].box.x,dots[i].box.y,100,"yellow",true,8)
				
				
				dots[i].destroy();
			}
		}
	};
	
	Loop.add(updateObj);
	Loop.start();
};

window.onload = pacman;

