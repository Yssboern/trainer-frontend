import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TrainerList from "./components/TrainerList";
import AddTrainer from "./components/AddTrainer";
import TrainerDetails from "./components/TrainerDetails";
import HomePage from "./components/HomePage";
import FacilityList from "./components/FacilityList";
import MemberList from "./components/MemberList";
import BookingList from "./components/BookingList";
import {Drawer, List, ListItemButton, ListItemText} from '@mui/material';
import TrainingList from "./components/TrainingList";
import AddTraining from "./components/AddTraining";

const darkTheme = createTheme({
    palette: {
        mode: 'dark', // Set the dark mode
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Router>
                <Drawer variant="permanent" anchor="left">
                    <List>
                        <ListItemButton component="a" href="/trainers">
                            <ListItemText primary="Home"/>
                        </ListItemButton>
                        <ListItemButton component="a" href="/facilities">
                            <ListItemText primary="View Facility List"/>
                        </ListItemButton>
                        <ListItemButton component="a" href="/trainers">
                            <ListItemText primary="View Trainer List"/>
                        </ListItemButton>
                        <ListItemButton component="a" href="/members">
                            <ListItemText primary="View Members List"/>
                        </ListItemButton>
                        <ListItemButton component="a" href="/bookings">
                            <ListItemText primary="View Bookings List"/>
                        </ListItemButton>
                        <ListItemButton component="a" href="/bookings">
                            <ListItemText primary="View Bookings List"/>
                        </ListItemButton>
                        <ListItemButton component="a" href="/trainings">
                            <ListItemText primary="View Training List"/>
                        </ListItemButton>
                    </List>
                </Drawer>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/trainers" element={<TrainerList/>}/>
                    <Route path="/add-trainer" element={<AddTrainer/>}/>
                    <Route path="/trainer/:id" element={<TrainerDetails/>}/>
                    <Route path="/facilities" element={<FacilityList/>}/>
                    <Route path="/members" element={<MemberList/>}/>
                    <Route path="/bookings" element={<BookingList/>}/>
                    <Route path="/trainings" element={<TrainingList/>}/>
                    <Route path="/add-training" element={<AddTraining/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
