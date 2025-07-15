import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { useLogger } from '../middleware/LoggerContext';
import { nanoid } from 'nanoid';

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { log } = useLogger();

  const handleInputChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addInput = () => {
    if (inputs.length < 5) setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleShorten = () => {
    const now = Date.now();
    const all = JSON.parse(localStorage.getItem('shortened') || '[]');
    const newResults = inputs.map((input) => {
      if (!isValidURL(input.url)) return { error: 'Invalid URL' };

      let validity = parseInt(input.validity || '30');
      const shortcode = input.shortcode || nanoid(6);
      const expiry = new Date(now + validity * 60000);
      const codeExists = all.find((e) => e.shortcode === shortcode);

      if (codeExists) return { error: 'Shortcode already exists' };

      const entry = {
        original: input.url,
        shortcode,
        expiry,
        created: new Date(),
        clicks: [],
      };

      all.push(entry);
      log('Shortened URL created', { shortcode, original: input.url });
      return entry;
    });

    const validResults = newResults.filter(res => !res.error);
    if (validResults.length > 0) {
      localStorage.setItem('shortened', JSON.stringify([...JSON.parse(localStorage.getItem('shortened') || '[]'), ...validResults]));
    }

    setResults(newResults);
    if (newResults.some(r => r.error)) {
      showSnackbar('One or more URLs failed to shorten.', 'warning');
    } else {
      showSnackbar('URLs shortened successfully.', 'success');
    }
  };

  return (
    <Box mt={4} maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        🚀 URL Shortener
      </Typography>
      {inputs.map((input, idx) => (
        <Paper key={idx} elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original URL"
                variant="outlined"
                value={input.url}
                onChange={(e) => handleInputChange(idx, 'url', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                variant="outlined"
                value={input.validity}
                onChange={(e) => handleInputChange(idx, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                variant="outlined"
                value={input.shortcode}
                onChange={(e) => handleInputChange(idx, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Box textAlign="center" mb={3}>
        <Button variant="outlined" onClick={addInput} disabled={inputs.length >= 5} sx={{ mr: 2 }}>
          + Add URL
        </Button>
        <Button variant="contained" color="primary" onClick={handleShorten}>
          🔗 Shorten URLs
        </Button>
      </Box>

      <Divider />

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Shortened URLs</Typography>
        {results.map((res, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2, mb: 2 }}>
            {res.error ? (
              <Typography color="error">❌ {res.error}</Typography>
            ) : (
              <Typography>
                <strong>{res.original}</strong> → <a href={`/${res.shortcode}`} target="_blank" rel="noreferrer">http://localhost:3000/{res.shortcode}</a><br/>
                <em>Expires at: {new Date(res.expiry).toLocaleString()}</em>
              </Typography>
            )}
          </Paper>
        ))}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShortenerPage;
