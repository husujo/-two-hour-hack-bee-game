var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var path = require('path');
var bodyparser = require('body-parser');

var serverinit = require('./routes/server-init');


app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(__dirname));
app.use('/serverinit',serverinit);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));


app.get('/', function(req, res){
	// Cookies that have not been signed
  var cookie = req.cookies.cookieName;
  if (cookie === undefined)
  {// no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName',randomNumber);
    console.log('cookie created successfully');
  } 
  else
  {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  // Cookies that have been signed
  //console.log('Signed Cookies: ', req.signedCookies)
  res.sendFile(__dirname + '/views/index.html');
});







var beelist = {};
var tornado = [200,200];

io.on('connection', function(socket){
	console.log("connection!" + socket['id']);

	
	// socket.on('giving a square', function(x) {
	// 	console.log("something");
	// 	console.log(x);
	// });

    socket.on('update', function(x,y){
    	// console.log(x + "   " + y);
    	beelist[socket['id']] = [x,y];
    	// console.log(beelist[socket['id']]);
    	//io.emit('chat message', msg);
    	socket.emit('entities', {beelist: beelist, tornado: tornado});
    	// broadcast('beelist',beelist);

    });

    socket.on('disconnect', function(){
        // console.log(socket);
      	console.log("disconnect: " + socket['id']);
	      delete(beelist[socket['id']]);
	     // console.log(beelist[socket['id']]);
    });

});



io.on('disconnect', function(socket){
	console.log("disconnect" + socket['id']);
	delete(beelist[socket['id']]);
	

});




http.listen(8080, function(){
  console.log('listening on *:8080');
});
