import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { GET_EVENT_BY_ID, GET_RESERVATIONS_BY_EVENT } from '../graphql/queries';
import { CREATE_RESERVATION } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [openRSVP, setOpenRSVP] = useState(false);
  const [attendees, setAttendees] = useState(1);

  const { loading, error, data } = useQuery(GET_EVENT_BY_ID, {
    variables: { id }
  });

  const { data: reservationsData } = useQuery(GET_RESERVATIONS_BY_EVENT, {
    variables: { eventId: data?.getEventById?.Event_id },
    skip: !data?.getEventById?.Event_id
  });

  const [createReservation] = useMutation(CREATE_RESERVATION, {
    refetchQueries: [{ query: GET_RESERVATIONS_BY_EVENT, variables: { eventId: data?.getEventById?.Event_id } }]
  });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const event = data?.getEventById;
  if (!event) return <Typography>Event not found</Typography>;

  const handleRSVP = async () => {
    try {
      await createReservation({
        variables: {
          input: {
            Alumni_id: user.Alumni_id,
            Event_id: event.Event_id,
            Number_of_attendees: attendees,
            Payment_status: 'Pending'
          }
        }
      });
      setOpenRSVP(false);
      alert('RSVP successful!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const reservationCount = reservationsData?.getReservationsByEvent?.reduce(
    (sum, r) => sum + (r.Number_of_attendees || 1),
    0
  ) || 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {event.Name}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Event Details</Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}
          </Typography>
          {event.Time && (
            <Typography><strong>Time:</strong> {event.Time}</Typography>
          )}
          <Typography><strong>Location:</strong> {event.Location}</Typography>
          {event.Capacity && (
            <Typography>
              <strong>Capacity:</strong> {reservationCount} / {event.Capacity}
            </Typography>
          )}
          <Typography sx={{ mt: 2 }}>{event.Description}</Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => setOpenRSVP(true)}>
            RSVP
          </Button>
        </Box>
      </Paper>

      <Dialog open={openRSVP} onClose={() => setOpenRSVP(false)}>
        <DialogTitle>RSVP for {event.Name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Number of Attendees"
            type="number"
            value={attendees}
            onChange={(e) => setAttendees(parseInt(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRSVP(false)}>Cancel</Button>
          <Button onClick={handleRSVP} variant="contained">
            Confirm RSVP
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetail;

