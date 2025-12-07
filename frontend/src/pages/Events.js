import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box
} from '@mui/material';
import { GET_EVENTS } from '../graphql/queries';
import { CREATE_EVENT } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const { loading, error, data, refetch } = useQuery(GET_EVENTS);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Location: '',
    Date: '',
    Time: '',
    Capacity: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const [createEvent] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      refetch();
      setOpenCreate(false);
      setFormData({ Name: '', Description: '', Location: '', Date: '', Time: '', Capacity: '' });
      setFormErrors({});
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateAndSubmit = () => {
    const errors = {};
    if (!formData.Name) errors.Name = 'Event name is required';
    if (!formData.Location) errors.Location = 'Location is required';
    if (!formData.Date) errors.Date = 'Date is required';
    if (!formData.Time) errors.Time = 'Time is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    createEvent({
      variables: {
        input: {
          Name: formData.Name,
          Description: formData.Description,
          Location: formData.Location,
          Date: formData.Date,
          Time: formData.Time,
          Capacity: formData.Capacity ? parseInt(formData.Capacity) : null,
          Organizer_id: user.Alumni_id
        }
      }
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const events = data?.getEvents || [];
  const upcomingEvents = events.filter(e => new Date(e.Date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.Date) < new Date());

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Events</Typography>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Event
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Upcoming Events
      </Typography>
      <Grid container spacing={3}>
        {upcomingEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Chip label="Upcoming" color="primary" size="small" sx={{ mb: 1 }} />
                <Typography variant="h6">{event.Name}</Typography>
                <Typography color="text.secondary" gutterBottom>
                  {new Date(event.Date).toLocaleDateString()}
                  {event.Time && ` at ${event.Time}`}
                </Typography>
                <Typography variant="body2">{event.Location}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {event.Description}
                </Typography>
                {event.Capacity && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Capacity: {event.Capacity}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/events/${event._id}`)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {upcomingEvents.length === 0 && (
        <Typography color="text.secondary">No upcoming events</Typography>
      )}

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Past Events
      </Typography>
      <Grid container spacing={3}>
        {pastEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card>
              <CardContent>
                <Chip label="Past" size="small" sx={{ mb: 1 }} />
                <Typography variant="h6">{event.Name}</Typography>
                <Typography color="text.secondary">
                  {new Date(event.Date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">{event.Location}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/events/${event._id}`)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          {Object.keys(formErrors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fill in all required fields
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Event Name *"
            value={formData.Name}
            onChange={(e) => handleInputChange('Name', e.target.value)}
            error={!!formErrors.Name}
            helperText={formErrors.Name}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Description"
            value={formData.Description}
            onChange={(e) => handleInputChange('Description', e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Location *"
            value={formData.Location}
            onChange={(e) => handleInputChange('Location', e.target.value)}
            error={!!formErrors.Location}
            helperText={formErrors.Location}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Date *"
            type="date"
            value={formData.Date}
            onChange={(e) => handleInputChange('Date', e.target.value)}
            error={!!formErrors.Date}
            helperText={formErrors.Date}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            label="Time *"
            type="time"
            value={formData.Time}
            onChange={(e) => handleInputChange('Time', e.target.value)}
            error={!!formErrors.Time}
            helperText={formErrors.Time}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            fullWidth
            label="Capacity"
            type="number"
            value={formData.Capacity}
            onChange={(e) => handleInputChange('Capacity', e.target.value)}
            margin="normal"
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={validateAndSubmit} variant="contained">
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Events;

