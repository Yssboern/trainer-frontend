import React, { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

interface Booking {
    bookid: number;
    facid: number;
    memid: number;
    starttime: string;
    slots: number;
}

interface Pageable {
    pageNumber: number;
}

const BookingList: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, [currentPage]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/bookings?page=${currentPage}`);
            const data = await response.json();
            setBookings(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Booking List
            </Typography>
            <Link to="/add-booking">Add Booking</Link>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {bookings.map(booking => (
                        <li key={booking.bookid} style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}>•</span>
                            <Button onClick={() => {
                                navigate(`/booking/${booking.bookid}`)
                            }}>{booking.starttime}</Button>
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

export default BookingList;
