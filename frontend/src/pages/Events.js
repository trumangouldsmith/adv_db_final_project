import React from 'react';
import { useQuery } from '@apollo/client';
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
  Chip
} from '@mui/material';
import { GET_EVENTS } from '../graphql/queries';

const Events = () => {
  const { loading, error, data } = useQuery(GET_EVENTS);
  const navigate = useNavigate();

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const events = data?.getEvents || [];
  const upcomingEvents = events.filter(e => new Date(e.Date) >= new Date());
  const pastEvents = events.filter(e => new Date(e.Date) < new Date());

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

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
    </Container>
  );
};

export default Events;

