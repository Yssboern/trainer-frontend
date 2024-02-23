import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, TextField, Typography} from '@mui/material';

const AddTraining: React.FC = () => {
    const [newTrainingName, setNewTrainingName] = useState('');
    const navigate = useNavigate();

    const handleAddTraining = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/trainings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newTrainingName,
                }),
            });
            if (response.ok) {
                // If training added successfully, navigate back to the TrainingList page
                navigate('/trainings');
            } else {
                console.error('Failed to add new training');
            }
        } catch (error) {
            console.error('Error adding new training:', error);
        }
    };

    const handleCancel = () => {
        navigate('/trainings');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Add Training
            </Typography>
            <div>
                <TextField
                    label="Training Name"
                    value={newTrainingName}
                    onChange={(e) => setNewTrainingName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleAddTraining} variant="contained" color="primary">Add Training</Button>
                <Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
            </div>
        </Container>
    );
};

export default AddTraining;
