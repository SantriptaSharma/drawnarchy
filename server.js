var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var ops = [];

app.get("/", (req, res) => {
    let root = "D:/Documents/WebDevelopment/draw/front/";
    res.sendFile(root + "index.html");
});

http.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`);
});

io.on('connection', (socket) => {
    socket.emit('init', ops);

    socket.on('update', (lPos, nPos, col) => {
        ops.push({type: 0, a: lPos, b: nPos, c: col});
        socket.broadcast.emit('update', lPos, nPos, col);
    });

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`)
    });

    socket.on('clear', () => {
        ops = [];
        socket.broadcast.emit('clear');
    });

    socket.on('dot', (pos, col) => {
        ops.push({type: 1, p: pos, c: col});
        socket.broadcast.emit('dot', pos, col);
    });

    console.log(`user ${socket.id} connected`)
});