import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./containers/SignupPage";
import LoginPage from "./containers/LoginPage";
import LandingPage from "./containers/LandingPage";
import ProfilePage from "./containers/ProfilePage";
import DifficultyPage from "./containers/DifficultyPage";
import CountdownPage from "./containers/CountdownPage";
import RoomPage from "./containers/RoomPage";

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
