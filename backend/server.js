require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { typeDefs } = require('./schema/typeDefs');
const { resolvers } = require('./schema/resolvers');
const { initGridFS, upload, getFileById, createReadStream, deleteFileById } = require('./middleware/gridfs');
const Photo = require('./models/Photo');

const app = express();

// Connect to MongoDB
connectDB();

// Initialize GridFS after connection
mongoose.connection.once('open', () => {
  initGridFS();
  console.log('GridFS initialized');
});

// Middleware
app.use(cors());
app.use(express.json());

// Photo upload endpoint
app.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoData = {
      File_id: req.file.id,
      File_name: req.file.originalname,
      File_size: req.file.size,
      Mime_type: req.file.mimetype,
      Alumni_id: req.body.Alumni_id,
      Event_id: req.body.Event_id || null,
      Tags: req.body.Tags ? JSON.parse(req.body.Tags) : []
    };

    const photo = new Photo(photoData);
    await photo.save();

    res.json({
      success: true,
      photo: {
        Photo_id: photo.Photo_id,
        File_id: photo.File_id,
        File_name: photo.File_name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Photo retrieval endpoint
app.get('/photo/:fileId', async (req, res) => {
  try {
    const file = await getFileById(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.set('Content-Type', file.contentType);
    const readStream = createReadStream(req.params.fileId);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Photo deletion endpoint
app.delete('/photo/:fileId', async (req, res) => {
  try {
    await deleteFileById(req.params.fileId);
    await Photo.findOneAndDelete({ File_id: req.params.fileId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();

