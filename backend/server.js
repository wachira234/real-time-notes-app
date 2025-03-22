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
    origin: "https://notes-app-mongodb.netlify.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: "https://notes-app-mongodb.netlify.app",
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
    console.log('New note created:', note._id);
    res.json(note);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).send('Server error');
  }
});

app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).send('Note not found');
    console.log('Fetched note:', note._id);
    res.json(note);
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).send('Server error');
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true });
    if (!note) return res.status(404).send('Note not found');
    console.log('Updated note:', note._id);
    res.json(note);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).send('Server error');
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', ({ room, username }) => {
    console.log(`Socket ${socket.id} joining room: ${room} as ${username}`);
    socket.join(room);
    socket.username = username; // Store username on socket
    if (!rooms.has(room)) rooms.set(room, new Set());
    rooms.get(room).add(username);
    io.to(room).emit('current users', Array.from(rooms.get(room)));
    socket.to(room).emit('user joined', username);
    console.log(`Room ${room} users:`, Array.from(rooms.get(room)));
  });

  socket.on('edit', async ({ room, content }) => {
    console.log(`Edit in room ${room}: ${content}`);
    socket.to(room).emit('edit', content);
    // Optionally save to MongoDB
    try {
      await Note.findByIdAndUpdate(room, { content }, { new: true });
      console.log(`Note ${room} updated in DB`);
    } catch (err) {
      console.error('Error saving edit to DB:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}, username: ${socket.username}`);
    rooms.forEach((users, room) => {
      if (users.has(socket.username)) {
        users.delete(socket.username);
        io.to(room).emit('user left', socket.username);
        io.to(room).emit('current users', Array.from(users));
        console.log(`Room ${room} users after disconnect:`, Array.from(users));
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));