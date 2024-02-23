import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Container, Typography} from '@mui/material';

interface Trainer {
    id: number;
    firstname: string;
    surname: string;
    facilityIds: number[];
    specialisations: number[];
    trophies: number[];
}

const TrainerDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [trainer, setTrainer] = useState<Trainer | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/trainers');
    }

    useEffect(() => {
        const fetchTrainerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/trainers/${id}`);
                const data = await response.json();
                setTrainer(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trainer details:', error);
            }
        };

        fetchTrainerDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!trainer) {
        return <div>Trainer not found</div>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Trainer Details
            </Typography>
            <Typography variant="h6">
                Name: {trainer.firstname} {trainer.surname}
            </Typography>
            <Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>


            {/* Display other trainer details here */}
            <Button variant="contained" color="primary">
                Edit Trainer
            </Button>
        </Container>
    );
};

export default TrainerDetails;
