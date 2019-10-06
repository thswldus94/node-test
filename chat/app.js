// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);    
var path = require('path');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {  
  res.render('chat');  // 루트 페이지로 접속시 chat.pug 렌더링
});

var count=1; 
io.on('connection', function(socket){  // 채팅방에 접속했을 때 - 1
	console.log('user connected: ', socket.id);  
	var name = "익명의 돼지" + count++;                 
	socket.name = name;
	io.to(socket.id).emit('create_name', name);  
	
	io.emit('new_connect', name);
	
	socket.on('disconnect', function(){   // 채팅방 접속이 끊어졌을 때 - 2
		console.log('user disconnected: '+ socket.id + ' ' + socket.name);
		io.emit('new_disconnect', name);
	});

	socket.on('send_msg', function(name, text){  // 메세지를 보냈을 때 - 3 
		var msg = name + ' : ' + text;
		
		if (name != socket.name) {
			io.emit('change_name', socket.name, name);
		}
		socket.name = name;
		
		console.log(msg);
		io.emit('receive_msg', msg);
	});
	
});

http.listen(3112, function(){ 
	console.log('server on..');
});