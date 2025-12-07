import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material';
import { GET_ALUMNI_BY_ID } from '../graphql/queries';

const AlumniProfile = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_ALUMNI_BY_ID, {
    variables: { id }
  });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const alumni = data?.getAlumniById;

  if (!alumni) return <Typography>Alumni not found</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {alumni.Name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {alumni.Alumni_id}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Email:</strong> {alumni.Email}</Typography>
              <Typography><strong>Phone:</strong> {alumni.Phone || 'N/A'}</Typography>
              <Typography><strong>Address:</strong> {alumni.Address || 'N/A'}</Typography>
              <Typography><strong>Graduation Year:</strong> {alumni.Graduation_year}</Typography>
              <Typography><strong>Field of Study:</strong> {alumni.Field_of_study?.join(', ') || 'N/A'}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Current Employment
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Status:</strong> {alumni.Employment_status || 'N/A'}</Typography>
              <Typography><strong>Employer:</strong> {alumni.Employer || 'N/A'}</Typography>
              <Typography><strong>Title:</strong> {alumni.Employment_title || 'N/A'}</Typography>
              {alumni.Employer_location && (
                <Typography>
                  <strong>Location:</strong> {alumni.Employer_location.City}, {alumni.Employer_location.State}
                </Typography>
              )}
            </Box>
          </Grid>

          {alumni.Employment_history && alumni.Employment_history.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Employment History
              </Typography>
              {alumni.Employment_history.map((job, index) => (
                <Box key={index} sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography><strong>{job.Employment_title}</strong> at {job.Employer}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(job.Start_date).toLocaleDateString()} - {job.End_date ? new Date(job.End_date).toLocaleDateString() : 'Present'}
                  </Typography>
                  {job.Location && (
                    <Typography variant="body2">
                      {job.Location.City}, {job.Location.State}
                    </Typography>
                  )}
                </Box>
              ))}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default AlumniProfile;

