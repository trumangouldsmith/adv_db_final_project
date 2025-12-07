import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Container, Paper, TextField, Button, Typography, Box, Tabs, Tab } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { LOGIN_ALUMNI, LOGIN_ADMIN } from '../graphql/mutations';

const Login = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginAlumni] = useMutation(LOGIN_ALUMNI);
  const [loginAdmin] = useMutation(LOGIN_ADMIN);

  const handleAlumniLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { data } = await loginAlumni({
        variables: { email, password }
      });
      
      const userData = {
        ...data.loginAlumni.alumni,
        type: 'alumni'
      };
      
      login(data.loginAlumni.token, userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { data } = await loginAdmin({
        variables: { username, password }
      });
      
      const userData = {
        ...data.loginAdmin.admin,
        type: 'admin'
      };
      
      login(data.loginAdmin.token, userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          CLP Alumni Directory
        </Typography>
        
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <Tab label="Alumni Login" />
          <Tab label="Admin Login" />
        </Tabs>

        {tab === 0 && (
          <Box component="form" onSubmit={handleAlumniLogin} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Login as Alumni
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={handleAdminLogin} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Login as Admin
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;

