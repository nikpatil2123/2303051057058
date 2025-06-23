import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import './App.css';
import UrlShortenerForm from './component/UrlShortenerForm';
import StatisticsPage from './component/StatisticsPage';

function UrlShortenerPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <UrlShortenerForm />
    </Container>
  );
}

function RedirectPage({ code }) {
  const [originalUrl, setOriginalUrl] = React.useState(null);

  React.useEffect(() => {
    const statistics = JSON.parse(localStorage.getItem('statistics')) || [];
    const entryIndex = statistics.findIndex((entry) => entry.code === code);

    if (entryIndex !== -1) {
      const entry = statistics[entryIndex];
      entry.clicks += 1;
      entry.clickDetails.push({
        timestamp: new Date().toLocaleString(),
        source: navigator.userAgent,
        location: 'Unknown', // Replace with actual location logic if available
      });
      statistics[entryIndex] = entry;
      localStorage.setItem('statistics', JSON.stringify(statistics));
      setOriginalUrl(entry.original);
    } else {
      setOriginalUrl('/');
    }
  }, [code]);

  if (!originalUrl) return <Typography>Loading...</Typography>;

  window.location.href = originalUrl;
  return null;
}

function App() {
  console.log('Rendering App component');

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>URL Shortener</Typography>
          <Button color="inherit" component={Link} to="/">Shorten URL</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<UrlShortenerPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/:code" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
