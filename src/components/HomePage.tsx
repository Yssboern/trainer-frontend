import React from 'react';
import {Container, Typography} from '@mui/material';

const HomePage: React.FC = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Welcome to the Home Page
            </Typography>
            <Typography variant="h6" gutterBottom>
                Home page
            </Typography>

        </Container>
    );
};

export default HomePage;
