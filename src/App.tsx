import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TrainerList from "./components/TrainerList";
import AddTrainer from "./components/AddTrainer";

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
                <Routes>
                    <Route path="/" element={<TrainerList/>}/>
                    <Route path="/trainers" element={<TrainerList/>}/>
                    <Route path="/add-trainer" element={<AddTrainer/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
