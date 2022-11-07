import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import useUserStore from "../store/userStore";
import RoomPage from "../containers/RoomPage";
import ProfilePage from "../containers/profile/ProfilePage";
import Layout from "../components/Layout";
import NotFoundPage from "../containers/NotFoundPage";
import LoginPage from "../containers/authentication/LoginPage";
import SignUpPage from "../containers/authentication/SignUpPage";
import DifficultyPage from "../containers/DifficultyPage";
import CountdownPage from "../containers/CountdownPage";
import LandingPage from "../containers/LandingPage";

const PrivateRoute = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <Navigate to="/login" /> : <Outlet />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DifficultyPage />} />
            <Route path="/difficulty" element={<DifficultyPage />} />
            <Route path="/countdown" element={<CountdownPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/landing" element={<LandingPage />} />
          </Route>
        </Route>

        {/* When no other routes match, show 404 page not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
