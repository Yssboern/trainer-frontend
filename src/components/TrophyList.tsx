//TrophyList.tsx
import React, {useEffect, useState} from 'react';
import {Button, Container, Typography} from '@mui/material';
import {Link} from 'react-router-dom';

interface Trophy {
    id: number;
    name: string;
    year: number;
}

interface Pageable {
    pageNumber: number;
}

const TrophyList: React.FC = () => {
    const [trophies, setTrophies] = useState<Trophy[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrophies();
    }, [currentPage]);

    const fetchTrophies = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/trophies?page=${currentPage}`);
            const data = await response.json();
            setTrophies(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
            console.log(data);
        } catch (error) {
            console.error('Error fetching trophies:', error);
        }
    };

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Trophy List
            </Typography>
            <Link to="/add-trophy">Add Trophy</Link>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {trophies.map(trophy => (
                        <li key={trophy.id}>
                            {trophy.name} {trophy.year} [{trophy.id}]
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

export default TrophyList;
