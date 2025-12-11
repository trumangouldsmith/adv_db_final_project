import React, { useState } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { GET_ALUMNI, GET_EVENTS, GET_RESERVATIONS, GET_PHOTOS, GET_ADMINS } from '../graphql/queries';
import { DELETE_ALUMNI, DELETE_EVENT, DELETE_RESERVATION, DELETE_PHOTO, DELETE_ADMIN } from '../graphql/mutations';

const AdminPanel = () => {
  const [tab, setTab] = useState(0);
  const [graphqlQuery, setGraphqlQuery] = useState(`query {
  getAlumni {
    _id
    Name
    Email
    Employer
  }
}`);
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [executing, setExecuting] = useState(false);
  const apolloClient = useApolloClient();

  const { data: alumniData, loading: alumniLoading, refetch: refetchAlumni } = useQuery(GET_ALUMNI);
  const { data: eventsData, loading: eventsLoading, refetch: refetchEvents } = useQuery(GET_EVENTS);
  const { data: reservationsData, loading: reservationsLoading, refetch: refetchReservations } = useQuery(GET_RESERVATIONS);
  const { data: photosData, loading: photosLoading, refetch: refetchPhotos } = useQuery(GET_PHOTOS);
  const { data: adminsData, loading: adminsLoading, refetch: refetchAdmins } = useQuery(GET_ADMINS);

  const [deleteAlumni] = useMutation(DELETE_ALUMNI);
  const [deleteEvent] = useMutation(DELETE_EVENT);
  const [deleteReservation] = useMutation(DELETE_RESERVATION);
  const [deletePhoto] = useMutation(DELETE_PHOTO);
  const [deleteAdmin] = useMutation(DELETE_ADMIN);

  const handleDelete = async (type, id, refetch) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;

    try {
      const mutations = {
        alumni: deleteAlumni,
        event: deleteEvent,
        reservation: deleteReservation,
        photo: deletePhoto,
        admin: deleteAdmin
      };

      await mutations[type]({ variables: { id } });
      refetch();
      alert('Deleted successfully');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const executeGraphQL = async () => {
    setExecuting(true);
    setQueryError(null);
    setQueryResult(null);

    try {
      const cleanQuery = graphqlQuery.trim();
      const dynamicQuery = gql`${cleanQuery}`;
      const isMutation = cleanQuery.toLowerCase().startsWith('mutation');

      let result;
      if (isMutation) {
        result = await apolloClient.mutate({ mutation: dynamicQuery });
      } else {
        result = await apolloClient.query({ query: dynamicQuery, fetchPolicy: 'network-only' });
      }

      setQueryResult(result.data);
      
      // Refetch all data to reflect any changes
      refetchAlumni();
      refetchEvents();
      refetchReservations();
      refetchPhotos();
      refetchAdmins();
    } catch (err) {
      setQueryError(err.message);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Alumni" />
        <Tab label="Events" />
        <Tab label="Reservations" />
        <Tab label="Photos" />
        <Tab label="Admins" />
        <Tab label="GraphQL Executor" />
      </Tabs>

      {/* Alumni Tab */}
      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          {alumniLoading ? <CircularProgress /> : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Employer</TableCell>
                    <TableCell>Graduation Year</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumniData?.getAlumni.map((alumni) => (
                    <TableRow key={alumni._id}>
                      <TableCell>{alumni.Name}</TableCell>
                      <TableCell>{alumni.Email}</TableCell>
                      <TableCell>{alumni.Employer || 'N/A'}</TableCell>
                      <TableCell>{alumni.Graduation_year}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete('alumni', alumni._id, refetchAlumni)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Events Tab */}
      {tab === 1 && (
        <Box sx={{ mt: 3 }}>
          {eventsLoading ? <CircularProgress /> : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventsData?.getEvents.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>{event.Name}</TableCell>
                      <TableCell>{new Date(event.Date).toLocaleDateString()}</TableCell>
                      <TableCell>{event.Location}</TableCell>
                      <TableCell>{event.Capacity || 'N/A'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete('event', event._id, refetchEvents)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Reservations Tab */}
      {tab === 2 && (
        <Box sx={{ mt: 3 }}>
          {reservationsLoading ? <CircularProgress /> : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reservation ID</TableCell>
                    <TableCell>Alumni ID</TableCell>
                    <TableCell>Event ID</TableCell>
                    <TableCell>Attendees</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservationsData?.getReservations.map((reservation) => (
                    <TableRow key={reservation._id}>
                      <TableCell>{reservation.Reservation_id}</TableCell>
                      <TableCell>{reservation.Alumni_id}</TableCell>
                      <TableCell>{reservation.Event_id}</TableCell>
                      <TableCell>{reservation.Number_of_attendees}</TableCell>
                      <TableCell>{reservation.Payment_status}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete('reservation', reservation._id, refetchReservations)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Photos Tab */}
      {tab === 3 && (
        <Box sx={{ mt: 3 }}>
          {photosLoading ? <CircularProgress /> : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Photo ID</TableCell>
                    <TableCell>Filename</TableCell>
                    <TableCell>Alumni ID</TableCell>
                    <TableCell>Event ID</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {photosData?.getPhotos.map((photo) => (
                    <TableRow key={photo._id}>
                      <TableCell>{photo.Photo_id}</TableCell>
                      <TableCell>{photo.File_name}</TableCell>
                      <TableCell>{photo.Alumni_id}</TableCell>
                      <TableCell>{photo.Event_id || 'N/A'}</TableCell>
                      <TableCell>{new Date(photo.Upload_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete('photo', photo._id, refetchPhotos)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Admins Tab */}
      {tab === 4 && (
        <Box sx={{ mt: 3 }}>
          {adminsLoading ? <CircularProgress /> : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminsData?.getAdmins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>{admin.Username}</TableCell>
                      <TableCell>{admin.Role}</TableCell>
                      <TableCell>{admin.Email || 'N/A'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete('admin', admin._id, refetchAdmins)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* GraphQL Executor Tab */}
      {tab === 5 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            GraphQL Executor
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Execute raw GraphQL queries and mutations directly against the database.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Query Input */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={graphqlQuery}
                onChange={(e) => setGraphqlQuery(e.target.value)}
                placeholder="Enter your GraphQL query or mutation..."
                sx={{
                  fontFamily: 'monospace',
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  }
                }}
              />
              <Button
                variant="contained"
                startIcon={executing ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                onClick={executeGraphQL}
                disabled={executing || !graphqlQuery.trim()}
                sx={{ mt: 2 }}
                fullWidth
              >
                {executing ? 'Executing...' : 'Execute Query'}
              </Button>
            </Box>

            {/* Results */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Results:
              </Typography>
              
              {queryError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {queryError}
                </Alert>
              )}

              <Paper
                sx={{
                  p: 2,
                  bgcolor: '#1e1e1e',
                  color: '#d4d4d4',
                  minHeight: 350,
                  maxHeight: 400,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {queryResult ? JSON.stringify(queryResult, null, 2) : 'Results will appear here...'}
              </Paper>
            </Box>
          </Box>

          {/* Quick Examples */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Quick Examples:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setGraphqlQuery(`query {
  getAlumni {
    _id
    Name
    Email
    Employer
    Graduation_year
  }
}`)}
              >
                Get All Alumni
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setGraphqlQuery(`query {
  getEvents {
    _id
    Event_id
    Name
    Date
    Location
  }
}`)}
              >
                Get All Events
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setGraphqlQuery(`query {
  getAlumniByEmployer(Employer: "Google") {
    Name
    Email
    Employment_title
  }
}`)}
              >
                Alumni by Employer
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setGraphqlQuery(`mutation {
  createEvent(input: {
    Name: "Test Event"
    Location: "Virtual"
    Date: "2025-12-25"
    Time: "18:00"
    Organizer_id: "A1001"
  }) {
    Event_id
    Name
    Date
  }
}`)}
              >
                Create Event
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AdminPanel;

