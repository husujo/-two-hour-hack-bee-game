// (function($) {
// 	$(function(){

var player;
var mousex;
var mousey;

var tornado_x;
var tornado_y;

var base_image;
var tornado_image;

var socket = io();

socket.on('entities', function(entities) {

	var ctx = myGameArea.context;
	
	// list.forEach(function(key,value) {
	// 	ctx.fillRect(value[0], value[1], 10, 10);
	// });
	
	myGameArea.clear();
	
	// console.log(entities.tornado);

	for (var x in entities.beelist){
		// ctx.fillRect(list[x][0], list[x][1], 10, 10);
		ctx.drawImage(base_image, entities.beelist[x][0], entities.beelist[x][1], 30,30);
	}
	// ctx.drawImage(tornado_image,200,200,40,40);

	ctx.drawImage(tornado_image,entities.tornado[0],entities.tornado[1],40,40);
	ctx.font = "48px serif";
	ctx.fillText("click to fly", 100,50,500);

	tornado_x = entities.tornado[0];
	tornado_y = entities.tornado[1];
});

socket.on("disconnect", function(){
        console.log("client disconnected from server");
});

window.onload = function() {

	base_image = new Image();
	base_image.src = 'https://www.rochester.edu/aboutus/images/Rocky-now.png';
	tornado_image = new Image();
	tornado_image.src = 'https://flashdba.files.wordpress.com/2013/10/tornado.png';
	

	mousex = 10;
	mousey = 10;
	player = new component(20,20,10,10);
	myGameArea.start();

}

// object
var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		console.log("starting the game");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.addEventListener("mousedown", handleMouseDown);
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]); // ?
		this.interval = setInterval(updateGameArea, 50);
		// this.context.drawImage(base_image, 20, 20);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

}

// creates an object and returns it
function component(width, height, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.update = function() {
		//console.log("player update\n");
		ctx = myGameArea.context;
		// ctx.fillStyle = "green";

		var xdist = Math.abs(this.x-mousex);
		var ydist = Math.abs(this.y-mousey);


		if (this.x+15 > tornado_x && this.y+15 > tornado_y && this.x+15 < tornado_x+40 && this.y+15 < tornado_y+40) {
			return;
		}

		if (xdist > ydist) {
			if (mousex > this.x) {this.x += 5};
			if (mousex < this.x) {this.x -= 5};
			if (mousey > this.y) {this.y += 5*(ydist/xdist)};
			if (mousey < this.y) {this.y -= 5*(ydist/xdist)};
		}
		else if (ydist > xdist) {
			if (mousey > this.y) {this.y += 5};
			if (mousey < this.y) {this.y -= 5};
			if (mousex > this.x) {this.x += 5*(xdist/ydist)};
			if (mousex < this.x) {this.x -= 5*(xdist/ydist)};
		}
		else {
			if (mousex > this.x) {this.x += 5};
			if (mousex < this.x) {this.x -= 5};
			if (mousey > this.y) {this.y += 5};
			if (mousey < this.y) {this.y -= 5};
		}

		// this.x = mousex;
		// this.y = mousey;


		// socket.emit('chat message', $('#m').val());


        // ctx.fillRect(this.x, this.y, this.width, this.height);
	}

}

function updateGameArea() {
	//console.log("updating\n");
	
	player.update();
	// send my squares coords
	// $.post('/server-init.js', {"x": player.x});

	socket.emit('update', player.x, player.y);
	
	// get the other players coords

}


function handleMouseDown(e) {
	mousex = e.x-20;
	mousey = e.y-20;
	console.log("mouse down on : %d %d\n", mousex,mousey);
}


// 	});
// })(jQuery);






















