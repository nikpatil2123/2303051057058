import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

export default function StatisticsPage() {
  const statistics = JSON.parse(localStorage.getItem('statistics')) || [];

  console.log('Retrieved statistics from localStorage:', statistics);

  if (statistics.length === 0) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>Statistics</Typography>
        <Typography>No statistics available. Please shorten a URL first.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Statistics</Typography>
      {statistics.map((stat, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 2 }}>
          <Typography>Short URL: {stat.short}</Typography>
          <Typography>Original URL: {stat.original}</Typography>
          <Typography>Total Clicks: {stat.clicks}</Typography>
          <Typography>Creation Date: {stat.creationDate}</Typography>
          <Typography>Expiry Date: {stat.expiryDate}</Typography>
          <Typography>Click Details:</Typography>
          {stat.clickDetails.map((detail, index) => (
            <Typography key={index}>
              Timestamp: {detail.timestamp} | Source: {detail.source} | Location: {detail.location}
            </Typography>
          ))}
        </Paper>
      ))}
    </Container>
  );
}

