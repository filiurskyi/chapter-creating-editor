const { staticFile, readDirPromise, readFilePromise } = require('./utilities/filesHandle');
const path = require('path');
const mime = require('./utilities/mime');

const express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http);

const port = 3700;

let clients = [];

io.on('connection', (socket) => {
    console.log(`Client with id ${socket.id} connected`);
    clients.push(socket.id);

    // socket.emit('message', "I'm server");

    socket.on('joinRoom', (roomName) => {
        socket.leaveAll();
        socket.join(roomName);

        console.log(`User joined room: ${roomName}`);
    });

    socket.on('message', (message) => {
        console.log('Message: ', message);
        io.emit('message', message);
    }
    );

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socket.id), 1);
        console.log(
            `Client with id ${socket.id} disconnected`
        );
    });
});

app.use(express.json());

app.get('/', (_, res) => {
    staticFile(res, '/html/websocket.html', '.html');
});

app.all('*', (req, res) => {
    const extname = String(path.extname(req.url)).toLowerCase();
    if (extname in mime) {
        staticFile(res, req.url, extname);
    } else {
        staticFile(res, '/html/not-found.html', '.html');
    }
});

//получение количества активных клиентов
app.get('/clients-count', (req, res) => {
    res.json({
        count: io.clients().server.engine.clientsCount,
    });
});

//отправка сообщения конкретному клиенту по его id
app.post('/client/:id', (req, res) => {
    if (clients.indexOf(req.params.id) !== -1) {
        io.sockets.connected[req.params.id].emit(
            'private message',
            `Message to client with id ${req.params.id}`
        );
        return res.status(200).json({
            message: `Message was sent to client with id ${req.params.id}`,
        });
    } else
        return res
            .status(404)
            .json({ message: 'Client not found' });
});

http.listen(port, () =>
    console.log(`Server listens`)
);