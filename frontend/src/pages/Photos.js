import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Box,
  Paper,
  IconButton,
  Alert,
  InputAdornment,
  Backdrop
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { GET_PHOTOS, GET_EVENTS } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

const Photos = () => {
  const { user } = useAuth();
  const [openUpload, setOpenUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState('');
  const [eventId, setEventId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [searchTags, setSearchTags] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_PHOTOS);
  const { data: eventsData } = useQuery(GET_EVENTS);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setUploadError(null);
    } else {
      setUploadError('Please select a valid image file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file');
      return;
    }

    if (!user?.Alumni_id) {
      setUploadError('You must be logged in to upload photos');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('Alumni_id', user.Alumni_id);
    if (eventId) formData.append('Event_id', eventId);
    if (tags) formData.append('Tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(t => t)));

    try {
      await axios.post(process.env.REACT_APP_UPLOAD_URI || 'http://localhost:4000/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOpenUpload(false);
      resetUploadForm();
      refetch();
    } catch (err) {
      setUploadError('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setFile(null);
    setPreview(null);
    setTags('');
    setEventId('');
    setUploadError(null);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
    resetUploadForm();
  };

  const handleDeletePhoto = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_PHOTO_URI || 'http://localhost:4000/photo'}/${fileId}`);
      refetch();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error loading photos: {error.message}</Alert>
      </Container>
    );
  }

  const photos = data?.getPhotos || [];
  const events = eventsData?.getEvents || [];

  // Filter photos by search tags
  const filteredPhotos = searchTags
    ? photos.filter(photo =>
        photo.Tags?.some(tag =>
          tag.toLowerCase().includes(searchTags.toLowerCase())
        )
      )
    : photos;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Photo Gallery
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => setOpenUpload(true)}
          sx={{ borderRadius: 2 }}
        >
          Upload Photo
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by tags..."
          value={searchTags}
          onChange={(e) => setSearchTags(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTags && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTags('')}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          size="small"
        />
      </Paper>

      {/* Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredPhotos.length} of {photos.length} photos
        </Typography>
      </Box>

      {/* Photo Grid */}
      <Grid container spacing={3}>
        {filteredPhotos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={photo._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`${process.env.REACT_APP_PHOTO_URI || 'http://localhost:4000/photo'}/${photo.File_id}`}
                  alt={photo.File_name}
                  sx={{ objectFit: 'cover', cursor: 'pointer', bgcolor: 'grey.800' }}
                  onClick={() => setSelectedPhoto(photo)}
                  onError={(e) => {
                    e.target.onerror = null;
                    // Use picsum.photos for random stock images - seed based on photo ID for consistency
                    const seed = photo.Photo_id || photo._id || Math.random();
                    e.target.src = `https://picsum.photos/seed/${seed}/400/300`;
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                  }}
                  size="small"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <ZoomInIcon />
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" noWrap title={photo.File_name}>
                  {photo.File_name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {photo.Upload_date && !isNaN(new Date(photo.Upload_date).getTime()) 
                    ? new Date(photo.Upload_date).toLocaleDateString() 
                    : 'Unknown date'}
                </Typography>
                {photo.Event_id && (
                  <Typography variant="caption" color="primary" display="block">
                    Event: {photo.Event_id}
                  </Typography>
                )}
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {photo.Tags?.slice(0, 3).map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      size="small"
                      variant="outlined"
                      onClick={() => setSearchTags(tag)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                  {photo.Tags?.length > 3 && (
                    <Chip label={`+${photo.Tags.length - 3}`} size="small" variant="outlined" />
                  )}
                </Box>
              </CardContent>
              {user && photo.Alumni_id === user.Alumni_id && (
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeletePhoto(photo.File_id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', mt: 4 }}>
          <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTags ? 'No photos found with those tags' : 'No photos yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTags ? 'Try a different search term' : 'Be the first to upload a photo!'}
          </Typography>
          {!searchTags && (
            <Button variant="contained" onClick={() => setOpenUpload(true)}>
              Upload Photo
            </Button>
          )}
        </Paper>
      )}

      {/* Upload Dialog */}
      <Dialog open={openUpload} onClose={handleCloseUpload} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Upload Photo
            <IconButton onClick={handleCloseUpload} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}

          {/* Drag and Drop Zone */}
          <Paper
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              p: 4,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'divider',
              bgcolor: dragActive ? 'action.hover' : 'background.default',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              mb: 2
            }}
            onClick={() => document.getElementById('photo-input').click()}
          >
            {preview ? (
              <Box>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {file?.name}
                </Typography>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1">
                  Drag and drop an image here, or click to select
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports: JPG, PNG, GIF, WebP
                </Typography>
              </Box>
            )}
          </Paper>

          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
            style={{ display: 'none' }}
          />

          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            margin="normal"
            placeholder="networking, gala, 2025"
            helperText="Add tags to help others find your photo"
          />

          <TextField
            fullWidth
            select
            label="Associated Event (optional)"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="">-- Select an event --</option>
            {events.map((event) => (
              <option key={event._id} value={event.Event_id}>
                {event.Name} ({new Date(event.Date).toLocaleDateString()})
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseUpload}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading || !file}
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lightbox */}
      <Backdrop
        open={!!selectedPhoto}
        onClick={() => setSelectedPhoto(null)}
        sx={{ zIndex: 1300, bgcolor: 'rgba(0,0,0,0.9)' }}
      >
        {selectedPhoto && (
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              onClick={() => setSelectedPhoto(null)}
              sx={{
                position: 'absolute',
                top: -40,
                right: 0,
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={`${process.env.REACT_APP_PHOTO_URI || 'http://localhost:4000/photo'}/${selectedPhoto.File_id}`}
              alt={selectedPhoto.File_name}
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 8
              }}
              onError={(e) => {
                e.target.onerror = null;
                const seed = selectedPhoto.Photo_id || selectedPhoto._id || Math.random();
                e.target.src = `https://picsum.photos/seed/${seed}/800/600`;
              }}
            />
            <Box sx={{ mt: 2, textAlign: 'center', color: 'white' }}>
              <Typography variant="body1">{selectedPhoto.File_name}</Typography>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                {selectedPhoto.Tags?.map((tag, idx) => (
                  <Chip key={idx} label={tag} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Backdrop>
    </Container>
  );
};

export default Photos;
