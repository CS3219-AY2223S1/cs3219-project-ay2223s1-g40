import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import DifficultyPage from "./components/DifficultyPage";
import CountdownPage from "./components/CountdownPage";
import RoomPage from "./components/RoomPage";

// import NavigationBar from "./components/NavigationBar";
import { Box } from "@mui/material";
import { PrivateRoute } from "./containers/PrivateRoute";

function App() {
  return (
    <div className="App">
      {/* <NavigationBar isAuthenticated={true}/> */}
      <Box display={"flex"} flexDirection={"column"}>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={<Navigate replace to="/login" />}
            ></Route>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/difficulty/*"
              element={
                <PrivateRoute>
                  <DifficultyPage />
                </PrivateRoute>
              }
            />
            <Route path="/countdown" element={<CountdownPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route
              path="/landing"
              element={
                <PrivateRoute>
                  <LandingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  {" "}
                  <ProfilePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </Box>
    </div>
  );
}

export default App;
