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

interface IdText {
    id: number;
    text: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onTrophySelect: (trophy: IdText) => void;
}

const TrophySelectionPopup: React.FC<Props> = ({ open, onClose, onTrophySelect }) => {
    const [trophies, setTrophies] = useState<IdText[]>([]);
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

            const items: IdText[] = data.content.map((t: { id: number; name: string }) => ({
                id: t.id,
                text: t.name
            }));
            setTrophies(items);
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

    const handleTrophySelect = (trophy: IdText) => {
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
                            <ListItemText primary={trophy.text} />
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
