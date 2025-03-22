import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';
import NoteEditor from './components/NoteEditor';

function Home() {
  const navigate = useNavigate();

  const createNewNote = async () => {
    console.log('Button clicked!');
    try {
      console.log('Fetching from: https://real-time-notes-app.onrender.com/api/notes');
      const response = await fetch('https://real-time-notes-app.onrender.com/api/notes', {
        method: 'POST',
      });
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error(`Failed to create note: ${response.status}`);
      const data = await response.json();
      console.log('New note ID:', data._id);
      navigate(`/notes/${data._id}`);
      console.log('Navigated to:', `/notes/${data._id}`);
    } catch (error) {
      console.error('Error creating note:', error.message);
      alert('Failed to create a new note: ' + error.message);
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