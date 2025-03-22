require('dotenv').config();

const express = require('express'); 
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: ["https://real-time-communication-with-socket-io.vercel.app/"],
    methods: ["GET", "POST"]
  }
});


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB Atlas connection error:', err);
});

const Note = mongoose.model('Note', {
  content: String
});

app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) res.json(note);
    else res.status(404).send('Note not found');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const note = new Note({ content: '' });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', ({ room, username }) => {
    socket.join(room);
    socket.data.username = username;
    socket.to(room).emit('user joined', username);
    const users = getUsersInRoom(room);
    socket.emit('current users', users);
  });

  socket.on('edit', async ({ room, content }) => {
    try {
      await Note.findByIdAndUpdate(room, { content });
      io.to(room).emit('edit', content);
    } catch (err) {
      console.error('Error updating note:', err);
    }
  });

  socket.on('disconnect', () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        const username = socket.data.username;
        io.to(room).emit('user left', username);
      }
    }
  });
});

function getUsersInRoom(room) {
  const clients = io.sockets.adapter.rooms.get(room);
  if (clients) {
    return Array.from(clients).map(socketId => io.sockets.sockets.get(socketId).data.username);
  }
  return [];
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
