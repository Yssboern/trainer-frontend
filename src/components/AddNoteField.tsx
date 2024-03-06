import React, {useState} from 'react';
import {IconButton, TextField} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface AddNoteFieldProps {
    id: number | string | undefined;
}

const AddNoteField: React.FC<AddNoteFieldProps> = ({
                                                       id
                                                   }) => {
    const [note, setNote] = useState('');
    const [isAddNoteError, setAddNoteError] = useState(false);
    const [addNoteHelper, setAddNoteHelper] = useState('Type note');

    const addNoteSaveError = () => {
        setAddNoteError(true);
        setAddNoteHelper('Error saving note!')
    }
    const addNoteSaveOK = () => {
        setNote('');
        setAddNoteError(false);
        setAddNoteHelper('Saved!')
    }

    const handleCancelNote = () => {
        setNote('');
        setAddNoteHelper('Type note')
    }

    const handleSaveNote = async () => {
        setAddNoteHelper('Saving...');
        try {
            const response = await fetch(`http://localhost:8080/api/trainers/${id}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: note})
            });

            if (response.ok) {
                addNoteSaveOK()
                window.location.reload();
            } else {
                addNoteSaveError()
            }
        } catch (error) {
            console.log(error)
            addNoteSaveError()
        }
    };

    return (
        <TextField
            error={isAddNoteError}
            label="Add Note"
            variant="outlined"
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
            helperText={addNoteHelper}
            InputProps={{
                endAdornment: (
                    <>
                        <IconButton aria-label="save-note-icon" disabled={!note} onClick={handleSaveNote}>
                            <SaveOutlinedIcon/>
                        </IconButton>
                        <IconButton aria-label="cancel-note-icon" onClick={handleCancelNote}>
                            <CancelOutlinedIcon/>
                        </IconButton>
                    </>
                ),
            }}
        />
    );
};

export default AddNoteField;
