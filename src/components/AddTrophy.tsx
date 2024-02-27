import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, TextField, Typography} from '@mui/material';

const AddTrophy: React.FC = () => {
    const [newTrophyName, setNewTrophyName] = useState('');
    const [newTrophyYear, setNewTrophyYear] = useState('');
    const navigate = useNavigate();

    const handleAddTrophy = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/trophies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newTrophyName,
                    year: parseInt(newTrophyYear),
                    discipline: 1
                }),
            });
            if (response.ok) {
                // If trophy added successfully, navigate back to the TrophyList page
                navigate('/trophies');
            } else {
                console.error('Failed to add new trophy');
            }
        } catch (error) {
            console.error('Error adding new trophy:', error);
        }
    };

    const handleCancel = () => {
        navigate('/trophies');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Add Trophy
            </Typography>
            <div>
                <TextField
                    label="Trophy Name"
                    value={newTrophyName}
                    onChange={(e) => setNewTrophyName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Year"
                    type="number"
                    value={newTrophyYear}
                    onChange={(e) => setNewTrophyYear(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleAddTrophy} variant="contained" color="primary">Add Trophy</Button>
                <Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
            </div>
        </Container>
    );
};

export default AddTrophy;
