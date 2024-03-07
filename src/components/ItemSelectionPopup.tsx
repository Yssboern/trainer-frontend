// ItemSelectionPopup.tsx
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
    onItemSelect: (item: IdText) => void;
    title: string; // title of selection window
    url: string;
}

const ItemSelectionPopup: React.FC<Props> = ({open, onClose, onItemSelect, title, url}) => {
    const [items, setItems] = useState<IdText[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchItems();
    }, [currentPage]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}?page=${currentPage}`);
            const data = await response.json();
            setItems(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching: ', error);
            setError('Failed to fetch');
            setLoading(false);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleItemSelect = (item: IdText) => {
        onItemSelect(item);
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
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <List>
                    {items.map(item => (
                        <ListItemButton key={`${title}+${item.id}`} onClick={() => handleItemSelect(item)}>
                            <ListItemText primary={item.text}/>
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

export default ItemSelectionPopup;
