import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper } from '@mui/material';

const DEFAULT_VALIDITY = 30;

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{3,20}$/.test(code); 
}

const emptyRow = { url: '', validity: '', shortcode: '', error: {} };

export default function UrlShortenerForm() {
  const [rows, setRows] = useState([
    { ...emptyRow },
  ]);
  const [results, setResults] = useState([]);

  const handleChange = (idx, field, value) => {
    const updated = [...rows];
    updated[idx][field] = value;
    updated[idx].error = { ...updated[idx].error, [field]: undefined };
    setRows(updated);
  };

  const addRow = () => {
    if (rows.length < 5) setRows([...rows, { ...emptyRow }]);
  };

  const removeRow = (idx) => {
    if (rows.length > 1) setRows(rows.filter((_, i) => i !== idx));
  };

  const validate = () => {
    let valid = true;
    const updated = rows.map((row) => {
      const error = {};
      if (!row.url || !isValidUrl(row.url)) {
        error.url = 'Enter a valid URL';
        valid = false;
      }
      if (row.validity && (!/^[0-9]+$/.test(row.validity) || parseInt(row.validity) <= 0)) {
        error.validity = 'Enter a positive integer (minutes)';
        valid = false;
      }
      if (row.shortcode && !isValidShortcode(row.shortcode)) {
        error.shortcode = '3-20 alphanumeric characters';
        valid = false;
      }
      return { ...row, error };
    });
    setRows(updated);
    return valid;
  };

  const usedShortcodes = new Set();

  const generateUniqueShortcode = (customCode) => {
    let code = customCode || Math.random().toString(36).substring(2, 8);
    while (usedShortcodes.has(code)) {
      code = Math.random().toString(36).substring(2, 8);
    }
    usedShortcodes.add(code);
    return code;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newResults = rows.map((row) => {
      const code = generateUniqueShortcode(row.shortcode);
      const validity = row.validity ? parseInt(row.validity) : DEFAULT_VALIDITY;
      const expiry = new Date(Date.now() + validity * 60000).toLocaleString();
      return {
        original: row.url,
        short: `${window.location.origin}/${code}`,
        expiry,
        code,
        creationDate: new Date().toLocaleString(),
        clicks: 0,
        clickDetails: [],
      };
    });
    setResults(newResults);

    const existingStatistics = JSON.parse(localStorage.getItem('statistics')) || [];
    const updatedStatistics = [...existingStatistics, ...newResults];
    localStorage.setItem('statistics', JSON.stringify(updatedStatistics));

    console.log('Updated statistics in localStorage:', updatedStatistics);
  };

  return (
    <Box mt={3}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {rows.map((row, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper sx={{ p: 2, mb: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Original URL"
                      value={row.url}
                      onChange={e => handleChange(idx, 'url', e.target.value)}
                      error={!!row.error.url}
                      helperText={row.error.url}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      label="Validity (min)"
                      value={row.validity}
                      onChange={e => handleChange(idx, 'validity', e.target.value)}
                      error={!!row.error.validity}
                      helperText={row.error.validity}
                      fullWidth
                      placeholder={DEFAULT_VALIDITY}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Custom Shortcode"
                      value={row.shortcode}
                      onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                      error={!!row.error.shortcode}
                      helperText={row.error.shortcode}
                      fullWidth
                      placeholder="Optional"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button onClick={() => removeRow(idx)} disabled={rows.length === 1} color="error">Remove</Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box mt={2}>
          <Button onClick={addRow} disabled={rows.length >= 5} variant="outlined">Add URL</Button>
        </Box>
        <Box mt={2}>
          <Button type="submit" variant="contained">Shorten URLs</Button>
        </Box>
      </form>
      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map((res, idx) => (
            <Paper key={idx} sx={{ p: 2, mt: 1 }}>
              <Typography>Original: {res.original}</Typography>
              <Typography>
                Short: <a href={res.original} target="_blank" rel="noopener noreferrer">{res.short}</a>
              </Typography>
              <Typography>Expiry: {res.expiry}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
