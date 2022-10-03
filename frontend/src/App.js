import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import DifficultyPage from './components/DifficultyPage';
import CountdownPage from "./components/CountdownPage";
import RoomPage from "./components/RoomPage";
import {Box} from "@mui/material";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route exact path="/" element={<Navigate replace to="/difficulty" />}></Route>
                        <Route path="/difficulty/*" element={<DifficultyPage/>}/>
                        <Route exact path="/" element={<Navigate replace to="/countdown" />}></Route>
                        <Route path="/countdown" element={<CountdownPage/>}/>
                        <Route exact path="/" element={<Navigate replace to="/room" />}></Route>
                        <Route path="/room" element={<RoomPage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
