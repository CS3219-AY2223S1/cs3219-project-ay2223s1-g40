import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import DifficultyPage from './components/DifficultyPage/DifficultyPage';
import CountdownPage from "./components/CountdownPage/CountdownPage";
import {Box} from "@mui/material";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/difficulty" />}></Route>
                        <Route path="/difficulty/*" element={<DifficultyPage/>}/>
                        <Route exact path="/" element={<Navigate replace to="/countdown" />}></Route>
                        <Route path="/countdown" element={<CountdownPage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
