import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Box
} from '@mui/material';
import { GET_PHOTOS } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

const Photos = () => {
  const { user } = useAuth();
  const [openUpload, setOpenUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [eventId, setEventId] = useState('');
  const [uploading, setUploading] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_PHOTOS);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('Alumni_id', user.Alumni_id);
    if (eventId) formData.append('Event_id', eventId);
    if (tags) formData.append('Tags', JSON.stringify(tags.split(',').map(t => t.trim())));

    try {
      await axios.post(process.env.REACT_APP_UPLOAD_URI, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Photo uploaded successfully!');
      setOpenUpload(false);
      setFile(null);
      setTags('');
      setEventId('');
      refetch();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const photos = data?.getPhotos || [];

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Photos</Typography>
        <Button variant="contained" onClick={() => setOpenUpload(true)}>
          Upload Photo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`${process.env.REACT_APP_PHOTO_URI}/${photo.File_id}`}
                alt={photo.File_name}
              />
              <CardContent>
                <Typography variant="body2">{photo.File_name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(photo.Upload_date).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {photo.Tags?.map((tag, idx) => (
                    <Chip key={idx} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {photos.length === 0 && (
        <Typography color="text.secondary">No photos yet</Typography>
      )}

      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Upload Photo</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: '16px' }}
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            margin="normal"
            placeholder="networking, gala, 2025"
          />
          <TextField
            fullWidth
            label="Event ID (optional)"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Photos;

