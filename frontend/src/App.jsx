import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NoteEditor from './NoteEditor';

function Home() {
  const navigate = useNavigate();

  const createNewNote = async () => {
    try {
      const response = await fetch('https://real-time-notes-backend-6qdj.onrender.com/api/notes', {
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
      <p>Create a new note or enter a note ID (e.g., /notes/123).</p>
      <button onClick={createNewNote} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Create New Note
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes/:id" element={<NoteEditor />} />
      </Routes>
    </Router>
  );
}

export default App;