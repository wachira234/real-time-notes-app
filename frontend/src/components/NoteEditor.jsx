import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../contexts/SocketContext';
import { UserContext } from '../contexts/UserContext';

const NoteEditor = () => {
  const { id } = useParams();
  const socket = useContext(SocketContext);
  const { username } = useContext(UserContext);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`https://real-time-notes-app.onrender.com/api/notes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch note: ${res.status}`);
        return res.json();
      })
      .then((data) => setContent(data.content || ''))
      .catch((err) => console.error('Error fetching note:', err));

    socket.connect();
    socket.emit('join', { room: id, username });

    socket.on('edit', (newContent) => setContent(newContent));
    socket.on('current users', (userList) => setUsers(userList));
    socket.on('user joined', (newUser) => setUsers((prev) => [...prev, newUser]));
    socket.on('user left', (leftUser) => setUsers((prev) => prev.filter((u) => u !== leftUser)));

    return () => {
      socket.disconnect();
      socket.off('edit');
      socket.off('current users');
      socket.off('user joined');
      socket.off('user left');
    };
  }, [id, username, socket]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit('edit', { room: id, content: newContent });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Collaborative Note</h2>
      <textarea
        value={content}
        onChange={handleChange}
        style={{ width: '100%', height: '200px', marginBottom: '20px' }}
        placeholder="Start typing..."
      />
      <h3>Online Users:</h3>
      <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default NoteEditor;