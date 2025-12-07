import React, { useState } from 'react';
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
  TextField,
  Box,
  CircularProgress
} from '@mui/material';
import { GET_ALUMNI } from '../graphql/queries';

const AlumniDirectory = () => {
  const [search, setSearch] = useState('');
  const { loading, error, data } = useQuery(GET_ALUMNI);
  const navigate = useNavigate();

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const filteredAlumni = data?.getAlumni.filter(alumni =>
    alumni.Name.toLowerCase().includes(search.toLowerCase()) ||
    alumni.Email.toLowerCase().includes(search.toLowerCase()) ||
    (alumni.Employer && alumni.Employer.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Alumni Directory
      </Typography>

      <TextField
        fullWidth
        label="Search by name, email, or employer"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredAlumni.map((alumni) => (
          <Grid item xs={12} sm={6} md={4} key={alumni._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{alumni.Name}</Typography>
                <Typography color="text.secondary">
                  Class of {alumni.Graduation_year}
                </Typography>
                {alumni.Employer && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {alumni.Employment_title} at {alumni.Employer}
                  </Typography>
                )}
                {alumni.Employer_location && (
                  <Typography variant="body2" color="text.secondary">
                    {alumni.Employer_location.City}, {alumni.Employer_location.State}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {alumni.Email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/alumni/${alumni._id}`)}>
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAlumni.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>No alumni found</Typography>
        </Box>
      )}
    </Container>
  );
};

export default AlumniDirectory;

