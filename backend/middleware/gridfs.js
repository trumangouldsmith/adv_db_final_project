const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

let gfs;

// Initialize GridFS
const initGridFS = () => {
  const conn = mongoose.connection;
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('photos');
  return gfs;
};

// GridFS Storage
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}_${file.originalname}`,
      bucketName: 'photos'
    };
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, gif)'), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 16777216 // 16MB default
  }
});

// Get file by ID
const getFileById = async (fileId) => {
  if (!gfs) {
    initGridFS();
  }
  
  return new Promise((resolve, reject) => {
    gfs.files.findOne({ _id: mongoose.Types.ObjectId(fileId) }, (err, file) => {
      if (err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
};

// Create read stream
const createReadStream = (fileId) => {
  if (!gfs) {
    initGridFS();
  }
  return gfs.createReadStream({ _id: mongoose.Types.ObjectId(fileId) });
};

// Delete file by ID
const deleteFileById = async (fileId) => {
  if (!gfs) {
    initGridFS();
  }
  
  return new Promise((resolve, reject) => {
    gfs.remove({ _id: mongoose.Types.ObjectId(fileId), root: 'photos' }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  initGridFS,
  upload,
  getFileById,
  createReadStream,
  deleteFileById
};

