import React, {useEffect, useState} from 'react';
import {Button, Container, Typography} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';

interface Member {
    memid: number;
    surname: string;
    firstname: string;
    address: string;
    zipcode: string;
    telephone: string;
    recommendedby: number;
    joindate: string;
}

const MemberList: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers().then(() => null);
    }, [currentPage]);

    const fetchMembers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/members?page=${currentPage}`);
            const data = await response.json();
            setMembers(data.content);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Member List
            </Typography>
            <Link to="/add-member">Add Member</Link>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {members.map(member => (
                        <li key={member.memid} style={{display: 'flex', alignItems: 'center'}}>
                            <span style={{marginRight: '8px'}}>•</span>
                            <Button onClick={() => {
                                navigate(`/member/${member.memid}`)
                            }}>{member.firstname} {member.surname}</Button>
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

export default MemberList;
