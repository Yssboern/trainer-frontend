import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';

interface Trainer {
    id: number;
    firstname: string;
    surname: string;
    facilityIds: number[];
    specialisations: number[];
    trophies: number[];
}

const TrainerList: React.FC = () => {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrainers();
    }, [currentPage]);

    const fetchTrainers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/trainers?page=${currentPage}`);
            const data = await response.json();
            setTrainers(data.content); // Access the 'content' property
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error('Error fetching trainers:', error);
        }
    };

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Trainer List
            </Typography>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {trainers.map(trainer => (
                        <li key={trainer.id}>
                            <Typography variant="h6">
                                {trainer.firstname} {trainer.surname}
                            </Typography>
                        </li>
                    ))}
                </ul>
            )}
            <div>
                <span>Elements: {trainers.length}</span>
                <Button onClick={prevPage} disabled={currentPage === 1}>Previous Page</Button>
                <span>Page: {currentPage}</span>
                <Button onClick={nextPage}>Next Page</Button>
            </div>
        </Container>
    );
};

export default TrainerList;
