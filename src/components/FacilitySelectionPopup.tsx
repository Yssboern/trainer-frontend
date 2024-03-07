// FacilitySelectionPopup.tsx
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

interface IdText {
    id: number;
    text: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onFacilitySelect: (facility: IdText) => void;
}

const FacilitySelectionPopup: React.FC<Props> = ({open, onClose, onFacilitySelect}) => {
    const [facilities, setFacilities] = useState<IdText[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchFacilities();
    }, [currentPage]);

    const fetchFacilities = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/facilities?page=${currentPage}`);
            const data = await response.json();

            const ff: IdText[] = data.content.map((f: { facid: number; name: string; }) => ({
                id: f.facid,
                name: f.name
            }));
            setFacilities(ff);
            setTotalPages(data.totalPages);
            setLoading(false);
            console.log(data)
        } catch (error) {
            console.error('Error fetching facilities:', error);
            setError('Failed to fetch facilities');
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleFacilitySelect = (facility: IdText) => {
        onFacilitySelect(facility);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select Facility</DialogTitle>
            <DialogContent>
                <List>
                    {facilities.map(facility => (
                        <ListItemButton key={facility.id} onClick={() => handleFacilitySelect(facility)}>
                            <ListItemText primary={facility.text}/>
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

export default FacilitySelectionPopup;
