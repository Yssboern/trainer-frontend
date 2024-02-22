import React, {useEffect, useState} from 'react';
import {Button, Container, Typography} from '@mui/material';
import {Link} from "react-router-dom";

interface Trainer {
    id: number;
    firstname: string;
    surname: string;
    facilityIds: number[];
    specialisations: number[];
    trophies: number[];
}

interface Pageable {
    pageNumber: number;
}

const TrainerList: React.FC = () => {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrainers();
    }, [currentPage]);

    const fetchTrainers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/trainers?page=${currentPage}`);
            const data = await response.json();
            setTrainers(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
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
            <Link to="/add-trainer">Add Trainer</Link>
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
                <Button onClick={prevPage} disabled={currentPage === 1}>Previous Page</Button>
                <span>Page: {currentPage}/{totalPages}</span>
                <Button onClick={nextPage} disabled={currentPage === totalPages}>Next Page</Button>
            </div>
        </Container>
    );
};

export default TrainerList;
