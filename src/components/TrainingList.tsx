import React, {useEffect, useState} from 'react';
import {Button, Container, Typography} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';

interface Training {
    id: number;
    name: string;
}

interface Pageable {
    pageNumber: number;
}

const TrainingList: React.FC = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTrainings();
    }, [currentPage]);

    const fetchTrainings = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/trainings?page=${currentPage}`);
            const data = await response.json();
            setTrainings(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Training List
            </Typography>
            <Link to="/add-training">Add Training</Link>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {trainings.map(training => (
                        <li key={training.id} style={{display: 'flex', alignItems: 'center'}}>
                            <span style={{marginRight: '8px'}}>•</span>
                            <Button onClick={() => {
                                navigate(`/training/${training.id}`)
                            }}>{training.name}</Button>
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

export default TrainingList;
