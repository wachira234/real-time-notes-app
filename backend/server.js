const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const Note = require('./models/Note');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://notes-app-mongodb.netlify.app", // No trailing slash
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: "https://notes-app-mongodb.netlify.app", // No trailing slash
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

app.post('/api/notes', async (req, res) => {
  try {
    const note = new Note({ content: '' });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send('Note not found');
    res.json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true });
    if (!note) return res.status(404).send('Note not found');
    res.json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('join', ({ room, username }) => {
    socket.join(room);
    if (!rooms.has(room)) rooms.set(room, new Set());
    rooms.get(room).add(username);
    io.to(room).emit('current users', Array.from(rooms.get(room)));
    socket.to(room).emit('user joined', username);
  });

  socket.on('edit', ({ room, content }) => {
    socket.to(room).emit('edit', content);
  });

  socket.on('disconnect', () => {
    rooms.forEach((users, room) => {
      if (users.has(socket.username)) {
        users.delete(socket.username);
        io.to(room).emit('user left', socket.username);
        io.to(room).emit('current users', Array.from(users));
      }
    });
  });

  socket.on('join', ({ username }) => socket.username = username);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));