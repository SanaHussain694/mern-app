import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
function HomePage() {
return (
<Box>
{/* Hero Section */}
<Box
sx={{
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
color: 'white',
py: 10,
textAlign: 'center'
}}
>
<Container>
<Typography variant='h2' fontWeight='bold' gutterBottom>
AI-Based Recruitment Platform
</Typography>
<Typography variant='h5' sx={{ mb: 4, opacity: 0.9 }}>
Connect talented candidates with top employers through intelligent assessments
</Typography>
<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
<Button variant='contained' size='large' sx={{ bgcolor: 'white', color: '#667eea', '&:hover': { bgcolor: '#f0f0f0' } }}>
Get Started
</Button>
<Button variant='outlined' size='large' sx={{ color: 'white', borderColor: 'white' }}>
Learn More
</Button>
</Box>
</Container>
</Box>
{/* Features Section will continue... */}
 aur remaining code:
{/* Features Section */}
<Container sx={{ py: 8 }}>
<Typography variant='h3' textAlign='center' fontWeight='bold' gutterBottom>
Our Features
</Typography>
<Grid container spacing={4} sx={{ mt: 4 }}>
<Grid item xs={12} md={4}>
<Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
<CardContent>
<WorkIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
<Typography variant='h5' fontWeight='bold' gutterBottom>
For Job Seekers
</Typography>
<Typography color='text.secondary'>
Take skill assessments, showcase your abilities, and get matched with perfect job opportunities.
</Typography>
</CardContent>
</Card>
</Grid>
{/* Similar cards for Job Providers and AI Assessments */}
</Grid>
</Container>
</Box>
);
}
export default HomePage;