import React, { useEffect, useState } from 'react';
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

interface Trophy {
    id: number;
    name: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onTrophySelect: (trophy: Trophy) => void;
}

const TrophySelectionPopup: React.FC<Props> = ({ open, onClose, onTrophySelect }) => {
    const [trophies, setTrophies] = useState<Trophy[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTrophies();
    }, [currentPage]);

    const fetchTrophies = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/trophies?page=${currentPage}`);
            const data = await response.json();

            const tt: Trophy[] = data.content.map((t: { id: number; name: string }) => ({
                id: t.id,
                name: t.name
            }));
            setTrophies(tt);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trophies:', error);
            setError('Failed to fetch trophies');
            setLoading(false);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleTrophySelect = (trophy: Trophy) => {
        onTrophySelect(trophy);
        onClose();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select Trophy</DialogTitle>
            <DialogContent>
                <List>
                    {trophies.map(trophy => (
                        <ListItemButton key={trophy.id} onClick={() => handleTrophySelect(trophy)}>
                            <ListItemText primary={trophy.name} />
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

export default TrophySelectionPopup;
