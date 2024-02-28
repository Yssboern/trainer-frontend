import React, {useEffect, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Container,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import TrainingSelectionPopup from './TrainingSelectionPopup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FacilitySelectionPopup from "./FacilitySelectionPopup"; // Import the remove icon
import TrophySelectionPopup from './TrophySelectionPopup'; // Import the TrophySelectionPopup component

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
    const [isFacilityPopupOpen, setIsFacilityPopupOpen] = useState(false);
    const [isTrainingPopupOpen, setIsTrainingPopupOpen] = useState(false);
    const [isTrophyPopupOpen, setIsTrophyPopupOpen] = useState(false); // State for trophy popup
    const [editedTrainer, setEditedTrainer] = useState<Trainer | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/trainers/${id}`);
                const data = await response.json();
                setTrainer(data);
                setEditedTrainer(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trainer details:', error);
            }
        };
        fetchTrainerDetails();
    }, [id]);

    const handleCancel = () => {
        navigate('/trainers');
    };

    const handleTrainingSelect = (training: IdName) => {
        if (editedTrainer) {
            const updatedTrainer = {...editedTrainer};
            if (updatedTrainer && updatedTrainer.skills) {
                const isDuplicate = updatedTrainer.skills.some(skill => skill.id === training.id);
                if (!isDuplicate) {
                    updatedTrainer.skills.push(training);
                    setEditedTrainer(updatedTrainer);
                    console.log(updatedTrainer);
                } else {
                    console.log("Training already exists in the skills array.");
                }
            }
        }
    };

    const handleFacilitySelect = (facility: IdName) => {
        console.log(facility)
        if (editedTrainer) {
            const updatedTrainer = {...editedTrainer};
            if (updatedTrainer && updatedTrainer.facilities) {
                const isDuplicate = updatedTrainer.facilities.some(fac => fac.id === facility.id);
                if (!isDuplicate) {
                    updatedTrainer.facilities.push(facility);
                    setEditedTrainer(updatedTrainer);
                    console.log(updatedTrainer);
                } else {
                    console.log("Facility already exists in the facilities array.");
                }
            }
        }
    };

    const handleTrophySelect = (trophy: IdName) => {
        if (editedTrainer) {
            const updatedTrainer = {...editedTrainer};
            if (updatedTrainer && updatedTrainer.trophies) {
                const isDuplicate = updatedTrainer.trophies.some(t => t.id === trophy.id);
                if (!isDuplicate) {
                    updatedTrainer.trophies.push(trophy);
                    setEditedTrainer(updatedTrainer);
                    console.log(updatedTrainer);
                } else {
                    console.log("Trophy already exists in the trophies array.");
                }
            }
        }
    };

    const handleRemoveSkill = (skillId: number) => {
        if (editedTrainer) {
            const updatedTrainer = {...editedTrainer};
            updatedTrainer.skills = updatedTrainer.skills.filter(skill => skill.id !== skillId);
            setEditedTrainer(updatedTrainer);
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

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <Typography>Skills [{trainer.skills.length}]</Typography>
                    <IconButton aria-label="add-skill" onClick={() => setIsTrainingPopupOpen(true)}>
                        <AddCircleOutlineIcon/>
                    </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        {trainer.skills && trainer.skills.map(skill => (
                            <li key={skill.id} style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{marginRight: '8px'}}>• {skill.name} [id:{skill.id}]</span>
                                <IconButton aria-label="remove-skill" onClick={() => handleRemoveSkill(skill.id)}>
                                    <RemoveCircleOutlineIcon/>
                                </IconButton>
                            </li>
                        ))}
                    </ul>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>Facilities [{trainer.facilities.length}]</Typography>
                    <IconButton aria-label="add-facility" onClick={() => setIsFacilityPopupOpen(true)}>
                        <AddCircleOutlineIcon/>
                    </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        {trainer.facilities && trainer.facilities.map(facility => (
                            <li key={facility.id} style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{marginRight: '8px'}}>• {facility.name} [{facility.id}]</span>
                            </li>
                        ))}
                    </ul>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>Trophies [{trainer.trophies.length}]</Typography>
                    <IconButton aria-label="add-trophy" onClick={() => setIsTrophyPopupOpen(true)}>
                        <AddCircleOutlineIcon/>
                    </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        {trainer.trophies && trainer.trophies.map(trophy => (
                            <li key={trophy.id} style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{marginRight: '8px'}}>• {trophy.name} [{trophy.id}]</span>
                            </li>
                        ))}
                    </ul>
                </AccordionDetails>
            </Accordion>
            <Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => setIsFacilityPopupOpen(true)}>Add Facility</Button>
            <Button variant="contained" color="primary" onClick={() => setIsTrainingPopupOpen(true)}>Add Skill</Button>
            <Button variant="contained" color="primary" onClick={() => setIsTrophyPopupOpen(true)}>Add Trophy</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>

            <TrainingSelectionPopup
                open={isTrainingPopupOpen}
                onClose={() => setIsTrainingPopupOpen(false)}
                onTrainingSelect={handleTrainingSelect}/>

            <FacilitySelectionPopup
                open={isFacilityPopupOpen}
                onClose={() => setIsFacilityPopupOpen(false)}
                onFacilitySelect={handleFacilitySelect}/>

            <TrophySelectionPopup
                open={isTrophyPopupOpen}
                onClose={() => setIsTrophyPopupOpen(false)}
                onTrophySelect={handleTrophySelect}/>

        </Container>
    );
};

export default TrainerDetails;
