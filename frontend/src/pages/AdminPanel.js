import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
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
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_ALUMNI, GET_EVENTS, GET_RESERVATIONS, GET_PHOTOS, GET_ADMINS } from '../graphql/queries';
import { DELETE_ALUMNI, DELETE_EVENT, DELETE_RESERVATION, DELETE_PHOTO, DELETE_ADMIN } from '../graphql/mutations';

const AdminPanel = () => {
  const [tab, setTab] = useState(0);

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
    </Container>
  );
};

export default AdminPanel;

