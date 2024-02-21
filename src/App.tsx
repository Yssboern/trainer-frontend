import React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TrainerList from "./components/TrainerList";

const darkTheme = createTheme({
    palette: {
        mode: 'dark', // Set the dark mode
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <TrainerList/>
        </ThemeProvider>
    );
};

export default App;
