
const express = require('express');
const app = express();
const cors = require('cors');
const MongooseConnection = require('./mongo-connection');
const AnnouncementsService = require('./announcements-service');
const socketIo = require('socket.io');
const http = require('http');
app.use(express.json());
const corsOptions = {
	origin: '*', // Allow requests from any origin
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Create an instance of the MongooseConnection class
const mongooseConnection = new MongooseConnection();

// Create an instance of the AnnouncementsService class
const announcementsService = new AnnouncementsService();

mongooseConnection.create().then((res) => {
	console.log(res);
})

const server = http.createServer(app);

// Create a WebSocket server using the HTTP server
const io = socketIo(server, {
	cors: { origin: '*' }
});


io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('checkUpdate', () => {
		io.emit('updateData', {});
	})
	socket.on('disconnect', () => {
		console.log('a user disconnected!');
	});
});


app.get('/announcements', async (req, res) => {
	const query = req.query;
	const response = await announcementsService.get(query);
	res.send(response);
})

app.post('/announcements', async (req, res) => {
	const body = req.body;
	const response = await announcementsService.create(body);
	io.emit('updateData', { type: response['type'] });
	res.send({ result: response, succeeded: true });
});

app.put('/announcements/:id', async (req, res) => {
	const id = req.params['id'];
	const body = req.body;
	const response = await announcementsService.update(id, body);
	io.emit('updateData', {});
	res.send({ result: response, succeeded: true });
});

app.delete('/announcements/:id', async (req, res) => {
	const id = req.params['id'];
	const response = await announcementsService.delete(id);
	io.emit('updateData', {type: response['type']});
	res.send({ result: response, succeeded: true });
});




server.listen(3000, () => {
	console.log('Server is running on port 3000');
});