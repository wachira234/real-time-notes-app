# Real-Time Notes App

## Description

This application is a real-time notes app built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to create, edit, and manage notes in real-time using WebSocket technology provided by Socket.IO.

## Technologies Used

- **MongoDB Atlas**: Cloud database service for storing notes.
- **Express**: Web framework for Node.js.
- **React**: JavaScript library for building user interfaces.
- **Node.js**: JavaScript runtime for server-side development.
- **Socket.IO**: Library for real-time web applications.
- **Vite**: Build tool for frontend development.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd real-time-notes-app
   ```

2. Navigate to the backend directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Set up your environment variables in a `.env` file:

   ```
   MONGODB_URI=<mongodb+srv://washira:<db_password>@cluster1.zgvp5.mongodb.net/>
   PORT=5000
   ```

4. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Usage

To run the application, follow these steps:

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd ../frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` to access the application.

## API Endpoints

- `GET /api/notes/:id`: Retrieve a note by its ID.
- `POST /api/notes`: Create a new note.

## Deployment

- **Frontend**: [Netlify Link](https://notes-app-mongodb.netlify.app/)
- **Backend**: [Render Link](https://real-time-notes-app.onrender.com)

## MongoDB Atlas

This application uses MongoDB Atlas for database management. Ensure you have a valid connection string in your `.env` file.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.
