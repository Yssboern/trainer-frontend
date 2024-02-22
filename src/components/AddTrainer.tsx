import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, TextField, Typography} from '@mui/material';

const AddTrainer: React.FC = () => {
    const [newTrainerFirstName, setNewTrainerFirstName] = useState('');
    const [newTrainerLastName, setNewTrainerLastName] = useState('');
    const navigate = useNavigate();

    // const handleAddTrainer = () => {
    //     // Handle adding the new trainer here
    //     // This could involve making an API call to add the trainer to your backend
    //
    //     // Navigate back to the TrainerList page after adding the trainer
    //     console.log(newTrainerFirstName + " " + newTrainerLastName);
    //     navigate('/trainers');
    // };

    const handleAddTrainer = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/trainers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: newTrainerFirstName,
                    lastName: newTrainerLastName,
                }),
            });
            if (response.ok) {
                // If trainer added successfully, refresh the list of trainers
                // fetchTrainers();
                // Reset the input fields
                setNewTrainerFirstName('');
                setNewTrainerLastName('');
            } else {
                console.error('Failed to add new trainer');
            }
        } catch (error) {
            console.error('Error adding new trainer:', error);
        }
    };

    const handleCancel = () => {
        navigate('/trainers');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Add Trainer
            </Typography>
            <div>
                <TextField
                    label="First Name"
                    value={newTrainerFirstName}
                    onChange={(e) => setNewTrainerFirstName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    value={newTrainerLastName}
                    onChange={(e) => setNewTrainerLastName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleAddTrainer} variant="contained" color="primary">Add Trainer</Button>
                <Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
                <Button onClick={() => navigate('/trainers')} variant="contained" color="primary">Cancel</Button>
            </div>
        </Container>
    );
};

export default AddTrainer;
