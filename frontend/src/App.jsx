import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';
import NoteEditor from './components/NoteEditor';

function App() {
  return (
    <SocketProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/notes/:id" element={<NoteEditor />} />
            <Route path="/" element={<div>Welcome! Enter a note ID to start (e.g., /notes/123).</div>} />
          </Routes>
        </Router>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;