// TrainingSelectionPopup.tsx
import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItemButton,
    ListItemText
} from '@mui/material';

interface Training {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onTrainingSelect: (training: Training) => void;
}

const TrainingSelectionPopup: React.FC<Props> = ({open, onClose, onTrainingSelect}) => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTrainings();
    }, [currentPage]);

    const fetchTrainings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/trainings?page=${currentPage}`);
            const data = await response.json();
            setTrainings(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trainings:', error);
            setError('Failed to fetch trainings');
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleTrainingSelect = (training: Training) => {
        onTrainingSelect(training);
        onClose();
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select Training</DialogTitle>
            <DialogContent>
                <List>
                    {trainings.map(training => (
                        <ListItemButton key={training.id} onClick={() => handleTrainingSelect(training)}>
                            <ListItemText primary={training.name}/>
                        </ListItemButton>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </Button>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TrainingSelectionPopup;
