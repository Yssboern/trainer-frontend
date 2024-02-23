import React, { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

interface Facility {
    facid: number;
    name: string;
    memberCost: number;
    guestCost: number;
    initialOutlay: number;
    monthlyMaintenance: number;
    trainerIds: number[];
}

interface Pageable {
    pageNumber: number;
}

const FacilityList: React.FC = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFacilities();
    }, [currentPage]);

    const fetchFacilities = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/facilities?page=${currentPage}`);
            const data = await response.json();
            setFacilities(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching facilities:', error);
        }
    };

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Facility List
            </Typography>
            <Link to="/add-facility">Add Facility</Link>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {facilities.map(facility => (
                        <li key={facility.facid} style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}>•</span>
                            <Button onClick={() => {
                                navigate(`/facility/${facility.facid}`)
                            }}>{facility.name}</Button>
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

export default FacilityList;
