import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';

const StatisticsPage = () => {
  const data = JSON.parse(localStorage.getItem('shortened') || '[]');

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>Statistics</Typography>
      {data.map((entry, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">
            <a href={`/${entry.shortcode}`} target="_blank" rel="noreferrer">http://localhost:3000/{entry.shortcode}</a>
          </Typography>
          <Typography>Created: {new Date(entry.created).toString()}</Typography>
          <Typography>Expires: {new Date(entry.expiry).toString()}</Typography>
          <Typography>Total Clicks: {entry.clicks.length}</Typography>
          <List>
            {entry.clicks.map((click, cIdx) => (
              <ListItem key={cIdx}>
                <ListItemText primary={`Time: ${click.time}, Source: ${click.source}, Location: ${click.location}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default StatisticsPage;
