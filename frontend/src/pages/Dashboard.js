import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { useQuery } from '@apollo/client';
import ChatInterface from '../components/ChatInterface';
import { GET_ALUMNI, GET_EVENTS } from '../graphql/queries';

const Dashboard = () => {
  const { data: alumniData } = useQuery(GET_ALUMNI);
  const { data: eventsData } = useQuery(GET_EVENTS);

  const totalAlumni = alumniData?.getAlumni?.length || 0;
  const totalEvents = eventsData?.getEvents?.length || 0;
  const upcomingEvents = eventsData?.getEvents?.filter(
    e => new Date(e.Date) >= new Date()
  )?.length || 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">{totalAlumni}</Typography>
            <Typography variant="subtitle1">Total Alumni</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">{upcomingEvents}</Typography>
            <Typography variant="subtitle1">Upcoming Events</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">{totalEvents}</Typography>
            <Typography variant="subtitle1">Total Events</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ask questions about alumni and events in natural language
            </Typography>
            <Box sx={{ mt: 2 }}>
              <ChatInterface />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

