import React, {useEffect, useState} from 'react';
import {Button, Container, TextField, Typography} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import TrainingSelectionPopup from './TrainingSelectionPopup';

interface IdName {
    id: number;
    name: String;
}

interface Trainer {
    id: number;
    firstname: string;
    surname: string;
    facilities: IdName[];
    skills: IdName[];
    trophies: IdName[];
}

interface TrainerSaveData {
    id: number;
    firstname: string;
    surname: string;
    facilityIds: number[];
    specialisations: number[];
    trophies: number[];
}

const convertToTrainerSaveData = (trainer: Trainer): TrainerSaveData => {
    const facilityIds = trainer.facilities ? trainer.facilities.map(item => item.id) : [];
    const specialisations = trainer.skills ? trainer.skills.map(item => item.id) : [];
    const trophies = trainer.trophies ? trainer.trophies.map(item => item.id) : [];

    return {
        id: trainer.id,
        firstname: trainer.firstname,
        surname: trainer.surname,
        facilityIds,
        specialisations,
        trophies
    };
};

const TrainerDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [trainer, setTrainer] = useState<Trainer | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editedTrainer, setEditedTrainer] = useState<Trainer | null>(null); // State to hold edited trainer data
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/trainers/${id}`);
                const data = await response.json();
                setTrainer(data);
                setEditedTrainer(data);
                setLoading(false);
                console.log(data)
            } catch (error) {
                console.error('Error fetching trainer details:', error);
            }
        };
        fetchTrainerDetails();
    }, [id]);

    const handleCancel = () => {
        navigate('/trainers');
    };

    const handleTrainingSelect = (trainig: IdName) => {
        if (editedTrainer) {
            const updatedTrainer = {...editedTrainer};
            if (updatedTrainer && updatedTrainer.skills) {
                const isDuplicate = updatedTrainer.skills.some(skill => skill.id === trainig.id);
                if (!isDuplicate) {
                    updatedTrainer.skills.push(trainig);
                    setEditedTrainer(updatedTrainer);
                    console.log(updatedTrainer);
                } else {
                    console.log("Training already exists in the skills array.");
                }
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        // Check if the property is an array
        if (name === 'facilityIds' || name === 'specialisations' || name === 'trophies') {
            // Parse input value to a number and split by commas to create an array
            const parsedValue = value ? value.split(',').map(Number) : [];
            setEditedTrainer((prevState: Trainer | null) => ({
                ...(prevState as Trainer),
                [name]: parsedValue
            }));
        } else {
            // For string properties, directly assign the value
            setEditedTrainer((prevState: Trainer | null) => ({
                ...(prevState as Trainer),
                [name]: value
            }));
        }
    };


    const handleSave = async () => {
        const trainerSaveData = editedTrainer ? convertToTrainerSaveData(editedTrainer) : null
        if (trainerSaveData) {
            console.log("Edited Trainer:", trainerSaveData);

            try {
                const response = await fetch(`http://localhost:8080/api/trainers/${trainerSaveData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trainerSaveData)
                });

                if (response.ok) {
                    // If the response is successful (status code 200-299), handle the success scenario here
                    console.log('Trainer data saved successfully!');
                    // Optionally, you can navigate to a different page or show a success message
                    navigate('/trainers');
                } else {
                    // If the response is not successful, handle the error scenario here
                    console.error('Failed to save trainer data:', response.statusText);
                    // Optionally, you can show an error message to the user
                }
            } catch (error) {
                // If an error occurs during the fetch request, handle it here
                console.error('Error saving trainer data:', error);
                // Optionally, you can show an error message to the user
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!trainer) {
        return <div>Trainer not found</div>;
    }

    console.log()

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Trainer Details
            </Typography>
            <div>
                <TextField
                    label="First Name"
                    value={editedTrainer?.firstname}
                    name="firstname"
                    onChange={handleInputChange}
                />
                <TextField
                    label="Surname"
                    value={editedTrainer?.surname}
                    name="surname"
                    onChange={handleInputChange}
                />
            </div>
            <ul>
                Skills:
                {trainer.skills && trainer.skills.map(skill => (
                    <li key={skill.id} style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{marginRight: '8px'}}>• {skill.name} [{skill.id}]</span>
                    </li>
                ))}
            </ul>
            <ul>
                Facilities:
                {trainer.facilities && trainer.facilities.map(facility => (
                    <li key={facility.id} style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{marginRight: '8px'}}>• {facility.name} [{facility.id}]</span>
                    </li>
                ))}
            </ul>
            <ul>
                Trophies:
                {trainer.trophies && trainer.trophies.map(trophy => (
                    <li key={trophy.id} style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{marginRight: '8px'}}>• {trophy.name} [{trophy.id}]</span>
                    </li>
                ))}
            </ul>
            <Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => setIsPopupOpen(true)}>Add Skill</Button>
            <TrainingSelectionPopup
                open={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onTrainingSelect={handleTrainingSelect}
            />
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
        </Container>
    );
};

export default TrainerDetails;
