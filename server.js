var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static("front"));

var ops = [];

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

http.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`);
});

io.on('connection', (socket) => {
    socket.emit('init', ops);

    socket.on('update', (lPos, nPos, col, tId) => {
        ops.push({type: 0, a: lPos, b: nPos, c: col, t: tId});
        socket.broadcast.emit('update', lPos, nPos, col, tId);
    });

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`)
    });

    socket.on('clear', () => {
        ops = [];
        socket.broadcast.emit('clear');
    });

    socket.on('dot', (pos, col, tId) => {
        ops.push({type: 1, p: pos, c: col, t: tId});
        socket.broadcast.emit('dot', pos, col, tId);
    });

    console.log(`user ${socket.id} connected`)
});