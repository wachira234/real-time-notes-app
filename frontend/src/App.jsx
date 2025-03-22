import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';
import NoteEditor from './components/NoteEditor';

function Home() {
  const navigate = useNavigate();

  const createNewNote = async () => {
    try {
      const response = await fetch('https://real-time-notes-app.onrender.com/api/notes', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to create note');
      const data = await response.json();
      navigate(`/notes/${data._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create a new note. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Real-Time Notes!</h1>
      <p>Click below to create a new note or enter a note ID (e.g., /notes/123).</p>
      <button onClick={createNewNote} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Create New Note
      </button>
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/notes/:id" element={<NoteEditor />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;