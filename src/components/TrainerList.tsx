import React, {useEffect, useState} from 'react';
import {Button, Container, Typography} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';

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
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTrainers().then(() => null);
    }, [currentPage]);

    const fetchTrainers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/trainers?page=${currentPage}`);
            const data = await response.json();
            setTrainers(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
            console.log(data)
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
                        <li key={trainer.id} style={{display: 'flex', alignItems: 'center'}}>
                            <span style={{marginRight: '8px'}}>•</span>
                            <Button onClick={() => {
                                navigate(`/trainer/${trainer.id}`)
                            }}> {trainer.firstname} {trainer.surname}</Button>

                        </li>
                    ))}
                </ul>
            )}
            <div>
                <Button onClick={prevPage} disabled={currentPage === 0}>Previous Page</Button>
                <span>Page: {currentPage}/{totalPages}</span>
                <Button onClick={nextPage} disabled={currentPage === totalPages - 1}>Next Page</Button>
            </div>
        </Container>
    );
};

export default TrainerList;
