import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function PageNotFoundModern(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', mb: 2 }}>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The Turing machine you're looking for doesn't exist or has been moved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default PageNotFoundModern;