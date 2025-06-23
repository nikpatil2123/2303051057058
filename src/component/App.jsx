import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import './App.css'
import UrlShortenerForm from './component/UrlShortenerForm'

function UrlShortenerPage() {
	return (
		<Container>
			<Typography variant="h4" gutterBottom>URL Shortener</Typography>
			<UrlShortenerForm />
		</Container>
	)
}

function StatisticsPage() {
	return (
		<Container>
			<Typography variant="h4" gutterBottom>Statistics</Typography>
			{/* Statistics content will go here */}
		</Container>
	)
}

function App() {
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
			</Routes>
		</Router>
	)
}

export default App