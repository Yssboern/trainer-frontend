import React, {useEffect, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Container,
    IconButton,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import TrainingSelectionPopup from './TrainingSelectionPopup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FacilitySelectionPopup from "./FacilitySelectionPopup";
import TrophySelectionPopup from './TrophySelectionPopup';
import DeleteIcon from '@mui/icons-material/Delete';
import AddNoteField from "./AddNoteField";

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
    notes: IdName[];
}

interface TrainerSaveData {
    id: number;
    firstname: string;
    surname: string;
    facilityIds: number[];
    specialisations: number[];
    trophies: number[];
    notes: IdName[];
}

const convertToTrainerSaveData = (trainer: Trainer): TrainerSaveData => {
    const facilityIds = trainer.facilities ? trainer.facilities.map(item => item.id) : [];
    const specialisations = trainer.skills ? trainer.skills.map(item => item.id) : [];
    const trophies = trainer.trophies ? trainer.trophies.map(item => item.id) : [];
    const notes = trainer.notes ? trainer.notes : [];

    return {
        id: trainer.id,
        firstname: trainer.firstname,
        surname: trainer.surname,
        facilityIds,
        specialisations,
        trophies,
        notes
    };
};

const TrainerDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [trainer, setTrainer] = useState<Trainer | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFacilityPopupOpen, setIsFacilityPopupOpen] = useState(false);
    const [isTrainingPopupOpen, setIsTrainingPopupOpen] = useState(false);
    const [isTrophyPopupOpen, setIsTrophyPopupOpen] = useState(false);
    const [isAddNoteVisible, setIsAddNoteVisible] = useState(false);
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

    const handleTrophyPlus = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setIsTrophyPopupOpen(true);
    };

    const handleAddNote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setIsAddNoteVisible(!isAddNoteVisible)
    };


    const handleRemoveSkill = (skillId: number) => {
        if (editedTrainer) {
            const updatedTrainer = {...editedTrainer};
            updatedTrainer.skills = updatedTrainer.skills.filter(skill => skill.id !== skillId);
            setEditedTrainer(updatedTrainer);
        }
    };

    const handleNoteChange = (index: number, value: string) => {
        if (editedTrainer) {
            const updatedTrainer = {...editedTrainer};
            updatedTrainer.notes[index].name = value;
            setEditedTrainer(updatedTrainer);
        }
    };

    const handleRemoveNote = (index: number) => {
        if (editedTrainer) {
            const updatedTrainer = {...editedTrainer};
            updatedTrainer.notes.splice(index, 1);
            setEditedTrainer(updatedTrainer);
            console.log(editedTrainer)
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;

        if (name === 'facilityIds' || name === 'specialisations' || name === 'trophies') {
            const parsedValue = value ? value.split(',').map(Number) : [];
            setEditedTrainer((prevState: Trainer | null) => ({
                ...(prevState as Trainer),
                [name]: parsedValue
            }));
        } else {
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
                    console.log('Trainer data saved successfully!');
                    navigate('/trainers');
                } else {
                    console.error('Failed to save trainer data:', response.statusText);
                }
            } catch (error) {
                console.error('Error saving trainer data:', error);
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
                Trainer Details [{id}]
            </Typography>
            {/*         NAME SURNAME           */}
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
            {/*         SKILLS           */}
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
            {/*         FACILITIES           */}
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
            {/*         TROPHIES           */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>Trophies [{trainer.trophies.length}]</Typography>
                    <IconButton aria-label="add-trophy" onClick={handleTrophyPlus}>
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
            {/*         NOTES           */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel4a-content"
                    id="panel4a-header"
                >
                    <Typography>Notes [{trainer.notes.length}]</Typography>
                    <Tooltip title="Add Note" placement="top">
                        <IconButton aria-label="add-note" onClick={handleAddNote}>
                            <AddCircleOutlineIcon/>
                        </IconButton>
                    </Tooltip>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        {!isAddNoteVisible ? null : (
                            <li>
                                <AddNoteField id={id}/>
                            </li>
                        )}
                        {trainer.notes.map((note, index) => (
                            <li key={note.id}>
                                <TextField
                                    value={note.name}
                                    onChange={(event) => handleNoteChange(index, event.target.value)}
                                    multiline
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton aria-label="delete-note"
                                                        onClick={() => handleRemoveNote(index)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        )
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </AccordionDetails>
            </Accordion>

            <Button onClick={handleCancel} variant="contained" color="primary">Cancel</Button>
            <Button variant="contained" color="primary" onClick={() => setIsFacilityPopupOpen(true)}>Add
                Facility</Button>
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
